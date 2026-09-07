# 🧊 PolarTwin --- Indian Antarctic Operations Digital Twin Platform

> **Smart India Hackathon 2026 · SIH26060 · Ministry of Earth Sciences /
> NCPOR**\
> **Real-Time Digital Twin Concept for Remote Management of Indian
> Antarctic Research Stations**

PolarTwin is a full-stack digital twin platform designed to provide a
unified operational view of India's **Maitri** and **Bharati** Antarctic
research stations.

The platform combines station visualization, energy monitoring,
environmental telemetry, logistics tracking, alerts, role-based access,
maintenance reporting, and predictive-style insights into a
mission-control dashboard.

------------------------------------------------------------------------

## 🎯 Problem Statement

Remote Antarctic stations operate in an extreme environment where:

-   physical access is difficult and infrequent,
-   environmental conditions can change rapidly,
-   energy systems are critical to station continuity,
-   fuel, food, medical supplies, and spare parts must be carefully
    managed,
-   equipment problems need to be identified before they become
    operational failures,
-   and decision-makers in India need a consolidated view of station
    status.

Traditional monitoring approaches can leave operational information
fragmented across different systems and manual reports.

### 💡 PolarTwin's Approach

PolarTwin creates a **digital operational representation of each
station** where important station assets and operational data can be
viewed from a single interface.

``` mermaid
flowchart LR
    A["🏔️ Antarctic Station<br/>Maitri / Bharati"] --> B["📊 Operational Data"]
    B --> C["🧠 PolarTwin Platform"]
    C --> D["🗺️ Digital Twin View"]
    C --> E["⚡ Energy Monitoring"]
    C --> F["🌡️ Environment Monitoring"]
    C --> G["📦 Logistics Tracking"]
    C --> H["🚨 Alert Management"]
    C --> I["🔮 Predictive Insights"]
    D --> J["👨‍💼 Officer / Operator"]
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
    J --> K["⚙️ Operational Decision"]
```

------------------------------------------------------------------------

# 🚀 Key Features

## 1. 🔐 Role-Based Authentication

PolarTwin uses JWT-based authentication with role-aware access.

### Supported roles

  -----------------------------------------------------------------------
  Role                                Access
  ----------------------------------- -----------------------------------
  **Officer**                         Both stations, monitoring and alert
                                      resolution

  **Admin**                           Full platform access

  **Maitri Operator**                 Maitri operational updates and
                                      maintenance reporting

  **Bharati Operator**                Bharati operational updates and
                                      maintenance reporting
  -----------------------------------------------------------------------

Authentication flow:

``` mermaid
flowchart TD
    A["User opens PolarTwin"] --> B["Login Page"]
    B --> C["Email + Password"]
    C --> D["POST /api/auth/login"]
    D --> E{"Credentials valid?"}
    E -- No --> F["❌ Authentication Error"]
    E -- Yes --> G["JWT Token Generated"]
    G --> H["Token stored in localStorage"]
    H --> I["Role-Based Route Access"]
    I --> J["Officer Dashboard"]
    I --> K["Operator Dashboard"]
    I --> L["Station Views"]
```

Every protected API request sends the JWT as a bearer token.

------------------------------------------------------------------------

# 🏔️ Station Management

PolarTwin currently models two Indian Antarctic research stations:

-   **Maitri**
-   **Bharati**

The landing page provides a station-level overview and allows the user
to enter an individual station's digital twin view.

``` mermaid
flowchart LR
    A["PolarTwin Landing"] --> B["Maitri"]
    A --> C["Bharati"]

    B --> D["Station Digital Twin"]
    C --> E["Station Digital Twin"]

    D --> F["Overview"]
    D --> G["2D Map"]
    D --> H["Energy"]
    D --> I["Environment"]
    D --> J["Logistics"]
    D --> K["Alerts"]
    D --> L["AI Insights"]

    E --> M["Overview"]
    E --> N["2D Map"]
    E --> O["Energy"]
    E --> P["Environment"]
    E --> Q["Logistics"]
    E --> R["Alerts"]
    E --> S["AI Insights"]
```

