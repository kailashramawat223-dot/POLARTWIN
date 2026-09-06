# PolarTwin — Antarctic Station Digital Twin

Real-time digital twin dashboard for remote management of India's Maitri and
Bharati Antarctic research stations. Built for Smart India Hackathon 2026
(Problem Statement SIH26060, Ministry of Earth Sciences / NCPOR).

## What this is

A live monitoring dashboard covering four modules — Energy, Environment,
Infrastructure, and Logistics — for both stations, with a rule-based alert
engine that flags issues automatically. Telemetry in this build is
simulated (no real sensors are deployed yet); the architecture is designed
so real IoT/satellite sensor feeds can be plugged in later without a
redesign.

## Running it locally

Requires [Node.js](https://nodejs.org/) (v16 or newer) installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start
```

This opens the dashboard at `http://localhost:3000`.

## Building for deployment

```bash
npm run build
```

This creates an optimized production build in the `build/` folder, which
can be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Project structure

```
polartwin/
├── package.json
├── public/
│   └── index.html
├── src/
│   ├── App.jsx        # main dashboard component
│   └── index.js        # React entry point
└── README.md
```

## Tech stack

- React 18
- Recharts (charts)
- lucide-react (icons)

## Next steps for real deployment

- Replace the simulated data generator (the `setInterval` block in
  `App.jsx`) with real API calls to a backend service.
- Backend: Node.js + a time-series database (e.g. InfluxDB) to ingest
  telemetry relayed from station IoT sensors via satellite uplink.
- Add authentication for the NCPOR control-room dashboard.
