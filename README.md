# 🛰️ PolarTwin
### Real-Time Digital Twin for Remote Antarctic Station Management

> **Smart India Hackathon 2026 — SIH26060**  
> **Ministry of Earth Sciences (MoES) / National Centre for Polar and Ocean Research (NCPOR)**

**PolarTwin** is a Digital Twin platform designed to provide a unified remote-monitoring interface for India's Antarctic research stations — **Maitri** and **Bharati**.

It brings station telemetry, energy status, environmental conditions, infrastructure health, logistics and operational alerts into a single dashboard so that critical conditions can be detected and acted upon remotely.

---

## 🚀 Why PolarTwin?

Antarctic research stations operate in one of the world's most isolated and extreme environments.

Physical access is limited, resupply is periodic, and critical infrastructure such as power generation, heating, communication and water systems must remain operational throughout the Antarctic winter.

The central challenge is simple:

> **How can India continuously understand the condition of a remote Antarctic station without physically being there?**

PolarTwin addresses this through a **Digital Twin + IoT telemetry + satellite communication + intelligent alerting** architecture.

---

# 🎯 Problem Statement

### SIH26060 — Digital Platform for Efficient Remote Management of Indian Antarctic Research Stations

India operates two major Antarctic research stations:

- 🏔️ **Maitri** — Schirmacher Oasis
- 🌊 **Bharati** — Larsemann Hills

The stations require continuous monitoring of:

- ⚡ Energy & power systems
- 🌡️ Environmental conditions
- 🔧 Infrastructure & equipment
- 📦 Critical supplies & logistics
- 🚨 Operational risks

PolarTwin aims to convert these physical station conditions into a **live digital representation** accessible from India.

---

# 💡 Our Solution

PolarTwin follows a simple operational concept:

```mermaid
flowchart LR

A["🏔️ Antarctic Station"] --> B["📡 Sensors"]
B --> C["🧠 Edge Gateway"]
C --> D["🛰️ Satellite Link"]
D --> E["🇮🇳 India / NCPOR"]
E --> F["⚙️ Data Processing"]
F --> G["🧬 Digital Twin"]
G --> H["📊 Monitoring Dashboard"]
G --> I["🚨 Alert Engine"]
I --> J["👨‍💻 Operator Action"]
J --> G
```

### The platform provides:

- Real-time-style station monitoring
- Station-specific telemetry
- Energy monitoring
- Environmental monitoring
- Infrastructure health tracking
- Logistics & supply monitoring
- Threshold-based alerts
- Historical telemetry visualization
- Offline-first data buffering concept
- Future predictive-maintenance integration

---

# 🧬 What is the PolarTwin Digital Twin?

The Digital Twin represents the operational state of an Antarctic station inside a virtual environment.

```mermaid
flowchart TD

A["🧬 POLARTWIN DIGITAL TWIN"]

A --> B["⚡ ENERGY"]
A --> C["🌡️ ENVIRONMENT"]
A --> D["🔧 INFRASTRUCTURE"]
A --> E["📦 LOGISTICS"]

B --> B1["Power Generation"]
B --> B2["Battery Reserve"]
B --> B3["Fuel Status"]

C --> C1["Temperature"]
C --> C2["Wind Speed"]
C --> C3["Weather Conditions"]

D --> D1["Equipment Health"]
D --> D2["HVAC"]
D --> D3["Water Systems"]
D --> D4["Communication Systems"]

E --> E1["Food"]
E --> E2["Fuel"]
E --> E3["Medical Supplies"]
E --> E4["Spare Parts"]
```

This allows operators to move from **isolated sensor readings** to a unified operational picture.

---

# 🛰️ System Architecture

The proposed production architecture connects sensors deployed at the station with the monitoring dashboard in India.

