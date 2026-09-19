import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopBar({ title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="border-b border-border bg-panel/60">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-ice text-xs font-semibold tracking-wide uppercase">PolarTwin</div>
          <h1 className="text-lg font-bold text-slate-100">{title}</h1>
          {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right">
              <div className="text-sm text-slate-200">{user.name}</div>
              <div className="text-xs text-muted capitalize">{user.role}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted hover:text-slate-100 hover:border-ice transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