------------------------------------------------------------------------

# 🗺️ 2D Digital Twin Map

Each station has an SVG-based 2D operational map.

The map represents important station assets as interactive nodes.

### Example tracked assets

-   Main habitat
-   Generator / CHP units
-   Fuel storage
-   Water treatment plant
-   Communications & satellite array
-   Medical facilities
-   Storage / ration facilities
-   Resupply infrastructure

Each asset carries a status:

-   🟢 **Green** --- normal
-   🟡 **Yellow** --- attention required
-   🔴 **Red** --- critical

``` mermaid
flowchart TD
    A["Station Digital Twin"] --> B["SVG 2D Station Map"]

    B --> C["Buildings"]
    B --> D["Power Assets"]
    B --> E["Fuel Storage"]
    B --> F["Water Treatment"]
    B --> G["Communications"]
    B --> H["Resupply Infrastructure"]

    C --> I["Asset Status"]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I

    I --> J{"Operational State"}
    J --> K["🟢 Normal"]
    J --> L["🟡 Attention"]
    J --> M["🔴 Critical"]

    K --> N["Asset Detail Panel"]
    L --> N
    M --> N
```

------------------------------------------------------------------------

# ⚡ Energy Monitoring

The Energy module provides an operational view of station power systems.

### Monitored information

-   Average consumption/load
-   Generator or CHP unit status
-   Individual generator load
-   Generator temperature
-   Historical consumption trend

``` mermaid
flowchart LR
    A["Energy Data"] --> B["Generator / CHP Units"]
    B --> C["Load + Temperature + Status"]
    C --> D["Energy API"]

    D --> E["Current Consumption"]
    D --> F["Historical Data"]

    E --> G["Energy Dashboard"]
    F --> H["Consumption Trend Chart"]

    G --> I{"Load / Status"}
    I --> J["🟢 Normal"]
    I --> K["🟡 Attention"]
    I --> L["🔴 Critical"]
```

------------------------------------------------------------------------

# 🌡️ Environment Monitoring

The Environment module presents key Antarctic environmental parameters:

-   Temperature
-   Wind speed
-   Humidity
-   Atmospheric pressure
-   Historical temperature trend

``` mermaid
flowchart TD
    A["Environmental Telemetry"] --> B["Temperature"]
    A --> C["Wind Speed"]
    A --> D["Humidity"]
    A --> E["Pressure"]

    B --> F["Environment API"]
    C --> F
    D --> F
    E --> F

    F --> G["Current Conditions"]
    F --> H["Historical Temperature"]

    G --> I["Environment Dashboard"]
    H --> J["Temperature Trend"]

    I --> K{"Operational Condition"}
    K --> L["🟢 Normal"]
    K --> M["🟡 Warning"]
    K --> N["🔴 Critical"]
```

------------------------------------------------------------------------

# 📦 Logistics & Inventory Management

Long-duration Antarctic missions depend heavily on resource planning.

PolarTwin tracks:

-   Food
-   Fuel
-   Medical supplies
-   Spare parts

Each inventory type includes a current quantity, full capacity,
daily-use estimate, and historical trend.

``` mermaid
flowchart LR
    A["Station Inventory"] --> B["Food"]
    A --> C["Fuel"]
    A --> D["Medical Supplies"]
    A --> E["Spare Parts"]

    B --> F["Current Quantity"]
    C --> F
    D --> F
    E --> F

    F --> G["Consumption History"]
    G --> H["Trend Analysis"]

    F --> I{"Reserve Level"}
    I --> J["🟢 Healthy"]
    I --> K["🟡 Low"]
    I --> L["🔴 Critical"]

    H --> M["Logistics Dashboard"]
    I --> M
```

### Operator workflow

