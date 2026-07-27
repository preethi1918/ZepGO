import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Zap, BatteryCharging, AlertTriangle, RefreshCw, Radio, Layers, CheckCircle2, ShieldAlert, ArrowRight, Clock, Star, Play, Pause, RotateCcw } from 'lucide-react';
import { ChargingStation, EVModel } from '../types';

interface InteractiveMapProps {
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  onSelectStation: (station: ChargingStation) => void;
  evModel: EVModel;
  currentBattery: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  evModel,
  currentBattery
}) => {
  const [activeStation, setActiveStation] = useState<ChargingStation>(selectedStation || stations[0]);
  const [isSimulatingDrive, setIsSimulatingDrive] = useState<boolean>(false);
  const [simulatedProgress, setSimulatedProgress] = useState<number>(0); // 0% to 100% route progress
  const [simulatedBattery, setSimulatedBattery] = useState<number>(currentBattery);
  const [dynamicRerouteAlert, setDynamicRerouteAlert] = useState<string | null>(null);
  const [reroutedStation, setReroutedStation] = useState<ChargingStation | null>(null);

  // Sync prop selection if provided
  useEffect(() => {
    if (selectedStation) {
      setActiveStation(selectedStation);
    }
  }, [selectedStation]);

  // Handle drive simulation progress interval
  useEffect(() => {
    let interval: any;
    if (isSimulatingDrive) {
      interval = setInterval(() => {
        setSimulatedProgress((prev) => {
          if (prev >= 100) {
            setIsSimulatingDrive(false);
            return 100;
          }
          const next = prev + 2;
          // Simulate battery drop along the route
          const drainRate = 0.5;
          setSimulatedBattery((b) => Math.max(2, Math.round(currentBattery - (next * drainRate))));
          return next;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isSimulatingDrive, currentBattery]);

  // Trigger Dynamic Re-routing simulation
  const handleTriggerDynamicReroute = () => {
    // Pick alternative station (e.g. Truckee High-Power Oasis)
    const backup = stations.find(s => s.id === 'sta-4') || stations[1];
    setReroutedStation(backup);
    setActiveStation(backup);
    onSelectStation(backup);

    setDynamicRerouteAlert(`⚡ DYNAMIC RE-ROUTING ALERT: Heavy traffic build-up on Hwy 80 & Sacramento station queue increased to 25 mins. ZepGo AI automatically updated your route to ${backup.stationName} (0 min wait, 350kW Ultra-Fast).`);
  };

  const resetSimulation = () => {
    setIsSimulatingDrive(false);
    setSimulatedProgress(0);
    setSimulatedBattery(currentBattery);
    setDynamicRerouteAlert(null);
    setReroutedStation(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Dynamic Re-routing Banner */}
      {dynamicRerouteAlert && (
        <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 border-2 border-amber-400 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 shrink-0 animate-pulse" />
            <span>{dynamicRerouteAlert}</span>
          </div>
          <button
            onClick={() => setDynamicRerouteAlert(null)}
            className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Simulation Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            <h1 className="text-xl font-extrabold text-slate-900">
              Battery-Aware Navigation & Live Route
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
              Live GPS Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Route: San Francisco ➔ Vallejo ➔ Sacramento ➔ Auburn ➔ Truckee ➔ Lake Tahoe (318 km)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSimulatingDrive(!isSimulatingDrive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              isSimulatingDrive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            {isSimulatingDrive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulatingDrive ? 'Pause Drive' : 'Simulate Drive'}</span>
          </button>

          <button
            onClick={handleTriggerDynamicReroute}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Simulate Traffic & Station Down</span>
          </button>

          <button
            onClick={resetSimulation}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map Visual Canvas & Station Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Custom SVG Interactive Route Map */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white relative min-h-[420px] flex flex-col justify-between overflow-hidden shadow-xl">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          {/* Map Top Status Overlay */}
          <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>ZepGo Live Monitoring Active</span>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-sky-400" />
              <span>Simulated Battery: <strong className="text-sky-300">{simulatedBattery}%</strong></span>
            </div>
          </div>

          {/* Interactive SVG Route Graph */}
          <div className="relative z-10 my-8">
            <svg className="w-full h-48 overflow-visible" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Elevation Mountain Silhouette */}
              <path
                d="M 50 180 Q 200 170 300 160 T 550 120 T 750 60 L 750 180 Z"
                fill="rgba(56, 189, 248, 0.05)"
                stroke="none"
              />

              {/* Main Route Line */}
              <path
                d="M 60 160 C 200 150, 350 130, 500 90 C 620 60, 700 50, 740 50"
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Route Progress Marker (Animated Vehicle) */}
              <circle
                cx={60 + (simulatedProgress / 100) * 680}
                cy={160 - (simulatedProgress / 100) * 110}
                r="10"
                fill="#38bdf8"
                className="animate-pulse shadow-lg"
              />

              {/* Start Pin */}
              <g transform="translate(60, 160)">
                <circle r="6" fill="#38bdf8" />
                <text x="0" y="24" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">San Francisco</text>
              </g>

              {/* Station Pins Along Route */}
              {stations.map((sta, i) => {
                const cx = 130 + i * 140;
                const cy = 150 - i * 22;
                const isSelected = activeStation.id === sta.id;

                return (
                  <g
                    key={sta.id}
                    transform={`translate(${cx}, ${cy})`}
                    className="cursor-pointer group"
                    onClick={() => {
                      setActiveStation(sta);
                      onSelectStation(sta);
                    }}
                  >
                    <circle
                      r={isSelected ? "14" : "10"}
                      fill={isSelected ? "#0284c7" : "#1e293b"}
                      stroke={isSelected ? "#38bdf8" : "#64748b"}
                      strokeWidth="3"
                    />
                    <text x="0" y="4" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="black">⚡</text>

                    {/* Label */}
                    <text x="0" y="-18" fill={isSelected ? "#38bdf8" : "#cbd5e1"} fontSize="10" textAnchor="middle" fontWeight="bold">
                      {sta.stationName.split('-')[0]}
                    </text>
                  </g>
                );
              })}

              {/* End Destination Pin */}
              <g transform="translate(740, 50)">
                <circle r="8" fill="#10b981" />
                <text x="0" y="-14" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold">Lake Tahoe</text>
              </g>
            </svg>
          </div>

          {/* Map Footer Route Info Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>Drive Progress: <strong className="text-white">{simulatedProgress}%</strong></span>
              <span>Elevation Gain: <strong className="text-sky-400">+1,890 meters</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              <span>Selected Stop: <strong className="text-white">{activeStation.stationName}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Selected Station Detail & Routing Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
                  Active Selected Station
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-1">{activeStation.stationName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeStation.locationName}
                </p>
              </div>

              <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-current" />
                {activeStation.rating}
              </span>
            </div>

            {/* Quick Specs */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Fast Charger Speed:</span>
                <strong className="text-slate-900">{activeStation.maxSpeedKw} kW</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Live Port Availability:</span>
                <strong className="text-emerald-700">{activeStation.availablePorts} of {activeStation.totalPorts} Available</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Estimated Queue Time:</span>
                <strong className="text-slate-900">{activeStation.waitingTimeMins === 0 ? 'Zero Waiting' : `${activeStation.waitingTimeMins} mins`}</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Pricing Rate:</span>
                <strong className="text-slate-900">${activeStation.pricePerkWh} / kWh</strong>
              </div>
            </div>

            {/* Amenities List */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Station Amenities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeStation.amenities.map((am, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {am}
                  </span>
                ))}
              </div>
            </div>

            {/* Set as Active Stop Action Button */}
            <button
              onClick={() => onSelectStation(activeStation)}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Confirm & Set as Route Stop</span>
            </button>
          </div>

          {/* Other Stations Shortcut List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-xs">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Other Route Stations
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {stations.map((sta) => (
                <div
                  key={sta.id}
                  onClick={() => {
                    setActiveStation(sta);
                    onSelectStation(sta);
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    activeStation.id === sta.id
                      ? 'border-sky-500 bg-sky-50/60 font-bold text-sky-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">{sta.stationName}</span>
                  <span className="shrink-0 font-semibold text-slate-500">{sta.maxSpeedKw}kW</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
