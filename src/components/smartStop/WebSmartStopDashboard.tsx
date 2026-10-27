import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Zap,
  Coffee,
  Star,
  Check,
  Layers,
  X,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Play,
  RotateCcw,
  Compass,
  Volume2,
  AlertTriangle,
} from 'lucide-react';

interface WebSmartStopDashboardProps {
  initialStateIndex?: number;
  onStateChange?: (index: number) => void;
}

export const WebSmartStopDashboard: React.FC<WebSmartStopDashboardProps> = ({
  initialStateIndex = 0,
  onStateChange,
}) => {
  const [activeStateIndex, setActiveStateIndex] = useState(initialStateIndex);
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState(0);

  const setStep = (idx: number) => {
    setActiveStateIndex(idx);
    if (onStateChange) onStateChange(idx);
    if (idx === 1) setShowRightDrawer(true);
    else if (idx !== 1) setShowRightDrawer(false);
  };

  const alternatives = [
    {
      name: 'Saravana Bhavan + Zep Fast Hub',
      sub: 'NH544 Salem Bypass',
      dist: '214 km',
      dev: '+0.2 km',
      rating: '4.8',
      charger: '150 kW DC',
      avail: '3/4 available',
      chargeTime: '24 min',
      cafe: 'Saravana Bhavan (120 m walk)',
      breakEst: '25 min',
    },
    {
      name: 'Murugan Idli + Tata Power Hub',
      sub: 'NH544 Krishnagiri Plaza',
      dist: '208 km',
      dev: '+0.5 km',
      rating: '4.6',
      charger: '120 kW DC',
      avail: '2/4 available',
      chargeTime: '28 min',
      cafe: 'Murugan Idli Shop (90 m walk)',
      breakEst: '30 min',
    },
    {
      name: 'Highway Star + Zeon Fast Hub',
      sub: 'NH544 Dharmapuri Highway',
      dist: '226 km',
      dev: '+1.1 km',
      rating: '4.7',
      charger: '150 kW DC',
      avail: '4/4 available',
      chargeTime: '22 min',
      cafe: 'Food Court & Cafe (150 m walk)',
      breakEst: '25 min',
    },
  ];

  const currentStop = alternatives[selectedAlternativeIndex];

  return (
    <div className="flex-1 bg-[#090D0B] text-white flex flex-col font-[Inter,sans-serif] select-none w-full min-h-[680px] overflow-hidden">
      {/* WEB DASHBOARD HEADER CONTROL BAR */}
      <div className="bg-[#111613] border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#22C55E] text-[#0B0F0D] rounded-xl flex items-center justify-center font-black shadow-md shadow-[#22C55E]/20">
            <Zap size={18} className="fill-[#0B0F0D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">ZepGO Web Navigation Dashboard</span>
              <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>💻</span> Desktop Smart Stop AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Intelligent Journey & Rest Stop Synchronization</p>
          </div>
        </div>

        {/* 5-State Journey Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            '1. Route Planning',
            '2. Recommendation',
            '3. Charge & Cafe Sync',
            '4. Route Updated',
            '5. Live Navigation',
          ].map((label, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeStateIndex === idx
                  ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold shadow-md shadow-[#22C55E]/20'
                  : 'bg-[#161C19] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  activeStateIndex === idx ? 'bg-[#0B0F0D] text-[#22C55E]' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {idx + 1}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(0)}
            className="px-3 py-1.5 bg-[#161C19] hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Journey</span>
          </button>
        </div>
      </div>

      {/* CORE BRAND DIFFERENTIATOR BAR */}
      <div className="bg-gradient-to-r from-[#142318] via-[#121A15] to-[#142318] border-b border-[#22C55E]/20 px-6 py-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-[#22C55E]" />
          <span className="font-extrabold text-[#22C55E] uppercase tracking-wider">ZepGO Concept:</span>
          <span className="text-slate-200 font-semibold">
            "ZepGO doesn't just find where to charge. It finds the best place to charge AND what you can do while charging."
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-400">Bengaluru ➔ Ooty EV Route (274 km)</span>
      </div>

      {/* MAIN DESKTOP 3-PANEL LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDE PANEL — ROUTE & TELEMETRY */}
        <aside className="w-80 lg:w-96 bg-[#0E1411] border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto no-scrollbar shrink-0 space-y-4">
          {/* Section 1: Route Setup Inputs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Route Details</span>
              <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] px-2 py-0.5 rounded-full border border-[#22C55E]/30">
                Tata Nexon EV Max
              </span>
            </div>

            <div className="bg-[#141A17] rounded-2xl p-3 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                  <Navigation size={13} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Origin</span>
                  <span className="font-extrabold text-white">MG Road, Bengaluru</span>
                </div>
              </div>

              <div className="ml-3 border-l border-dashed border-slate-700 h-2.5" />

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <MapPin size={13} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Destination</span>
                  <span className="font-extrabold text-white">Ooty Lake, Tamil Nadu</span>
                </div>
              </div>
            </div>

            {/* Telemetry Metrics Card */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#141A17] p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Battery SOC</span>
                <span className="font-black text-[#22C55E] text-sm">34% (110 km)</span>
                <span className="text-[9px] text-amber-400 font-bold block flex items-center gap-1">
                  <AlertTriangle size={10} /> Recharge Required
                </span>
              </div>

              <div className="bg-[#141A17] p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Trip Distance</span>
                <span className="font-black text-white text-sm">274 km</span>
                <span className="text-[9px] text-red-400 font-bold block">Arrival SOC: -12% ⚠️</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC MIDDLE CONTENT BASED ON ACTIVE STATE */}
          <div className="flex-1 space-y-3">
            {/* STATE 1 CONTENT: COMPACT SMART STOP DETECTION CARD */}
            {activeStateIndex === 0 && (
              <div className="bg-gradient-to-br from-[#16251C] to-[#121A15] rounded-2xl p-3.5 border border-[#22C55E]/40 space-y-3 animate-fadeIn shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black">
                      <Coffee size={14} />
                    </div>
                    <span className="text-xs font-black text-white">SMART STOP DETECTED</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-300">Location:</span>
                    <span className="text-white">214 km ahead</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Detour:</span>
                    <span className="text-[#22C55E] font-bold">+0.2 km route deviation</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Match:</span>
                    <span className="text-white font-extrabold">{currentStop.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#0B0F0D]/70 p-2 rounded-xl border border-slate-800 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Zap size={12} className="text-[#22C55E]" />
                    <span>24 min charging</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Coffee size={12} className="text-amber-400" />
                    <span>25 min break</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-[0.98]"
                >
                  <span>View Smart Stop</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            )}

            {/* STATE 2 CONTENT: ACTIVE RECOMMENDATION QUICK PANEL */}
            {activeStateIndex === 1 && (
              <div className="bg-[#141A17] rounded-2xl p-3.5 border border-[#22C55E]/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-[#22C55E] uppercase tracking-wider">
                    Stop Recommendation Active
                  </span>
                  <span className="text-[10px] text-slate-400">Drawer Open 👉</span>
                </div>
                <p className="text-xs text-slate-300">
                  Review the recommended charger and cafe timing sync on the right panel.
                </p>
                <button
                  onClick={() => setShowRightDrawer(true)}
                  className="w-full bg-[#161C19] border border-slate-700 hover:border-[#22C55E] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Expand Recommendation Drawer</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* STATE 3 CONTENT: CHARGING + CAFE SYNC TIMELINE */}
            {activeStateIndex === 2 && (
              <div className="bg-gradient-to-br from-[#16251C] to-[#121A15] rounded-2xl p-3.5 border border-[#22C55E]/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5 text-[#22C55E]">
                    <Sparkles size={15} />
                    <span className="text-xs font-black uppercase tracking-wider">CHARGE + BREAK SYNC</span>
                  </div>
                  <span className="text-[9px] font-extrabold bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-md">
                    Zero Wasted Time
                  </span>
                </div>

                {/* Timeline */}
                <div className="space-y-1.5 text-[10px]">
                  <div className="bg-[#0B0F0D] p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 uppercase font-bold">ARRIVE @ 214 km</span>
                    <span className="text-amber-400 font-extrabold">SOC 22%</span>
                  </div>
                  <div className="text-center text-[#22C55E] font-black">↓</div>
                  <div className="bg-[#22C55E]/15 border border-[#22C55E]/30 p-2 rounded-xl flex items-center justify-between">
                    <span className="text-[#22C55E] font-black uppercase">24 MIN CHARGING</span>
                    <span className="text-white font-bold">150 kW DC (22% → 80%)</span>
                  </div>
                  <div className="text-center text-amber-400 font-black">↓</div>
                  <div className="bg-amber-500/15 border border-amber-500/30 p-2 rounded-xl flex items-center justify-between">
                    <span className="text-amber-400 font-black uppercase">25 MIN CAFE / REST</span>
                    <span className="text-white font-bold">Saravana Bhavan (120m)</span>
                  </div>
                  <div className="text-center text-[#22C55E] font-black">↓</div>
                  <div className="bg-[#0B0F0D] p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-[#22C55E] font-black uppercase">READY TO CONTINUE</span>
                    <span className="text-[#22C55E] font-extrabold">SOC 80%</span>
                  </div>
                </div>

                <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-0.5">
                  <div className="flex items-center gap-1 text-[#22C55E] font-extrabold">
                    <ShieldCheck size={14} />
                    <span>"Your charging time matches your break time."</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Eat breakfast and recharge your battery simultaneously.
                  </p>
                </div>

                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
                >
                  <Check size={16} className="stroke-[3]" />
                  <span>Add Smart Stop</span>
                </button>
              </div>
            )}

            {/* STATE 4 CONTENT: ROUTE UPDATED SUMMARY */}
            {activeStateIndex === 3 && (
              <div className="bg-[#141A17] rounded-2xl p-3.5 border border-[#22C55E]/40 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <div className="w-5 h-5 rounded-md bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black">
                    <Check size={14} />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wider">ROUTE UPDATED</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between bg-[#0B0F0D] p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Original ETA:</span>
                    <span className="text-slate-400 line-through">6:40 PM</span>
                  </div>
                  <div className="flex justify-between bg-[#0B0F0D] p-2 rounded-xl border border-slate-800">
                    <span className="text-white font-extrabold">New ETA:</span>
                    <span className="text-[#22C55E] font-black">7:05 PM (+25 min break)</span>
                  </div>
                  <div className="flex justify-between bg-[#0B0F0D] p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Arrival Battery:</span>
                    <span className="text-[#22C55E] font-black">18% SOC</span>
                  </div>
                </div>

                <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                  <span className="font-extrabold text-white block">Smart Stop Scheduled</span>
                  <p className="text-[10px] text-slate-400">
                    24 min charging • 25 min break @ Saravana Bhavan
                  </p>
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
                >
                  <Play size={15} className="fill-[#0B0F0D]" />
                  <span>Start Navigation</span>
                </button>
              </div>
            )}

            {/* STATE 5 CONTENT: LIVE NAV STATUS */}
            {activeStateIndex === 4 && (
              <div className="bg-[#141A17] rounded-2xl p-3.5 border border-slate-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">Live Navigation Active</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#22C55E]">GPS Live</span>
                </div>
                <p className="text-xs text-slate-300">
                  Turn-by-turn guidance active. The floating Smart Stop card appears on the bottom right of the map as you approach the station.
                </p>
                <button
                  onClick={() => setStep(0)}
                  className="w-full bg-[#161C19] border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Restart Journey Simulation</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer branding */}
          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-medium">
            <span>ZepGO India EV Navigation Dashboard • Web Desktop Mode</span>
          </div>
        </aside>

        {/* CENTRAL MAIN AREA — LARGE MAP CANVAS */}
        <main className="flex-1 relative bg-[#0C120F] flex flex-col overflow-hidden">
          {/* STATE 5 TOP NAVIGATION BANNER OVERLAY */}
          {activeStateIndex === 4 && (
            <div className="absolute top-4 left-4 right-4 z-20 max-w-xl mx-auto">
              <div className="bg-[#0B0F0D]/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shrink-0">
                    <Navigation size={22} className="fill-[#0B0F0D]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider block">
                      In 500 meters
                    </span>
                    <h3 className="text-xs font-black text-white">Turn Right onto NH44 / Ooty Highway</h3>
                  </div>
                </div>
                <span className="text-xs font-black text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-3 py-1 rounded-full">
                  72 km/h
                </span>
              </div>
            </div>
          )}

          {/* SVG MAP CANVAS */}
          <div className="flex-1 relative w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Map Background grid */}
              <rect width="1000" height="600" fill="#0C120F" />
              <path
                d="M0 100H1000M0 250H1000M0 400H1000M0 550H1000M200 0V600M400 0V600M600 0V600M800 0V600"
                stroke="#15211B"
                strokeWidth="1"
                strokeDasharray="6 6"
              />

              {/* Major Highway Route Line */}
              <path
                d="M 100 480 Q 300 420, 520 280 T 900 120"
                stroke="#1F3027"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 100 480 Q 300 420, 520 280 T 900 120"
                stroke={activeStateIndex >= 3 ? '#22C55E' : '#3B82F6'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={activeStateIndex === 4 ? '12 6' : undefined}
              />

              {/* Waypoint 1: Bengaluru Start */}
              <g transform="translate(100, 480)">
                <circle cx="0" cy="0" r="14" fill="#22C55E" fillOpacity="0.2" className="animate-pulse" />
                <circle cx="0" cy="0" r="8" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2" />
                <text x="15" y="4" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  Bengaluru (Start)
                </text>
              </g>

              {/* Waypoint 2: Smart Stop @ 214 km */}
              <g transform="translate(520, 280)">
                <circle cx="0" cy="0" r="22" fill="#EAB308" fillOpacity="0.3" className="animate-ping" />
                <rect x="-18" y="-18" width="36" height="36" rx="10" fill="#EAB308" stroke="#FFFFFF" strokeWidth="2" />
                <path d="M-6 -2 L6 -2 M0 -8 L0 4 M-4 6 L4 6" stroke="#0B0F0D" strokeWidth="2.5" strokeLinecap="round" />
                <text x="25" y="-5" fill="#EAB308" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                  Saravana Bhavan + Zep Fast Hub
                </text>
                <text x="25" y="12" fill="#FFFFFF" fontSize="10" fontFamily="sans-serif">
                  214 km • 150 kW DC Fast • 24 min charge
                </text>
              </g>

              {/* Waypoint 3: Ooty Destination */}
              <g transform="translate(900, 120)">
                <circle cx="0" cy="0" r="14" fill="#EF4444" fillOpacity="0.2" />
                <circle cx="0" cy="0" r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                <text x="-120" y="4" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  Ooty Lake (End)
                </text>
              </g>

              {/* Live Vehicle Marker in State 4/5 */}
              {activeStateIndex === 4 && (
                <g transform="translate(420, 340)">
                  <circle cx="0" cy="0" r="24" fill="#22C55E" fillOpacity="0.3" className="animate-ping" />
                  <circle cx="0" cy="0" r="14" fill="#22C55E" stroke="#FFFFFF" strokeWidth="3" />
                  <polygon points="0,-7 5,5 0,2 -5,5" fill="#0B0F0D" />
                </g>
              )}
            </svg>

            {/* MAP FLOATING CONTROLS */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button className="w-10 h-10 rounded-xl bg-[#0B0F0D]/90 backdrop-blur-md border border-slate-800 text-white flex items-center justify-center shadow-lg hover:border-slate-700">
                <Compass size={18} className="text-[#22C55E]" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-[#0B0F0D]/90 backdrop-blur-md border border-slate-800 text-white flex items-center justify-center shadow-lg hover:border-slate-700">
                <Volume2 size={18} />
              </button>
            </div>

            {/* STATE 5 FLOATING SMART STOP ALERT CARD NEAR BOTTOM RIGHT */}
            {activeStateIndex === 4 && (
              <div className="absolute bottom-6 right-6 z-20 max-w-md animate-slideUp">
                <div className="bg-gradient-to-r from-[#142318] to-[#0F1A13] border border-[#22C55E]/50 rounded-2xl p-4 shadow-2xl space-y-2.5 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
                      <span className="text-xs font-black text-[#22C55E] uppercase tracking-wider">
                        SMART STOP IN 2 KM
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 px-2 py-0.5 rounded-full">
                      Approaching Station
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-white">Zep Fast Hub + Cafe</h3>
                    <p className="text-[11px] text-slate-300">150 kW DC • 3/4 available</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#0B0F0D]/80 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Zap size={13} className="text-[#22C55E]" />
                      <span>24 min charging</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Coffee size={13} className="text-amber-400" />
                      <span>Cafe 120 m away</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowRightDrawer(true)}
                    className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-[0.98]"
                  >
                    <span>View Stop</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT EXPANDABLE DRAWER / PANEL — STATE 2 SMART STOP RECOMMENDATION */}
        {(showRightDrawer || activeStateIndex === 1) && (
          <aside className="w-80 lg:w-96 bg-[#0E1411] border-l border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto no-scrollbar shrink-0 space-y-3 z-30 animate-slideLeft shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.5 rounded-full inline-block">
                  RECOMMENDED SMART STOP
                </span>
                <h2 className="text-sm font-black text-white mt-1">{currentStop.name}</h2>
              </div>
              <button
                onClick={() => setShowRightDrawer(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
              {/* Detour & Rating Box */}
              <div className="flex items-center justify-between bg-[#141A17] p-2.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Route Detour</span>
                  <span className="font-extrabold text-[#22C55E]">{currentStop.dev} detour</span>
                </div>
                <div className="text-right bg-[#0B0F0D] px-2.5 py-1 rounded-lg border border-amber-500/30">
                  <span className="font-black text-amber-400 flex items-center gap-1">
                    <Star size={12} className="fill-amber-400" /> {currentStop.rating} / 5
                  </span>
                </div>
              </div>

              {/* CHARGING SPECIFICATION CARD */}
              <div className="bg-[#141A17] rounded-xl p-3 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <div className="flex items-center gap-1.5 text-[#22C55E]">
                    <Zap size={14} />
                    <span className="text-xs font-extrabold text-white">CHARGING</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded">
                    {currentStop.charger}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Fill Range:</span>
                    <span className="font-extrabold text-white">22% → 80%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Est. Charge Time:</span>
                    <span className="font-extrabold text-[#22C55E]">{currentStop.chargeTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Plugs Open:</span>
                    <span className="font-bold text-white">{currentStop.avail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Speed:</span>
                    <span className="font-bold text-amber-400">{currentStop.charger}</span>
                  </div>
                </div>
              </div>

              {/* CAFE & REST CARD */}
              <div className="bg-[#141A17] rounded-xl p-3 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Coffee size={14} />
                    <span className="text-xs font-extrabold text-white">CAFE / REST</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    Open till 10 PM
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Walking Dist:</span>
                    <span className="font-extrabold text-white">{currentStop.cafe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recommended Break:</span>
                    <span className="font-extrabold text-amber-400">{currentStop.breakEst}</span>
                  </div>
                </div>
              </div>

              {/* REASON BADGE */}
              <div className="bg-[#16251C] border border-[#22C55E]/40 rounded-xl p-2.5 text-center text-xs font-extrabold text-white">
                "Best match for your charging and break time."
              </div>

              {/* EXPANDABLE ALTERNATIVES SECTION (Small section within drawer!) */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <button
                  onClick={() => setShowAlternatives(!showAlternatives)}
                  className="w-full bg-[#161C19] border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers size={14} className="text-[#22C55E]" />
                    <span>View Alternatives ({alternatives.length - 1})</span>
                  </span>
                  <span>{showAlternatives ? '▲' : '▼'}</span>
                </button>

                {showAlternatives && (
                  <div className="space-y-1.5 animate-fadeIn">
                    {alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedAlternativeIndex(idx)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedAlternativeIndex === idx
                            ? 'bg-[#1E2923] border-[#22C55E] text-white'
                            : 'bg-[#0B0F0D] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between font-extrabold">
                          <span>{alt.name}</span>
                          <span className="text-amber-400 text-[10px]">⭐ {alt.rating}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {alt.dist} • {alt.dev} detour • {alt.chargeTime} charge
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
              >
                <Check size={16} className="stroke-[3]" />
                <span>Use This Stop</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
