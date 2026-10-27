import pytest
from backend.app.ml.predict import predict_energy_consumption
from backend.app.ml.isolation_forest import detect_anomaly

def test_ml_energy_prediction_output():
    result = predict_energy_consumption(
        soc_percent=62.0,
        distance_km=142.0,
        vehicle_efficiency_km_kwh=6.8,
        avg_speed_kmh=75.0,
        traffic_level=1.0,
        temperature_c=28.0,
        rain_level_mm=0.0,
        elevation_gain_m=120.0
    )
    assert "predicted_energy_kwh" in result
    assert "confidence_percent" in result
    assert result["predicted_energy_kwh"] > 0
    # For 142 km at 6.8 km/kWh, expect roughly 18-24 kWh
    assert 16.0 <= result["predicted_energy_kwh"] <= 26.0
    assert result["confidence_percent"] >= 80.0

def test_isolation_forest_anomaly_detection():
    # Normal efficiency: 142 km / 21 kWh = 6.76 km/kWh
    normal_res = detect_anomaly(observed_distance_km=142.0, observed_energy_kwh=21.0, expected_efficiency=6.8)
    assert not normal_res["is_anomaly"]
    assert normal_res["flag_message"] is None

    # Severely abnormal consumption: 50 km / 25 kWh = 2.0 km/kWh
    abnormal_res = detect_anomaly(observed_distance_km=50.0, observed_energy_kwh=25.0, expected_efficiency=6.8)
    assert abnormal_res["is_anomaly"]
    assert abnormal_res["flag_message"] is not None
    assert len(abnormal_res["possible_causes"]) > 0
