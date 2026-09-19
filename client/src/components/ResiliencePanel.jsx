import React, { useEffect, useState, useCallback } from 'react';
import { getCommsStatus, toggleSatellite } from '../api';
import { useAuth } from '../context/AuthContext';
import { PanelLoading, PanelError } from './Shared';

const EVENT_LABELS = {
  satellite_down: 'Satellite link lost',
  satellite_restored: 'Satellite link restored',
  failover_to_hf_radio: 'Failed over to HF radio',
};

function eventLabel(event) {
  if (EVENT_LABELS[event]) return EVENT_LABELS[event];
  const m = event.match(/^buffer_drained_(\d+)_items$/);
  if (m) return `Buffer drained \u2014 ${m[1]} queued reading${m[1] === '1' ? '' : 's'} delivered`;
  return event;
}

export default function ResiliencePanel({ stationId }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(false);

  const canToggle = user && (user.role === 'officer' || user.role === 'admin' || user.stationId === stationId);

  const refresh = useCallback(() => {
    getCommsStatus(stationId)
      .then((data) => {
        setStatus(data);
        setError(null);
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [stationId]);

  useEffect(() => {
    setLoading(true);
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [refresh]);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleSatellite(stationId);
      refresh();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <PanelLoading label="Loading comms status..." />;
  if (error) return <PanelError message={error} />;

  return (
    <div className="space-y-4">
      <div className="bg-panel border border-border rounded-xl p-5">
        <div className="text-xs text-muted uppercase tracking-wide mb-4">
          Communications &amp; data resilience
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <CommsStat
            label="Satellite uplink"
            active={status.satelliteUp}
            activeText="Online (primary)"
            inactiveText="Offline"
            activeColor="ice"
          />
          <CommsStat
            label="HF radio"
            active={status.hfRadioActive}
            activeText="Active (backup)"
            inactiveText="Standby"
            activeColor="warn"
          />
          <CommsStat
            label="Local buffer"
            active={status.bufferCount > 0}
            activeText={`${status.bufferCount} reading${status.bufferCount === 1 ? '' : 's'} queued`}
            inactiveText="Empty"
            activeColor="warn"
          />
        </div>

        {canToggle && (
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
              status.satelliteUp
                ? 'border-crit text-crit hover:bg-crit/10'
                : 'border-ok text-ok hover:bg-ok/10'
            }`}
          >
            {toggling ? 'Working...' : status.satelliteUp ? 'Simulate satellite failure' : 'Restore satellite'}
          </button>
        )}

        <p className="text-xs text-muted mt-4 leading-relaxed">
          Routine telemetry only transmits when a reading changes meaningfully or a periodic
          heartbeat is due (change-detection engine) &mdash; this is why most sensor ticks produce
          no visible update on the Energy/Environment charts. When the satellite is down, routine
          telemetry queues in the local buffer, but critical alerts still reach NCPOR over the HF
          radio backup and are never held back.
        </p>
      </div>

      <div className="bg-panel border border-border rounded-xl p-5">
        <div className="text-xs text-muted uppercase tracking-wide mb-3">Recent comms events</div>
        {status.recentEvents.length === 0 ? (
          <div className="text-sm text-muted py-4 text-center">No comms events yet.</div>
        ) : (
          <div className="space-y-2">
            {status.recentEvents.map((e, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-200">{eventLabel(e.event)}</span>
                <span className="text-muted">{new Date(e.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const COLOR_CLASSES = {
  ice: { dot: 'bg-ice', text: 'text-ice' },
  warn: { dot: 'bg-warn', text: 'text-warn' },
};

function CommsStat({ label, active, activeText, inactiveText, activeColor }) {
  const c = COLOR_CLASSES[activeColor] || COLOR_CLASSES.ice;
  return (
    <div className="bg-panelAlt border border-border rounded-lg p-3">
      <div className="text-[11px] text-muted uppercase tracking-wide mb-1.5">{label}</div>
      <div className={`flex items-center gap-2 text-sm font-medium ${active ? c.text : 'text-muted'}`}>
        <span className={`w-2 h-2 rounded-full ${active ? c.dot : 'bg-muted'}`} />
        {active ? activeText : inactiveText}
      </div>
    </div>
  );
}

// Compact, no-frills version used inline on the Overview tab so operators/
// officers see comms health at a glance without switching tabs.
export function CommsStrip({ stationId }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => getCommsStatus(stationId).then((d) => !cancelled && setStatus(d)).catch(() => {});
    load();
    const id = setInterval(load, 4000);
    return () => { cancelled = true; clearInterval(id); };
  }, [stationId]);

  if (!status) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 bg-panel border border-border rounded-xl p-3 text-xs">
      <Dot active={status.satelliteUp} color="ice" label="Satellite" />
      <Dot active={status.hfRadioActive} color="warn" label="HF radio" />
      <Dot active={status.bufferCount > 0} color="warn" label={`Buffer: ${status.bufferCount}`} />
    </div>
  );
}

function Dot({ active, color, label }) {
  const c = COLOR_CLASSES[color] || COLOR_CLASSES.ice;
  return (
    <span className={`inline-flex items-center gap-1.5 ${active ? c.text : 'text-muted'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? c.dot : 'bg-muted'}`} />
      {label}
    </span>
  );
}
