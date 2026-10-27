from typing import Dict, Any, Tuple

class RiskService:
    @staticmethod
    def evaluate_charging_risk(
        arrival_soc: float,
        safety_reserve: float = 18.0,
        charger_available_plugs: int = 3,
        distance_to_next_charger_km: float = 25.0,
        is_compatible: bool = True,
        waiting_time_minutes: int = 0,
        weather_factor: float = 1.0
    ) -> Tuple[str, str, Dict[str, Any]]:
        """
        Evaluates risk category: LOW, MEDIUM, HIGH.
        """
        risk_score = 0
        reasons = []

        # 1. Arrival SOC check vs Safety Reserve
        if arrival_soc >= (safety_reserve + 10.0):
            risk_score += 0
        elif arrival_soc >= safety_reserve:
            risk_score += 25
            reasons.append(f"Arrival battery ({arrival_soc:.0f}%) is within buffer of safety reserve ({safety_reserve:.0f}%)")
        elif arrival_soc >= (safety_reserve - 6.0):
            risk_score += 60
            reasons.append(f"Arrival battery ({arrival_soc:.0f}%) drops below your {safety_reserve:.0f}% safety reserve")
        else:
            risk_score += 90
            reasons.append(f"Critical battery depletion risk ({arrival_soc:.0f}% arrival SOC)")

        # 2. Charger availability check
        if charger_available_plugs >= 2 and waiting_time_minutes == 0:
            risk_score += 0
        elif charger_available_plugs == 1:
            risk_score += 15
            reasons.append("Only 1 plug currently open; moderate queue probability")
        else:
            risk_score += 45
            reasons.append(f"All plugs occupied ({waiting_time_minutes} min estimated wait time)")

        # 3. Next charger distance
        if distance_to_next_charger_km > 40.0:
            risk_score += 20
            reasons.append(f"Next compatible charger is {distance_to_next_charger_km:.0f} km away")

        # 4. Compatibility
        if not is_compatible:
            risk_score += 80
            reasons.append("Connector type or vehicle protocol incompatible")

        # 5. Weather headwind
        if weather_factor > 1.15:
            risk_score += 10
            reasons.append("Adverse weather increases route energy uncertainty")

        # Determine Category
        if risk_score < 30:
            category = "LOW"
            explanation = f"Your expected arrival battery is {arrival_soc:.0f}% and a compatible high-speed charger is currently available."
        elif risk_score < 65:
            category = "MEDIUM"
            explanation = "Moderate trip risk: " + "; ".join(reasons)
        else:
            category = "HIGH"
            explanation = f"High charging risk: Expected arrival battery is {arrival_soc:.0f}% and {reasons[0] if reasons else 'charger availability is critical'}."

        return category, explanation, {
            "risk_score": risk_score,
            "risk_category": category,
            "reasons": reasons,
            "arrival_soc": arrival_soc,
            "safety_reserve": safety_reserve,
            "available_plugs": charger_available_plugs
        }
