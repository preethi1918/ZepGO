import React from 'react';
import { BatteryCharging, Zap, MapPin, Navigation, Sparkles, ShieldCheck, Leaf, DollarSign, ArrowRight, Clock, Star, AlertTriangle, ShieldAlert, CheckCircle2, TrendingUp, ChevronRight } from 'lucide-react';
import { EVModel, ChargingStation, TripAnalysisResult, UserProfile } from '../types';
import { RangeAnxietyMeter } from './RangeAnxietyMeter';

interface DashboardProps {
  user: UserProfile | null;
  evModel: EVModel;
  stations: ChargingStation[];
  currentBattery: number;
  setCurrentBattery: (val: number) => void;
  lastAnalysis: TripAnalysisResult | null;
  onNavigateTab: (tab: string) => void;
  onSelectStation: (station: ChargingStation) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  evModel,
  stations,
  currentBattery,
  setCurrentBattery,
  lastAnalysis,
  onNavigateTab,
  onSelectStation
}) => {
  // Estimated range in km based on battery %
  const estimatedRangeKm = Math.round((currentBattery / 100) * evModel.rangeKm);
  const batteryHealth = 98; // 98% Health SOH

  // Quick battery status styling
  const getBatteryBadge = (level: number) => {
    if (level > 70) return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Optimal' };
    if (level > 35) return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Moderate' };
    return { bg: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Charge Soon' };
  };

  const badge = getBatteryBadge(currentBattery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="text-sky-600">{user?.name || 'EV Driver'}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Your {evModel.name} is connected. ZepGo is actively monitoring route battery demand.
          </p>
        </div>

        {/* Quick CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('planner')}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span>Launch Pre-Trip Planner</span>
          </button>
          <button
            onClick={() => onNavigateTab('map')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Live Map</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Battery & Range */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Battery</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.bg}`}>
              {badge.label}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{currentBattery}%</span>
            <span className="text-xs font-extrabold text-sky-600">~{estimatedRangeKm} km range</span>
          </div>

          <div className="mt-3 w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                currentBattery > 60 ? 'bg-emerald-500' : currentBattery > 35 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${currentBattery}%` }}
            ></div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Battery Health: {batteryHealth}% SOH</span>
            <span>Capacity: {evModel.usableCapacityKwh} kWh</span>
          </div>
        </div>

        {/* Card 2: Range Anxiety Index */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Range Confidence</span>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
              AI Monitored
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {lastAnalysis ? lastAnalysis.rangeConfidenceScore : 88}%
            </span>
            <span className="text-xs font-extrabold text-emerald-600">Low Risk</span>
          </div>

          <p className="mt-2 text-xs text-slate-500 line-clamp-1">
            {lastAnalysis?.preTripChargingRequired
              ? '⚠️ Charging recommended before long trip'
              : '✅ Safe range buffer for local & highway routes'}
          </p>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer" onClick={() => onNavigateTab('planner')}>
            <span>View Pre-Trip Analysis</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Carbon Saved */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Carbon Offset</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Leaf className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{user?.totalCo2SavedKg || 856}</span>
            <span className="text-xs font-extrabold text-slate-500">kg CO2</span>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Equivalent to planting <strong>~42 trees</strong> this year!
          </p>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer" onClick={() => onNavigateTab('analytics')}>
            <span>View Impact Analytics</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Fuel Savings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cost Saved vs Gas</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">${user?.totalMoneySavedDollar || 1140}</span>
            <span className="text-xs font-extrabold text-emerald-600">+62% cheaper</span>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Saved vs equivalent 28 MPG gasoline sedan
          </p>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer" onClick={() => onNavigateTab('analytics')}>
            <span>View Charging History</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Feature Highlight: Pre-Trip Charging Decision Engine Box */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Pre-Trip Prediction</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Planning a trip? Let ZepGo AI check your route.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              ZepGo checks your route distance, vehicle efficiency, weather impact, and mountain elevation to answer: <strong className="text-white">"Can I safely reach my destination without charging?"</strong>
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('planner')}
            className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Run Pre-Trip Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Simulated Active Trip Status */}
        {lastAnalysis ? (
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-sky-300">
              <span>Last Evaluated Route: {lastAnalysis.vehicleDetails.name}</span>
              <span className={lastAnalysis.canReachDestination ? 'text-emerald-400' : 'text-amber-400'}>
                {lastAnalysis.canReachDestination ? '✅ Safe Journey' : '⚠️ Pre-Trip Charging Recommended'}
              </span>
            </div>
            <p className="text-xs text-slate-200">
              Destination: <strong>{lastAnalysis.distanceKm} km</strong> | Required: <strong>{lastAnalysis.requiredKwh} kWh</strong> | Predicted Battery at Arrival: <strong>{lastAnalysis.estimatedBatteryAtDestinationPercent}%</strong>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-sky-300 block">1. Predict Before Starting</span>
              <span className="text-slate-300 text-[11px]">Know if your battery is sufficient before taking off.</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-sky-300 block">2. AI Ranked Stations</span>
              <span className="text-slate-300 text-[11px]">Scored by wait time, speed, price, and compatibility.</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-sky-300 block">3. Dynamic Re-routing</span>
              <span className="text-slate-300 text-[11px]">Auto-redirects if traffic changes or stations fill up.</span>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Fast Charging Stations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-sky-600" />
              Top Fast Charging Stations Near Route
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered for {evModel.brand} connector compatibility and fast charging speed
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('stations')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>View All Stations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stations.slice(0, 3).map((station) => (
            <div
              key={station.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">{station.stationName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {station.locationName}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    {station.rating}
                  </span>
                </div>

                {/* Ports & Speed Pill */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-bold border border-sky-100 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {station.maxSpeedKw} kW Fast
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5" />
                    {station.availablePorts}/{station.totalPorts} Open
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span>Price: <strong className="text-slate-900">${station.pricePerkWh}/kWh</strong></span>
                  <span>Wait: <strong className="text-emerald-600">{station.waitingTimeMins === 0 ? 'No Wait' : `${station.waitingTimeMins}m`}</strong></span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectStation(station);
                  onNavigateTab('map');
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Navigate & Reserve</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