``` mermaid
flowchart TD
    A["Station Operator"] --> B["Operator Dashboard"]
    B --> C["Select Inventory Type"]
    C --> D["Enter Updated Quantity"]
    D --> E["Add Note"]
    E --> F["POST Inventory Update"]
    F --> G["Server Updates Inventory"]
    G --> H["Historical Record Added"]
    H --> I["Updated Logistics Dashboard"]
```

------------------------------------------------------------------------

# 🚨 Alert Management

PolarTwin provides a centralized alert feed for operational issues.

Alerts are categorized by:

-   **Severity**
-   **Station**
-   **Operational category**
-   **Message**
-   **Timestamp**
-   **Resolved / unresolved state**

Examples include:

-   Low fuel reserve
-   High generator load
-   Sustained high wind
-   Low projected ration reserve
-   Infrastructure inspection requirements

``` mermaid
flowchart TD
    A["Station Operational Data"] --> B["Alert Records"]
    B --> C{"Severity"}

    C --> D["🟢 Informational"]
    C --> E["🟡 Warning"]
    C --> F["🔴 Critical"]

    D --> G["Alert Feed"]
    E --> G
    F --> G

    G --> H{"Authorized User?"}
    H -- Yes --> I["Resolve Alert"]
    H -- No --> J["Read / Monitor"]

    I --> K["Alert Marked Resolved"]
```

### Alert resolution permissions

-   Officers can resolve alerts.
-   Admins can resolve alerts.
-   Operators can view alerts but do not have alert-resolution
    permission in the current implementation.

------------------------------------------------------------------------

# 🔮 AI Insights & Predictive View

The AI Insights section provides operational forecasting-style
information for:

### Inventory

-   Estimated days remaining
-   Safe-threshold flag

### Generator health

-   Health score
-   Health-related flags

``` mermaid
flowchart LR
    A["Operational Data"] --> B["Prediction Service"]
    B --> C["Inventory Forecasts"]
    B --> D["Generator Health"]

    C --> E["Days Remaining"]
    E --> F{"Below Safe Threshold?"}
    F -- Yes --> G["⚠️ Planning Attention"]
    F -- No --> H["✅ Healthy Reserve"]

    D --> I["Health Score"]
    I --> J{"Health Flag?"}
    J -- Yes --> K["🔧 Maintenance Attention"]
    J -- No --> L["✅ Healthy"]

    G --> M["AI Insights Dashboard"]
    H --> M
    K --> M
    L --> M
```

> **Prototype note:** the current implementation exposes seeded
> prediction data through the backend. It is structured so a production
> deployment can replace the mock prediction layer with real forecasting
> / ML services.

------------------------------------------------------------------------

# 🧑‍💼 Officer Dashboard

The Officer Dashboard provides a cross-station operational view.

It combines:

-   Maitri summary
-   Bharati summary
-   Inventory health
-   Active alert counts
-   Combined alert feed
-   Severity-based prioritization

``` mermaid
flowchart TD
    A["Maitri Data"] --> C["Officer Dashboard API"]
    B["Bharati Data"] --> C

    C --> D["Station Summaries"]
    C --> E["Combined Active Alerts"]

    D --> F["Maitri Status"]
    D --> G["Bharati Status"]

    E --> H["Severity Sorting"]
    H --> I["🔴 Critical"]
    H --> J["🟡 Warning"]
    H --> K["🟢 Informational"]

    F --> L["NCPOR Duty Officer"]
    G --> L
    I --> L
    J --> L
    K --> L
```

------------------------------------------------------------------------

# 🔧 Operator Dashboard

Operators receive station-scoped operational controls.

### Available actions

-   Update inventory
-   Add notes to inventory updates
-   Submit maintenance reports
-   View recent station alerts

``` mermaid
flowchart TD
    A["Station Operator Login"] --> B["Role + Station Validation"]
    B --> C["Operator Dashboard"]

    C --> D["Inventory Update"]
    C --> E["Maintenance Report"]
    C --> F["Recent Alerts"]

    D --> G["Update Station Inventory"]
    E --> H["Create Maintenance Record"]
    F --> I["Monitor Operational Issues"]

    G --> J["Station Operations"]
    H --> J
    I --> J
```

