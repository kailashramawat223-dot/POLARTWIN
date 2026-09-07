const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {
  stations,
  energyHistory,
  generators,
  environmentHistory,
  environmentLatest,
  inventory,
  inventoryHistory,
  alerts,
  predictions,
  maintenanceReports,
  users,
} = require('./data');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'polartwin-dev-secret-change-in-production';
const PORT = process.env.PORT || 5001;

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this action' });
    }
    next();
  };
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const payload = { email: user.email, role: user.role, name: user.name, stationId: user.stationId || null };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, user: payload });
});

// ---------------------------------------------------------------------------
// Stations
// ---------------------------------------------------------------------------
app.get('/api/stations', authMiddleware, (req, res) => {
  const list = Object.values(stations).map((s) => ({
    id: s.id, name: s.name, photoUrl: s.photoUrl, status: s.status, location: s.location,
  }));
  res.json(list);
});

app.get('/api/stations/:id', authMiddleware, (req, res) => {
  const station = stations[req.params.id];
  if (!station) return res.status(404).json({ error: 'Station not found' });
  res.json(station);
});

// ---------------------------------------------------------------------------
// Energy
// ---------------------------------------------------------------------------
app.get('/api/energy/:stationId/latest', authMiddleware, (req, res) => {
  const { stationId } = req.params;
  const gens = generators[stationId];
  if (!gens) return res.status(404).json({ error: 'Unknown station' });
  const consumptionPercent = gens.reduce((sum, g) => sum + g.load, 0) / gens.length;
  res.json({ consumptionPercent: Math.round(consumptionPercent), generators: gens });
});

app.get('/api/energy/:stationId', authMiddleware, (req, res) => {
  const history = energyHistory[req.params.stationId];
  if (!history) return res.status(404).json({ error: 'Unknown station' });
  res.json(history.map((h) => ({ timestamp: h.timestamp, consumptionKwh: h.value })));
});

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
app.get('/api/environment/:stationId/latest', authMiddleware, (req, res) => {
  const latest = environmentLatest[req.params.stationId];
  if (!latest) return res.status(404).json({ error: 'Unknown station' });
  res.json(latest);
});

app.get('/api/environment/:stationId', authMiddleware, (req, res) => {
  const history = environmentHistory[req.params.stationId];
  if (!history) return res.status(404).json({ error: 'Unknown station' });
  res.json(history.map((h) => ({ timestamp: h.timestamp, temperature: h.value })));
});

// ---------------------------------------------------------------------------
// Inventory / Logistics
// ---------------------------------------------------------------------------
app.get('/api/inventory/:stationId', authMiddleware, (req, res) => {
  const inv = inventory[req.params.stationId];
  if (!inv) return res.status(404).json({ error: 'Unknown station' });
  res.json(Object.values(inv));
});

app.get('/api/inventory/:stationId/history/:type', authMiddleware, (req, res) => {
  const { stationId, type } = req.params;
  const hist = inventoryHistory[stationId] && inventoryHistory[stationId][type];
  if (!hist) return res.status(404).json({ error: 'Unknown station or inventory type' });
  res.json(hist.map((h) => ({ timestamp: h.timestamp, quantity: h.value })));
});

app.post('/api/inventory/:stationId/update', authMiddleware, requireRole('operator', 'admin'), (req, res) => {
  const { stationId } = req.params;
  const { type, quantity, note } = req.body || {};
  const inv = inventory[stationId];
  if (!inv || !inv[type]) return res.status(404).json({ error: 'Unknown station or inventory type' });

  inv[type].currentQuantity = quantity;
  const hist = inventoryHistory[stationId][type];
  hist.push({ timestamp: new Date().toISOString(), value: quantity });

  res.json({ success: true, type, quantity, note: note || null, updatedBy: req.user.email });
});

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------
app.get('/api/alerts/:stationId', authMiddleware, (req, res) => {
  const { stationId } = req.params;
  const { resolved } = req.query;
  let list = alerts.filter((a) => a.stationId === stationId);
  if (resolved !== undefined) {
    const wantResolved = resolved === 'true';
    list = list.filter((a) => a.resolved === wantResolved);
  }
  list = [...list].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(list);
});

app.patch('/api/alerts/:alertId/resolve', authMiddleware, requireRole('officer', 'admin'), (req, res) => {
  const alert = alerts.find((a) => a.id === req.params.alertId);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.resolved = true;
  res.json(alert);
});

// ---------------------------------------------------------------------------
// AI Insights / predictions
// ---------------------------------------------------------------------------
app.get('/api/predictions/:stationId', authMiddleware, (req, res) => {
  const pred = predictions[req.params.stationId];
  if (!pred) return res.status(404).json({ error: 'Unknown station' });
  res.json(pred);
});

// ---------------------------------------------------------------------------
// Maintenance reports
// ---------------------------------------------------------------------------
app.post('/api/maintenance/:stationId', authMiddleware, requireRole('operator', 'admin'), (req, res) => {
  const { stationId } = req.params;
  const { equipmentName, description, severity } = req.body || {};
  if (!equipmentName || !severity) {
    return res.status(400).json({ error: 'equipmentName and severity are required' });
  }
  const report = {
    id: 'mr-' + Date.now(),
    stationId,
    equipmentName,
    description: description || '',
    severity,
    submittedBy: req.user.email,
    timestamp: new Date().toISOString(),
  };
  maintenanceReports.push(report);
  res.status(201).json(report);
});

// ---------------------------------------------------------------------------
// Dashboards
// ---------------------------------------------------------------------------
app.get('/api/dashboard/officer', authMiddleware, requireRole('officer', 'admin'), (req, res) => {
  const summary = Object.values(stations).map((s) => {
    const inv = inventory[s.id];
    const keyInventoryPercent = Math.round(
      Object.values(inv).reduce((sum, i) => sum + i.currentQuantity, 0) / Object.values(inv).length
    );
    const activeAlertCount = alerts.filter((a) => a.stationId === s.id && !a.resolved).length;
    return { id: s.id, name: s.name, status: s.status, keyInventoryPercent, activeAlertCount };
  });

  const combinedAlerts = alerts
    .filter((a) => !a.resolved)
    .sort((a, b) => {
      const order = { red: 0, yellow: 1, green: 2 };
      return order[a.severity] - order[b.severity] || new Date(b.timestamp) - new Date(a.timestamp);
    });

  res.json({ stations: summary, combinedAlerts });
});

app.get('/api/dashboard/operator/:stationId', authMiddleware, requireRole('operator', 'admin'), (req, res) => {
  const { stationId } = req.params;
  const station = stations[stationId];
  if (!station) return res.status(404).json({ error: 'Unknown station' });
  const inv = Object.values(inventory[stationId]);
  const recentAlerts = alerts
    .filter((a) => a.stationId === stationId && !a.resolved)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json({ station, inventory: inv, recentAlerts });
});

// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'polartwin-mock-api' }));

app.listen(PORT, () => {
  console.log(`PolarTwin mock API listening on http://localhost:${PORT}`);
  console.log('Demo accounts:');
  console.log('  officer@polartwin.in / officer123');
  console.log('  admin@polartwin.in / admin123');
  console.log('  operator.maitri@polartwin.in / operator123');
  console.log('  operator.bharati@polartwin.in / operator123');
});