```mermaid
flowchart TB

subgraph ANTARCTICA["🏔️ ANTARCTIC STATION"]

S1["⚡ Power Sensors"]
S2["🌡️ Temperature Sensors"]
S3["💨 Wind Sensors"]
S4["〰️ Vibration Sensors"]
S5["📦 Inventory Sensors"]

S1 --> G
S2 --> G
S3 --> G
S4 --> G
S5 --> G

G["🧠 Edge Gateway"]

end

G --> N{"📡 Satellite Available?"}

N -->|YES| T["📤 Transmit Telemetry"]
N -->|NO| B["💾 Local Data Buffer"]

B --> R["🔄 Retry Connection"]
R --> N

T --> SAT["🛰️ Satellite Uplink"]

subgraph INDIA["🇮🇳 INDIA / NCPOR"]

SAT --> API["⚙️ Node.js API"]
API --> DB["📈 InfluxDB"]
DB --> ENGINE["🚨 Rule-Based Alert Engine"]
DB --> DASH["📊 React Dashboard"]
ENGINE --> ALERT["🔔 Alerts & Notifications"]

end

DASH --> OP["👨‍💻 NCPOR Operator"]
ALERT --> OP
OP --> ACT["🛠️ Operational Decision"]
```

---

# 🔄 End-to-End Data Flow

The complete telemetry journey can be understood as:

```mermaid
flowchart LR

A["Sensor Reading"]
--> B["Edge Gateway"]
--> C{"Connection?"}

C -->|Available| D["Telemetry Packet"]
C -->|Unavailable| E["Local Buffer"]

E --> F["Connection Restored"]
F --> D

D --> G["Satellite Uplink"]
G --> H["India Ground Infrastructure"]
H --> I["Node.js API"]
I --> J["InfluxDB"]
J --> K["Digital Twin"]
K --> L["Dashboard"]

K --> M["Alert Engine"]
M --> N{"Threshold Exceeded?"}

N -->|No| O["✅ Continue Monitoring"]
N -->|Yes| P["🚨 Generate Alert"]

P --> Q["Operator Response"]
```

---

# 📊 Dashboard Modules

PolarTwin's dashboard is organized around four major operational domains.

---

## ⚡ 1. Energy Monitoring

The Energy module provides visibility into the station's power ecosystem.

### Monitored parameters

- Power generation
- Power consumption
- Battery reserve
- Generator condition
- Fuel availability
- Energy trends

```mermaid
flowchart TD

A["⚡ Energy Telemetry"]

A --> B["Power Generation"]
A --> C["Power Consumption"]
A --> D["Battery Reserve"]
A --> E["Generator Health"]
A --> F["Fuel Status"]

B --> G["📊 Energy Dashboard"]
C --> G
D --> G
E --> G
F --> G

G --> H{"⚠️ Abnormal Condition?"}

H -->|No| I["Normal Operation"]
H -->|Yes| J["🚨 Energy Alert"]
```

---

# 🌡️ 2. Environment Monitoring

Environmental conditions directly influence station operations.

### Parameters

- Temperature
- Wind speed
- Weather conditions
- Environmental trends
- Station-specific thresholds

```mermaid
flowchart LR

A["🌡️ Environmental Sensors"]

A --> B["Temperature"]
A --> C["Wind"]
A --> D["Weather Data"]

B --> E["Telemetry Processing"]
C --> E
D --> E

E --> F{"Threshold Check"}

F -->|Normal| G["🟢 Normal"]
F -->|Warning| H["🟡 Warning"]
F -->|Critical| I["🔴 Critical"]

H --> J["Operator Notification"]
I --> J
```

---

# 🔧 3. Infrastructure Health

The Infrastructure module focuses on critical station equipment.

### Example systems

- HVAC / thermal control
- Water treatment
- Communication systems
- Generator systems
- Structural monitoring

```mermaid
flowchart TD

A["🔧 Infrastructure"]

A --> B["HVAC"]
A --> C["Water Treatment"]
A --> D["Communication"]
A --> E["Generator"]
A --> F["Structural Monitoring"]

B --> G["Health Score"]
C --> G
D --> G
E --> G
F --> G

G --> H{"Equipment Condition"}

H -->|Healthy| I["🟢 Operational"]
H -->|Degrading| J["🟡 Maintenance Required"]
H -->|Critical| K["🔴 Immediate Attention"]

J --> L["Maintenance Planning"]
K --> L
```

