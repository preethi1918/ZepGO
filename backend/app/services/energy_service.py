from typing import Dict, Any
from ..utils.calculations import calculate_expected_energy, calculate_arrival_soc
from ..ml.predict import predict_energy_consumption
from ..ml.isolation_forest import detect_anomaly

class EnergyService:
    @staticmethod
    def predict_energy(
        distance_km: float,
        current_soc_percent: float,
        battery_capacity_kwh: float,
        vehicle_efficiency_km_kwh: float,
        avg_speed_kmh: float = 75.0,
        traffic_factor: float = 1.0,
        weather_factor: float = 1.0,
        elevation_gain_m: float = 120.0,
        rain_level_mm: float = 0.0,
        temperature_c: float = 29.0,
        ac_enabled: bool = True
    ) -> Dict[str, Any]:
        ac_factor = 1.08 if ac_enabled else 1.0
        
        # 1. Deterministic baseline
        deterministic_energy = calculate_expected_energy(
            distance_km=distance_km,
            vehicle_efficiency=vehicle_efficiency_km_kwh,
            traffic_factor=traffic_factor,
            weather_factor=weather_factor,
            elevation_factor=1.0 + (elevation_gain_m / 2500.0),
            speed_factor=1.0 + max(0.0, (avg_speed_kmh - 70.0) / 100.0) * 0.35,
            ac_factor=ac_factor
        )
        
        # 2. XGBoost ML Prediction
        ml_result = predict_energy_consumption(
            soc_percent=current_soc_percent,
            distance_km=distance_km,
            vehicle_efficiency_km_kwh=vehicle_efficiency_km_kwh,
            avg_speed_kmh=avg_speed_kmh,
            traffic_level=traffic_factor,
            temperature_c=temperature_c,
            rain_level_mm=rain_level_mm,
            elevation_gain_m=elevation_gain_m,
            num_stops=1
        )
        
        # Combined expected energy (favoring ML model with physical consistency check)
        predicted_energy = ml_result["predicted_energy_kwh"]
        if abs(predicted_energy - deterministic_energy) > (deterministic_energy * 0.35):
            predicted_energy = round((predicted_energy + deterministic_energy) / 2.0, 2)
            
        arrival_soc = calculate_arrival_soc(
            current_soc=current_soc_percent,
            energy_consumed_kwh=predicted_energy,
            battery_capacity_kwh=battery_capacity_kwh
        )
        
        # 3. Anomaly Detection check
        anomaly_check = detect_anomaly(
            observed_distance_km=distance_km,
            observed_energy_kwh=predicted_energy,
            expected_efficiency=vehicle_efficiency_km_kwh
        )
        
        return {
            "predicted_energy_consumption_kwh": predicted_energy,
            "deterministic_baseline_kwh": deterministic_energy,
            "expected_arrival_soc_percent": arrival_soc,
            "prediction_confidence_percent": ml_result["confidence_percent"],
            "prediction_confidence_label": ml_result["confidence_label"],
            "ml_model_used": ml_result["model_name"],
            "anomaly_telemetry": anomaly_check,
            "parameters": {
                "distance_km": distance_km,
                "current_soc_percent": current_soc_percent,
                "vehicle_efficiency_km_kwh": vehicle_efficiency_km_kwh,
                "avg_speed_kmh": avg_speed_kmh,
                "traffic_factor": traffic_factor,
                "weather_factor": weather_factor,
                "elevation_gain_m": elevation_gain_m,
                "ac_enabled": ac_enabled
            }
        }
