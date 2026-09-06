import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Zap, Thermometer, Wind, Package, AlertTriangle, Radio,
  Droplets, Battery, Activity, Snowflake, Truck, Wrench,
  MapPin, ChevronRight, CheckCircle2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Design tokens — polar research-station instrument panel, not a generic SaaS look
// ---------------------------------------------------------------------------
const C = {
  bg: '#0E1B2A',
  panel: '#142838',
  panelAlt: '#1B3247',
  border: '#2A4358',
  borderLit: '#3D5D78',
  text: '#E8F1F5',
  muted: '#7E9BAC',
  ice: '#5FD8E8',
  amber: '#E8A23F',
  coral: '#E8604F',
  mint: '#5FE0A0',
};

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');";

// ---------------------------------------------------------------------------
// Station baselines — Maitri: inland, colder, smaller. Bharati: coastal, milder, larger.
// ---------------------------------------------------------------------------
const STATIONS = {
  maitri: { name: 'Maitri', code: 'MTR-07', location: 'Schirmacher Oasis, Queen Maud Land', baseTemp: -26, baseWind: 21, basePower: 44, baseBattery: 76, crew: 23 },
  bharati: { name: 'Bharati', code: 'BHR-12', location: 'Larsemann Hills, Ingrid Christensen Coast', baseTemp: -13, baseWind: 33, basePower: 61, baseBattery: 83, crew: 31 },
};

const HOURS = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

