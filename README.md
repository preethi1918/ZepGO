# ⚡ ZepGO – AI-Powered EV Navigation & Charging Intelligence Platform

> **Plan smarter. Charge safer. Drive farther.**
> *"ZepGO doesn't just tell an EV where to go. It predicts whether the EV can safely get there and intelligently decides where, when, and why it should charge."*

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

```text
Vehicle Details
      ↓
Current Location + Battery %
      ↓
Destination
      ↓
Route Analysis
      ↓
Energy / Range Prediction (XGBoost)
      ↓
Traffic + Weather + Elevation Analysis
      ↓
Charging Requirement Evaluation
      ↓
Charger Risk & Availability Scoring
      ↓
Primary Charger + Verified Backup Charger
      ↓
Recommended Route & Live Monitoring
```

---

## 🚨 2. The Core Problem Statement

<<<<<<< HEAD
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

## 💡 3. The ZepGO Solution Architecture

ZepGO unifies route calculation, telemetry simulation, machine learning, and dynamic charger intelligence:

```text
                 ┌─────────────────────────┐
                 │       User Inputs       │
                 │                         │
                 │ Current Location        │
                 │ Destination             │
                 │ Battery %               │
                 │ Vehicle Details         │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │     FastAPI Backend     │
                 └────────────┬────────────┘
                              │
             ┌────────────────┼─────────────────┐
             │                │                 │
             ▼                ▼                 ▼
      Route Analysis    Weather Data      Elevation Data
      Google Maps       OpenWeather        Google Elevation
             │                │                 │
             └────────────────┼─────────────────┘
                              ▼
                 ┌─────────────────────────┐
                 │   Energy Prediction     │
                 │   (XGBoost Regressor)   │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │  Charging Intelligence  │
                 │                         │
                 │ Charger Risk            │
                 │ Predictive Availability │
                 │ Real-time Queues        │
                 │ Verified Backup Charger │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   ZepGO Recommendation  │
                 │                         │
                 │ Optimized Route         │
                 │ Explainable Stops       │
                 │ Arrival Battery Margin  │
                 │ Seamless Backup Reroute │
                 └─────────────────────────┘
```
=======
## 1. 🔋 Vehicle-Aware Range Prediction
ZepGO does not depend only on the manufacturer's claimed range. It considers battery capacity, current state of charge, vehicle efficiency, elevation, and weather.

## 2. 🗺️ Intelligent Route Planning
Analyzes optimal routes considering energy consumption, traffic, elevation, and available charging infrastructure.

## 3. ⚡ Smart Charging Decision
Determines if charging is actually required, preventing unnecessary detour stops.

## 4. 🔌 Charger Risk Analysis
Evaluates station availability, port counts, queue predictions, charger status, and cost.

## 5. 🛡️ Backup Charger Planning
Maintains fallback charging stations along the route if the primary charger becomes unavailable or congested.

## 6. 📊 "Why This Charger?" Explanation
Provides clear reasoning behind selected charging recommendations.

## 7. ☕ Smart Stop Recommendations
Recommends nearby amenities (cafés, rest areas, restaurants) during charging sessions.
>>>>>>> origin/main

---

## ✨ 4. Key Platform Features

<<<<<<< HEAD
### 1. 🔋 Vehicle-Aware Range Prediction
Rather than trusting static manufacturer ranges, ZepGO models:
- Usable battery capacity & real-time SOC
- Aerodynamic drag ($v^2$) and vehicle curb weight
- Traffic idling energy draws
- Elevation potential work ($m \cdot g \cdot \Delta h$)
- Ambient temperature cabin thermal loads (HVAC)

### 2. 🗺️ Intelligent Route Planning
Analyzes multiple highway corridor variants, prioritizing overall travel efficiency, charger reliability, and minimum total trip time.

### 3. ⚡ Smart Charging Decision
- If the EV reaches the destination with SOC $\ge \text{Safety Reserve}$: **No charging stop is inserted**, avoiding wasted detours.
- If predicted SOC falls below reserve: **An optimal high-speed charging stop is seamlessly sequenced**.

### 4. 🔌 Predictive Charger Risk & Queue Scoring
Evaluates stations using a multi-factor risk model:
- Historical uptime and maintenance reports
- Live connector availability and queue progression
- Predictive plug availability (+30 min / +60 min forecasting)

### 5. 🛡️ Automatic Backup Charger Planning
For every recommended primary charger, ZepGO identifies and verifies a reliable backup charger within 5–10 km in case of unexpected queues or downtime.

### 6. 📊 "Why This Charger?" Explainability Framework
Drivers receive transparent rationale before committing to a stop:
- **WHAT**: Hub name, speed rating (kW), and connector types.
- **WHY**: Plug availability, buffer margin above safety reserve, and lowest cost.
- **IMPACT**: Required charging time, estimated cost, and final destination battery buffer.

### 7. ☕ "While You Charge" Amenity Experience
Recommends verified highway amenities (restrooms, cafes, dining, illuminated night zones) so drivers never wait in isolated or uncomfortable locations.

### 8. 🚨 Integrated Emergency SOS Hub
Immediate 1-tap support for battery critical alerts, breakdown assistance, flat tyre support, or authorized roadside dispatch.

---

## 🤖 5. Machine Learning Engine

### 5.1 XGBoost Energy Regressor
Trained on highway EV telemetry data with 9 core features:
1. `battery_capacity_kwh`
2. `battery_soc_percent`
3. `distance_km`
4. `vehicle_efficiency_km_per_kwh`
5. `average_speed_kmh`
6. `traffic_factor`
7. `temperature_celsius`
8. `rain_factor`
9. `elevation_gain_m`

