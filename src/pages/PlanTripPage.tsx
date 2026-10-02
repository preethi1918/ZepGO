import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Plus,
  Compass,
  Clock,
  Zap,
  Sliders,
  CloudSun,
  Car,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { storage } from '../utils/storage';
import { findRoute } from '../data/mockRoutes';
import { calculateTripPlan } from '../utils/batteryEngine';
import type {
  TripPreference,
  TrafficCondition,
  WeatherCondition,
  RoadCondition,
  Vehicle
} from '../types';

export const PlanTripPage: React.FC = () => {
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle>(() => storage.getVehicleData());

  const [from, setFrom] = useState('Chennai');
  const [to, setTo] = useState('Coimbatore');
  const [optionalStop, setOptionalStop] = useState('');
  const [showStopInput, setShowStopInput] = useState(false);
  const [departureTime, setDepartureTime] = useState('08:00 AM');

  const [preference, setPreference] = useState<TripPreference>('Fastest');

  const [traffic, setTraffic] = useState<TrafficCondition>('normal');
  const [weather, setWeather] = useState<WeatherCondition>('normal');
  const [road, setRoad] = useState<RoadCondition>('good');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVehicle(storage.getVehicleData());
  }, []);

  const routeData = findRoute(from, to, optionalStop);
  const livePlan = calculateTripPlan(
    routeData,
    preference,
    { traffic, weather, road },
    departureTime,
    vehicle
  );

  const preferencesList: { label: TripPreference; desc: string; icon: React.ReactNode }[] = [
    { label: 'Fastest', desc: 'Prioritizes shortest travel time', icon: <Zap className="w-4 h-4 text-emerald-600" /> },
    { label: 'Energy Efficient', desc: 'Minimizes Wh/km consumption', icon: <Sparkles className="w-4 h-4 text-blue-600" /> },
    { label: 'Avoid Tolls', desc: 'Bypasses toll roads when available', icon: <Car className="w-4 h-4 text-amber-600" /> },
    { label: 'Maximum Safety Margin', desc: 'Enforces high battery buffer', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!from.trim() || !to.trim()) {
      setError('Please enter both origin and destination locations.');
      return;
    }

    setError(null);

    const calculatedResult = calculateTripPlan(
      routeData,
      preference,
      { traffic, weather, road },
      departureTime,
      vehicle
    );

    try {
      localStorage.setItem('zepgo_active_trip', JSON.stringify(calculatedResult));
    } catch (err) {
      console.error('Failed to save active trip calculation', err);
    }

    navigate('/route-result');
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Compass className="w-3.5 h-3.5" />}>
                EcoTech Journey Planner
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/plan-trip</span>
            </div>
            <PageTitle gradient>Plan Your Journey</PageTitle>
            <PageSubtitle>
              Calculate real-time battery consumption, safety buffers, and charging recommendations.
            </PageSubtitle>
          </div>

          <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <Car className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col text-right">
              <span className="text-[11px] font-extrabold text-slate-900">{vehicle.brand} {vehicle.model}</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">SOC: {vehicle.soc}% ({vehicle.batteryCapacity} kWh)</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Fields & Preferences */}
          <div className="lg:col-span-7 space-y-6">
            <Card variant="solid" className="space-y-4 bg-white border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>1. Route Parameters</span>
              </h3>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="origin-input" className="text-xs font-bold text-slate-700 block">From (Origin)</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-emerald-600 transition-colors">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      id="origin-input"
                      type="text"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-900 w-full outline-none"
                      placeholder="e.g. Chennai"
                      required
                    />
                  </div>
                </div>

                {showStopInput ? (
                  <div className="space-y-1 animate-in fade-in duration-200">
                    <label htmlFor="stop-input" className="text-xs font-bold text-slate-700 block">Optional Stop</label>
                    <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-blue-600 transition-colors">
                      <Plus className="w-4 h-4 text-blue-600 shrink-0" />
                      <input
                        id="stop-input"
                        type="text"
                        value={optionalStop}
                        onChange={(e) => setOptionalStop(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-900 w-full outline-none"
                        placeholder="e.g. Salem Charging Station"
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowStopInput(true)}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span>Add Optional Stopping Area</span>
                  </button>
                )}

                <div className="space-y-1">
                  <label htmlFor="destination-input" className="text-xs font-bold text-slate-700 block">To (Destination)</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-blue-600 transition-colors">
                    <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                    <input
                      id="destination-input"
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-900 w-full outline-none"
                      placeholder="e.g. Coimbatore"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <label htmlFor="time-input" className="text-xs font-bold text-slate-700 block">Departure Time</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:border-emerald-600 transition-colors">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      id="time-input"
                      type="text"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-900 w-full outline-none"
                      placeholder="e.g. 08:00 AM"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="solid" className="space-y-4 bg-white border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>2. Trip Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {preferencesList.map((pref) => {
                  const isSelected = preference === pref.label;
                  return (
                    <button
                      key={pref.label}
                      type="button"
                      onClick={() => setPreference(pref.label)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-xs font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{pref.label}</span>
                        {pref.icon}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight">{pref.desc}</p>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card variant="solid" className="space-y-4 bg-white border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
                <CloudSun className="w-4 h-4 text-amber-600" />
                <span>3. Live Environmental Conditions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Traffic Level</label>
                  <select
                    value={traffic}
                    onChange={(e) => setTraffic(e.target.value as TrafficCondition)}
                    className="w-full bg-slate-50 text-xs font-bold text-slate-900 p-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-600"
                  >
                    <option value="normal">Normal (0%)</option>
                    <option value="moderate">Moderate (+5%)</option>
                    <option value="heavy">Heavy (+10%)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Weather Condition</label>
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value as WeatherCondition)}
                    className="w-full bg-slate-50 text-xs font-bold text-slate-900 p-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                  >
                    <option value="normal">Normal (0%)</option>
                    <option value="rain">Rain (+4%)</option>
                    <option value="extreme">Extreme (+8%)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Road Condition</label>
                  <select
                    value={road}
                    onChange={(e) => setRoad(e.target.value as RoadCondition)}
                    className="w-full bg-slate-50 text-xs font-bold text-slate-900 p-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-600"
                  >
                    <option value="good">Good (0%)</option>
                    <option value="congested">Congested (+3%)</option>
                    <option value="poor">Poor (+6%)</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Live Battery Preview */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="glow" className="space-y-4 border-emerald-200 bg-emerald-50/40 sticky top-24">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Calculation Preview
                  </span>
                </div>
                <Badge variant="success">Engine Active</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-bold">Route Distance</span>
                  <span className="text-sm font-black text-slate-900">{livePlan.route.distanceKm} km ({livePlan.route.travelTimeText})</span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-bold">Base Energy Needed</span>
                  <span className="text-sm font-black text-blue-700">{livePlan.baseEnergyRequiredKwh} kWh</span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-bold">Environmental Penalty</span>
                  <span className="text-sm font-black text-amber-700">+{livePlan.trafficImpactPercent + livePlan.weatherImpactPercent + livePlan.roadImpactPercent}% ({livePlan.adjustedEnergyRequiredKwh} kWh total)</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Starting SOC</span>
                    <span className="text-lg font-black text-slate-900">{livePlan.startingSOC}%</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Est. Arrival SOC</span>
                    <span className={`text-lg font-black ${livePlan.arrivalSOC > 15 ? 'text-emerald-700' : livePlan.arrivalSOC > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                      {livePlan.arrivalSOC}%
                    </span>
                  </div>
                </div>

                {/* Decision Preview Banner */}
                <div className={`p-3 rounded-xl border text-xs font-extrabold flex items-center gap-2 ${
                  livePlan.decision === 'NO_CHARGING_REQUIRED'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : livePlan.decision === 'CHARGING_RECOMMENDED'
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    {livePlan.decision === 'NO_CHARGING_REQUIRED' && '🟢 NO CHARGING REQUIRED'}
                    {livePlan.decision === 'CHARGING_RECOMMENDED' && '🟠 CHARGING RECOMMENDED'}
                    {livePlan.decision === 'UNSAFE_ACTION_REQUIRED' && '🔴 UNSAFE — ACTION REQUIRED'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-1 font-medium">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Calculated using active vehicle data ({vehicle.batteryCapacity} kWh battery, {vehicle.efficiency} Wh/km efficiency).</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mt-2"
              >
                Plan Journey Now
              </Button>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
