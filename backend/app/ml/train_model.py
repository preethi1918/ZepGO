import os
import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.ensemble import IsolationForest

try:
    from .model_utils import FEATURE_COLUMNS, generate_synthetic_ev_dataset
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from model_utils import FEATURE_COLUMNS, generate_synthetic_ev_dataset

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
XGB_MODEL_PATH = os.path.join(MODEL_DIR, "xgb_energy_model.json")
ISO_MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.joblib")

def train_and_save_models():
    print("=" * 60)
    print("[ZepGO ML Engine] Training XGBoost Energy Consumption Model")
    print("=" * 60)
    
    # 1. Generate realistic dataset (2,500 trips across Indian highway profiles)
    df = generate_synthetic_ev_dataset(num_samples=3000, random_seed=42)
    print(f"Dataset generated: {len(df)} samples across 9 telemetry features.")
    
    X = df[FEATURE_COLUMNS]
    y = df["energy_consumption_kwh"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 2. Train XGBoost Regressor
    model = xgb.XGBRegressor(
        n_estimators=180,
        max_depth=5,
        learning_rate=0.06,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        objective="reg:squarederror"
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print(f"XGBoost Model Performance on Test Set:")
    print(f"  - Mean Absolute Error (MAE): {mae:.2f} kWh")
    print(f"  - Root Mean Squared Error (RMSE): {rmse:.2f} kWh")
    print(f"  - R^2 Score: {r2:.4f} (High predictive fidelity on physics-based test set)")
    
    # Save XGBoost Model
    model.save_model(XGB_MODEL_PATH)
    print(f"Saved XGBoost model to: {XGB_MODEL_PATH}")
    
    # 3. Train Isolation Forest Anomaly Detector
    # Feature for anomaly detection: observed consumption efficiency in km/kWh
    # Specification: Normal consumption 5-7 km/kWh, Anomaly < 3.5 km/kWh or severe deviations
    print("\nTraining Isolation Forest Anomaly Detection Model...")
    normal_eff_samples = np.random.normal(loc=6.0, scale=0.55, size=2500)
    normal_eff_samples = np.clip(normal_eff_samples, 4.8, 7.4).reshape(-1, 1)
    
    iso_forest = IsolationForest(
        n_estimators=100,
        contamination=0.01,
        random_state=42
    )
    iso_forest.fit(normal_eff_samples)
    
    joblib.dump(iso_forest, ISO_MODEL_PATH)
    print(f"Saved Isolation Forest to: {ISO_MODEL_PATH}")
    print("=" * 60)
    print("ML Engine Artifacts successfully generated.")
    return model, iso_forest

if __name__ == "__main__":
    train_and_save_models()
