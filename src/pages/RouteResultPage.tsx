import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  Zap,
  AlertTriangle,
  ArrowLeft,
  Sliders,
  Car,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Compass
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { storage } from '../utils/storage';
import { findRoute } from '../data/mockRoutes';
import { calculateTripPlan } from '../utils/batteryEngine';
import { checkBackupReachability } from '../utils/chargerEngine';
import type { TripCalculationResult, Vehicle, Charger } from '../types';

export const RouteResultPage: React.FC = () => {
  const navigate = useNavigate();

  const [primaryCharger, setPrimaryCharger] = useState<Charger>(() => storage.getPrimaryCharger());
  const [backupCharger, setBackupCharger] = useState<Charger>(() => storage.getBackupCharger());

  const [result, setResult] = useState<TripCalculationResult | null>(() => {
    try {
      const stored = localStorage.getItem('zepgo_active_trip');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse active trip calculation', e);
    }

    const defaultVehicle: Vehicle = storage.getVehicleData();
    const defaultRoute = findRoute('Chennai', 'Coimbatore');
    return calculateTripPlan(
      defaultRoute,
      'Fastest',
      { traffic: 'normal', weather: 'normal', road: 'good' },
      '08:00 AM',
      defaultVehicle
    );
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zepgo_active_trip');
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to sync trip calculation', e);
    }
    setPrimaryCharger(storage.getPrimaryCharger());
    setBackupCharger(storage.getBackupCharger());
  }, []);

  if (!result) {
    return (
      <AppLayout>
        <div className="py-12 text-center space-y-4 max-w-md mx-auto">
          <PageTitle>No Active Trip Result</PageTitle>
          <PageSubtitle>Please specify your route parameters first.</PageSubtitle>
          <Button variant="primary" onClick={() => navigate('/plan-trip')}>
            Go to Trip Planner
          </Button>
        </div>
      </AppLayout>
    );
  }

  const {
    route,
    conditions,
    baseEnergyRequiredKwh,
    adjustedEnergyRequiredKwh,
    trafficImpactPercent,
    weatherImpactPercent,
    roadImpactPercent,
    startingSOC,
    arrivalSOC,
    availableEnergyKwh,
    reserveEnergyKwh,
    reservePercent,
    reserveReason,
    realisticRangeKm,
    safeReachableRangeKm,
    shortfallKm,
    kwhNeeded,
    decision,
    decisionTitle,
    decisionText,
    rangeUncertainty,
    vehicleSnapshot
  } = result;

  const isChargingRequired = decision !== 'NO_CHARGING_REQUIRED';
  const backupAnalysis = checkBackupReachability(primaryCharger, backupCharger, vehicleSnapshot, startingSOC);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Navigation className="w-3.5 h-3.5" />}>
                Assessment Completed
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/route-result</span>
            </div>
            <PageTitle gradient>
              {route.origin} → {route.destination}
            </PageTitle>
            <PageSubtitle>
              Real-time battery consumption analysis & charging recommendation.
            </PageSubtitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/plan-trip')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Modify Trip
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/live-journey')}
              rightIcon={<Navigation className="w-4 h-4" />}
            >
              Start Live Journey
            </Button>
          </div>
        </div>

        {/* JOURNEY ANALYSIS CARD */}
        <Card variant="solid" className="p-6 bg-white border-slate-200 shadow-sm space-y-5 rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">INTELLIGENT ENERGY ANALYSIS</span>
                <h3 className="text-lg font-black text-slate-900">Journey Analysis & Charging Decision</h3>
              </div>
            </div>
            <Badge variant={isChargingRequired ? 'warning' : 'success'}>
              {decisionTitle || (isChargingRequired ? 'CHARGING REQUIRED' : 'NO CHARGING REQUIRED')}
            </Badge>
          </div>

          {/* 5 KEY CALCULATION METRICS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Current Battery</span>
              <div className="text-2xl font-black text-slate-900">{startingSOC}%</div>
              <span className="text-[10px] text-slate-500 font-mono font-bold">{availableEnergyKwh} kWh Energy</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Destination Distance</span>
              <div className="text-2xl font-black text-slate-900">{route.distanceKm} km</div>
              <span className="text-[10px] text-slate-500 font-semibold">Route Total</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Predicted Realistic Range</span>
              <div className="text-2xl font-black text-blue-700">{realisticRangeKm} km</div>
              <span className="text-[10px] text-slate-500 font-semibold">Tuned to penalties</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Safety Reserve</span>
              <div className="text-2xl font-black text-amber-700">{reservePercent}%</div>
              <span className="text-[10px] text-slate-500 font-semibold">Dynamic Buffer</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Safe Reachable Range</span>
              <div className="text-2xl font-black text-emerald-700">{safeReachableRangeKm} km</div>
              <span className="text-[10px] text-slate-500 font-semibold">After Reserve</span>
            </div>
          </div>

          {/* DECISION BANNER & REASONING QUOTE */}
          <div
            className={`p-4 rounded-xl border space-y-2.5 ${
              !isChargingRequired
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : decision === 'UNSAFE_ACTION_REQUIRED'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-base">
              {!isChargingRequired ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>🟢 NO CHARGING REQUIRED</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>{decisionTitle || '🟡 CHARGING REQUIRED'}</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold leading-relaxed italic">
              "{decisionText}"
            </p>

            <div className="text-[11px] font-semibold text-slate-700 pt-2 border-t border-slate-200/80 flex flex-wrap gap-x-4 gap-y-1">
              <span>• Safety Reserve Reason: {reserveReason || 'Normal driving conditions applied.'}</span>
              {isChargingRequired && (
                <span className="text-rose-700 font-bold">
                  • Shortfall: {shortfallKm || Math.max(0, route.distanceKm - safeReachableRangeKm)} km (~{kwhNeeded} kWh top-up required)
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* CHARGER RECOMMENDATION VS DIRECT ROUTE */}
        <Card variant="solid" className="p-5 space-y-3 bg-white border-slate-200 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Charger Recommendation Engine
              </h3>
            </div>
            <Badge variant={isChargingRequired ? 'warning' : 'success'}>
              {isChargingRequired ? 'Charging Recommended' : 'Direct Route'}
            </Badge>
          </div>

          {isChargingRequired ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Recommended Primary Fast Charger
                  </span>
                  <h4 className="text-base font-black text-slate-900">{primaryCharger.name}</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {primaryCharger.locationName} ({primaryCharger.distanceKm} km) • {primaryCharger.chargingSpeed} kW ({primaryCharger.connector})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/backup-charger')}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    View Backup Plan
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Backup Charger ({backupCharger.name}) Failover Reachability:</span>
                </span>
                <span className={`font-black ${backupAnalysis.isBackupReachable ? 'text-emerald-700' : 'text-red-700'}`}>
                  {backupAnalysis.statusText} ({backupAnalysis.backupArrivalSOCIfPrimaryFails}% Failover SOC)
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">No Charging Required for this Trip</h4>
                  <p className="text-xs text-slate-700 font-medium">
                    Your safe reachable range ({safeReachableRangeKm} km) easily covers the {route.distanceKm} km route while preserving your {reservePercent}% safety reserve.
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/chargers')}
                leftIcon={<Sparkles className="w-4 h-4 text-emerald-600" />}
                className="shrink-0"
              >
                Browse Chargers Anyway
              </Button>
            </div>
          )}
        </Card>

        {/* MAIN 2-COLUMN DISPLAY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDE: ROUTE MAP & DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            <Card variant="solid" className="relative overflow-hidden p-5 bg-white border-slate-200 space-y-4 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">ROUTE MAP</h3>
                    <p className="text-xs font-bold text-slate-900">{route.origin} → {route.destination}</p>
                  </div>
                </div>
                <Badge variant="info">{route.travelTimeText}</Badge>
              </div>

              {/* Map SVG container */}
              <div className="relative w-full h-64 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #CBD5E1 1px, transparent 1px), linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <path
                    d="M 50,140 C 150,160 220,50 320,110 L 450,60"
                    stroke="#16A34A"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 50,140 C 150,160 220,50 320,110 L 450,60"
                    stroke="#22C55E"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                </svg>

                <div className="absolute left-[10%] bottom-[25%] flex flex-col items-center z-10">
                  <div className="p-1.5 rounded-full bg-[#16A34A] text-white shadow-sm">
                    <Navigation className="w-4 h-4 fill-white" />
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {route.origin} (Start)
                  </span>
                </div>

                {route.stops && route.stops.length > 0 && (
                  <div className="absolute left-[58%] top-[30%] flex flex-col items-center z-10">
                    <div className="p-1.5 rounded-full bg-blue-600 text-white shadow-sm">
                      <Zap className="w-4 h-4 fill-white" />
                    </div>
                    <span className="mt-1 text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {route.stops[0]}
                    </span>
                  </div>
                )}

                <div className="absolute right-[8%] top-[20%] flex flex-col items-center z-10">
                  <div className="p-1.5 rounded-full bg-blue-600 text-white shadow-sm">
                    <Navigation className="w-4 h-4 fill-white" />
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {route.destination} (End)
                  </span>
                </div>
              </div>
            </Card>

            {/* Condition Impact Breakdown */}
            <Card variant="solid" className="space-y-3 bg-white border-slate-200 shadow-sm rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Environmental Condition Impact Breakdown</span>
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Traffic Impact</span>
                  <div className="text-sm font-black text-amber-700">
                    {trafficImpactPercent > 0 ? `-${trafficImpactPercent}%` : '0% (Normal)'}
                  </div>
                  <span className="text-[10px] text-slate-600 capitalize font-medium">{conditions.traffic} flow</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Weather Impact</span>
                  <div className="text-sm font-black text-blue-700">
                    {weatherImpactPercent > 0 ? `-${weatherImpactPercent}%` : '0% (Normal)'}
                  </div>
                  <span className="text-[10px] text-slate-600 capitalize font-medium">{conditions.weather} weather</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Road Impact</span>
                  <div className="text-sm font-black text-red-700">
                    {roadImpactPercent > 0 ? `-${roadImpactPercent}%` : '0% (Good)'}
                  </div>
                  <span className="text-[10px] text-slate-600 capitalize font-medium">{conditions.road} condition</span>
                </div>
              </div>
            </Card>

            {/* Range Uncertainty Breakdown */}
            <Card variant="solid" className="space-y-3 bg-white border-slate-200 shadow-sm rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Dynamic Range Uncertainty Model</span>
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-center space-y-1">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Best Case</span>
                  <div className="text-xl font-black text-slate-900">{rangeUncertainty.bestCaseKm} km</div>
                  <span className="text-[10px] text-slate-600 block font-medium">Ideal conditions</span>
                </div>

                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-center space-y-1">
                  <span className="text-[10px] text-blue-800 font-bold uppercase block">Expected</span>
                  <div className="text-xl font-black text-slate-900">{rangeUncertainty.expectedKm} km</div>
                  <span className="text-[10px] text-slate-600 block font-medium">Active environmental model</span>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-center space-y-1">
                  <span className="text-[10px] text-amber-800 font-bold uppercase block">Conservative</span>
                  <div className="text-xl font-black text-slate-900">{rangeUncertainty.conservativeKm} km</div>
                  <span className="text-[10px] text-slate-600 block font-medium">Severe headwinds</span>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE: SUMMARY */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="solid" className="space-y-4 bg-white border-slate-200 shadow-sm rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Metrics Summary</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-medium">Total Distance</span>
                  <span className="font-bold text-slate-900">{route.distanceKm} km</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-medium">Base Energy Required</span>
                  <span className="font-bold text-blue-700">{baseEnergyRequiredKwh} kWh</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-medium">Adjusted Energy Required</span>
                  <span className="font-bold text-amber-700">{adjustedEnergyRequiredKwh} kWh</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-medium">Starting SOC</span>
                  <span className="font-bold text-slate-900">{startingSOC}% ({availableEnergyKwh} kWh)</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-medium">Expected Arrival SOC</span>
                  <span className={`font-black ${arrivalSOC > 15 ? 'text-emerald-700' : arrivalSOC > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                    {arrivalSOC}%
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-medium">Required Safety Reserve</span>
                  <span className="font-bold text-emerald-700">{reservePercent}% ({reserveEnergyKwh} kWh)</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{vehicleSnapshot.brand} {vehicleSnapshot.model}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{vehicleSnapshot.batteryCapacity} kWh • {vehicleSnapshot.efficiency} Wh/km</span>
                  </div>
                </div>
                <Badge variant="success">Active EV</Badge>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={() => navigate('/live-journey')}
                  rightIcon={<Navigation className="w-4 h-4" />}
                >
                  Start Live Journey
                </Button>

                <Button
                  variant="secondary"
                  fullWidth
                  size="md"
                  onClick={() => navigate('/plan-trip')}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Modify Parameters
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
