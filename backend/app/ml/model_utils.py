import os
import numpy as np
import pandas as pd
from typing import List, Tuple

# ML Feature Columns in exact order
FEATURE_COLUMNS: List[str] = [
    "soc_percent",
    "distance_km",
    "vehicle_efficiency_km_kwh",
    "avg_speed_kmh",
    "traffic_level",         # 1.0 (light), 1.3 (medium), 1.6 (heavy)
    "temperature_c",         # ambient Celsius
    "rain_level_mm",         # 0.0 (dry) to 25.0 (heavy rain)
    "elevation_gain_m",      # meters
    "num_stops"              # number of stops/starts
]

def generate_synthetic_ev_dataset(num_samples: int = 2500, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates a realistic synthetic telemetry dataset for Indian EV highway operations.
    Clearly documented as synthetic training data adhering to EV thermodynamics.
    """
    np.random.seed(random_seed)
    
    soc = np.random.uniform(20.0, 100.0, num_samples)
    distance = np.random.uniform(15.0, 350.0, num_samples)
    efficiency = np.random.choice([5.8, 6.2, 6.5, 6.8, 7.2], num_samples)
    speed = np.random.uniform(40.0, 105.0, num_samples)
    traffic = np.random.choice([1.0, 1.15, 1.35, 1.6], num_samples, p=[0.4, 0.3, 0.2, 0.1])
    temp = np.random.uniform(15.0, 42.0, num_samples)  # Indian highway climates
    rain = np.random.choice([0.0, 2.0, 8.0, 18.0], num_samples, p=[0.7, 0.15, 0.1, 0.05])
    elevation = np.random.uniform(0.0, 600.0, num_samples)
    stops = np.random.poisson(lam=1.5, size=num_samples)

    # Physical baseline energy consumption (kWh)
    base_energy = distance / efficiency
    
    # Aerodynamic drag effect: increases roughly with speed squared above 70 km/h
    excess_speed = np.maximum(0.0, (speed - 70.0) / 75.0)
    speed_penalty = 1.0 + (excess_speed ** 1.6) * 0.35
    
    # AC load: high above 32°C or below 18°C
    ac_penalty = np.where(temp > 32, 1.0 + (temp - 32) * 0.012, np.where(temp < 18, 1.08, 1.0))
    
    # Wet road rolling resistance & windshield/wiper electrical drain
    rain_penalty = 1.0 + (rain / 25.0) * 0.14
    
    # Gravitational potential energy: PE = m * g * h / 3.6e6 kWh (~1500kg car = ~4.1 kWh per 1000m climb)
    elevation_kwh = (elevation / 1000.0) * 4.2
    
    # Stop-and-go acceleration losses
    stop_penalty = 1.0 + (stops * 0.03)
    
    # Traffic stop/crawl idling
    traffic_penalty = traffic ** 0.6
    
    # Add small stochastic Gaussian noise (sensor variations / tire pressure)
    noise = np.random.normal(1.0, 0.03, num_samples)
    
    energy_kwh = (
        base_energy * speed_penalty * ac_penalty * rain_penalty * stop_penalty * traffic_penalty
        + elevation_kwh
    ) * noise

    energy_kwh = np.maximum(energy_kwh, 1.5)  # min bound

    df = pd.DataFrame({
        "soc_percent": np.round(soc, 1),
        "distance_km": np.round(distance, 1),
        "vehicle_efficiency_km_kwh": efficiency,
        "avg_speed_kmh": np.round(speed, 1),
        "traffic_level": traffic,
        "temperature_c": np.round(temp, 1),
        "rain_level_mm": rain,
        "elevation_gain_m": np.round(elevation, 1),
        "num_stops": stops,
        "energy_consumption_kwh": np.round(energy_kwh, 2)
    })
    return df
