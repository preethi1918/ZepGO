import os
import joblib
import numpy as np
from typing import Dict, Any

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
ISO_MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.joblib")

_iso_model = None

def get_isolation_forest_model():
    global _iso_model
    if _iso_model is None and os.path.exists(ISO_MODEL_PATH):
        try:
            _iso_model = joblib.load(ISO_MODEL_PATH)
        except Exception:
            _iso_model = None
    return _iso_model

def detect_anomaly(
    observed_distance_km: float,
    observed_energy_kwh: float,
    expected_efficiency: float = 6.8
) -> Dict[str, Any]:
    """
    Detects abnormal consumption deviation using Isolation Forest.
    Example: Normal consumption: 5-7 km/kWh. Observed: 2.1 km/kWh.
    Flags: "Unusual energy consumption detected."
    Possible causes: Heavy traffic, Low tyre pressure, Extreme weather, Aggressive driving, Sensor issue.
    """
    if observed_energy_kwh <= 0 or observed_distance_km <= 0:
        return {
            "is_anomaly": False,
            "anomaly_score": 0.0,
            "observed_efficiency": expected_efficiency,
            "flag_message": None,
            "possible_causes": []
        }

    observed_eff = observed_distance_km / observed_energy_kwh
    model = get_isolation_forest_model()

    is_anomaly = False
    score = 0.5

    if model is not None:
        try:
            X = np.array([[observed_eff]])
            pred = model.predict(X)[0]  # -1 = anomaly, 1 = normal
            score = float(model.decision_function(X)[0])
            is_anomaly = bool(pred == -1 or observed_eff < 3.5 or observed_eff > 9.2)
        except Exception:
            is_anomaly = bool(observed_eff < 3.5 or observed_eff > 9.2)
    else:
        # Fallback heuristic if model file not yet loaded
        is_anomaly = bool(observed_eff < 3.5 or observed_eff > 9.2)
        score = -0.15 if is_anomaly else 0.4

    possible_causes = []
    flag_message = None

    if is_anomaly:
        flag_message = f"Unusual energy consumption detected: Observed {observed_eff:.1f} km/kWh vs normal {expected_efficiency:.1f} km/kWh."
        if observed_eff < expected_efficiency:
            possible_causes = [
                "Heavy stop-and-go highway congestion",
                "Sub-optimal tyre pressure or high aerodynamic drag",
                "Severe ambient headwinds or steep continuous uphill incline",
                "Aggressive rapid acceleration / braking cycles",
                "High continuous climate control (AC/Heater) power draw"
            ]
        else:
            possible_causes = [
                "Prolonged downhill gradient with regenerative braking",
                "Strong tailwinds and drafting at moderate highway speeds"
            ]

    return {
        "is_anomaly": is_anomaly,
        "observed_efficiency_km_kwh": round(observed_eff, 2),
        "expected_efficiency_km_kwh": round(expected_efficiency, 2),
        "anomaly_score": round(score, 3),
        "flag_message": flag_message,
        "possible_causes": possible_causes
    }
