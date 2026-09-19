// ---------------------------------------------------------------------------
// Resilience layer for PolarTwin.
//
// This module adds the pieces that turn the static seeded mock data into a
// live, self-updating "edge gateway" simulation per station, plus the
// resilience features discussed for a real Antarctic deployment:
//
//   1. Change-detection engine   -- a sensor reading is only pushed into the
//      shared data store (what dashboards display) when it crosses a
//      deadband threshold or a periodic heartbeat is due. This mirrors the
//      real reason for doing this: satellite bandwidth is expensive, so you
//      don't stream every reading, only meaningful changes.
//
//   2. Local alert system        -- rule-based thresholds are evaluated
//      against the station's *raw* sensor state every tick, independent of
//      whether that tick's reading made it into the shared store. This
//      models a local alarm that doesn't depend on the satellite link.
//
//   3. Multi-path comms          -- each station has an independent
//      satellite/HF-radio state. Satellite is primary; if it's down, only
//      high-priority traffic (alerts) rides the HF radio, and routine
//      telemetry queues in a local buffer instead of updating the shared
//      store.
//
//   4. Priority data buffer      -- routine telemetry queued while the
//      satellite is down is flushed into the shared store, in order, the
//      moment the satellite comes back.
//
// Swap-out note: replace this whole module with a real ingestion pipeline
// (real sensors -> real edge gateway -> real satellite/radio hardware) in a
// production deployment. Everything else in the app (routes, dashboards)
// keeps working unchanged because it only ever reads the shared data-store
// objects this module updates.
// ---------------------------------------------------------------------------

const {
  stations,
  energyHistory,
  generators,
  environmentHistory,
  environmentLatest,
  alerts,
} = require('./data');

const STATIONS = Object.keys(stations);

const TICK_MS = 4000; // simulated sensor sampling rate
const HEARTBEAT_MS = 45 * 1000; // force a transmission at least this often, even with no change
const ALERT_COOLDOWN_MS = 25 * 1000; // don't re-fire the same alert rule more than once per this window

// ---------------------------------------------------------------------------
// Per-metric simulation config: baseline is seeded from the existing data so
// stations keep looking like themselves; wander is the natural per-tick
// noise; deadband is the minimum change worth transmitting; spikeChance/
// spike model an occasional anomaly (what triggers the demo-able alerts).
// ---------------------------------------------------------------------------
const REVERSION_RATE = 0.15;

function genMetricConfig(baselineLoad, baselineTemp) {
  return {
    load: { baseline: baselineLoad, wander: 1, deadband: 3, spikeChance: 0.02, spike: () => 88 + Math.random() * 12 },
    tempC: { baseline: baselineTemp, wander: 0.6, deadband: 2, spikeChance: 0.02, spike: () => 82 + Math.random() * 10 },
  };
}

function envMetricConfig(latest) {
  return {
    temperature: { baseline: latest.temperature, wander: 0.15, deadband: 0.5, spikeChance: 0.02, spike: () => (Math.random() > 0.5 ? 9 : -66) },
    windSpeed: { baseline: latest.windSpeed, wander: 1.2, deadband: 3, spikeChance: 0.025, spike: () => 92 + Math.random() * 25 },
    humidity: { baseline: latest.humidity, wander: 0.6, deadband: 2, spikeChance: 0.01, spike: () => 20 + Math.random() * 10 },
    pressure: { baseline: latest.pressure, wander: 0.4, deadband: 1, spikeChance: 0.01, spike: () => 930 + Math.random() * 8 },
  };
}

// ---------------------------------------------------------------------------
// Per-station runtime state
// ---------------------------------------------------------------------------
const runtime = {}; // stationId -> { rawGenerators, rawEnvironment, lastApplied, alertCooldowns }
const commsState = {}; // stationId -> { satelliteUp, hfRadioActive }
const buffers = {}; // stationId -> [{ type, payload, timestamp, reason }]
const commsLog = {}; // stationId -> [{ event, timestamp }]

for (const stationId of STATIONS) {
  runtime[stationId] = {
    rawGenerators: generators[stationId].map((g) => ({ ...g, cfg: genMetricConfig(g.load, g.tempC) })),
    rawEnvironment: { ...environmentLatest[stationId] },
    envCfg: envMetricConfig(environmentLatest[stationId]),
    lastApplied: 0,
    alertCooldowns: {},
  };
  commsState[stationId] = { satelliteUp: true, hfRadioActive: false };
  buffers[stationId] = [];
  commsLog[stationId] = [];
}

