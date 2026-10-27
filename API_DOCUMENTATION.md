# ZepGO – Complete REST API Specification

The ZepGO backend is built using FastAPI. When running locally, interactive Swagger UI documentation is available at `http://127.0.0.1:8000/docs` and Redoc at `http://127.0.0.1:8000/redoc`.

Base URL: `http://127.0.0.1:8000`

---

## 1. System & Health

### `GET /health`
Returns the operational status of the ZepGO API and mock data layer.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "zepgo-backend",
  "database": "sample-data-layer-active"
}
```

### `GET /`
Returns platform metadata and ML engine operational status.
- **Response `200 OK`**:
```json
{
  "project": "ZepGO",
  "tagline": "AI-Powered EV Navigation & Charging Intelligence Platform",
  "ml_engines": {
    "xgboost_energy": "active",
    "isolation_forest_anomaly": "active"
  }
}
```

---

## 2. Authentication & Profiles (`/api/auth`)

### `POST /api/auth/login`
Authenticates a user and returns their profile with saved EVs.
- **Request Body**:
```json
{
  "email": "preethi@zepgo.io",
  "password": "password123"
}
```
- **Response `200 OK`**:
```json
{
  "id": "usr-preethi-01",
  "name": "Preethi",
  "email": "preethi@zepgo.io",
  "active_vehicle_id": "veh-nexon-ev-max",
  "safety_reserve_percent": 18.0,
  "route_preference": "energy_efficient"
}
```

### `POST /api/auth/register`
Registers a new user account.

---

## 3. Vehicle Garage (`/api/vehicles`)

### `GET /api/vehicles`
Retrieves all configured EV profiles in the system.
- **Response `200 OK`**: List of vehicle specifications:
```json
[
  {
    "id": "veh-nexon-ev-max",
    "brand": "Tata",
    "model": "Nexon EV Max",
    "battery_capacity_kwh": 40.5,
    "efficiency_km_per_kwh": 6.8,
    "connector_type": "CCS2",
    "max_charging_speed_kw": 50.0
  }
]
```

### `GET /api/vehicles/{id}`
Returns details for a single EV profile by ID.

### `POST /api/vehicles`
Adds a new custom vehicle configuration to the user's garage.

---

## 4. Range & Energy Prediction (`/api/range`, `/api/energy`)

### `POST /api/range/predict`
Computes physics-based realistic remaining range adjusted for environmental factors.
- **Request Body**:
```json
{
  "battery_capacity_kwh": 40.5,
  "current_soc_percent": 62.0,
  "efficiency_km_per_kwh": 6.8,
  "traffic_factor": 1.1,
  "weather_factor": 1.05,
  "elevation_gain_m": 120.0
}
```
- **Response `200 OK`**:
```json
{
  "available_energy_kwh": 25.11,
  "base_range_km": 170.75,
  "estimated_realistic_range_km": 184.2,
  "environmental_penalty_factor": 1.08,
  "confidence_score": 0.94,
  "status_level": "comfortable",
  "label": "Estimated Range"
}
```

### `POST /api/energy/predict`
Predicts trip energy consumption using the trained XGBoost model and checks for anomalies via Isolation Forest.
- **Request Body**:
```json
{
  "vehicle_id": "veh-nexon-ev-max",
  "distance_km": 142.0,
  "current_soc_percent": 62.0,
  "battery_capacity_kwh": 40.5,
  "average_speed_kmh": 72.0,
  "traffic_factor": 1.1,
  "temperature_celsius": 31.0,
  "elevation_gain_m": 180.0
}
```
- **Response `200 OK`**:
```json
{
  "predicted_energy_kwh": 20.88,
  "model_confidence_percent": 95.2,
  "expected_arrival_soc_percent": 24.1,
  "is_anomaly": false,
  "anomaly_message": "Energy consumption within normal highway parameters"
}
```

---

## 5. Charging Station Intelligence (`/api/charging-stations`, `/api/charging`)

### `GET /api/charging-stations`
Returns all charging hubs along active highway corridors with real-time plug occupancy.

### `GET /api/charging-stations/{id}`
Returns granular telemetry for a specific charging hub.

### `POST /api/charging/recommend`
Executes the multi-factor charger ranking algorithm and generates the "Why This Charger?" explainability payload.
- **Request Body**:
```json
{
  "vehicle_id": "veh-nexon-ev-max",
  "current_soc_percent": 62.0,
  "route_distance_km": 142.0,
  "safety_reserve_percent": 18.0
}
```
- **Response `200 OK`**:
```json
{
  "recommended_station": {
    "id": "cs-zeon-salem",
    "name": "Zeon Charging Hub - Salem Highway",
    "charging_speed": 120,
    "available_chargers": 3,
    "distance_from_route_km": 0.2
  },
  "explanation": {
    "what": "Zeon Charging Hub - Salem Highway (120 kW CCS2 DC Fast Charger)",
    "why": "Optimal corridor position (12 km ahead), guaranteed 24.1% arrival buffer above 18% reserve, 3 available plugs, lowest tariff (₹18/kWh).",
    "impact": "+24 min charging, +₹180 estimated cost, +18% safety margin restored.",
    "checkmarks": [
      "12 km from your route corridor",
      "Compatible with your EV (CCS2)",
      "Expected arrival battery: 24.1%",
      "Currently 3 plugs available",
      "120 kW dual-gun fast charger",
      "Nearby Cafe Coffee Day and clean restroom"
    ]
  },
  "risk_assessment": {
    "level": "LOW",
    "rationale": "Expected arrival battery is 24% and compatible 120 kW fast chargers are available."
  }
}
```

---

## 6. Route Planning & Dynamic Recalculation (`/api/trip`)

### `POST /api/trip/plan`
Plans the trip, returning the recommended corridor, energy budget, and charging stops.

### `POST /api/route/compare`
Compares 3 distinct route strategies:
1. **Fastest Route**: Minimum travel duration.
2. **Energy Efficient Route**: Optimized highway speeds and minimal elevation gain.
3. **Charging Safe Route**: Maximum charger redundancy along high-density charging corridors.

### `POST /api/trip/recalculate`
Dynamically recalculates the travel plan when conditions change (e.g., sudden traffic jam, storm, charger outage).

---

## 7. Facilities & Emergency SOS (`/api/facilities`, `/api/sos`)

### `GET /api/facilities/nearby?station_id=cs-zeon-salem`
Returns nearby cafes, restrooms, restaurants, and convenience stores within walking distance.

### `POST /api/sos`
Dispatches roadside assistance for battery exhaustion, flat tyre, breakdown, or accidents without calling emergency services without confirmation.