function rand(min, max) { return +(Math.random() * (max - min) + min).toFixed(1); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function seedEnergy(base) {
  return HOURS.map((h) => ({
    time: h,
    generated: clamp(base.basePower + rand(-6, 6), 20, 90),
    consumed: clamp(base.basePower - 4 + rand(-8, 8), 15, 85),
  }));
}
function seedEnv(base) {
  return HOURS.map((h) => ({
    time: h,
    temp: clamp(base.baseTemp + rand(-4, 4), -45, 5),
    wind: clamp(base.baseWind + rand(-8, 10), 5, 70),
  }));
}
function seedEquipment() {
  const items = [
    { key: 'hvac', name: 'HVAC / Thermal Control', icon: 'thermo' },
    { key: 'water', name: 'Water Treatment Unit', icon: 'droplet' },
    { key: 'comms', name: 'Comms & Satellite Array', icon: 'radio' },
    { key: 'struct', name: 'Structural Load Sensors', icon: 'activity' },
    { key: 'genset', name: 'Diesel Generator Bank', icon: 'zap' },
  ];
  return items.map((it) => ({ ...it, health: Math.round(rand(72, 99)) }));
}
function seedSupplies() {
  return [
    { key: 'food', name: 'Food Rations', pct: Math.round(rand(55, 90)), dailyUse: 1.1 },
    { key: 'fuel', name: 'Diesel Fuel', pct: Math.round(rand(45, 85)), dailyUse: 1.6 },
    { key: 'medical', name: 'Medical Supplies', pct: Math.round(rand(60, 95)), dailyUse: 0.3 },
    { key: 'parts', name: 'Spare Parts', pct: Math.round(rand(40, 80)), dailyUse: 0.4 },
  ];
}

const ICONS = { thermo: Thermometer, droplet: Droplets, radio: Radio, activity: Activity, zap: Zap };

function healthColor(h) {
  if (h >= 80) return C.mint;
  if (h >= 60) return C.amber;
  return C.coral;
}
function healthLabel(h) {
  if (h >= 80) return 'Nominal';
  if (h >= 60) return 'Degraded';
  return 'Critical';
}

// ---------------------------------------------------------------------------

export default function AntarcticDigitalTwin() {
  const [station, setStation] = useState('maitri');
  const [tab, setTab] = useState('overview');

  const [energyHistory, setEnergyHistory] = useState({
    maitri: seedEnergy(STATIONS.maitri),
    bharati: seedEnergy(STATIONS.bharati),
  });
  const [envHistory, setEnvHistory] = useState({
    maitri: seedEnv(STATIONS.maitri),
    bharati: seedEnv(STATIONS.bharati),
  });
  const [equipment, setEquipment] = useState({
    maitri: seedEquipment(),
    bharati: seedEquipment(),
  });
  const [supplies] = useState({
    maitri: seedSupplies(),
    bharati: seedSupplies(),
  });
  const [battery, setBattery] = useState({
    maitri: STATIONS.maitri.baseBattery,
    bharati: STATIONS.bharati.baseBattery,
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Live telemetry simulation — every 3s, nudge the latest reading for both stations
  useEffect(() => {
    const id = setInterval(() => {
      setEnergyHistory((prev) => {
        const next = { ...prev };
        for (const key of ['maitri', 'bharati']) {
          const arr = [...prev[key]];
          const last = arr[arr.length - 1];
          arr.shift();
          arr.push({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            generated: clamp(last.generated + rand(-3, 3), 20, 90),
            consumed: clamp(last.consumed + rand(-3, 3), 15, 85),
          });
          next[key] = arr;
        }
        return next;
      });
      setEnvHistory((prev) => {
        const next = { ...prev };
        for (const key of ['maitri', 'bharati']) {
          const arr = [...prev[key]];
          const last = arr[arr.length - 1];
          arr.shift();
          arr.push({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            temp: clamp(last.temp + rand(-1.5, 1.5), -55, 5),
            wind: clamp(last.wind + rand(-4, 5), 5, 80),
          });
          next[key] = arr;
        }
        return next;
      });
      setEquipment((prev) => {
        const next = { ...prev };
        for (const key of ['maitri', 'bharati']) {
          next[key] = prev[key].map((eq) => ({
            ...eq,
            health: Math.round(clamp(eq.health + rand(-2, 1.2), 30, 100)),
          }));
        }
        return next;
      });
      setBattery((prev) => ({
        maitri: Math.round(clamp(prev.maitri + rand(-3, 3), 10, 100)),
        bharati: Math.round(clamp(prev.bharati + rand(-3, 3), 10, 100)),
      }));
      setLastUpdate(new Date());
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const s = STATIONS[station];
  const eHist = energyHistory[station];
  const vHist = envHistory[station];
  const eq = equipment[station];
  const sup = supplies[station];
  const batt = battery[station];

  const currentPower = eHist[eHist.length - 1];
  const currentEnv = vHist[vHist.length - 1];

  // Derived alerts across all modules for this station
  const alerts = useMemo(() => {
    const list = [];
    if (batt < 35) list.push({ sev: 'critical', msg: `Battery reserve at ${batt}% — below safe threshold`, mod: 'Energy' });
    else if (batt < 55) list.push({ sev: 'warning', msg: `Battery reserve at ${batt}% — monitor closely`, mod: 'Energy' });

    if (currentEnv.wind > 55) list.push({ sev: 'critical', msg: `Wind speed ${currentEnv.wind} km/h — outdoor operations unsafe`, mod: 'Environment' });
    else if (currentEnv.wind > 40) list.push({ sev: 'warning', msg: `Wind speed rising (${currentEnv.wind} km/h)`, mod: 'Environment' });

    if (currentEnv.temp < -45) list.push({ sev: 'warning', msg: `Extreme cold: ${currentEnv.temp}°C — equipment cold-stress risk`, mod: 'Environment' });

    eq.forEach((item) => {
      if (item.health < 60) list.push({ sev: 'critical', msg: `${item.name} health at ${item.health}% — maintenance required`, mod: 'Infrastructure' });
      else if (item.health < 75) list.push({ sev: 'warning', msg: `${item.name} health degrading (${item.health}%)`, mod: 'Infrastructure' });
    });

    sup.forEach((item) => {
      const daysLeft = Math.round(item.pct / item.dailyUse);
      if (daysLeft < 15) list.push({ sev: 'critical', msg: `${item.name}: ~${daysLeft} days remaining — resupply urgently`, mod: 'Logistics' });
      else if (daysLeft < 30) list.push({ sev: 'warning', msg: `${item.name}: ~${daysLeft} days remaining`, mod: 'Logistics' });
    });

    return list;
  }, [batt, currentEnv, eq, sup]);

  const criticalCount = alerts.filter((a) => a.sev === 'critical').length;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'energy', label: 'Energy', icon: Zap },
    { key: 'environment', label: 'Environment', icon: Snowflake },
    { key: 'infrastructure', label: 'Infrastructure', icon: Wrench },
    { key: 'logistics', label: 'Logistics', icon: Truck },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100%', fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: 0.2 }}>
            Antarctic Station Digital Twin
          </div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>
            MoES / NCPOR · remote management platform
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {Object.keys(STATIONS).map((key) => (
            <button
              key={key}
              onClick={() => setStation(key)}
              style={{
                padding: '9px 16px',
                borderRadius: 6,
                border: `1px solid ${station === key ? C.ice : C.border}`,
                background: station === key ? 'rgba(95,216,232,0.1)' : 'transparent',
                color: station === key ? C.ice : C.muted,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer',
              }}
            >
              {STATIONS[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* Station identity strip */}
      <div style={{ padding: '14px 28px', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.muted, fontSize: 13 }}>
          <MapPin size={15} color={C.ice} />
          {s.location}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.muted }}>
          ID {s.code}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.muted }}>
          Crew {s.crew}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {criticalCount > 0 ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.coral, fontSize: 13, fontWeight: 600 }}>
              <AlertTriangle size={15} /> {criticalCount} critical alert{criticalCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.mint, fontSize: 13, fontWeight: 600 }}>
              <CheckCircle2 size={15} /> All systems nominal
            </span>
          )}
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: C.muted }}>
            · updated {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '0 28px', borderBottom: `1px solid ${C.border}`, overflowX: 'auto' }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '13px 16px',
                border: 'none',
                borderBottom: `2px solid ${active ? C.ice : 'transparent'}`,
                background: 'transparent',
                color: active ? C.text : C.muted,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: 28 }}>
        {tab === 'overview' && (
          <Overview s={s} eHist={eHist} currentPower={currentPower} currentEnv={currentEnv} batt={batt} eq={eq} sup={sup} alerts={alerts} />
        )}
        {tab === 'energy' && <EnergyModule eHist={eHist} batt={batt} current={currentPower} />}
        {tab === 'environment' && <EnvironmentModule vHist={vHist} current={currentEnv} />}
        {tab === 'infrastructure' && <InfrastructureModule eq={eq} />}
        {tab === 'logistics' && <LogisticsModule sup={sup} />}
      </div>

      {/* Footer: architecture note for jury talking points */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '14px 28px', fontSize: 12, color: C.muted }}>
        <span>Live telemetry shown here is simulated for demonstration. Architecture accepts real IoT/MQTT sensor feeds without redesign.</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared UI atoms