### 5.2 Isolation Forest Anomaly Detection
Continuously monitors driving consumption patterns. If real-time consumption drops below normal highway bounds, ZepGO alerts the driver to investigate tyre pressure, strong headwinds, or HVAC anomalies.

---

## 🛠️ 6. Technology Stack

- **Frontend**: React 18, TypeScript, Vite 8, Tailwind CSS, Lucide Icons, Leaflet / React-Leaflet
- **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic v2
- **Machine Learning**: XGBoost, Scikit-learn (Isolation Forest), Pandas, NumPy
- **Containerization & Deployment**: Docker, Docker Compose, Vercel, Render

---

## 🚀 7. Getting Started

### 7.1 Backend Setup (FastAPI & XGBoost)
```bash
# Navigate to backend and install dependencies
cd backend
pip install -r requirements.txt

# Train ML models & generate artifacts
python -m backend.app.ml.train_model

# Run the 14-test verification suite
python -m pytest backend/tests

# Start FastAPI server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
=======
### Frontend
* **Framework:** React 19 + Vite
* **Language:** TypeScript / JavaScript
* **Styling:** Vanilla CSS / Tailwind CSS v4
* **Icons:** Lucide React
* **Routing:** React Router v7

### Backend
* **Framework:** Python 3.11 + FastAPI
* **Server:** Uvicorn
* **ML/Analytics:** XGBoost, Isolation Forest, Pandas, NumPy

---

# 📁 Project Structure

```text
Zep_Go/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   ├── routes/              # API route definitions (/api/health, etc.)
│   ├── services/            # Intelligence & prediction services
│   ├── models/              # Pydantic & data schemas
│   └── utils/               # Utility functions
├── src/
│   ├── components/          # UI Components (Dashboard, Live, Layout, UI)
│   ├── pages/               # Application Pages & Route Views
│   ├── context/             # App Context (Auth, Vehicle, Journey)
│   ├── routes/              # React Router setup
│   ├── utils/               # Client-side intelligence engines
│   ├── App.tsx              # Root App Component
│   └── index.css            # Design system & styles
├── package.json             # Frontend dependencies
└── README.md                # Documentation
>>>>>>> origin/main
```
API runs at `http://127.0.0.1:8000` (Interactive Docs: `http://127.0.0.1:8000/docs`).

### 7.2 Frontend Setup (React & Vite)
```bash
# In the root directory:
npm install

# Build production bundle
npm run build

# Start local development server
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 7.3 Docker Multi-Container Deployment
```bash
docker-compose up --build
```
- Frontend UI: `http://localhost:80`
- Backend API: `http://localhost:8000`

---

<<<<<<< HEAD
## ☁️ 8. Cloud Deployment Guide

### Vercel (Frontend)
1. Push repository changes to GitHub (`git push origin main`).
2. In Vercel (`vercel.com`), select **Add New Project** and import `preethi1918/ZepGo`.
3. Vercel automatically detects the Vite framework and `vercel.json` routing rules.
4. Set `VITE_API_URL` to your production backend URL (e.g. `https://zepgo-backend.onrender.com`).
5. Click **Deploy**.

### Render (Backend)
1. In Render (`render.com`), create a **New Blueprint Instance**.
2. Connect the `https://github.com/preethi1918/ZepGo` repository.
3. Render reads `render.yaml`, spins up Python 3.11, runs dependency installation, trains the XGBoost model, and starts Uvicorn on dynamic `$PORT`.
=======
# 💻 How to Run the Project

### 1. Running the Frontend (React + Vite)

Ensure Node.js (v18+) is installed.

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will be accessible at `http://localhost:5173`.
>>>>>>> origin/main

### 2. Running the Backend (FastAPI)

<<<<<<< HEAD
## 🔑 9. Demo Persona & Default Scenario

- **User**: Preethi (`preethi@zepgo.io` / `password123`)
- **EV**: Tata Nexon EV Max (40.5 kWh, 62% SOC, 184 km range)
- **Origin**: Salem Highway Corridor
- **Destination**: Coimbatore (142 km, 3h 20m)
- **Safety Reserve**: 18%
- **Expected Arrival Battery**: 24.1%
- **Charging Recommendation**: Zeon Charging Hub - Salem Highway (120 kW Fast Charger, 24 min charge)
=======
Ensure Python (3.9+) is installed.

```bash
# Navigate to backend directory
cd backend
>>>>>>> origin/main

# Install dependencies
pip install -r requirements.txt

<<<<<<< HEAD
## 📚 10. Platform Documentation Suite

- 🏛️ [ARCHITECTURE.md](ARCHITECTURE.md) — System design, components, ranking algorithms, and resilience.
- 📡 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) — Complete 18-endpoint REST API reference.
- 🧠 [ML_DOCUMENTATION.md](ML_DOCUMENTATION.md) — XGBoost and Isolation Forest training, features, and metrics.
- 🗄️ [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) — Pydantic and database entity schemas.
- ⚙️ [SETUP.md](SETUP.md) — Comprehensive developer setup and environment configuration guide.
- ✨ [FEATURES.md](FEATURES.md) — Complete 20-phase feature catalog and capability matrix.

---

## 🛡️ 11. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
=======
# Start FastAPI server
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Verify backend health check at `http://127.0.0.1:8000/api/health`.

---

# 📌 Project Status

**ZepGO is actively under development.**

This project is developed for educational, research, and innovation purposes.
>>>>>>> origin/main