function logEvent(stationId, event) {
  commsLog[stationId].push({ event, timestamp: new Date().toISOString() });
  if (commsLog[stationId].length > 30) commsLog[stationId].shift();
}

function getActiveChannel(stationId, priority) {
  const state = commsState[stationId];
  if (state.satelliteUp) return 'satellite';
  // Satellite down: only priority-1 (alerts) traffic rides the HF radio.
  // Routine telemetry queues locally until satellite returns.
  return priority === 1 ? 'hf_radio' : 'buffered';
}

function setSatellite(stationId, up) {
  const state = commsState[stationId];
  if (state.satelliteUp === up) return state;

  state.satelliteUp = up;
  state.hfRadioActive = !up;
  logEvent(stationId, up ? 'satellite_restored' : 'satellite_down');
  if (!up) logEvent(stationId, 'failover_to_hf_radio');
  if (up) drainBuffer(stationId);
  return state;
}

function getCommsStatus(stationId) {
  return {
    satelliteUp: commsState[stationId].satelliteUp,
    hfRadioActive: commsState[stationId].hfRadioActive,
    bufferCount: buffers[stationId].length,
    oldestBufferedAt: buffers[stationId][0]?.timestamp || null,
    recentEvents: [...commsLog[stationId]].reverse().slice(0, 10),
  };
}

// Applies a buffered/queued reading to the real shared data store, exactly
// as if it had just arrived over satellite.
function applyToStore(stationId, payload, reason) {
  if (payload.type === 'energy') {
    generators[stationId] = payload.generators;
    energyHistory[stationId].push({ timestamp: payload.timestamp, value: payload.avgLoad });
    if (energyHistory[stationId].length > 200) energyHistory[stationId].shift();
  } else if (payload.type === 'environment') {
    environmentLatest[stationId] = payload.environment;
    environmentHistory[stationId].push({ timestamp: payload.timestamp, value: payload.environment.temperature });
    if (environmentHistory[stationId].length > 200) environmentHistory[stationId].shift();
  }
}

function drainBuffer(stationId) {
  const queued = buffers[stationId];
  if (queued.length === 0) return;
  for (const item of queued) {
    applyToStore(stationId, item.payload, `${item.reason}_flushed`);
  }
  buffers[stationId] = [];
  logEvent(stationId, `buffer_drained_${queued.length}_items`);
}

// ---------------------------------------------------------------------------
// Local alert system -- evaluated every tick against the *raw* sensor
// reading, regardless of whether that reading made it into the shared
// store. This is what "an alert doesn't need the satellite" means.
// ---------------------------------------------------------------------------
function maybeRaiseAlert(stationId, key, condition, { severity, category, message }) {
  if (!condition) return;
  const cooldowns = runtime[stationId].alertCooldowns;
  const now = Date.now();
  if (cooldowns[key] && now - cooldowns[key] < ALERT_COOLDOWN_MS) return;
  cooldowns[key] = now;

  const channel = getActiveChannel(stationId, 1); // alerts are always top priority
  alerts.push({
    id: 'auto-' + now + '-' + Math.random().toString(36).slice(2, 7),
    stationId,
    severity,
    category,
    message,
    timestamp: new Date().toISOString(),
    resolved: false,
    source: 'local_alert_system',
    channel,
  });
  if (alerts.length > 300) alerts.shift();
}

function nextValue(current, cfg) {
  const pull = (cfg.baseline - current) * REVERSION_RATE;
  let value = current + pull + (Math.random() * 2 - 1) * cfg.wander;
  if (Math.random() < cfg.spikeChance) value = cfg.spike();
  return value;
}

function statusFromLoad(load) {
  if (load > 92) return 'red';
  if (load > 80) return 'yellow';
  return 'green';
}

