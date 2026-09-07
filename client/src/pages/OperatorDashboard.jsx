import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOperatorDashboard, updateInventory, submitMaintenanceReport } from '../api';
import { PanelLoading, PanelError } from '../components/Shared';
import TopBar from '../components/TopBar';

const LABELS = { food: 'Food', fuel: 'Fuel', medical: 'Medical Supplies', spareParts: 'Spare Parts' };

export default function OperatorDashboard() {
  const { stationId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getOperatorDashboard(stationId)
      .then(setData)
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [stationId]);

  return (
    <div className="min-h-screen bg-bg">
      <TopBar title="Operator Dashboard" subtitle={data ? data.station.name : ''} />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading && <PanelLoading label="Loading dashboard..." />}
        {error && <PanelError message={error} />}

        {data && (
          <div className="space-y-8">
            <InventoryUpdateForm stationId={stationId} inventory={data.inventory} onUpdated={load} />
            <MaintenanceReportForm stationId={stationId} />
            <RecentAlerts alerts={data.recentAlerts} />
          </div>
        )}
      </div>
    </div>
  );
}

function InventoryUpdateForm({ stationId, inventory, onUpdated }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(inventory.map((i) => [i.type, i.currentQuantity]))
  );
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      for (const item of inventory) {
        const newVal = Number(values[item.type]);
        if (newVal !== item.currentQuantity) {
          await updateInventory(stationId, item.type, newVal, note || undefined);
        }
      }
      setMessage({ type: 'ok', text: 'Inventory updated successfully.' });
      setNote('');
      onUpdated();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update inventory' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-border rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-4">
        Weekly Inventory Update
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {inventory.map((item) => (
          <div key={item.type}>
            <label className="block text-xs text-muted mb-1.5">
              {LABELS[item.type] || item.type}{' '}
              <span className="text-muted">(current: {item.currentQuantity}{item.unit})</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={values[item.type]}
              onChange={(e) => setValues((v) => ({ ...v, [item.type]: e.target.value }))}
              className="w-full bg-panelAlt border border-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-ice"
            />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-xs text-muted mb-1.5">Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. resupply received, manual recount..."
          className="w-full bg-panelAlt border border-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-ice"
        />
      </div>
      {message && (
        <div className={`text-xs mb-3 ${message.type === 'ok' ? 'text-ok' : 'text-crit'}`}>{message.text}</div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="bg-ice text-bg font-semibold rounded-lg px-5 py-2 text-sm hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Submit update'}
      </button>
    </form>
  );
}

function MaintenanceReportForm({ stationId }) {
  const [equipmentName, setEquipmentName] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('low');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await submitMaintenanceReport(stationId, { equipmentName, description, severity });
      setMessage({ type: 'ok', text: 'Maintenance report submitted.' });
      setEquipmentName('');
      setDescription('');
      setSeverity('low');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to submit report' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-border rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-4">
        Submit Maintenance Report
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1.5">Equipment name</label>
          <input
            type="text"
            required
            value={equipmentName}
            onChange={(e) => setEquipmentName(e.target.value)}
            className="w-full bg-panelAlt border border-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-ice"
            placeholder="e.g. Generator 1, Water Treatment Plant..."
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-panelAlt border border-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-ice"
            placeholder="What's the issue?"
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full bg-panelAlt border border-border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-ice"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      {message && (
        <div className={`text-xs mt-3 ${message.type === 'ok' ? 'text-ok' : 'text-crit'}`}>{message.text}</div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 bg-ice text-bg font-semibold rounded-lg px-5 py-2 text-sm hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit report'}
      </button>
    </form>
  );
}

function RecentAlerts({ alerts }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">
        Recent unresolved alerts
      </h2>
      {alerts.length === 0 ? (
        <div className="text-sm text-muted py-6 text-center">No active alerts for this station.</div>
      ) : (
        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a.id} className="bg-panel border border-border rounded-xl p-4">
              <div className="text-xs text-muted mb-1">
                {a.category} &middot; {new Date(a.timestamp).toLocaleString()}
              </div>
              <div className="text-sm text-slate-100">{a.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
