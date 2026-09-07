import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await loginApi(email, password);
      login(token, user);
      if (user.role === 'officer' || user.role === 'admin') {
        navigate('/dashboard/officer');
      } else {
        navigate(`/dashboard/operator/${user.stationId}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-ice text-sm font-semibold tracking-wide uppercase mb-1">PolarTwin</div>
          <h1 className="text-xl font-bold text-slate-100">Indian Antarctic Operations</h1>
          <p className="text-muted text-sm mt-1">Digital Twin Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-panel border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-panelAlt border border-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-ice"
              placeholder="you@polartwin.in"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panelAlt border border-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-ice"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            />
          </div>

          {error && <div className="text-crit text-xs">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ice text-bg font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-xs text-muted text-center leading-relaxed">
          Demo accounts: officer@polartwin.in / officer123<br />
          operator.maitri@polartwin.in / operator123
        </div>
      </div>
    </div>
  );
}
