// In-memory mock data store for both Antarctic stations.
// Replace this whole module with real database queries when real
// sensors / real inventory systems are connected.

function hoursAgoISO(hoursAgo) {
  return new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
}

function buildHistory(baseValue, points, spread) {
  const arr = [];
  let value = baseValue;
  for (let i = points; i >= 0; i--) {
    value = value + (Math.random() - 0.5) * spread;
    arr.push({ timestamp: hoursAgoISO(i), value: Math.round(value * 10) / 10 });
  }
  return arr;
}

const stations = {
  maitri: {
    id: 'maitri',
    name: 'Maitri',
    photoUrl: '/images/maitri.jpg',
    location: 'Schirmacher Oasis, Queen Maud Land',
    established: 1989,
    status: 'yellow',
    lastUpdated: new Date().toISOString(),
    mapAssets: [
      { id: 'm-main-hab', label: 'Main Habitat Block', type: 'building', status: 'green', x: 480, y: 420, meta: { crew: 25 } },
      { id: 'm-gen-1', label: 'Generator Shed 1', type: 'power', status: 'yellow', x: 250, y: 300, meta: { load: '78%' } },
      { id: 'm-gen-2', label: 'Generator Shed 2', type: 'power', status: 'green', x: 250, y: 500, meta: { load: '52%' } },
      { id: 'm-fuel-farm', label: 'Fuel Storage Farm', type: 'fuel', status: 'yellow', x: 700, y: 250, meta: { reserve: '38%' } },
      { id: 'm-water', label: 'Water Treatment Plant', type: 'water', status: 'green', x: 700, y: 550, meta: { flow: 'nominal' } },
      { id: 'm-comms', label: 'Comms & Satellite Array', type: 'comms', status: 'green', x: 480, y: 200, meta: { uplink: 'stable' } },
      { id: 'm-med', label: 'Medical Bay', type: 'building', status: 'green', x: 320, y: 420, meta: {} },
      { id: 'm-store', label: 'Cold Storage / Rations', type: 'building', status: 'red', x: 620, y: 420, meta: { daysLeft: 12 } },
    ],
  },
  bharati: {
    id: 'bharati',
    name: 'Bharati',
    photoUrl: '/images/bharati.jpg',
    location: 'Larsemann Hills, Prydz Bay',
    established: 2012,
    status: 'green',
    lastUpdated: new Date().toISOString(),
    mapAssets: [
      { id: 'b-main-hab', label: 'Main Habitat Modules', type: 'building', status: 'green', x: 500, y: 400, meta: { crew: 23 } },
      { id: 'b-chp-1', label: 'CHP Unit 1', type: 'power', status: 'green', x: 260, y: 280, meta: { load: '61%' } },
      { id: 'b-chp-2', label: 'CHP Unit 2', type: 'power', status: 'green', x: 260, y: 480, meta: { load: '58%' } },
      { id: 'b-chp-3', label: 'CHP Unit 3 (standby)', type: 'power', status: 'yellow', x: 260, y: 660, meta: { load: '0%' } },
      { id: 'b-fuel-farm', label: 'Fuel Storage Farm', type: 'fuel', status: 'green', x: 720, y: 260, meta: { reserve: '64%' } },
      { id: 'b-water', label: 'Water Treatment Plant', type: 'water', status: 'green', x: 720, y: 560, meta: { flow: 'nominal' } },
      { id: 'b-comms', label: 'Comms & Satellite Array', type: 'comms', status: 'green', x: 500, y: 180, meta: { uplink: 'stable' } },
      { id: 'b-jetty', label: 'Jetty / Resupply Point', type: 'building', status: 'yellow', x: 900, y: 420, meta: { distanceToShore: '50m' } },
    ],
  },
};

const energyHistory = {
  maitri: buildHistory(44, 24, 6),
  bharati: buildHistory(61, 24, 8),
};

const generators = {
  maitri: [
    { id: 'gen-1', name: 'Generator 1', status: 'green', load: 78, tempC: 62 },
    { id: 'gen-2', name: 'Generator 2', status: 'green', load: 52, tempC: 58 },
    { id: 'gen-3', name: 'Generator 3 (standby)', status: 'yellow', load: 0, tempC: 22 },
  ],
  bharati: [
    { id: 'chp-1', name: 'CHP Unit 1', status: 'green', load: 61, tempC: 60 },
    { id: 'chp-2', name: 'CHP Unit 2', status: 'green', load: 58, tempC: 59 },
    { id: 'chp-3', name: 'CHP Unit 3 (standby)', status: 'yellow', load: 0, tempC: 24 },
  ],
};

const environmentHistory = {
  maitri: buildHistory(-26, 24, 4),
  bharati: buildHistory(-13, 24, 3),
};

const environmentLatest = {
  maitri: { temperature: -27.4, windSpeed: 24, humidity: 58, pressure: 968 },
  bharati: { temperature: -14.1, windSpeed: 41, humidity: 64, pressure: 972 },
};