------------------------------------------------------------------------

# 🛠️ Maintenance Reporting

Operators/admins can submit a maintenance report containing:

-   Equipment name
-   Description
-   Severity
-   User who submitted the report
-   Timestamp

``` mermaid
flowchart LR
    A["Equipment Issue"] --> B["Operator Dashboard"]
    B --> C["Maintenance Report Form"]
    C --> D["Equipment Name"]
    C --> E["Description"]
    C --> F["Severity"]

    D --> G["POST /api/maintenance/:stationId"]
    E --> G
    F --> G

    G --> H["Maintenance Record"]
    H --> I["Station Maintenance Workflow"]
```

------------------------------------------------------------------------

# 🧠 Full Platform Architecture

PolarTwin is implemented as a two-part full-stack application:

-   **Client:** React + Vite + Tailwind CSS
-   **Server:** Node.js + Express REST API
-   **Authentication:** JWT
-   **Data layer:** In-memory seeded mock data for the current prototype

``` mermaid
flowchart TB
    subgraph USER["👤 Users"]
        U1["NCPOR Officer"]
        U2["System Admin"]
        U3["Maitri Operator"]
        U4["Bharati Operator"]
    end

    subgraph CLIENT["🖥️ React Client"]
        C1["React Router"]
        C2["Authentication Context"]
        C3["Station Views"]
        C4["Officer Dashboard"]
        C5["Operator Dashboard"]
        C6["Energy / Environment / Logistics"]
        C7["Alerts / AI Insights"]
        C8["SVG Digital Twin Map"]
        C9["Axios API Client"]
    end

    subgraph SERVER["⚙️ Node.js + Express"]
        S1["JWT Authentication"]
        S2["Role Authorization"]
        S3["Station APIs"]
        S4["Energy APIs"]
        S5["Environment APIs"]
        S6["Inventory APIs"]
        S7["Alert APIs"]
        S8["Prediction APIs"]
        S9["Maintenance APIs"]
        S10["Dashboard APIs"]
    end

    subgraph DATA["🗄️ Current Prototype Data Layer"]
        D1["In-Memory Station Data"]
        D2["Energy History"]
        D3["Environment History"]
        D4["Inventory + History"]
        D5["Alerts"]
        D6["Predictions"]
        D7["Maintenance Reports"]
        D8["Demo Users"]
    end

    U1 --> CLIENT
    U2 --> CLIENT
    U3 --> CLIENT
    U4 --> CLIENT

    C9 --> S1
    S1 --> S2
    S2 --> S3
    S2 --> S4
    S2 --> S5
    S2 --> S6
    S2 --> S7
    S2 --> S8
    S2 --> S9
    S2 --> S10

    S3 --> DATA
    S4 --> DATA
    S5 --> DATA
    S6 --> DATA
    S7 --> DATA
    S8 --> DATA
    S9 --> DATA
    S10 --> DATA
```

------------------------------------------------------------------------

# 🔄 End-to-End Data Flow

``` mermaid
flowchart TD
    A["Station Operational Information"] --> B["Backend Data Layer"]

    B --> C["Express REST API"]
    C --> D["JWT Authentication + Role Check"]

    D --> E["React Frontend"]

    E --> F["Station Digital Twin"]
    E --> G["Energy Monitoring"]
    E --> H["Environment Monitoring"]
    E --> I["Logistics Monitoring"]
    E --> J["Alert Feed"]
    E --> K["Predictive Insights"]

    F --> L["Operator / Officer"]
    G --> L
    H --> L
    I --> L
    J --> L
    K --> L

    L --> M["Operational Action"]
    M --> N["Inventory Update / Maintenance Report / Alert Resolution"]
    N --> C
```

------------------------------------------------------------------------

# 🔒 API & Authorization Model