---

# 📦 4. Logistics & Supply Monitoring

Because Antarctic resupply is highly constrained, resource visibility is critical.

PolarTwin tracks:

- 🛢️ Diesel fuel
- 🍱 Food reserves
- 💊 Medical supplies
- 🔩 Spare parts
- 📈 Consumption trends
- ⏳ Estimated remaining availability

```mermaid
flowchart LR

A["📦 Supply Data"]

A --> B["Fuel"]
A --> C["Food"]
A --> D["Medical"]
A --> E["Spare Parts"]

B --> F["Consumption Analysis"]
C --> F
D --> F
E --> F

F --> G["📈 Depletion Trend"]

G --> H{"Reserve Level"}

H -->|Healthy| I["🟢 Normal"]
H -->|Low| J["🟡 Warning"]
H -->|Critical| K["🔴 Critical"]

J --> L["Resupply Planning"]
K --> L
```

---

# 🚨 Intelligent Alert Engine

PolarTwin uses a threshold-based alert mechanism in the current prototype.

The system evaluates incoming telemetry and determines whether an operational condition requires attention.

```mermaid
flowchart TD

A["📡 Incoming Telemetry"]

A --> B["Validate Data"]
B --> C["Update Digital Twin"]
C --> D["Evaluate Thresholds"]

D --> E{"Condition Normal?"}

E -->|YES| F["🟢 Continue Monitoring"]

E -->|NO| G{"Severity"}

G -->|Warning| H["🟡 Warning Alert"]
G -->|Critical| I["🔴 Critical Alert"]

H --> J["Dashboard Notification"]
I --> J

J --> K["👨‍💻 Operator Review"]
K --> L["🛠️ Corrective Action"]
```

### Current alert categories

- 🔋 Low battery
- 💨 High wind
- 🥶 Extreme temperature
- 🔧 Equipment health degradation
- 🚨 Critical equipment condition
- 📦 Low supply reserve

---

# 💾 Offline-First Data Pipeline

One of PolarTwin's key production concepts is **local buffering during communication outages**.

Instead of immediately discarding telemetry when the satellite connection is unavailable, the edge gateway can temporarily store timestamped readings.

```mermaid
flowchart TD

A["📡 Sensor Reading"]
--> B["🧠 Edge Gateway"]

B --> C{"Satellite Link Available?"}

C -->|YES| D["📤 Send Telemetry"]
C -->|NO| E["💾 Store Locally"]

E --> F["🔁 Periodic Connection Check"]

F --> G{"Connection Restored?"}

G -->|NO| F
G -->|YES| H["📦 Prepare Buffered Data"]

H --> I["📤 Batch / Burst Synchronization"]
I --> J["🇮🇳 India Backend"]

D --> J

J --> K["📈 Time-Series Database"]
K --> L["🧬 Digital Twin"]
```

### Why this matters

The objective is to prevent communication interruptions from becoming permanent telemetry gaps.

> **Store locally → reconnect → synchronize → restore the timeline**

---

# 🧠 Station-Specific Intelligence

Maitri and Bharati do not have identical operational environments.

Therefore, PolarTwin is designed around **station-specific monitoring rules**.

```mermaid
flowchart LR

A["🛰️ PolarTwin"]

A --> B["🏔️ Maitri Profile"]
A --> C["🌊 Bharati Profile"]

B --> B1["Structural Monitoring"]
B --> B2["Energy Monitoring"]
B --> B3["Temperature / Snow Conditions"]

C --> C1["Wind Monitoring"]
C --> C2["Coastal Environment"]
C --> C3["Energy Monitoring"]

B1 --> D["Station-Specific Thresholds"]
B2 --> D
B3 --> D

C1 --> D
C2 --> D
C3 --> D

D --> E["🚨 Customized Alerts"]
```

This makes the platform adaptable rather than treating both stations as identical environments.

---

# 🖥️ Current Prototype

The current implementation is a **React-based working dashboard prototype**.

