import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStations } from '../api';
import { PanelLoading, PanelError } from '../components/Shared';
import StatusBadge from '../components/StatusBadge';

export default function Landing() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getStations()
      .then(setStations)
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-ice text-sm font-semibold tracking-wide uppercase mb-1">PolarTwin</div>
          <h1 className="text-2xl font-bold text-slate-100">Indian Antarctic Operations Digital Twin Platform</h1>
          <p className="text-muted text-sm mt-2">Select a station to view its live status</p>
        </div>

        {loading && <PanelLoading label="Loading stations..." />}
        {error && <PanelError message={error} />}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stations.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/station/${s.id}`)}
                className="text-left bg-panel border border-border rounded-2xl overflow-hidden hover:border-ice transition-colors group"
              >
                <div
                  className="h-40 bg-panelAlt flex items-center justify-center text-muted text-sm"
                  style={{
                    backgroundImage: `url(${s.photoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <span className="bg-bg/60 px-2 py-1 rounded">Station photo</span>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-slate-100 uppercase tracking-wide group-hover:text-ice transition-colors">
                      {s.name}
                    </div>
                    <div className="text-xs text-muted mt-0.5">{s.location}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