// ---------------------------------------------------------------------------
function Panel({ title, children, right }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: C.panel, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14 }}>{title}</span>
        {right}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, unit, accent }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: C.panel, padding: 16, flex: 1, minWidth: 160 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.muted, fontSize: 12.5, marginBottom: 10 }}>
        <Icon size={15} color={accent || C.ice} /> {label}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 500, color: accent || C.text }}>
        {value}<span style={{ fontSize: 14, color: C.muted, marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  );
}

function AlertRow({ a }) {
  const color = a.sev === 'critical' ? C.coral : C.amber;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
      <AlertTriangle size={15} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ fontSize: 13 }}>
        <div>{a.msg}</div>
        <div style={{ color: C.muted, fontSize: 11.5, marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>{a.mod}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------
function Overview({ s, eHist, currentPower, currentEnv, batt, eq, sup, alerts }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KPI icon={Zap} label="Power generated" value={currentPower.generated.toFixed(1)} unit="kW" />
        <KPI icon={Battery} label="Battery reserve" value={batt} unit="%" accent={batt < 35 ? C.coral : batt < 55 ? C.amber : C.mint} />
        <KPI icon={Thermometer} label="Outdoor temp" value={currentEnv.temp.toFixed(1)} unit="°C" />
        <KPI icon={Wind} label="Wind speed" value={currentEnv.wind.toFixed(0)} unit="km/h" accent={currentEnv.wind > 40 ? C.amber : C.text} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <Panel title="Power balance — last 24h (simulated)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={eHist} margin={{ top: 5, right: 20, bottom: 0, left: -10 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke={C.muted} fontSize={11} />
              <YAxis stroke={C.muted} fontSize={11} />
              <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }} />
              <Line type="monotone" dataKey="generated" stroke={C.ice} strokeWidth={2} dot={false} name="Generated" />
              <Line type="monotone" dataKey="consumed" stroke={C.amber} strokeWidth={2} dot={false} name="Consumed" />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title={`Active alerts (${alerts.length})`}>
          {alerts.length === 0 ? (
            <div style={{ color: C.muted, fontSize: 13 }}>No active alerts. All monitored systems within normal range.</div>
          ) : (
            <div>{alerts.slice(0, 6).map((a, i) => <AlertRow key={i} a={a} />)}</div>
          )}
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Panel title="Infrastructure snapshot">
          {eq.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <Icon size={15} color={C.muted} /> {item.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: healthColor(item.health) }}>{item.health}%</span>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: healthColor(item.health) }} />
                </div>
              </div>
            );
          })}
        </Panel>
        <Panel title="Supply reserves">
          {sup.map((item) => {
            const days = Math.round(item.pct / item.dailyUse);
            return (
              <div key={item.key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span>{item.name}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.muted }}>{days}d left</span>
                </div>
                <div style={{ height: 6, background: C.panelAlt, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: days < 15 ? C.coral : days < 30 ? C.amber : C.ice }} />
                </div>
              </div>
            );
          })}
        </Panel>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Energy module