function tickStation(stationId) {
  const rt = runtime[stationId];
  const now = Date.now();
  const nowISO = new Date().toISOString();

  // --- Energy: advance each generator's raw reading ---
  let anyEnergyChange = false;
  const newGenerators = rt.rawGenerators.map((g) => {
    const newLoad = Math.max(0, nextValue(g.load, g.cfg.load));
    const newTemp = Math.max(-40, nextValue(g.tempC, g.cfg.tempC));
    if (Math.abs(newLoad - g.load) >= g.cfg.load.deadband || Math.abs(newTemp - g.tempC) >= g.cfg.tempC.deadband) {
      anyEnergyChange = true;
    }

    maybeRaiseAlert(
      stationId,
      `energy:${g.id}:load`,
      newLoad > 92,
      { severity: 'red', category: 'Energy', message: `${g.name} load reached ${newLoad.toFixed(0)}% - above safe operating limit` }
    );
    maybeRaiseAlert(
      stationId,
      `energy:${g.id}:temp`,
      newTemp > 82,
      { severity: 'red', category: 'Energy', message: `${g.name} temperature reached ${newTemp.toFixed(0)}\u00b0C - above safe operating limit` }
    );

    return { ...g, load: newLoad, tempC: newTemp, status: statusFromLoad(newLoad) };
  });
  rt.rawGenerators = newGenerators;

  // --- Environment: advance each raw metric ---
  const prevEnv = rt.rawEnvironment;
  const newEnv = {};
  let anyEnvChange = false;
  for (const metric of Object.keys(rt.envCfg)) {
    const cfg = rt.envCfg[metric];
    const value = nextValue(prevEnv[metric], cfg);
    newEnv[metric] = Math.round(value * 10) / 10;
    if (Math.abs(newEnv[metric] - prevEnv[metric]) >= cfg.deadband) anyEnvChange = true;
  }
  rt.rawEnvironment = newEnv;

  maybeRaiseAlert(
    stationId,
    'environment:temperature',
    newEnv.temperature < -65 || newEnv.temperature > 8,
    { severity: 'red', category: 'Environment', message: `Station temperature reached ${newEnv.temperature.toFixed(1)}\u00b0C - outside safe range` }
  );
  maybeRaiseAlert(
    stationId,
    'environment:wind',
    newEnv.windSpeed > 90,
    { severity: 'red', category: 'Environment', message: `Wind speed reached ${newEnv.windSpeed.toFixed(0)} km/h - blizzard-level, secure operations` }
  );

  // --- Change-detection engine: decide whether this tick's readings get
  // transmitted (or buffered) at all ---
  const heartbeatDue = now - rt.lastApplied >= HEARTBEAT_MS;

  if (anyEnergyChange || heartbeatDue) {
    const reason = anyEnergyChange ? 'threshold_change' : 'heartbeat';
    const avgLoad = newGenerators.reduce((sum, g) => sum + g.load, 0) / newGenerators.length;
    const payload = {
      type: 'energy',
      generators: newGenerators.map(({ cfg, ...g }) => ({ ...g, load: Math.round(g.load), tempC: Math.round(g.tempC) })),
      avgLoad: Math.round(avgLoad),
      timestamp: nowISO,
    };
    const channel = getActiveChannel(stationId, 2);
    if (channel === 'buffered') {
      buffers[stationId].push({ type: 'energy', payload, timestamp: nowISO, reason });
    } else {
      applyToStore(stationId, payload, reason);
    }
  }

  if (anyEnvChange || heartbeatDue) {
    const reason = anyEnvChange ? 'threshold_change' : 'heartbeat';
    const payload = { type: 'environment', environment: newEnv, timestamp: nowISO };
    const channel = getActiveChannel(stationId, 2);
    if (channel === 'buffered') {
      buffers[stationId].push({ type: 'environment', payload, timestamp: nowISO, reason });
    } else {
      applyToStore(stationId, payload, reason);
    }
  }

  if (anyEnergyChange || anyEnvChange || heartbeatDue) {
    rt.lastApplied = now;
  }

  // Keep station-level status (used by the landing page / officer summary)
  // roughly in sync with the worst generator/environment condition.
  const worstGenStatus = newGenerators.some((g) => g.status === 'red')
    ? 'red'
    : newGenerators.some((g) => g.status === 'yellow')
    ? 'yellow'
    : 'green';
  stations[stationId].status = worstGenStatus;
  stations[stationId].lastUpdated = nowISO;
}

let started = false;
function start() {
  if (started) return;
  started = true;
  for (const stationId of STATIONS) {
    setInterval(() => tickStation(stationId), TICK_MS);
  }
}

module.exports = {
  start,
  STATIONS,
  getCommsStatus,
  setSatellite,
  getActiveChannel,
};