The backend exposes REST endpoints for authentication, stations,
telemetry-style data, logistics, alerts, predictions, maintenance, and
dashboards.

## Main API Groups

  ------------------------------------------------------------------------------------------
  API Group               Example Endpoint                           Access
  ----------------------- ------------------------------------------ -----------------------
  Authentication          `POST /api/auth/login`                     Public

  Stations                `GET /api/stations`                        Authenticated

  Energy                  `GET /api/energy/:stationId`               Authenticated

  Environment             `GET /api/environment/:stationId`          Authenticated

  Inventory               `GET /api/inventory/:stationId`            Authenticated

  Inventory Update        `POST /api/inventory/:stationId/update`    Operator/Admin

  Alerts                  `GET /api/alerts/:stationId`               Authenticated

  Resolve Alert           `PATCH /api/alerts/:alertId/resolve`       Officer/Admin

  Predictions             `GET /api/predictions/:stationId`          Authenticated

  Maintenance             `POST /api/maintenance/:stationId`         Operator/Admin

  Officer Dashboard       `GET /api/dashboard/officer`               Officer/Admin

  Operator Dashboard      `GET /api/dashboard/operator/:stationId`   Operator/Admin

  Health                  `GET /api/health`                          Public
  ------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 📁 Project Structure

``` text
polartwin-platform/
│
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   │
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── index.css
│       ├── main.jsx
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── components/
│       │   ├── AIInsightsPanel.jsx
│       │   ├── AlertsPanel.jsx
│       │   ├── EnergyPanel.jsx
│       │   ├── EnvironmentPanel.jsx
│       │   ├── LogisticsPanel.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Shared.jsx
│       │   ├── StationMap.jsx
│       │   ├── StatusBadge.jsx
│       │   └── TopBar.jsx
│       │
│       └── pages/
│           ├── Landing.jsx
│           ├── Login.jsx
│           ├── OfficerDashboard.jsx
│           ├── OperatorDashboard.jsx
│           └── StationPage.jsx
│
├── server/
│   ├── data.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

------------------------------------------------------------------------

# 🧰 Technology Stack

``` mermaid
flowchart LR
    A["PolarTwin"] --> B["Frontend"]
    A --> C["Backend"]
    A --> D["Security"]
    A --> E["Visualization"]

    B --> B1["React 18"]
    B --> B2["Vite"]
    B --> B3["React Router"]
    B --> B4["Tailwind CSS"]
    B --> B5["Axios"]

    C --> C1["Node.js"]
    C --> C2["Express"]
    C --> C3["REST APIs"]
    C --> C4["In-Memory Data Store"]

    D --> D1["JWT"]
    D --> D2["Role-Based Authorization"]
    D --> D3["Protected Routes"]

    E --> E1["Recharts"]
    E --> E2["SVG Digital Twin Map"]
```

### Frontend

-   React 18
-   Vite
-   React Router DOM
-   Tailwind CSS
-   Axios
-   Recharts

### Backend

-   Node.js
-   Express
-   CORS
-   JSON Web Tokens

------------------------------------------------------------------------

# ▶️ Local Setup

## Prerequisites

Install:

-   Node.js
-   npm

Check:

``` bash
node -v
npm -v
```

------------------------------------------------------------------------

## 1. Start the Backend

Open Terminal 1:

``` bash
cd server
npm install
npm start
```

Backend:

``` text
http://localhost:5001
```

Health check:

``` text
http://localhost:5001/api/health
```

------------------------------------------------------------------------

## 2. Start the Frontend

Open Terminal 2:

``` bash
cd client
npm install
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

Open the displayed Vite URL in your browser.

------------------------------------------------------------------------

# 👤 Demo Accounts

  Role               Email                             Password
  ------------------ --------------------------------- ---------------
  Officer            `officer@polartwin.in`            `officer123`
  Admin              `admin@polartwin.in`              `admin123`
  Maitri Operator    `operator.maitri@polartwin.in`    `operator123`
  Bharati Operator   `operator.bharati@polartwin.in`   `operator123`