### Implemented

- ✅ React 18 dashboard
- ✅ Maitri / Bharati station switching
- ✅ Energy monitoring interface
- ✅ Environment monitoring interface
- ✅ Infrastructure health interface
- ✅ Logistics monitoring interface
- ✅ Dynamic telemetry simulation
- ✅ Threshold-based alert system
- ✅ Warning / Critical alert states
- ✅ Interactive charts using Recharts
- ✅ Responsive dashboard UI
- ✅ Lucide-based interface icons

### Demo Data

The current dashboard uses **simulated telemetry** to demonstrate how live station data would behave.

> ⚠️ **Important:** The displayed telemetry is demo/simulated data and does not represent live Antarctic measurements.

---

# 🏗️ Current vs Production Architecture

```mermaid
flowchart LR

A["🧪 Current Prototype"]

A --> A1["React 18"]
A --> A2["Recharts"]
A --> A3["Simulated Telemetry"]
A --> A4["Local Alert Logic"]

B["🚀 Production Target"]

B --> B1["IoT Sensors"]
B --> B2["Edge Gateway"]
B --> B3["Satellite Link"]
B --> B4["Node.js API"]
B --> B5["InfluxDB"]
B --> B6["Alert Engine"]
B --> B7["React Dashboard"]

A --> C["🔄 Integration Roadmap"]
C --> B
```

This distinction is intentional:

**The prototype demonstrates the user experience and monitoring logic, while the production architecture defines how real station telemetry can eventually be integrated.**

---

# 🗂️ Project Structure

```mermaid
flowchart TD

A["🛰️ polartwin"]

A --> B["📄 package.json"]
A --> C["📁 public"]
A --> D["📁 src"]
A --> E["📄 README.md"]

C --> C1["📄 index.html"]

D --> D1["⚛️ App.jsx"]
D --> D2["📄 index.js"]

D1 --> D3["📊 Dashboard"]
D1 --> D4["⚡ Energy"]
D1 --> D5["🌡️ Environment"]
D1 --> D6["🔧 Infrastructure"]
D1 --> D7["📦 Logistics"]
D1 --> D8["🚨 Alerts"]
```

### Simplified structure

```text
polartwin/
│
├── package.json
│
├── public/
│   └── index.html
│
├── src/
│   ├── App.jsx
│   └── index.js
│
└── README.md
```

---

# 🛠️ Technology Stack

```mermaid
flowchart LR

A["🧬 PolarTwin"]

A --> B["Frontend"]
A --> C["Data Visualization"]
A --> D["Backend — Planned"]
A --> E["Database — Planned"]
A --> F["Edge Hardware — Planned"]

B --> B1["React 18"]
C --> C1["Recharts"]
B --> B2["Lucide React"]

D --> D1["Node.js"]
D --> D2["Express"]

E --> E1["InfluxDB"]

F --> F1["IoT Sensors"]
F --> F2["Edge Gateway"]
F --> F3["Satellite Communication"]
```

| Technology | Role |
|---|---|
| **React 18** | Dashboard interface |
| **Recharts** | Telemetry visualization |
| **Lucide React** | UI icons |
| **Node.js + Express** | Planned telemetry API |
| **InfluxDB** | Planned time-series storage |
| **IoT Sensors** | Planned station telemetry |
| **Edge Gateway** | Planned local processing & buffering |
| **Satellite Link** | Planned remote telemetry transmission |

---

# 🔄 Development Roadmap

```mermaid
flowchart LR

A["Phase 1<br/>🧪 Prototype"]
--> B["Phase 2<br/>⚙️ Backend"]

B --> C["Phase 3<br/>📡 IoT Integration"]

C --> D["Phase 4<br/>🛰️ Satellite Integration"]

D --> E["Phase 5<br/>🏔️ Field Deployment"]

E --> F["Phase 6<br/>🧠 Advanced Analytics"]
```

### Phase 1 — Prototype
- React dashboard
- Simulated telemetry
- Charts
- Alert logic
- Station switching

