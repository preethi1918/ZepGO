import type {
  Vehicle,
  RouteData,
  EnvironmentalConditions,
  TripCalculationResult,
  TripPreference,
  Charger,
  BackupAnalysisResult,
  BadgeVariant
} from '../types';
import { calculateTripPlan } from './batteryEngine';
import { checkBackupReachability } from './chargerEngine';

export type DataLineageType = 'Live' | 'Cached' | 'Demo Data' | 'Estimated' | 'Predicted';

export interface DataBadgeInfo {
  label: string;
  type: DataLineageType;
  variant: BadgeVariant;
}

/**
 * ZepGO Central Intelligence Engine
 * Consolidates Vehicle Telemetry + Route + Environmental Conditions + Charger Risk + Rerouting Logic
 */
export class IntelligenceEngine {
  /**
   * Main Decision Pipeline
   */
  public static evaluateJourney(
    route: RouteData,
    preference: TripPreference,
    conditions: EnvironmentalConditions,
    departureTime: string,
    vehicle: Vehicle
  ): TripCalculationResult {
    return calculateTripPlan(route, preference, conditions, departureTime, vehicle);
  }

  /**
   * Evaluate Primary vs Backup Charger Failover
   */
  public static evaluateBackupFailover(
    primaryCharger: Charger,
    backupCharger: Charger,
    vehicle: Vehicle,
    startingSOC: number
  ): BackupAnalysisResult {
    return checkBackupReachability(primaryCharger, backupCharger, vehicle, startingSOC);
  }

  /**
   * Get Data Lineage Transparency Badge info for Rule 5 & 28
   */
  public static getDataLineageBadge(type: DataLineageType): DataBadgeInfo {
    switch (type) {
      case 'Live':
        return { label: 'LIVE DATA', type: 'Live', variant: 'success' };
      case 'Cached':
        return { label: 'CACHED DATA', type: 'Cached', variant: 'warning' };
      case 'Demo Data':
        return { label: 'DEMO DATA', type: 'Demo Data', variant: 'info' };
      case 'Estimated':
        return { label: 'ESTIMATED', type: 'Estimated', variant: 'neutral' };
      case 'Predicted':
        return { label: 'PREDICTED ML', type: 'Predicted', variant: 'info' };
      default:
        return { label: 'ESTIMATED', type: 'Estimated', variant: 'neutral' };
    }
  }

  /**
   * ML Ready Architecture - Charger Availability Prediction (Mock XGBoost Model Interface)
   */
  public static predictChargerAvailabilityAtArrival(
    charger: Charger
  ): { status: string; confidence: number; riskLevel: 'Low' | 'Medium' | 'High' } {
    if (charger.freePorts >= 2 && charger.queueLevel === 'Low') {
      return { status: 'Likely Available', confidence: 0.94, riskLevel: 'Low' };
    } else if (charger.freePorts === 1) {
      return { status: 'May Be Busy', confidence: 0.78, riskLevel: 'Medium' };
    } else {
      return { status: 'High Occupancy Predicted', confidence: 0.88, riskLevel: 'High' };
    }
  }

  /**
   * Emergency Safe Stop Recommendation Engine
   */
  public static findSafeStoppingPoints() {
    return [
      {
        id: 'stop-1',
        name: 'NH-44 Highway Emergency Bay #14',
        distanceMeters: 500,
        type: 'Safe Stopping Location',
        isSafeArea: true,
        address: 'KM 142, NH-44 Express Corridor'
      },
      {
        id: 'mechanic-1',
        name: 'Salem QuickFix EV & Tyre Service',
        distanceKm: 1.4,
        type: 'Mechanic',
        phone: '+91 98765 43210',
        address: 'Service Road, Near Toll Plaza'
      },
      {
        id: 'charger-1',
        name: 'Tata Power 250kW Hypercharger',
        distanceKm: 2.1,
        type: 'Fast Charger',
        connector: 'CCS2',
        address: 'Highway Plaza Rest Hub'
      },
      {
        id: 'emergency-1',
        name: 'ZepGO Roadside Assistance & Tow Support',
        distanceKm: 3.2,
        type: 'Emergency Support',
        phone: '1800-ZEPGO-HELP',
        etaMinutes: 12
      }
    ];
  }
}
