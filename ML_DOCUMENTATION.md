# ZepGO – Machine Learning & Predictive Modeling Documentation

## 1. Machine Learning Strategy

Electric vehicle range estimation cannot rely on simple linear arithmetic ($SOC \times \text{efficiency}$) because energy consumption is highly sensitive to non-linear physical forces:
- **Aerodynamic Drag**: Increases with the square of velocity ($F_d \propto v^2$), making consumption spike non-linearly above 70 km/h.
- **Rolling Resistance**: Function of vehicle mass and tyre pressure.
- **Climatic Loads**: Cabin HVAC drawing 1.5–3.5 kW depending on ambient temperature.
- **Topographic Work**: Gravitational potential energy ($\Delta E = m \cdot g \cdot \Delta h$) consumed during uphill climbs.

ZepGO addresses this with a dual-stage ML architecture:
1. **Supervised Stage**: XGBoost Regressor predicting route energy consumption ($kWh$).
2. **Unsupervised Stage**: Isolation Forest detecting anomalous battery drain or sensor inaccuracies.

---

## 2. XGBoost Energy Regression Model

### 2.1 Model Artifact
- **File**: `backend/app/ml/xgb_energy_model.json`
- **Framework**: `xgboost` 2.1+ / `scikit-learn` 1.4+
- **Objective**: `reg:squarederror`
- **Trained Performance**:
  - **$R^2$ Score**: `0.9910`
  - **Mean Absolute Error (MAE)**: `1.33 kWh`
  - **Root Mean Squared Error (RMSE)**: `1.78 kWh`

### 2.2 Feature Specifications (9 Inputs)

| Feature | Type | Range / Units | Description |
|---|---|---|---|
| `battery_capacity_kwh` | Float | 15.0 – 120.0 kWh | Gross battery pack capacity |
| `battery_soc_percent` | Float | 5.0 – 100.0 % | Initial State of Charge at trip departure |
| `distance_km` | Float | 5.0 – 600.0 km | Corridor distance between origin and destination |
| `vehicle_efficiency_km_per_kwh` | Float | 3.5 – 9.0 km/kWh | OEM rated vehicle efficiency |
| `average_speed_kmh` | Float | 30.0 – 125.0 km/h | Expected cruising velocity |
| `traffic_factor` | Float | 1.0 – 2.0 | Congestion multiplier (stop-and-go idle draw) |
| `temperature_celsius` | Float | 10.0 – 46.0 °C | Ambient temperature (HVAC thermal load) |
| `rain_factor` | Float | 1.0 – 1.4 | Road wetness and hydroplaning rolling resistance |
| `elevation_gain_m` | Float | 0.0 – 2500.0 m | Cumulative ascent along highway topography |

### 2.3 Hyperparameters
```python
xgb_params = {
    "n_estimators": 120,
    "max_depth": 5,
    "learning_rate": 0.08,
    "subsample": 0.85,
    "colsample_bytree": 0.85,
    "random_state": 42
}
```

---

## 3. Isolation Forest Anomaly Detector

### 3.1 Model Artifact
- **File**: `backend/app/ml/isolation_forest.joblib`
- **Framework**: `sklearn.ensemble.IsolationForest`
- **Contamination Rate**: `0.05` (5% expected anomaly threshold)

### 3.2 Purpose & Logic
The Isolation Forest continuously evaluates trip efficiency metrics ($km/kWh$) relative to the vehicle's standard operating envelope.
- Normal highway efficiency for Indian passenger EVs (Nexon EV, ZS EV, XUV400): **$4.8\text{ to }7.4\text{ km/kWh}$**.
- When observed consumption drops below **$3.5\text{ km/kWh}$**, the system scores an anomaly.
- **User Explanation**: Rather than claiming mechanical defects with false certainty, ZepGO displays:
  > *"Unusual energy consumption detected. Possible causes: Heavy traffic, low tyre pressure, extreme headwind, or aggressive driving."*

---

## 4. Reproducing & Re-training

To re-generate datasets and re-train the ML models:
```bash
# In the project root with the Python environment active:
python -m backend.app.ml.train_model
```
Console Output:
```text
Training XGBoost Model...
XGBoost Evaluation - R2: 0.9910, MAE: 1.33 kWh
Saved model to: .../xgb_energy_model.json
Training Isolation Forest Anomaly Detector...
Saved Isolation Forest to: .../isolation_forest.joblib
```
