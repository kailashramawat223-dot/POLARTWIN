import React, { useEffect, useState } from 'react';
import { getPredictions } from '../api';
import { PanelLoading, PanelError } from './Shared';

const LABELS = { food: 'Food', fuel: 'Fuel', medical: 'Medical Supplies', spareParts: 'Spare Parts' };

export default function AIInsightsPanel({ stationId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getPredictions(stationId)
      .then((d) => !cancelled && setData(d))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load AI insights'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [stationId]);

  if (loading) return <PanelLoading label="Running predictions..." />;
  if (error) return <PanelError message={error} />;

  return (
    <div className="space-y-4">
      <div className="bg-panel border border-border rounded-xl p-4">
        <div className="text-sm text-muted mb-3">Supply forecast</div>
        <div className="space-y-2">
          {data.inventoryPredictions.map((p) => (
            <div
              key={p.type}
              className={`flex justify-between items-center px-3 py-2 rounded-lg border ${
                p.belowSafeThreshold ? 'border-crit/40 bg-crit/10' : 'border-border'
              }`}
            >
              <span className="text-sm text-slate-200">
                {LABELS[p.type] || p.type}: ~{p.daysRemaining} days remaining at current usage
              </span>
              {p.belowSafeThreshold && (
                <span className="text-xs font-semibold text-crit">BELOW SAFE THRESHOLD</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-panel border border-border rounded-xl p-4">
        <div className="text-sm text-muted mb-3">Generator health</div>
        <div className="space-y-2">
          {data.generatorHealth.map((g) => (
            <div key={g.id} className="px-3 py-2 rounded-lg border border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-200">{g.name}</span>
                <span className="text-sm font-semibold text-slate-100">{g.healthScore}/100</span>
              </div>
              {g.flags.length > 0 && (
                <div className="mt-1 text-xs text-warn">
                  {g.flags.map((f, i) => (
                    <div key={i}>\u26A0 {f}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
