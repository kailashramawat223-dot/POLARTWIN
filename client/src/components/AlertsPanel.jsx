import React, { useEffect, useState } from 'react';
import { getAlerts, resolveAlert } from '../api';
import { useAuth } from '../context/AuthContext';
import { PanelLoading, PanelError } from './Shared';

const SEVERITY_DOT = { red: '\u{1F534}', yellow: '\u{1F7E1}', green: '\u{1F7E2}' };

export default function AlertsPanel({ stationId }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  const canResolve = user && (user.role === 'officer' || user.role === 'admin');

  const load = () => {
    setLoading(true);
    setError(null);
    getAlerts(stationId, false)
      .then(setAlerts)
      .catch((err) => setError(err.message || 'Failed to load alerts'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [stationId]);

  const handleResolve = async (alertId) => {
    setResolvingId(alertId);
    try {
      await resolveAlert(alertId);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (err) {
      setError(err.message || 'Failed to resolve alert');
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) return <PanelLoading label="Loading alerts..." />;
  if (error) return <PanelError message={error} />;

  if (alerts.length === 0) {
    return <div className="text-sm text-muted py-8 text-center">No active alerts \u2014 all clear.</div>;
  }

  return (
    <div className="space-y-3">
      {alerts.map((a) => (
        <div key={a.id} className="bg-panel border border-border rounded-xl p-4 flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">{SEVERITY_DOT[a.severity] || '\u26AA'}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted mb-1">
              <span className="uppercase tracking-wide">{a.category}</span>
              <span>\u2022</span>
              <span>{new Date(a.timestamp).toLocaleString()}</span>
            </div>
            <div className="text-sm text-slate-100">{a.message}</div>
          </div>
          {canResolve && (
            <button
              onClick={() => handleResolve(a.id)}
              disabled={resolvingId === a.id}
              className="text-xs px-3 py-1.5 rounded-lg border border-ice text-ice hover:bg-ice/10 disabled:opacity-50 whitespace-nowrap"
            >
              {resolvingId === a.id ? 'Resolving...' : 'Resolve'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