> These credentials are intentionally included for the hackathon
> prototype and must not be used in a production deployment.

------------------------------------------------------------------------

# 🔁 Complete Operational Workflow

``` mermaid
flowchart TD
    A["User Login"] --> B["JWT Authentication"]
    B --> C["Role Validation"]

    C --> D["Select Station"]

    D --> E["Station Digital Twin"]

    E --> F["Overview"]
    E --> G["2D Map"]
    E --> H["Energy"]
    E --> I["Environment"]
    E --> J["Logistics"]
    E --> K["Alerts"]
    E --> L["AI Insights"]

    H --> M["Monitor Power Systems"]
    I --> N["Monitor Environmental Conditions"]
    J --> O["Monitor Supplies"]
    K --> P["Review Operational Alerts"]
    L --> Q["Review Forecasts + Health Scores"]

    M --> R["Operational Decision"]
    N --> R
    O --> R
    P --> R
    Q --> R

    R --> S{"Action Required?"}

    S -- No --> T["Continue Monitoring"]
    S -- Yes --> U["Update Inventory / Maintenance / Resolve Alert"]

    U --> V["Backend API"]
    V --> W["Updated Operational State"]
    W --> E
```

------------------------------------------------------------------------

# 🧪 Prototype Data Model

The current hackathon implementation uses **seeded in-memory data**
rather than a production database.

The backend stores:

``` text
Stations
├── Maitri
└── Bharati

Energy
├── Current generator/CHP status
└── Historical consumption

Environment
├── Current conditions
└── Historical temperature

Inventory
├── Food
├── Fuel
├── Medical supplies
└── Spare parts

Operations
├── Alerts
├── Predictions
└── Maintenance reports

Users
├── Officer
├── Admin
├── Maitri Operator
└── Bharati Operator
```

Restarting the backend resets mutable prototype data to its seeded
state.

------------------------------------------------------------------------

# 🛰️ Production Architecture Roadmap

The current application is intentionally designed as a hackathon-ready
full-stack prototype. A field deployment can replace the mock data layer
with real station telemetry and operational systems.

``` mermaid
flowchart TB
    subgraph ANTARCTICA["🏔️ Antarctic Station"]
        S1["Environmental Sensors"]
        S2["Power / Generator Sensors"]
        S3["Infrastructure Sensors"]
        S4["Inventory / Operations Data"]
    end

    S1 --> G["Edge Gateway"]
    S2 --> G
    S3 --> G
    S4 --> G

    G --> L{"Satellite Link Available?"}

    L -- Yes --> SAT["🛰️ Satellite Uplink"]
    L -- No --> BUF["💾 Local Edge Buffer"]

    BUF --> L
    SAT --> API["☁️ Production API"]
    API --> DB["Time-Series / Operational Database"]

    DB --> DT["🧬 PolarTwin Digital Twin"]
    DT --> DASH["📊 Monitoring Dashboard"]
    DT --> ALERT["🚨 Alert Engine"]
    DT --> ML["🤖 Forecasting / Predictive Models"]

    DASH --> OPS["NCPOR / Operations Team"]
    ALERT --> OPS
    ML --> OPS
```

### Planned production upgrades

-   Real IoT sensor integration
-   Edge gateway at each station
-   Satellite telemetry uplink
-   Offline-first synchronization
-   Time-series database
-   Real-time streaming
-   Production alert engine
-   ML-based anomaly detection
-   Predictive maintenance
-   Resource consumption forecasting
-   Secure production authentication
-   Audit logs and operational history
-   Integration with future station automation infrastructure

------------------------------------------------------------------------

# 🧭 Current Prototype → Production Evolution

