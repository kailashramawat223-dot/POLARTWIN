import React, { useState } from 'react';

const STATUS_COLOR = { green: '#22c55e', yellow: '#eab308', red: '#ef4444' };

const TYPE_ICON = {
  building: '\u25A0', // square
  power: '\u26A1', // bolt
  fuel: '\u26FD', // fuel pump
  water: '\u1F4A7', // will fall back, see below
  comms: '\u21C7',
};

// Simple glyphs that render reliably across fonts
const TYPE_GLYPH = {
  building: 'B',
  power: '\u26A1',
  fuel: 'F',
  water: 'W',
  comms: 'C',
};

const VIEW_W = 1000;
const VIEW_H = 800;

export default function StationMap({ assets = [] }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 bg-panel border border-border rounded-xl p-4">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto" style={{ maxHeight: 520 }}>
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1b2740" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" />

          {assets.map((asset) => {
            const isSelected = selected && selected.id === asset.id;
            return (
              <g
                key={asset.id}
                transform={`translate(${asset.x}, ${asset.y})`}
                onClick={() => setSelected(asset)}
                style={{ cursor: 'pointer' }}
              >
                {isSelected && <circle r={34} fill="none" stroke="#5FD8E8" strokeWidth={2} opacity={0.6} />}
                <circle r={26} fill={STATUS_COLOR[asset.status] || '#7E93B8'} opacity={0.85} />
                <circle r={26} fill="none" stroke="#0B1220" strokeWidth={2} />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16}
                  fontWeight="700"
                  fill="#0B1220"
                >
                  {TYPE_GLYPH[asset.type] || '?'}
                </text>
                <text
                  textAnchor="middle"
                  y={44}
                  fontSize={15}
                  fill="#E8F1F5"
                  fontWeight={isSelected ? 700 : 400}
                >
                  {asset.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex gap-4 mt-3 text-xs text-muted flex-wrap">
          <Legend color="#22c55e" label="Nominal" />
          <Legend color="#eab308" label="Degraded" />
          <Legend color="#ef4444" label="Critical" />
        </div>
      </div>

      <div className="w-full md:w-72 bg-panel border border-border rounded-xl p-4">
        {!selected && (
          <div className="text-muted text-sm">Click any node on the map to see its details here.</div>
        )}
        {selected && (
          <div>
            <div className="text-xs uppercase tracking-wide text-muted mb-1">{selected.type}</div>
            <div className="text-lg font-semibold text-slate-100 mb-3">{selected.label}</div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: STATUS_COLOR[selected.status] }}
              />
              <span className="text-sm capitalize text-slate-200">{selected.status}</span>
            </div>
            {Object.keys(selected.meta || {}).length > 0 && (
              <div className="space-y-2">
                {Object.entries(selected.meta).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm border-b border-border pb-1.5">
                    <span className="text-muted capitalize">{k}</span>
                    <span className="text-slate-200 font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setSelected(null)}
              className="mt-4 text-xs text-ice hover:underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
