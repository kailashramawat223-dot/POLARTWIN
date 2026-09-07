import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getEnvironmentLatest, getEnvironmentHistory } from '../api';
import { PanelLoading, PanelError } from './Shared';

export default function EnvironmentPanel({ stationId }) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getEnvironmentLatest(stationId), getEnvironmentHistory(stationId)])
      .then(([latestData, historyData]) => {
        if (cancelled) return;
        setLatest(latestData);
        setHistory(
          historyData.map((h) => ({
            time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temperature: h.temperature,
          }))
        );
      })
      .catch((err) => !cancelled && setError(err.message || 'Failed to load environment data'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [stationId]);

  if (loading) return <PanelLoading label="Loading environment data..." />;
  if (error) return <PanelError message={error} />;

  const stats = [
    { label: 'Temperature', value: `${latest.temperature}\u00b0C` },
    { label: 'Wind speed', value: `${latest.windSpeed} km/h` },
    { label: 'Humidity', value: `${latest.humidity}%` },
    { label: 'Pressure', value: `${latest.pressure} hPa` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-panel border border-border rounded-xl p-4">
            <div className="text-xs text-muted mb-1">{s.label}</div>
            <div className="text-xl font-semibold text-slate-100">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-panel border border-border rounded-xl p-4">
        <div className="text-sm text-muted mb-3">Temperature trend</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={history}>
            <CartesianGrid stroke="#233150" strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#7E93B8" fontSize={11} />
            <YAxis stroke="#7E93B8" fontSize={11} />
            <Tooltip contentStyle={{ background: '#17233A', border: '1px solid #233150', borderRadius: 8 }} />
            <Area type="monotone" dataKey="temperature" stroke="#5FD8E8" fill="#5FD8E822" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
