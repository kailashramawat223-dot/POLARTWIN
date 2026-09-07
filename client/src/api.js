import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

const client = axios.create({ baseURL: BASE_URL });

// Attach the bearer token from localStorage to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('polartwin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a request comes back unauthorized, clear the stored session so the
// app can redirect back to /login on the next render.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('polartwin_token');
      localStorage.removeItem('polartwin_user');
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const login = (email, password) =>
  client.post('/auth/login', { email, password }).then((r) => r.data);

// ---------------------------------------------------------------------------
// Stations
// ---------------------------------------------------------------------------
export const getStations = () => client.get('/stations').then((r) => r.data);
export const getStation = (id) => client.get(`/stations/${id}`).then((r) => r.data);

// ---------------------------------------------------------------------------
// Energy
// ---------------------------------------------------------------------------
export const getEnergyLatest = (stationId) =>
  client.get(`/energy/${stationId}/latest`).then((r) => r.data);
export const getEnergyHistory = (stationId) =>
  client.get(`/energy/${stationId}`).then((r) => r.data);

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
export const getEnvironmentLatest = (stationId) =>
  client.get(`/environment/${stationId}/latest`).then((r) => r.data);
export const getEnvironmentHistory = (stationId) =>
  client.get(`/environment/${stationId}`).then((r) => r.data);

// ---------------------------------------------------------------------------
// Inventory / Logistics
// ---------------------------------------------------------------------------
export const getInventory = (stationId) =>
  client.get(`/inventory/${stationId}`).then((r) => r.data);
export const getInventoryHistory = (stationId, type) =>
  client.get(`/inventory/${stationId}/history/${type}`).then((r) => r.data);
export const updateInventory = (stationId, type, quantity, note) =>
  client.post(`/inventory/${stationId}/update`, { type, quantity, note }).then((r) => r.data);

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------
export const getAlerts = (stationId, resolved) =>
  client
    .get(`/alerts/${stationId}`, { params: resolved !== undefined ? { resolved } : {} })
    .then((r) => r.data);
export const resolveAlert = (alertId) =>
  client.patch(`/alerts/${alertId}/resolve`).then((r) => r.data);

// ---------------------------------------------------------------------------
// AI Insights
// ---------------------------------------------------------------------------
export const getPredictions = (stationId) =>
  client.get(`/predictions/${stationId}`).then((r) => r.data);

// ---------------------------------------------------------------------------
// Maintenance
// ---------------------------------------------------------------------------
export const submitMaintenanceReport = (stationId, payload) =>
  client.post(`/maintenance/${stationId}`, payload).then((r) => r.data);

// ---------------------------------------------------------------------------
// Dashboards
// ---------------------------------------------------------------------------
export const getOfficerDashboard = () =>
  client.get('/dashboard/officer').then((r) => r.data);
export const getOperatorDashboard = (stationId) =>
  client.get(`/dashboard/operator/${stationId}`).then((r) => r.data);

export default client;