// ---------------------------------------------------------------------------
function EnergyModule({ eHist, batt, current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KPI icon={Zap} label="Generated now" value={current.generated.toFixed(1)} unit="kW" />
        <KPI icon={Activity} label="Consumed now" value={current.consumed.toFixed(1)} unit="kW" />
        <KPI icon={Battery} label="Battery reserve" value={batt} unit="%" accent={batt < 35 ? C.coral : batt < 55 ? C.amber : C.mint} />
      </div>
      <Panel title="Generation vs consumption (kW)">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={eHist} margin={{ top: 5, right: 20, bottom: 0, left: -10 }}>
            <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke={C.muted} fontSize={11} />
            <YAxis stroke={C.muted} fontSize={11} />
            <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }} />
            <Line type="monotone" dataKey="generated" stroke={C.ice} strokeWidth={2} dot={false} name="Generated" />
            <Line type="monotone" dataKey="consumed" stroke={C.amber} strokeWidth={2} dot={false} name="Consumed" />
          </LineChart>
        </ResponsiveContainer>
      </Panel>
      <Panel title="Generator bank status">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {['Generator 1', 'Generator 2', 'Generator 3 (standby)'].map((g, i) => {
            const load = i === 2 ? 0 : Math.round(rand(55, 92));
            return (
              <div key={g} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
                <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 6 }}>{g}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20 }}>{load}%</div>
                <div style={{ fontSize: 11, color: load === 0 ? C.muted : C.mint, marginTop: 4 }}>{load === 0 ? 'Standby' : 'Running'}</div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Environment module
// ---------------------------------------------------------------------------
function EnvironmentModule({ vHist, current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KPI icon={Thermometer} label="Outdoor temperature" value={current.temp.toFixed(1)} unit="°C" />
        <KPI icon={Wind} label="Wind speed" value={current.wind.toFixed(0)} unit="km/h" accent={current.wind > 40 ? C.amber : C.text} />
        <KPI icon={Snowflake} label="Ice stability index" value={(100 - current.wind / 2).toFixed(0)} unit="/100" />
      </div>
      <Panel title="Temperature trend (°C)">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={vHist} margin={{ top: 5, right: 20, bottom: 0, left: -10 }}>
            <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke={C.muted} fontSize={11} />
            <YAxis stroke={C.muted} fontSize={11} />
            <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }} />
            <Area type="monotone" dataKey="temp" stroke={C.ice} fill="rgba(95,216,232,0.15)" strokeWidth={2} name="Temp (°C)" />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
      <Panel title="Wind speed trend (km/h)">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={vHist} margin={{ top: 5, right: 20, bottom: 0, left: -10 }}>
            <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke={C.muted} fontSize={11} />
            <YAxis stroke={C.muted} fontSize={11} />
            <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }} />
            <Area type="monotone" dataKey="wind" stroke={C.amber} fill="rgba(232,162,63,0.15)" strokeWidth={2} name="Wind (km/h)" />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Infrastructure module
// ---------------------------------------------------------------------------
function InfrastructureModule({ eq }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {eq.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <Panel key={item.key} title={item.name} right={
            <span style={{ fontSize: 12, color: healthColor(item.health), fontWeight: 600 }}>{healthLabel(item.health)}</span>
          }>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Icon size={22} color={healthColor(item.health)} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: C.panelAlt, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${item.health}%`, height: '100%', background: healthColor(item.health) }} />
                </div>
              </div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, minWidth: 48, textAlign: 'right' }}>{item.health}%</span>
            </div>
            {item.health < 75 && (
              <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted }}>
                Predictive maintenance flagged — schedule inspection within {item.health < 60 ? '48 hours' : '2 weeks'}.
              </div>
            )}
          </Panel>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Logistics module
// ---------------------------------------------------------------------------
function LogisticsModule({ sup }) {
  const chartData = sup.map((s) => ({ name: s.name, reserve: s.pct }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Panel title="Supply reserves (%)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 0, left: -10 }}>
            <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={C.muted} fontSize={11} />
            <YAxis stroke={C.muted} fontSize={11} />
            <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }} />
            <Bar dataKey="reserve" fill={C.ice} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
      <Panel title="Resupply planning">
        {sup.map((item) => {
          const days = Math.round(item.pct / item.dailyUse);
          return (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <Package size={15} color={C.muted} /> {item.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 12.5, color: C.muted }}>{item.pct}% remaining</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: days < 15 ? C.coral : days < 30 ? C.amber : C.text }}>
                  ~{days} days
                </span>
                <ChevronRight size={14} color={C.muted} />
              </div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
}