``` mermaid
flowchart LR
    A["Current Prototype"] --> B["Backend Integration"]
    B --> C["Real Sensor Integration"]
    C --> D["Edge Computing"]
    D --> E["Satellite Telemetry"]
    E --> F["Production Data Platform"]
    F --> G["Predictive Digital Twin"]
    G --> H["Remote Operations"]

    A1["React + Vite"] --> A
    A2["Express REST API"] --> A
    A3["Mock In-Memory Data"] --> A

    B1["Production Database"] --> B
    C1["IoT Sensors"] --> C
    D1["Local Buffering"] --> D
    E1["Satellite Link"] --> E
    F1["Time-Series Storage"] --> F
    G1["ML / Forecasting"] --> G
```

------------------------------------------------------------------------

# 🌍 Future Vision

PolarTwin is designed to evolve from a station monitoring prototype into
a unified remote operations platform.

``` mermaid
flowchart TD
    A["PolarTwin"] --> B["Real-Time Monitoring"]
    A --> C["Predictive Maintenance"]
    A --> D["Resource Forecasting"]
    A --> E["Anomaly Detection"]
    A --> F["Remote Operational Support"]

    B --> G["Station Digital Twin"]
    C --> G
    D --> G
    E --> G
    F --> G

    G --> H["Maitri"]
    G --> I["Bharati"]
    G --> J["Future Antarctic Infrastructure"]

    H --> K["Unified NCPOR Operations View"]
    I --> K
    J --> K
```

The long-term vision is a **single operational intelligence layer** for
India's Antarctic research infrastructure.

------------------------------------------------------------------------

# 🏆 Why PolarTwin?

### 1. Unified operational visibility

Brings station status, energy, environment, logistics, alerts, and asset
information into one interface.

### 2. Station-aware monitoring

Maitri and Bharati are represented as separate operational environments
rather than generic dashboards.

### 3. Digital twin visualization

The interactive 2D station map connects physical station assets with
their operational state.

### 4. Role-aware operations

Officers, administrators, and station operators receive different
capabilities based on their responsibilities.

### 5. Decision-oriented insights

The platform emphasizes alerts, resource forecasts, equipment health,
and actionable operational information.

### 6. Designed for remote environments

The architecture is intentionally structured so the current prototype
can evolve toward edge processing, satellite communication, and
offline-first operation.

------------------------------------------------------------------------

# ⚠️ Prototype Disclaimer

This repository is a **Smart India Hackathon prototype**.

The current backend uses **seeded in-memory mock data** rather than live
Antarctic sensors, production databases, or live satellite telemetry.

The AI Insights section currently exposes **predefined prototype
prediction data** rather than a trained machine-learning model.

The production architecture described in this README is the intended
evolution path and should not be interpreted as already deployed
infrastructure.

------------------------------------------------------------------------

# 📌 Project Status

  Component                Current Status
  ------------------------ ----------------------------
  React Frontend           ✅ Implemented
  Vite Build System        ✅ Implemented
  Tailwind UI              ✅ Implemented
  JWT Authentication       ✅ Implemented
  Role-Based Access        ✅ Implemented
  Maitri Digital Twin      ✅ Implemented
  Bharati Digital Twin     ✅ Implemented
  Interactive 2D Map       ✅ Implemented
  Energy Monitoring        ✅ Implemented
  Environment Monitoring   ✅ Implemented
  Logistics Tracking       ✅ Implemented
  Alert Management         ✅ Implemented
  Maintenance Reporting    ✅ Implemented
  AI Insights UI           ✅ Implemented
  Prediction Backend       ✅ Prototype / Seeded Data
  Real IoT Sensors         🔜 Planned
  Satellite Telemetry      🔜 Planned
  Production Database      🔜 Planned
  ML Forecasting           🔜 Planned
  Predictive Maintenance   🔜 Planned

------------------------------------------------------------------------

# 👨‍💻 Project

**PolarTwin --- Indian Antarctic Operations Digital Twin Platform**

**Smart India Hackathon 2026**\
**Problem Statement:** SIH26060\
**Organization:** Ministry of Earth Sciences / National Centre for Polar
and Ocean Research (NCPOR)

------------------------------------------------------------------------

## ⭐ Built for extreme environments. Designed for smarter decisions.
