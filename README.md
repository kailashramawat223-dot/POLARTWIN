# Indian Antarctic Operations Digital Twin Platform (PolarTwin)

A full-stack digital twin platform for remotely monitoring and managing India's
Maitri and Bharati Antarctic research stations. Built for Smart India
Hackathon 2026 (SIH26060, Ministry of Earth Sciences / NCPOR).

This repo has two parts:

```
polartwin-platform/
├── server/   # Express mock REST API (JWT auth, in-memory data)
└── client/   # React (Vite) + Tailwind CSS frontend
```

## Quick start

You need two terminals — one for the API, one for the frontend.

**Terminal 1 — API server**
```bash
cd server
npm install
npm start
```
Runs on `http://localhost:5000`.

**Terminal 2 — frontend**
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173` (Vite's default port).

Open `http://localhost:5173` in your browser and log in with one of the demo
accounts below.

## Demo accounts

| Role | Email | Password | Lands on |
|---|---|---|---|
| Officer | `officer@polartwin.in` | `officer123` | Officer Dashboard (both stations, read-only) |
| Admin | `admin@polartwin.in` | `admin123` | Officer Dashboard (full access) |
| Operator (Maitri) | `operator.maitri@polartwin.in` | `operator123` | Operator Dashboard for Maitri |
| Operator (Bharati) | `operator.bharati@polartwin.in` | `operator123` | Operator Dashboard for Bharati |

## What's implemented

- **Auth**: JWT login, token stored in `localStorage`, attached to every
  request via an axios interceptor, role-based redirect after login.
- **Landing page**: station cards for Maitri and Bharati, click through to
  each station.
- **Station page**: banner, status badge, tabbed sections —
  Overview, 2D Map, Energy, Environment, Logistics, Alerts, AI Insights.
- **2D digital twin map**: SVG-rendered station layout with clickable,
  colour-coded asset nodes (buildings, generators, fuel farm, water plant,
  comms array) and a detail side panel.
- **Energy panel**: consumption %, generator list with load/status, a
  history line chart.
- **Environment panel**: temperature / wind / humidity / pressure stat
  cards plus a temperature trend chart.
- **Logistics panel**: progress bars per supply type with a per-type
  consumption trend chart.
- **Alerts panel**: severity-coloured alert feed; officers/admins can
  resolve alerts.
- **AI Insights panel**: days-remaining forecasts per supply type (flagged
  when below a safe threshold) and generator health scores.
- **Officer Dashboard**: side-by-side station summaries plus a combined,
  severity-sorted alert feed across both stations. Read-only.
- **Operator Dashboard**: weekly inventory update form and a maintenance
  report form, scoped to the operator's own station.
- Loading and error states on every data-fetching view.

## Design

Dark, mission-control aesthetic — deep navy background, ice-blue accent,
strict green/yellow/red status colours, card-based layout, minimal clutter.
Built to be read at a glance on a monitoring display.

## Notes on the data

This uses an **in-memory mock backend** — restarting the server resets all
data to its seed values (inventory levels, resolved alerts, maintenance
reports). This is intentional for a hackathon demo; swap `server/data.js`
for real database queries when connecting to actual station sensors and
inventory systems.

Station photos are referenced as `/images/maitri.jpg` and
`/images/bharati.jpg` in `server/data.js` — add real images to
`client/public/images/` with those names, or the cards will simply show a
placeholder background.