### Phase 2 — Backend Integration
- Node.js / Express API
- Authentication
- Telemetry ingestion
- InfluxDB storage

### Phase 3 — Hardware Integration
- IoT sensor network
- Edge gateway
- Local data buffering
- Sensor health monitoring

### Phase 4 — Communication Integration
- Satellite telemetry
- Low-bandwidth payload optimization
- Automatic synchronization

### Phase 5 — Field Deployment
- Ruggedized hardware
- Environmental testing
- Station integration
- Operational validation

### Phase 6 — Advanced Analytics
- Historical anomaly detection
- Predictive maintenance
- Resource forecasting
- Advanced operational intelligence

---

# 🔮 Future Vision

PolarTwin is designed to evolve from a monitoring dashboard into a complete remote station-management platform.

```mermaid
flowchart TD

A["🛰️ PolarTwin"]

A --> B["Real-Time Monitoring"]
A --> C["Predictive Maintenance"]
A --> D["Resource Forecasting"]
A --> E["Anomaly Detection"]
A --> F["Remote Operations"]
A --> G["Maitri-II Integration"]

B --> H["🧠 Unified Polar Operations Platform"]
C --> H
D --> H
E --> H
F --> H
G --> H
```

The long-term vision is to create a reusable digital infrastructure layer that can support both existing stations and future generations of Antarctic research infrastructure.

---

# 💻 Installation & Local Setup

## 1. Prerequisites

Install:

- Node.js v18+
- npm

Verify:

```bash
node -v
npm -v
```

---

## 2. Clone Repository

```bash
git clone https://github.com/kailashramawat223-dot/POLARTWIN.git
```

```bash
cd POLARTWIN
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Start the Dashboard

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

# 🎯 Expected Workflow

```mermaid
flowchart LR

A["🏔️ Station"]
--> B["📡 Sensors"]
--> C["🧠 Edge Processing"]
--> D["🛰️ Communication"]
--> E["🇮🇳 NCPOR"]
--> F["📊 PolarTwin"]
--> G["🚨 Alerts"]
--> H["👨‍💻 Decision"]
```

**Monitor → Detect → Alert → Decide → Act**

---

# 🌍 Impact

PolarTwin aims to improve Antarctic station operations through:

### 🛡️ Safety
Earlier visibility into hazardous environmental and equipment conditions.

### ⚡ Reliability
Continuous monitoring of critical energy and infrastructure systems.

### 📦 Logistics
Better understanding of resource consumption and resupply requirements.

### 🔬 Scientific Continuity
Reduced operational disruptions to scientific activities.

### 🇮🇳 Strategic Capability
A reusable digital monitoring framework for India's Antarctic infrastructure.

---

# 🇮🇳 Built for India's Polar Future

PolarTwin is designed around a simple principle:

> **The station may be thousands of kilometres away, but its operational state should never feel invisible.**

By combining **Digital Twin technology, telemetry, edge computing, satellite communication and intelligent alerting**, PolarTwin creates a foundation for smarter and safer remote Antarctic operations.

---

## 👨‍💻 Smart India Hackathon 2026

**Problem Statement:** SIH26060  
**Organization:** Ministry of Earth Sciences / NCPOR  
**Theme:** Smart Automation  
**Category:** Software  

### 🛰️ PolarTwin

**Monitor the station. Understand the risk. Act before failure.**

---

## 📚 References

- National Centre for Polar and Ocean Research (NCPOR)
- Ministry of Earth Sciences (MoES)
- Smart India Hackathon
- Government publications related to Indian Antarctic expeditions
- Digital Twin concepts and industrial monitoring architectures

---

## ⚠️ Prototype Disclaimer

PolarTwin is currently a **demonstration/prototype system**.

Telemetry displayed in the dashboard is simulated and is intended to demonstrate the proposed monitoring, visualization and alerting workflow.

Real-world deployment would require:

- Certified Antarctic-grade sensors
- Validated communication infrastructure
- Hardware environmental testing
- Secure backend infrastructure
- NCPOR integration
- Field validation
- Operational safety certification
