import React from 'react';

const COLORS = {
  green: { dot: 'bg-ok', text: 'text-ok', bg: 'bg-ok/10', border: 'border-ok/30', label: 'Nominal' },
  yellow: { dot: 'bg-warn', text: 'text-warn', bg: 'bg-warn/10', border: 'border-warn/30', label: 'Degraded' },
  red: { dot: 'bg-crit', text: 'text-crit', bg: 'bg-crit/10', border: 'border-crit/30', label: 'Critical' },
};

export default function StatusBadge({ status, label }) {
  const c = COLORS[status] || COLORS.green;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${c.bg} ${c.border} ${c.text} text-xs font-semibold`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {label || c.label}
    </span>
  );
}
