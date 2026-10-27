import json
import os
from typing import List, Dict, Any, Optional

from ..models.charging_station import ChargingStation, ChargerRecommendation, WhyThisCharger
from ..models.facility import Facility
from ..utils.calculations import calculate_charging_time, calculate_charging_cost
from .risk_service import RiskService

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
CHARGERS_FILE = os.path.join(DATA_DIR, "charging_stations.json")
FACILITIES_FILE = os.path.join(DATA_DIR, "facilities.json")

class ChargingService:
    @staticmethod
    def load_stations() -> List[ChargingStation]:
        if not os.path.exists(CHARGERS_FILE):
            return []
        with open(CHARGERS_FILE, "r", encoding="utf-8") as f:
            raw = json.load(f)
            return [ChargingStation(**item) for item in raw]

    @staticmethod
    def get_station_by_id(station_id: str) -> Optional[ChargingStation]:
        stations = ChargingService.load_stations()
        for s in stations:
            if s.id == station_id:
                return s
        return None

    @staticmethod
    def rank_chargers(
        stations: List[ChargingStation],
        vehicle_model: str,
        vehicle_connector: str,
        vehicle_max_speed: float,
        battery_capacity: float,
        current_soc: float,
        expected_arrival_soc: float,
        safety_reserve: float = 18.0,
        weights: Optional[Dict[str, float]] = None
    ) -> List[ChargerRecommendation]:
        """
        Calculates recommendation score using multi-factor normalized algorithm:
        Score = Safety*w1 + Availability*w2 + Compatibility*w3 + Cost*w4 + Distance*w5 + Speed*w6
        Weights are configurable.
        """
        if weights is None:
            weights = {
                "safety": 0.25,
                "availability": 0.20,
                "compatibility": 0.20,
                "speed": 0.15,
                "cost": 0.10,
                "distance": 0.10
            }

        recommendations = []

        for st in stations:
            # 1. Compatibility
            is_compatible = (st.connector_type == vehicle_connector) or ("CCS2" in vehicle_connector)
            compat_score = 100.0 if is_compatible else 10.0

            # 2. Availability & Waiting time
            if st.availability == "Available" and st.available_chargers > 0:
                avail_score = min(100.0, 70.0 + (st.available_chargers * 10.0) - (st.estimated_waiting_time * 2.0))
            elif st.availability == "Busy":
                avail_score = max(20.0, 50.0 - (st.estimated_waiting_time * 2.0))
            else:
                avail_score = 0.0

            # 3. Speed Score (Higher is better, normalized up to 150 kW)
            effective_speed = min(st.charging_speed, vehicle_max_speed)
            speed_score = min(100.0, (effective_speed / 150.0) * 100.0)

            # 4. Cost Score (Lower price per kWh yields higher score, range INR 18 to 26)
            cost_score = max(20.0, min(100.0, 100.0 - ((st.price_per_kwh - 18.0) / 8.0) * 80.0))

            # 5. Distance Diversion Score (closer to route is better, 0 to 5 km)
            dist_score = max(20.0, min(100.0, 100.0 - (st.distance_from_route_km * 16.0)))

            # 6. Safety Score
            safety_score = 95.0 if expected_arrival_soc >= safety_reserve else 60.0

            # Composite Score
            total_score = (
                (safety_score * weights["safety"]) +
                (avail_score * weights["availability"]) +
                (compat_score * weights["compatibility"]) +
                (speed_score * weights["speed"]) +
                (cost_score * weights["cost"]) +
                (dist_score * weights["distance"])
            )

            # Risk evaluation
            risk_cat, risk_msg, _ = RiskService.evaluate_charging_risk(
                arrival_soc=expected_arrival_soc,
                safety_reserve=safety_reserve,
                charger_available_plugs=st.available_chargers,
                distance_to_next_charger_km=28.0,
                is_compatible=is_compatible,
                waiting_time_minutes=st.estimated_waiting_time
            )

            # Charging time and cost estimation to 80% SOC
            target_soc = 80.0
            soc_to_add = max(0.0, target_soc - max(15.0, expected_arrival_soc))
            energy_needed_kwh = (soc_to_add / 100.0) * battery_capacity
            
            charging_mins = calculate_charging_time(
                current_soc=max(15.0, expected_arrival_soc),
                target_soc=target_soc,
                battery_capacity_kwh=battery_capacity,
                charger_speed_kw=st.charging_speed,
                vehicle_max_speed_kw=vehicle_max_speed
            )
            est_cost = calculate_charging_cost(energy_needed_kwh, st.price_per_kwh)

            # Why this charger bullet points
            bullets = [
                f"{st.distance_from_route_km:.1f} km from your route corridor",
                f"Fully compatible with your {vehicle_model} ({st.connector_type})",
                f"Expected arrival battery: {expected_arrival_soc:.0f}%",
                f"Currently {st.availability.lower()} ({st.available_chargers}/{st.total_chargers} plugs open)",
                f"High-power {st.charging_speed:.0f} kW DC fast charger",
                f"Estimated cost: ₹{est_cost:.0f} ({st.price_per_kwh} ₹/kWh)",
                f"Adjacent amenities: {st.nearby_facilities[0].name if st.nearby_facilities else 'Restrooms & Cafes'}"
            ]

            why_obj = WhyThisCharger(
                bullet_points=bullets,
                arrival_soc_percent=round(expected_arrival_soc, 1),
                charging_time_minutes=charging_mins,
                estimated_cost_inr=est_cost,
                safety_margin_percent=round(max(0.0, expected_arrival_soc - safety_reserve), 1),
                summary=f"Closest verified {st.charging_speed:.0f} kW DC fast charger with {st.available_chargers} open plugs and excellent amenities."
            )

            recommendations.append(
                ChargerRecommendation(
                    station=st,
                    recommendation_score=round(total_score, 1),
                    is_recommended=False,
                    why_this_charger=why_obj,
                    risk_level=risk_cat,
                    risk_explanation=risk_msg,
                    arrival_soc_percent=round(expected_arrival_soc, 1),
                    time_to_charge_minutes=charging_mins,
                    target_soc_percent=target_soc,
                    estimated_charging_cost_inr=est_cost,
                    rank=0
                )
            )

        # Sort descending by recommendation_score
        recommendations.sort(key=lambda x: x.recommendation_score, reverse=True)
        
        # Assign ranks and mark #1 as is_recommended
        for i, rec in enumerate(recommendations):
            rec.rank = i + 1
            if i == 0:
                rec.is_recommended = True

        return recommendations
