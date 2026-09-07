import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getInventory, getInventoryHistory } from '../api';
import { PanelLoading, PanelError } from './Shared';

const LABELS = { food: 'Food', fuel: 'Fuel', medical: 'Medical Supplies', spareParts: 'Spare Parts' };

export default function LogisticsPanel({ stationId }) {
  const [inventory, setInventory] = useState([]);
  const [selectedType, setSelectedType] = useState('food');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getInventory(stationId)
      .then((data) => !cancelled && setInventory(data))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load inventory'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [stationId]);

  useEffect(() => {
    let cancelled = false;
    setHistoryLoading(true);
    getInventoryHistory(stationId, selectedType)
      .then((data) => {
        if (cancelled) return;
        setHistory(
          data.map((h) => ({
            time: new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            quantity: h.quantity,
          }))
        );
      })
      .catch(() => {})
      .finally(() => !cancelled && setHistoryLoading(false));
    return () => { cancelled = true; };
  }, [stationId, selectedType]);

  if (loading) return <PanelLoading label="Loading logistics data..." />;
  if (error) return <PanelError message={error} />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inventory.map((item) => {
          const pct = Math.round((item.currentQuantity / item.fullQuantity) * 100);
          const barColor = pct < 30 ? 'bg-crit' : pct < 50 ? 'bg-warn' : 'bg-ok';
          return (
            <button
              key={item.type}
              onClick={() => setSelectedType(item.type)}
              className={`text-left bg-panel border rounded-xl p-4 transition-colors ${
                selectedType === item.type ? 'border-ice' : 'border-border'
              }`}
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-100">{LABELS[item.type] || item.type}</span>
                <span className="text-sm text-slate-300">{pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-panelAlt rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-panel border border-border rounded-xl p-4">
        <div className="text-sm text-muted mb-3">{LABELS[selectedType]} \u2014 consumption trend</div>
        {historyLoading ? (
          <PanelLoading label="Loading trend..." />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid stroke="#233150" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#7E93B8" fontSize={11} />
              <YAxis stroke="#7E93B8" fontSize={11} />
              <Tooltip contentStyle={{ background: '#17233A', border: '1px solid #233150', borderRadius: 8 }} />
              <Line type="monotone" dataKey="quantity" stroke="#5FD8E8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
