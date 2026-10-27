# ⚡ ZepGO – AI-Powered EV Navigation & Charging Intelligence Platform

> **"ZepGO doesn't just tell an EV where to go. It predicts whether the EV can safely get there and intelligently decides where, when and why it should charge."**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?style=flat&logo=react)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![XGBoost](https://img.shields.io/badge/ML-XGBoost%20Regressor-EB7F00.svg?style=flat)](https://xgboost.readthedocs.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 1. Project Overview & Vision

**ZepGO** is an intelligent electric vehicle navigation and charging intelligence platform engineered to eliminate EV range anxiety. Traditional navigation systems treat electric vehicles like internal combustion engine (ICE) cars—calculating routes based purely on distance or traffic time, and treating EV chargers as static pins on a map. 

ZepGO transforms this experience into a vehicle-aware, risk-resilient intelligence platform:
- It understands your specific EV's battery chemistry, usable pack capacity, and aerodynamic efficiency.
- It models dynamic real-world factors including vehicle cruising speed, ambient temperature (HVAC load), elevation change, and traffic congestion.
- It continuously tracks your battery State of Charge (SOC) against a **configurable Safety Reserve (default: 18%)**.
- It ranks highway charging stations not just by proximity, but by **plug availability upon arrival, charging speed, connector compatibility, cost, and safety margin**.
- Crucially, it provides transparent explainability through the **"Why This Charger?"** framework, answering **WHAT**, **WHY**, and **IMPACT**.

---

## 🚨 2. The Core Problem

Electric vehicle drivers on highway corridors face 10 critical challenges:
1. **Range Anxiety**: Fear of depleting the battery pack before reaching a destination.
2. **Uncertainty of Range Estimates**: Instrument cluster estimates ("Guess-O-Meters") fluctuate wildly based on driving style.
3. **Charger Incompatibility**: Arriving at a charger only to find mismatched plugs (e.g., GB/T vs CCS2).
4. **Charger Unavailability & Queues**: Arriving at a station with non-functional equipment or long queues.
5. **Vehicle Heterogeneity**: Different EVs have vastly different capacities (e.g. 19.2 kWh Tiago vs 72.6 kWh Ioniq 5).
6. **Environmental Variability**: Highway speeds ($>80\text{ km/h}$), AC in tropical heat, and uphill climbs drain energy non-linearly.
7. **Proximity Trap**: The nearest charger is often a slow 7.2 kW AC charger rather than a high-power DC fast charger.
8. **Lack of Explainability**: Drivers do not trust opaque black-box recommendations without clear rationale.
9. **Wasted Charging Time**: Drivers are stranded at barren highway stops without restrooms, food, or shade.
10. **Emergency Situations**: Lack of integrated assistance when battery levels drop to critical thresholds.

---

## 💡 3. The ZepGO Solution

ZepGO solves these challenges through a unified full-stack architecture:

```
[ User & EV Profile ] ──> [ Context Factors (Speed, Weather, Topography) ]
                                    │
                                    ▼
                [ Supervised XGBoost Energy Regressor ]
                                    │
                                    ▼
             [ Arrival SOC vs Safety Reserve (18%) Check ]
                                    │
                                    ▼
           [ Multi-Factor Charging Intelligence & Risk Engine ]
                                    │
                                    ▼
            [ "Why This Charger?" Explainability Breakdown ]
                                    │
                                    ▼
         [ Live Navigation HUD + Dynamic Rerouting + Amenities ]
```

---

## 🏆 4. Competitor Positioning

Existing EV navigation tools (Google Maps, PlugShare, ABRP) offer valuable route planning and static charger directories. ZepGO differentiates by synthesizing vehicle-specific telemetry and contextual intelligence into explainable charging decisions:

| Capability | Traditional Maps | Basic EV Navigators | ZepGO Platform |
|---|---|---|---|
| **Routing Metric** | Distance / Traffic Time | Basic Distance / SOC | Physics-based Energy Budget ($kWh$) |
| **Charger Ranking** | Sorted by Distance | Distance & Brand Filter | **Multi-factor Safety, Speed, Queue & Cost Score** |
| **Explainability** | None | None | **"Why This Charger?" (WHAT, WHY, IMPACT)** |
| **Charger Redundancy** | Shows single pin | Shows nearby pins | **Quantified Risk Level (LOW / MEDIUM / HIGH)** |
| **Driver Amenities** | Generic POIs | Separate search | **"While You Charge" Synchronized Amenities** |
| **Sudden Weather/Traffic** | Reroutes for traffic only | Static plan | **Dynamic Recalculation with Instant Rerouting** |
| **Emergency Dispatch** | None | None | **Integrated 1-Tap Roadside SOS Hub** |

---

## 🛠️ 5. Technology Stack

- **Frontend**:
  - React 18, TypeScript, Tailwind CSS, Lucide Icons
  - Interactive Mapping: Leaflet, React-Leaflet, OpenStreetMap
  - Responsive Light Theme Design System (`#F8FAFC`, Emerald `#10B981`, Slate `#0F172A`)
  - Resilient Client-Side Fallback Engine
- **Backend**:
  - Python 3.11, FastAPI, Uvicorn
  - Pydantic v2 validation models
  - RESTful modular architecture across 8 service domains
- **Machine Learning**:
  - **XGBoost Regressor**: Supervised energy prediction model ($R^2 = 0.9910$, $\text{MAE} = 1.33\text{ kWh}$)
  - **Scikit-learn Isolation Forest**: Unsupervised efficiency anomaly detection ($< 3.5\text{ km/kWh}$)
  - NumPy, Pandas, Joblib
- **DevOps & Deployment**:
  - Docker & Docker Compose multi-container orchestration
  - Vercel SPA deployment configuration (`vercel.json`)
  - Automated Pytest test suite (14 verified tests)

---

## 🤖 6. Machine Learning Architecture

### 6.1 XGBoost Energy Regressor
Energy consumption does not scale linearly with distance. ZepGO’s XGBoost regression model takes **9 real-world highway telemetry features**:
1. `battery_capacity_kwh`
2. `battery_soc_percent`
3. `distance_km`
4. `vehicle_efficiency_km_per_kwh`
5. `average_speed_kmh` (aerodynamic drag scaling quadratically with speed)
6. `traffic_factor` (stop-and-go idle draw)
7. `temperature_celsius` (cabin HVAC thermal load)
8. `rain_factor` (rolling resistance from wet asphalt)
9. `elevation_gain_m` (gravitational potential work)

### 6.2 Isolation Forest Anomaly Detection
The Isolation Forest continuously scores highway efficiency ($km/kWh$). If consumption drops below normal highway bounds (e.g. $< 3.5\text{ km/kWh}$), ZepGO alerts the driver:
> *"Unusual energy consumption detected. Possible causes: Heavy traffic, low tyre pressure, extreme headwind, or aggressive driving."*

---

## 📸 7. Application Walkthrough & Screenshots

### Master Executive Dashboard
The primary command center displays real-time driver context:
- **Greeting**: *"Good evening, Preethi"*
- **Current EV**: *Tata Nexon EV Max (40.5 kWh, 6.8 km/kWh)*
- **Battery Card**: *62% SOC (25.1 kWh available, 184 km estimated range, 18% Safety Reserve indicator)*
- **Destination & Status**: *Coimbatore (142 km, Safe to continue)*
- **Interactive Route Map**: Leaflet OSM map highlighting the NH544 corridor and recommended charging hubs.

### "Why This Charger?" Explainability Card
Every recommendation adheres to the 3-pillar explainability framework:
- **WHAT**: Zeon Charging Hub - Salem Highway (120 kW dual-gun CCS2 fast charger).
- **WHY**: Optimal corridor position (12 km ahead), guaranteed 24.1% arrival buffer above the 18% reserve, 3 available plugs, lowest tariff (₹18/kWh).
- **IMPACT**: +24 min charging, +₹180 estimated cost, +18% safety buffer margin restored.

### Live Navigation HUD & Dynamic Recalculation
- Cruising speed gauge (74 km/h), remaining distance, real-time ETA, and dynamic battery drain.
- **Simulate Traffic Spike**: Demonstrates real-time rerouting when sudden congestion increases energy draw below the safety threshold.

### "While You Charge" Stop Experience
- 24-minute fast charging countdown timer and battery charging curve.
- Nearby amenities within walking distance: Cafe Coffee Day, clean highway restrooms, restaurant, and grocery store.

### Emergency SOS Hub
- 1-tap roadside dispatch for Low Battery Emergency, Vehicle Breakdown, Flat Tyre, or Accident without unauthorized emergency calls.

---

## 🚀 8. Getting Started

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+ or 3.11+
- (Optional) Docker & Docker Compose

### 8.1 Backend Setup
```bash
# Clone the repository
git clone https://github.com/preethi1918/ZepGO.git
cd ZepGO

# Install Python requirements
pip install -r backend/requirements.txt

# Train or verify ML model artifacts
python -m backend.app.ml.train_model

# Run automated tests
python -m pytest backend/tests

# Start FastAPI backend
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend runs at `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`).

### 8.2 Frontend Setup
In a new terminal window:
```bash
# Install Node dependencies
npm install

# Build for production
npm run build

# Start Vite development server
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 8.3 Docker Deployment
```bash
docker-compose up --build
```
- Frontend: `http://localhost:80`
- Backend: `http://localhost:8000`

---

## 🔑 9. Demo Persona & Default Scenario

- **User**: Preethi (`preethi@zepgo.io` / `password123`)
- **EV**: Tata Nexon EV Max (40.5 kWh, 62% SOC, 184 km range)
- **Origin**: Salem Highway Corridor
- **Destination**: Coimbatore (142 km, 3h 20m)
- **Safety Reserve**: 18%
- **Expected Arrival Battery**: 24.1%
- **Charging Recommendation**: Zeon Charging Hub - Salem Highway (120 kW Fast Charger, 24 min charge)

---

## 📚 10. Platform Documentation Suite

Detailed architectural, API, and setup documentation is available in the repository:
- 🏛️ [ARCHITECTURE.md](ARCHITECTURE.md) — System design, components, ranking algorithms, and resilience.
- 📡 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) — Complete 18-endpoint REST API reference.
- 🧠 [ML_DOCUMENTATION.md](ML_DOCUMENTATION.md) — XGBoost and Isolation Forest training, features, and metrics.
- 🗄️ [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) — Pydantic and database entity schemas.
- ⚙️ [SETUP.md](SETUP.md) — Comprehensive developer setup and environment configuration guide.
- ✨ [FEATURES.md](FEATURES.md) — Complete 20-phase feature catalog and capability matrix.

---

## 🔮 11. Future Scope

1. **CAN-Bus / OBD-II Integration**: Real-time reading of battery pack temperatures and state-of-health (SOH) via BLE adapters.
2. **Dynamic Charger Reservation**: Direct API booking of charging slots through OCPP 2.0.1 integration.
3. **Fleet Management Portal**: Multi-vehicle telemetry dashboard for EV taxi and delivery fleet operators.
4. **Grid Carbon Intensity Awareness**: Scheduling charging stops during peak renewable energy generation hours.

---

## 🛡️ 12. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