const inventory = {
  maitri: {
    food: { type: 'food', currentQuantity: 62, fullQuantity: 100, unit: '%', dailyUse: 1.1 },
    fuel: { type: 'fuel', currentQuantity: 38, fullQuantity: 100, unit: '%', dailyUse: 1.6 },
    medical: { type: 'medical', currentQuantity: 71, fullQuantity: 100, unit: '%', dailyUse: 0.3 },
    spareParts: { type: 'spareParts', currentQuantity: 45, fullQuantity: 100, unit: '%', dailyUse: 0.4 },
  },
  bharati: {
    food: { type: 'food', currentQuantity: 80, fullQuantity: 100, unit: '%', dailyUse: 1.0 },
    fuel: { type: 'fuel', currentQuantity: 64, fullQuantity: 100, unit: '%', dailyUse: 1.7 },
    medical: { type: 'medical', currentQuantity: 88, fullQuantity: 100, unit: '%', dailyUse: 0.3 },
    spareParts: { type: 'spareParts', currentQuantity: 58, fullQuantity: 100, unit: '%', dailyUse: 0.4 },
  },
};

const inventoryHistory = {
  maitri: {
    food: buildHistory(75, 20, 2),
    fuel: buildHistory(55, 20, 2),
    medical: buildHistory(80, 20, 1),
    spareParts: buildHistory(60, 20, 1.5),
  },
  bharati: {
    food: buildHistory(88, 20, 2),
    fuel: buildHistory(72, 20, 2),
    medical: buildHistory(92, 20, 1),
    spareParts: buildHistory(65, 20, 1.5),
  },
};

let alerts = [
  { id: 'a1', stationId: 'maitri', severity: 'red', category: 'Logistics', message: 'Cold storage rations projected to run out in 12 days', timestamp: hoursAgoISO(2), resolved: false },
  { id: 'a2', stationId: 'maitri', severity: 'yellow', category: 'Energy', message: 'Generator 1 running above 75% load for 6+ hours', timestamp: hoursAgoISO(5), resolved: false },
  { id: 'a3', stationId: 'maitri', severity: 'yellow', category: 'Logistics', message: 'Fuel reserve below 40%', timestamp: hoursAgoISO(9), resolved: false },
  { id: 'a4', stationId: 'bharati', severity: 'yellow', category: 'Environment', message: 'Wind speed sustained above 40 km/h', timestamp: hoursAgoISO(1), resolved: false },
  { id: 'a5', stationId: 'bharati', severity: 'yellow', category: 'Logistics', message: 'Jetty status flagged for inspection after last resupply', timestamp: hoursAgoISO(30), resolved: false },
  { id: 'a6', stationId: 'maitri', severity: 'green', category: 'Infrastructure', message: 'Scheduled maintenance on comms array completed', timestamp: hoursAgoISO(48), resolved: true },
];

const predictions = {
  maitri: {
    inventoryPredictions: [
      { type: 'food', daysRemaining: 56, belowSafeThreshold: false },
      { type: 'fuel', daysRemaining: 24, belowSafeThreshold: true },
      { type: 'medical', daysRemaining: 237, belowSafeThreshold: false },
      { type: 'spareParts', daysRemaining: 113, belowSafeThreshold: false },
    ],
    generatorHealth: [
      { id: 'gen-1', name: 'Generator 1', healthScore: 71, flags: ['Elevated running temperature'] },
      { id: 'gen-2', name: 'Generator 2', healthScore: 88, flags: [] },
      { id: 'gen-3', name: 'Generator 3 (standby)', healthScore: 95, flags: [] },
    ],
  },
  bharati: {
    inventoryPredictions: [
      { type: 'food', daysRemaining: 80, belowSafeThreshold: false },
      { type: 'fuel', daysRemaining: 38, belowSafeThreshold: false },
      { type: 'medical', daysRemaining: 293, belowSafeThreshold: false },
      { type: 'spareParts', daysRemaining: 145, belowSafeThreshold: false },
    ],
    generatorHealth: [
      { id: 'chp-1', name: 'CHP Unit 1', healthScore: 84, flags: [] },
      { id: 'chp-2', name: 'CHP Unit 2', healthScore: 81, flags: [] },
      { id: 'chp-3', name: 'CHP Unit 3 (standby)', healthScore: 97, flags: [] },
    ],
  },
};

let maintenanceReports = [];

const users = [
  { email: 'officer@polartwin.in', password: 'officer123', role: 'officer', name: 'NCPOR Duty Officer' },
  { email: 'admin@polartwin.in', password: 'admin123', role: 'admin', name: 'System Admin' },
  { email: 'operator.maitri@polartwin.in', password: 'operator123', role: 'operator', name: 'Maitri Station Operator', stationId: 'maitri' },
  { email: 'operator.bharati@polartwin.in', password: 'operator123', role: 'operator', name: 'Bharati Station Operator', stationId: 'bharati' },
];

module.exports = {
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
  buildHistory,
  hoursAgoISO,
};
