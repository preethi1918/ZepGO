import React, { useState, useEffect } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { RouteMap } from '../components/dashboard/RouteMap';
import { FeatureCard } from '../components/dashboard/FeatureCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  MapPin, 
  Navigation, 
  Battery, 
  Car, 
  Zap, 
  Compass, 
  ShieldAlert, 
  Plus, 
  Sparkles, 
  RefreshCw, 
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  CloudRain,
  Mountain
} from 'lucide-react';
import { storage } from '../utils/storage';
import { findRoute } from '../data/mockRoutes';
import { calculateDynamicJourneyDecision, calculateTripPlan } from '../utils/batteryEngine';
import type { DynamicDecisionResult } from '../utils/batteryEngine';
import type { RoadCondition, TrafficCondition, WeatherCondition } from '../types';

export const HomePage: React.FC = () => {
  // UX Workflow State: false = Trip Planning Input screen, true = Journey Results & Live Map screen
  const [hasPlannedJourney, setHasPlannedJourney] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Form Inputs
  const [origin, setOrigin] = useState<string>('Chennai');
  const [destination, setDestination] = useState<string>('Coimbatore');
  const [destinationDistanceKm, setDestinationDistanceKm] = useState<number>(180);
  const [batterySoc, setBatterySoc] = useState<number>(72);
  const [vehicleModel, setVehicleModel] = useState<string>('Tata Nexon EV');
  const [batteryCapacity, setBatteryCapacity] = useState<number>(40.5);
  const [baseEfficiency, setBaseEfficiency] = useState<number>(155);
  const [connectorType, setConnectorType] = useState<string>('CCS2');
  const [viaStop, setViaStop] = useState<string>('');

  // Environmental Condition Selectors
  const [trafficCondition, setTrafficCondition] = useState<TrafficCondition>('heavy');
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('clear');
  const [roadCondition, setRoadCondition] = useState<RoadCondition>('good');

  useEffect(() => {
    const v = storage.getVehicleData();
    if (v.model) setVehicleModel(v.model);
    if (v.batteryCapacity) setBatteryCapacity(v.batteryCapacity);
    if (v.soc) setBatterySoc(v.soc);
    if (v.connectorType) setConnectorType(v.connectorType);
    if (v.efficiency) setBaseEfficiency(v.efficiency);
  }, []);

  // Calculate Dynamic Decision live on every parameter change
  const dynamicResult: DynamicDecisionResult = calculateDynamicJourneyDecision(
    batteryCapacity,
    batterySoc,
    destinationDistanceKm,
    baseEfficiency,
    trafficCondition,
    weatherCondition,
    roadCondition
  );

  // Quick Action: Autofill current location
  const handleUseCurrentLocation = () => {
    setOrigin('Chennai Central, TN');
  };

  // Submit Handler: Process Trip Planning Input -> Journey Results
  const handlePlanJourney = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    const activeRoute = findRoute(origin, destination, viaStop);
    const updatedRoute = { ...activeRoute, distanceKm: destinationDistanceKm };
    const tripResult = calculateTripPlan(
      updatedRoute,
      'Fastest',
      { traffic: trafficCondition, weather: weatherCondition, road: roadCondition },
      '08:00 AM',
      {
        id: 'user_veh',
        brand: vehicleModel.split(' ')[0] || 'Tata',
        model: vehicleModel,
        soc: batterySoc,
        batteryCapacity,
        efficiency: baseEfficiency,
        connectorType,
        maxChargingSpeed: 150,
        status: 'Active',
        currentLocation: origin,
        vehicleStatus: 'Normal'
      }
    );

    try {
      localStorage.setItem('zepgo_active_trip', JSON.stringify(tripResult));
    } catch (err) {
      console.error('Failed to save trip result', err);
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      setHasPlannedJourney(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  // Quick Demo Scenario Preset Loaders
  const loadScenario = (scenario: number) => {
    switch (scenario) {
      case 1:
        // Scenario 1 — High Battery (90% SOC, 100 km) -> No Charging Required
        setOrigin('Chennai');
        setDestination('Kanchipuram');
        setDestinationDistanceKm(100);
        setBatterySoc(90);
        setTrafficCondition('normal');
        setWeatherCondition('clear');
        setRoadCondition('good');
        break;
      case 2:
        // Scenario 2 — Medium Battery (55% SOC, 180 km) -> Charging Required
        setOrigin('Chennai');
        setDestination('Vellore');
        setDestinationDistanceKm(180);
        setBatterySoc(55);
        setTrafficCondition('heavy');
        setWeatherCondition('clear');
        setRoadCondition('good');
        break;
      case 3:
        // Scenario 3 — Low Battery (25% SOC, 150 km) -> Charging Required (Critical)
        setOrigin('Chennai');
        setDestination('Tirupati');
        setDestinationDistanceKm(150);
        setBatterySoc(25);
        setTrafficCondition('heavy');
        setWeatherCondition('rain');
        setRoadCondition('good');
        break;
      case 4:
        // Scenario 4 — Short Trip (30% SOC, 25 km) -> No Charging Required
        setOrigin('Chennai');
        setDestination('Tambaram');
        setDestinationDistanceKm(25);
        setBatterySoc(30);
        setTrafficCondition('normal');
        setWeatherCondition('clear');
        setRoadCondition('good');
        break;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto py-2">
        {/* ========================================================================= */}
        {/* STEP 1: INITIAL SCREEN — TRIP PLANNING INPUT (When hasPlannedJourney === false) */}
        {/* ========================================================================= */}
        {!hasPlannedJourney ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* HERO HEADER */}
            <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>ZepGO Dynamic EV Range & Charging Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Plan Your EV Journey
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Real-time dynamic calculation: Battery Energy $\to$ Realistic Consumption $\to$ Dynamic Safety Reserve $\to$ Charging Decision.
              </p>
            </div>

            {/* REALISTIC DEMO SCENARIO PRESETS */}
            <div className="max-w-3xl mx-auto p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  ⚡ Realistic Demo Scenarios (Click to test dynamic range logic)
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">40.5 kWh / ~6 km/kWh</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => loadScenario(1)}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-left font-bold transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-emerald-700 font-extrabold">SCENARIO 1</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="block text-xs font-extrabold">High Battery</span>
                  <span className="block text-[10px] text-slate-600 font-medium">90% SOC • 100 km</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadScenario(2)}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-left font-bold transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-amber-700 font-extrabold">SCENARIO 2</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  </div>
                  <span className="block text-xs font-extrabold">Medium Battery</span>
                  <span className="block text-[10px] text-slate-600 font-medium">55% SOC • 180 km</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadScenario(3)}
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-left font-bold transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-rose-700 font-extrabold">SCENARIO 3</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  </div>
                  <span className="block text-xs font-extrabold">Low Battery</span>
                  <span className="block text-[10px] text-slate-600 font-medium">25% SOC • 150 km</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadScenario(4)}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-left font-bold transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-emerald-700 font-extrabold">SCENARIO 4</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="block text-xs font-extrabold">Short Trip</span>
                  <span className="block text-[10px] text-slate-600 font-medium">30% SOC • 25 km</span>
                </button>
              </div>
            </div>

            {/* MAIN TRIP PLANNER INPUT FORM */}
            <Card variant="solid" className="max-w-3xl mx-auto p-6 sm:p-8 bg-white border-slate-200 shadow-sm space-y-6 rounded-2xl">
              <form onSubmit={handlePlanJourney} className="space-y-6">
                
                {/* 1. CURRENT LOCATION */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="origin-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>1. Current Location</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Use Current Location</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="origin-input"
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Enter current location (e.g. Chennai)"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                      required
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* 2. DESTINATION & DISTANCE */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8 space-y-2">
                    <label htmlFor="destination-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span>2. Destination</span>
                    </label>

                    <div className="relative">
                      <input
                        id="destination-input"
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Where are you going? (e.g. Coimbatore)"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                        required
                      />
                      <Navigation className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div className="sm:col-span-4 space-y-2">
                    <label htmlFor="distance-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Distance (km)
                    </label>
                    <input
                      id="distance-input"
                      type="number"
                      min="5"
                      max="1000"
                      value={destinationDistanceKm}
                      onChange={(e) => setDestinationDistanceKm(Number(e.target.value))}
                      className="w-full py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {/* 3. BATTERY PERCENTAGE */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label htmlFor="battery-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Battery className="w-4 h-4 text-emerald-600" />
                      <span>3. Current Battery Level</span>
                    </label>
                    <span className="text-sm font-black text-emerald-700 font-mono bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                      {batterySoc}% SOC ({dynamicResult.batteryEnergyKwh} kWh)
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <input
                      id="battery-slider"
                      type="range"
                      min="5"
                      max="100"
                      step="1"
                      value={batterySoc}
                      onChange={(e) => setBatterySoc(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                      <span>0% (Empty)</span>
                      <span>50%</span>
                      <span>100% (Full Charge)</span>
                    </div>
                  </div>
                </div>

                {/* 4. VEHICLE DETAILS */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <span>4. Vehicle Details & Efficiency</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="vehicle-model-select" className="text-[11px] font-semibold text-slate-500 block">Vehicle Model</label>
                      <select
                        id="vehicle-model-select"
                        value={vehicleModel}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVehicleModel(val);
                          if (val === 'Tata Nexon EV') {
                            setBatteryCapacity(40.5);
                            setBaseEfficiency(155);
                          } else if (val === 'MG ZS EV') {
                            setBatteryCapacity(50.3);
                            setBaseEfficiency(160);
                          } else if (val === 'Mahindra XUV400') {
                            setBatteryCapacity(39.4);
                            setBaseEfficiency(152);
                          } else if (val === 'Hyundai Kona Electric') {
                            setBatteryCapacity(39.2);
                            setBaseEfficiency(147);
                          }
                        }}
                        className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                      >
                        <option value="Tata Nexon EV">Tata Nexon EV (40.5 kWh)</option>
                        <option value="MG ZS EV">MG ZS EV (50.3 kWh)</option>
                        <option value="Mahindra XUV400">Mahindra XUV400 (39.4 kWh)</option>
                        <option value="Hyundai Kona Electric">Hyundai Kona Electric (39.2 kWh)</option>
                        <option value="Custom EV">Custom EV</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="battery-capacity-val" className="text-[11px] font-semibold text-slate-500 block">Usable Battery (kWh)</label>
                      <input
                        id="battery-capacity-val"
                        type="number"
                        step="0.1"
                        value={batteryCapacity}
                        onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                        className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-blue-700 outline-none focus:border-emerald-500 focus:bg-white"
                        placeholder="40.5 kWh"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="connector-type-val" className="text-[11px] font-semibold text-slate-500 block">Charging Port</label>
                      <select
                        id="connector-type-val"
                        value={connectorType}
                        onChange={(e) => setConnectorType(e.target.value)}
                        className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                      >
                        <option value="CCS2">CCS2 Fast Charge</option>
                        <option value="Type 2">Type 2 AC</option>
                        <option value="GB/T">GB/T</option>
                        <option value="CHAdeMO">CHAdeMO</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ENVIRONMENTAL PENALTIES & DYNAMIC RESERVE IMPACT */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-600" />
                    <span>5. Environmental Impact & Dynamic Safety Reserve</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="space-y-1">
                      <label htmlFor="traffic-select" className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                        <span>Traffic Level</span>
                      </label>
                      <select
                        id="traffic-select"
                        value={trafficCondition}
                        onChange={(e) => setTrafficCondition(e.target.value as any)}
                        className="w-full bg-white p-2 rounded-lg border border-slate-200 font-bold text-slate-800 text-xs"
                      >
                        <option value="normal">Normal Flow (0% penalty - 15% reserve)</option>
                        <option value="moderate">Moderate Flow (+5% penalty - 15% reserve)</option>
                        <option value="heavy">Heavy Traffic (+10% penalty — 18% reserve)</option>
                        <option value="congested">Severe Congestion (+15% penalty — 20% reserve)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="weather-select" className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                        <span>Weather Condition</span>
                      </label>
                      <select
                        id="weather-select"
                        value={weatherCondition}
                        onChange={(e) => setWeatherCondition(e.target.value as any)}
                        className="w-full bg-white p-2 rounded-lg border border-slate-200 font-bold text-slate-800 text-xs"
                      >
                        <option value="clear">Clear Weather (0% penalty - 15% reserve)</option>
                        <option value="rain">Heavy Rain (+8% penalty — 18% reserve)</option>
                        <option value="extreme">Storm / Extreme (+15% penalty — 20% reserve)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="road-select" className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Mountain className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Road Elevation</span>
                      </label>
                      <select
                        id="road-select"
                        value={roadCondition}
                        onChange={(e) => setRoadCondition(e.target.value as any)}
                        className="w-full bg-white p-2 rounded-lg border border-slate-200 font-bold text-slate-800 text-xs"
                      >
                        <option value="good">Flat / Highway (0% penalty)</option>
                        <option value="congested">Moderate Incline (+3% penalty)</option>
                        <option value="poor">Hilly / Steep Elevation (+6% penalty — 20% reserve)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 6. OPTIONAL STOP */}
                <div className="space-y-2">
                  <label htmlFor="via-stop-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>6. Add Stop (Optional)</span>
                  </label>

                  <div className="relative">
                    <input
                      id="via-stop-input"
                      type="text"
                      value={viaStop}
                      onChange={(e) => setViaStop(e.target.value)}
                      placeholder="Enter intermediate stop (e.g. Salem)"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                    <Plus className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* DYNAMIC CALCULATION LIVE PREVIEW BANNER */}
                <div className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                  dynamicResult.isChargingRequired
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center justify-between font-extrabold text-sm border-b border-slate-200/60 pb-2">
                    <span className="flex items-center gap-2">
                      {dynamicResult.isChargingRequired ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>Live Range & Charging Assessment Preview</span>
                    </span>
                    <Badge variant={dynamicResult.isChargingRequired ? 'warning' : 'success'}>
                      {dynamicResult.decisionTitle}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-bold">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Battery Energy</span>
                      <span className="text-slate-900">{dynamicResult.batteryEnergyKwh} kWh</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Predicted Range</span>
                      <span className="text-blue-700">{dynamicResult.realisticRangeKm} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Safety Reserve</span>
                      <span className="text-amber-700">{dynamicResult.reservePercent}% ({dynamicResult.reservePercent === 15 ? 'Normal' : dynamicResult.reservePercent === 18 ? 'Heavy' : 'High-risk'})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Safe Reachable</span>
                      <span className="text-emerald-700">{dynamicResult.safeReachableRangeKm} km</span>
                    </div>
                  </div>

                  <p className="text-[11px] italic pt-1 font-medium border-t border-slate-200/40">
                    "{dynamicResult.decisionText}"
                  </p>
                </div>

                {/* MAIN PROMINENT GREEN ACTION BUTTON */}
                <div className="pt-2 text-center space-y-2">
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full py-4 px-8 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-base font-extrabold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-75"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Evaluating Realistic Energy & Charging Decision...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-white" />
                        <span>Plan My EV Journey</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 font-medium">
                    Calculated dynamically using Battery Energy $\to$ Consumption Penalties $\to$ Dynamic Reserve $\to$ Safe Range.
                  </p>
                </div>

              </form>
            </Card>
          </div>
        ) : (
          /* ========================================================================= */
          /* STEP 2-5: AFTER SUBMITTING — JOURNEY ANALYSIS & DYNAMIC CHARGING RESULT */
          /* ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* TOP BAR: ACTIVE JOURNEY SUMMARY & RESET BUTTON */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-xl border border-emerald-200 text-emerald-700">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={dynamicResult.isChargingRequired ? 'warning' : 'success'}>
                      {dynamicResult.decisionTitle}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">/{origin || 'Chennai'} → {destination || 'Coimbatore'} ({destinationDistanceKm} km)</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900">
                    {origin || 'Chennai Central'} → {destination || 'Coimbatore Junction'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {vehicleModel} ({batteryCapacity} kWh) • Starting SOC: {batterySoc}% ({dynamicResult.batteryEnergyKwh} kWh)
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setHasPlannedJourney(false)}
                leftIcon={<Sliders className="w-4 h-4" />}
              >
                Modify Trip Inputs
              </Button>
            </div>

            {/* REALISTIC UI RESULT: JOURNEY ANALYSIS CARD */}
            <Card variant="solid" className="p-6 bg-white border-slate-200 shadow-sm space-y-5 rounded-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">DYNAMIC ENERGY & RANGE ANALYSIS</span>
                    <h3 className="text-lg font-black text-slate-900">Journey Analysis</h3>
                  </div>
                </div>
                <Badge variant={dynamicResult.isChargingRequired ? 'warning' : 'success'}>
                  {dynamicResult.decisionTitle}
                </Badge>
              </div>

              {/* 5 KEY CALCULATION METRICS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Current Battery</span>
                  <div className="text-2xl font-black text-slate-900">{batterySoc}%</div>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">{dynamicResult.batteryEnergyKwh} kWh Available</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Destination Distance</span>
                  <div className="text-2xl font-black text-slate-900">{destinationDistanceKm} km</div>
                  <span className="text-[10px] text-slate-500 font-semibold">Route Total</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Predicted Realistic Range</span>
                  <div className="text-2xl font-black text-blue-700">{dynamicResult.realisticRangeKm} km</div>
                  <span className="text-[10px] text-slate-500 font-semibold">{dynamicResult.adjustedEfficiencyWhPerKm} Wh/km eff</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Safety Reserve</span>
                  <div className="text-2xl font-black text-amber-700">{dynamicResult.reservePercent}%</div>
                  <span className="text-[10px] text-slate-500 font-semibold">Dynamic Buffer</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Safe Reachable Range</span>
                  <div className="text-2xl font-black text-emerald-700">{dynamicResult.safeReachableRangeKm} km</div>
                  <span className="text-[10px] text-slate-500 font-semibold">After {dynamicResult.reservePercent}% Reserve</span>
                </div>
              </div>

              {/* DECISION BANNER & REASONING QUOTE */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${
                !dynamicResult.isChargingRequired
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : dynamicResult.decisionStatus === 'CRITICAL_CHARGING_REQUIRED'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center gap-2 font-black text-base">
                  {!dynamicResult.isChargingRequired ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>🟢 NO CHARGING REQUIRED</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span>{dynamicResult.decisionTitle}</span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold leading-relaxed italic">
                  "{dynamicResult.decisionText}"
                </p>

                <div className="text-[11px] font-semibold text-slate-700 pt-2 border-t border-slate-200/80 flex flex-wrap gap-x-4 gap-y-1">
                  <span>• Safety Reserve Reason: {dynamicResult.reserveReason}</span>
                  {dynamicResult.isChargingRequired && (
                    <span className="text-rose-700 font-bold">
                      • Shortfall: {dynamicResult.shortfallKm} km (~{dynamicResult.kwhNeeded} kWh top-up required)
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* LIVE ROUTE MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-12 flex flex-col">
                <RouteMap />
              </div>
            </div>

            {/* CHARGER RECOMMENDATIONS (RECOMMENDED CHARGER A & BACKUP CHARGER B) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  <span>Charger Intelligence & Recommendations</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">CCS2 Compatible • Real-time Status</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* RECOMMENDED CHARGER A */}
                <Card variant="solid" className="p-5 space-y-4 bg-white border-emerald-300 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">RECOMMENDED PRIMARY CHARGER</span>
                        <h4 className="text-base font-bold text-slate-900">Tata Power 250kW Hypercharger (Charger A)</h4>
                      </div>
                    </div>
                    <Badge variant="success">Low Risk</Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Distance</span>
                      <span className="font-extrabold text-slate-900">42 km away</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Ports</span>
                      <span className="font-extrabold text-emerald-700">3 / 4 Free</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Est. Wait</span>
                      <span className="font-extrabold text-emerald-700">10 min</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Compatibility</span>
                      <span className="font-extrabold text-emerald-700">Compatible</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Fastest CCS2 hypercharger on route with attached Green Leaf Café & EV Lounge. Fully compatible with {vehicleModel}.
                  </p>
                </Card>

                {/* BACKUP CHARGER B */}
                <Card variant="solid" className="p-5 space-y-4 bg-white border-blue-300 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">FAILOVER BACKUP CHARGER</span>
                        <h4 className="text-base font-bold text-slate-900">Zeon Charging 150kW Hub (Charger B)</h4>
                      </div>
                    </div>
                    <Badge variant="info">Low Risk</Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Distance</span>
                      <span className="font-extrabold text-blue-700">51 km away</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Ports</span>
                      <span className="font-extrabold text-slate-900">4 / 4 Free</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Est. Wait</span>
                      <span className="font-extrabold text-emerald-700">0 min</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Reliability</span>
                      <span className="font-extrabold text-emerald-700">99.4%</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Secondary failover option available if Charger A becomes occupied or suffers unexpected downtime.
                  </p>
                </Card>
              </div>
            </div>

            {/* 11 CORE FEATURE CARDS */}
            <FeatureCard />
          </div>
        )}
      </div>
    </AppLayout>
  );
};
