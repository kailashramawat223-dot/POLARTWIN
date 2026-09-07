import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getEnergyLatest, getEnergyHistory } from '../api';
import { PanelLoading, PanelError } from './Shared';

const STATUS_COLOR = { green: 'text-ok bg-ok/10 border-ok/30', yellow: 'text-warn bg-warn/10 border-warn/30', red: 'text-crit bg-crit/10 border-crit/30' };

export default function EnergyPanel({ stationId }) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getEnergyLatest(stationId), getEnergyHistory(stationId)])
      .then(([latestData, historyData]) => {
        if (cancelled) return;
        setLatest(latestData);
        setHistory(
          historyData.map((h) => ({
            time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            consumptionKwh: h.consumptionKwh,
          }))
        );
      })
      .catch((err) => !cancelled && setError(err.message || 'Failed to load energy data'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [stationId]);

  if (loading) return <PanelLoading label="Loading energy data..." />;
  if (error) return <PanelError message={error} />;

  return (
    <div className="space-y-4">
      <div className="bg-panel border border-border rounded-xl p-4">
        <div className="text-sm text-muted mb-2">Current consumption</div>
        <div className="w-full h-3 bg-panelAlt rounded-full overflow-hidden">
          <div
            className="h-full bg-ice rounded-full transition-all"
            style={{ width: `${latest.consumptionPercent}%` }}
          />
        </div>
        <div className="text-right text-sm text-slate-300 mt-1">{latest.consumptionPercent}%</div>
      </div>

      <div className="bg-panel border border-border rounded-xl p-4">
        <div className="text-sm text-muted mb-3">Consumption trend (kWh)</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={history}>
            <CartesianGrid stroke="#233150" strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#7E93B8" fontSize={11} />
            <YAxis stroke="#7E93B8" fontSize={11} />
            <Tooltip contentStyle={{ background: '#17233A', border: '1px solid #233150', borderRadius: 8 }} />
            <Line type="monotone" dataKey="consumptionKwh" stroke="#5FD8E8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {latest.generators.map((g) => (
          <div key={g.id} className="bg-panel border border-border rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-slate-100 text-sm">{g.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLOR[g.status]}`}>{g.status}</span>
            </div>
            <div className="text-xs text-muted">Load</div>
            <div className="text-lg font-semibold text-slate-100">{g.load}%</div>
            <div className="text-xs text-muted mt-1">{g.tempC}\u00b0C</div>
          </div>
        ))}
      </div>
    </div>
  );
}
