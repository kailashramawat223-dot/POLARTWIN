import React from 'react';

export function PanelLoading({ label }) {
  return <div className="text-muted text-sm py-8 text-center">{label || 'Loading...'}</div>;
}

export function PanelError({ message }) {
  return (
    <div className="text-crit text-sm py-8 text-center border border-crit/30 bg-crit/10 rounded-xl">
      Something went wrong: {message}
    </div>
  );
}
