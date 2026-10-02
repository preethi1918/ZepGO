# ⚡ ZepGO — Intelligent EV Route & Charging Assistant

> **Plan smarter. Charge safer. Drive farther.**

ZepGO is an intelligent EV navigation and charging assistant designed to make long-distance electric vehicle travel more reliable and stress-free.

Unlike basic navigation systems that mainly provide routes and nearby charging stations, **ZepGO considers the vehicle's battery condition, expected energy consumption, traffic, road conditions, weather, charging-station risks, and backup options before recommending a route or charger.**

---

## 🚗 What is ZepGO?

Electric vehicle drivers often face uncertainty during long-distance trips:

* Will the current battery be enough?
* Where should I charge?
* Will the charger be available when I reach?
* What if there is a queue?
* What if the charger is faulty?
* How much battery will remain after reaching the destination?
* Is the route affected by traffic, hills, weather, or road conditions?
* What happens if the vehicle develops a problem during the trip?

**ZepGO brings these factors together into one intelligent EV travel assistant.**

The system analyzes the trip before and during travel and provides:

**Route → Energy Prediction → Charging Decision → Charger Risk → Backup Plan → Travel Support**

---

# 🎯 Problem Statement

Current EV navigation and charging applications often provide route navigation or charging-station information separately.

However, EV drivers need a more complete decision-making system that considers:

* Vehicle-specific battery capacity
* Current battery percentage
* Real-world energy consumption
* Traffic conditions
* Road type and elevation
* Weather conditions
* Charging-station availability
* Queue conditions
* Connector/port availability
* Charger faults or maintenance
* Charging cost
* Backup charging options
* Emergency vehicle issues

ZepGO aims to combine these factors into a single intelligent travel-planning system.

---

# 💡 Our Solution

ZepGO creates a **dynamic EV travel plan** based on the driver's vehicle, battery state, destination, and real-world travel conditions.

### Basic workflow

```text
Vehicle Details
      ↓
Current Location + Battery %
      ↓
Destination
      ↓
Route Analysis
      ↓
Energy / Range Prediction
      ↓
Traffic + Weather + Road Analysis
      ↓
Charging Requirement
      ↓
Charger Risk Analysis
      ↓
Primary Charger + Backup Charger
      ↓
Recommended Route
```

---

# ✨ Key Features

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

---

# 🛠️ Technology Stack

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
```

---

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

### 2. Running the Backend (FastAPI)

Ensure Python (3.9+) is installed.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Verify backend health check at `http://127.0.0.1:8000/api/health`.

---

# 📌 Project Status

**ZepGO is actively under development.**

This project is developed for educational, research, and innovation purposes.
