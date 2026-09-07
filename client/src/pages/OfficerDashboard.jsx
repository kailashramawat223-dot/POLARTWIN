import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOfficerDashboard } from '../api';
import { PanelLoading, PanelError } from '../components/Shared';
import StatusBadge from '../components/StatusBadge';
import TopBar from '../components/TopBar';

const SEVERITY_DOT = { red: '\u{1F534}', yellow: '\u{1F7E1}', green: '\u{1F7E2}' };

export default function OfficerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOfficerDashboard()
      .then(setData)
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <TopBar title="Officer Dashboard" subtitle="Combined view \u2014 read only" />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && <PanelLoading label="Loading dashboard..." />}
        {error && <PanelError message={error} />}

        {data && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.stations.map((s) => (
                <Link
                  key={s.id}
                  to={`/station/${s.id}`}
                  className="bg-panel border border-border rounded-2xl p-6 hover:border-ice transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-lg font-bold text-slate-100 uppercase tracking-wide">{s.name}</div>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted mb-1">Key inventory</div>
                      <div className="text-xl font-semibold text-slate-100">{s.keyInventoryPercent}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-1">Active alerts</div>
                      <div className="text-xl font-semibold text-slate-100">{s.activeAlertCount}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">
                Combined alerts feed
              </h2>
              <div className="space-y-2">
                {data.combinedAlerts.length === 0 && (
                  <div className="text-sm text-muted py-6 text-center">No active alerts across either station.</div>
                )}
                {data.combinedAlerts.map((a) => (
                  <div key={a.id} className="bg-panel border border-border rounded-xl p-4 flex items-start gap-3">
                    <span className="text-lg leading-none mt-0.5">{SEVERITY_DOT[a.severity] || '\u26AA'}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted mb-1">
                        <span className="uppercase font-semibold">{a.stationId}</span>
                        <span>&middot;</span>
                        <span>{a.category}</span>
                        <span>&middot;</span>
                        <span>{new Date(a.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-slate-100">{a.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
