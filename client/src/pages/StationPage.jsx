import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStation, getAlerts } from '../api';
import { PanelLoading, PanelError } from '../components/Shared';
import StatusBadge from '../components/StatusBadge';
import StationMap from '../components/StationMap';
import EnergyPanel from '../components/EnergyPanel';
import EnvironmentPanel from '../components/EnvironmentPanel';
import LogisticsPanel from '../components/LogisticsPanel';
import AlertsPanel from '../components/AlertsPanel';
import AIInsightsPanel from '../components/AIInsightsPanel';

const TABS = ['Overview', '2D Map', 'Energy', 'Environment', 'Logistics', 'Alerts', 'AI Insights'];

export default function StationPage() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [alertCount, setAlertCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setActiveTab('Overview');
    Promise.all([getStation(id), getAlerts(id, false)])
      .then(([stationData, alerts]) => {
        if (cancelled) return;
        setStation(stationData);
        setAlertCount(alerts.length);
      })
      .catch((err) => !cancelled && setError(err.response?.data?.error || err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="min-h-screen bg-bg p-8"><PanelLoading label="Loading station..." /></div>;
  if (error) return <div className="min-h-screen bg-bg p-8"><PanelError message={error} /></div>;

  return (
    <div className="min-h-screen bg-bg">
      <div
        className="h-56 relative flex items-end"
        style={{ backgroundImage: `url(${station.photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-5 flex items-end justify-between">
          <div>
            <Link to="/" className="text-xs text-ice hover:underline">&larr; All stations</Link>
            <h1 className="text-3xl font-bold text-slate-100 uppercase tracking-wide mt-1">{station.name}</h1>
            <div className="text-sm text-muted">{station.location} &middot; est. {station.established}</div>
          </div>
          <div className="text-right">
            <StatusBadge status={station.status} />
            <div className="text-xs text-muted mt-2">
              Last updated {new Date(station.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="flex gap-1 border-b border-border overflow-x-auto mt-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab ? 'border-ice text-ice' : 'border-transparent text-muted hover:text-slate-200'
              }`}
            >
              {tab}
              {tab === 'Alerts' && alertCount > 0 && (
                <span className="ml-1.5 bg-crit text-white text-[10px] px-1.5 py-0.5 rounded-full">{alertCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'Overview' && <OverviewTab station={station} alertCount={alertCount} />}
          {activeTab === '2D Map' && <StationMap assets={station.mapAssets} />}
          {activeTab === 'Energy' && <EnergyPanel stationId={id} />}
          {activeTab === 'Environment' && <EnvironmentPanel stationId={id} />}
          {activeTab === 'Logistics' && <LogisticsPanel stationId={id} />}
          {activeTab === 'Alerts' && <AlertsPanel stationId={id} />}
          {activeTab === 'AI Insights' && <AIInsightsPanel stationId={id} />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ station, alertCount }) {
  const assetsByStatus = { green: 0, yellow: 0, red: 0 };
  station.mapAssets.forEach((a) => { assetsByStatus[a.status] = (assetsByStatus[a.status] || 0) + 1; });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard label="Overall status" value={station.status.toUpperCase()} />
      <StatCard label="Active alerts" value={alertCount} />
      <StatCard label="Tracked assets" value={station.mapAssets.length} />
      <StatCard label="Assets needing attention" value={assetsByStatus.yellow + assetsByStatus.red} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-xl font-semibold text-slate-100">{value}</div>
    </div>
  );
}
