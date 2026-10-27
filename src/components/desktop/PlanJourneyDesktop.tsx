import React, { useState } from 'react';
import {
  Navigation,
  MapPin,
  Zap,
  Coffee,
  Star,
  Check,
  Layers,
  X,
  ChevronRight,
  Sparkles,
  Play,
  Compass,
  Volume2,
  AlertTriangle,
} from 'lucide-react';

interface PlanJourneyDesktopProps {
  onStartNavigation: () => void;
}

export const PlanJourneyDesktop: React.FC<PlanJourneyDesktopProps> = ({ onStartNavigation }) => {
  // Journey state: 0 = Planning, 1 = Recommendation Panel Open, 2 = Stop Added / Route Recalculated
  const [journeyStage, setJourneyStage] = useState<0 | 1 | 2>(0);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState(0);

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
      cafe: 'Saravana Bhavan (120 m away)',
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
      cafe: 'Murugan Idli Shop (90 m away)',
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
      cafe: 'Food Court & Cafe (150 m away)',
      breakEst: '25 min',
    },
  ];

  const currentStop = alternatives[selectedAlternativeIndex];

  const handleOpenSmartStop = () => {
    setJourneyStage(1);
    setShowRightPanel(true);
  };

  const handleAddSmartStop = () => {
    setJourneyStage(2);
    setShowRightPanel(false);
  };

  return (
    <div className="flex-1 bg-[#090D0B] text-white flex flex-col font-[Inter,sans-serif] select-none w-full h-[calc(100vh-65px)] overflow-hidden relative">
      {/* TOP DESKTOP SUB-HEADER BRAND DIFFERENTIATOR BANNER */}
      <div className="bg-gradient-to-r from-[#142318] via-[#121A15] to-[#142318] border-b border-[#22C55E]/20 px-6 py-2 flex items-center justify-between text-xs shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-[#22C55E]" />
          <span className="font-extrabold text-[#22C55E] uppercase tracking-wider">ZepGO Core Differentiator:</span>
          <span className="text-slate-200 font-semibold">
            "ZepGO doesn't just find where to charge. It finds the best place to charge AND what you can do while charging."
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-400">Bengaluru ➔ Ooty Highway Route (274 km)</span>
      </div>

      {/* MAIN DESKTOP WORKSPACE LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR (380px) — ROUTE PLANNING & SMART STOP DETECTION */}
        <aside className="w-[380px] lg:w-[410px] bg-[#0E1411] border-r border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto no-scrollbar shrink-0 space-y-4 shadow-2xl z-20">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#22C55E] tracking-wider block">
                  Intelligent Route Planner
                </span>
                <h2 className="text-base font-black text-white tracking-tight">PLAN YOUR JOURNEY</h2>
              </div>
              <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-full">
                Live AI Active
              </span>
            </div>

            {/* Origin & Destination Inputs Card */}
            <div className="bg-[#141A17] rounded-2xl p-4 border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] shrink-0">
                  <Navigation size={14} />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">From</span>
                  <span className="text-xs font-extrabold text-white">MG Road, Bengaluru</span>
                </div>
              </div>

              <div className="ml-3.5 border-l-2 border-dashed border-slate-700 h-3" />

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <MapPin size={14} />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">To</span>
                  <span className="text-xs font-extrabold text-white">Ooty Lake, Tamil Nadu</span>
                </div>
              </div>
            </div>

            {/* Vehicle & Telemetry Metrics Grid */}
            <div className="bg-[#141A17] rounded-2xl p-4 border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-white">Tata Nexon EV Max</span>
                <span className="text-[10px] font-black text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-md">
                  SOC 34%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Distance</span>
                  <span className="font-black text-white text-xs">274 km</span>
                </div>
                <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Est. Time</span>
                  <span className="font-black text-white text-xs">6h 20m</span>
                </div>
                <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Arrival SOC</span>
                  <span className="font-black text-red-400 text-xs">
                    {journeyStage === 2 ? '18%' : '-12% ⚠️'}
                  </span>
                </div>
              </div>

              {/* Warning badge */}
              {journeyStage !== 2 && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle size={14} /> ⚠ RECHARGE REQUIRED
                  </span>
                  <span className="text-[10px] text-amber-300">Target SOC &lt; 20%</span>
                </div>
              )}
            </div>

            {/* INTEGRATED SMART STOP DETECTION CARD */}
            {journeyStage !== 2 ? (
              <div className="bg-gradient-to-br from-[#16251C] to-[#121A15] rounded-2xl p-4 border border-[#22C55E]/40 shadow-lg space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shadow-md">
                      <Coffee size={15} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#22C55E] tracking-wider block">
                        AI Break & Charge Sync
                      </span>
                      <h3 className="text-xs font-black text-white">SMART STOP DETECTED</h3>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-2 py-0.5 rounded-full">
                    ⭐ 4.8 / 5
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-white text-sm">{currentStop.name}</h4>
                  <p className="text-[11px] text-slate-300">
                    214 km ahead • <strong className="text-[#22C55E]">+0.2 km route deviation</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#0B0F0D]/80 p-2.5 rounded-xl border border-slate-800 text-[10px]">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block font-bold">⚡ EV Charging</span>
                    <span className="text-white font-extrabold block">24 min charging</span>
                    <span className="text-[#22C55E] block">150 kW DC • 3/4 Open</span>
                  </div>
                  <div className="space-y-0.5 border-l border-slate-800 pl-2">
                    <span className="text-slate-400 block font-bold">☕ Cafe / Rest</span>
                    <span className="text-white font-extrabold block">25 min break</span>
                    <span className="text-amber-400 block">Saravana Bhavan</span>
                  </div>
                </div>

                <button
                  onClick={handleOpenSmartStop}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-[0.98]"
                >
                  <span>VIEW SMART STOP</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : (
              /* ROUTE RECALCULATED SUMMARY PANEL */
              <div className="bg-[#142318] border border-[#22C55E]/40 rounded-2xl p-4 shadow-lg space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black">
                      <Check size={14} />
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">ROUTE UPDATED</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">ETA Change:</span>
                    <span className="text-white font-bold">
                      <span className="line-through text-slate-500 mr-1">6:40 PM</span>
                      <strong className="text-[#22C55E]">7:05 PM</strong> (+25m break)
                    </span>
                  </div>

                  <div className="flex justify-between bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Arrival Battery:</span>
                    <span className="text-[#22C55E] font-black">18% SOC (Safely Recharged)</span>
                  </div>

                  <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                    <span className="font-extrabold text-white block">Smart Stop Inserted @ 214 km</span>
                    <p className="text-[10px] text-slate-300">
                      24 min charging (150 kW) + 25 min break at Saravana Bhavan
                    </p>
                  </div>
                </div>

                <button
                  onClick={onStartNavigation}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
                >
                  <Play size={16} className="fill-[#0B0F0D]" />
                  <span>START NAVIGATION</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
            ZepGO Desktop Engine v2.0 • Full Viewport Architecture
          </div>
        </aside>

        {/* CENTRAL MAIN AREA — LARGE DESKTOP MAP CANVAS */}
        <main className="flex-1 relative bg-[#0C120F] flex flex-col overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1000 650" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Map Canvas Background Grid */}
            <rect width="1000" height="650" fill="#0C120F" />
            <path
              d="M0 100H1000M0 250H1000M0 400H1000M0 550H1000M200 0V650M400 0V650M600 0V650M800 0V650"
              stroke="#14211A"
              strokeWidth="1"
              strokeDasharray="6 6"
            />

            {/* Secondary Roads */}
            <path d="M-50 220 C 150 180, 350 250, 550 200 T 1050 180" stroke="#1A2820" strokeWidth="8" />

            {/* Primary Highway Route Line */}
            <path
              d="M 100 520 C 250 480, 480 340, 540 290 T 920 100"
              stroke="#1E3326"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M 100 520 C 250 480, 480 340, 540 290 T 920 100"
              stroke={journeyStage === 2 ? '#22C55E' : '#3B82F6'}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Waypoint 1: Bengaluru Start */}
            <g transform="translate(100, 520)">
              <circle cx="0" cy="0" r="16" fill="#22C55E" fillOpacity="0.2" className="animate-pulse" />
              <circle cx="0" cy="0" r="8" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2" />
              <text x="18" y="4" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                Bengaluru (Start)
              </text>
            </g>

            {/* Waypoint 2: SMART STOP MARKER @ 214 km */}
            <g transform="translate(540, 290)">
              <circle cx="0" cy="0" r="26" fill="#22C55E" fillOpacity="0.25" className="animate-ping" />
              <rect x="-20" y="-20" width="40" height="40" rx="12" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2.5" />
              <path d="M-6 -2 L6 -2 M0 -8 L0 4 M-4 6 L4 6" stroke="#0B0F0D" strokeWidth="3" strokeLinecap="round" />

              {/* Map Floating Callout Box */}
              <g transform="translate(28, -25)">
                <rect x="0" y="0" width="240" height="52" rx="10" fill="#0B0F0D" stroke="#22C55E" strokeWidth="1.5" />
                <text x="12" y="18" fill="#22C55E" fontSize="11" fontWeight="900" fontFamily="sans-serif">
                  ⚡ Saravana Bhavan + Zep Fast Hub
                </text>
                <text x="12" y="36" fill="#FFFFFF" fontSize="10" fontFamily="sans-serif">
                  214 km • 150 kW DC • 24 min charge
                </text>
              </g>
            </g>

            {/* Waypoint 3: Ooty Destination */}
            <g transform="translate(920, 100)">
              <circle cx="0" cy="0" r="16" fill="#EF4444" fillOpacity="0.2" />
              <circle cx="0" cy="0" r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
              <text x="-130" y="4" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                Ooty Lake (Destination)
              </text>
            </g>
          </svg>

          {/* Floating Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button className="w-10 h-10 rounded-xl bg-[#0B0F0D]/90 backdrop-blur-md border border-slate-800 text-white flex items-center justify-center shadow-lg hover:border-slate-700">
              <Compass size={18} className="text-[#22C55E]" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-[#0B0F0D]/90 backdrop-blur-md border border-slate-800 text-white flex items-center justify-center shadow-lg hover:border-slate-700">
              <Volume2 size={18} />
            </button>
          </div>
        </main>

        {/* RIGHT-SIDE DETAILS PANEL (380px Desktop Drawer) */}
        {(showRightPanel || journeyStage === 1) && (
          <aside className="w-[380px] lg:w-[420px] bg-[#0E1411] border-l border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto no-scrollbar shrink-0 space-y-4 shadow-2xl z-30 animate-slideLeft">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2.5 py-0.5 rounded-full inline-block">
                  RECOMMENDED SMART STOP
                </span>
                <h2 className="text-base font-black text-white mt-1">{currentStop.name}</h2>
                <p className="text-[11px] text-slate-400">{currentStop.sub}</p>
              </div>
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3.5 flex-1 overflow-y-auto no-scrollbar">
              {/* Rating & Deviation Box */}
              <div className="flex items-center justify-between bg-[#141A17] p-3 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Route Deviation</span>
                  <span className="font-extrabold text-[#22C55E] text-sm">{currentStop.dev} detour</span>
                </div>
                <div className="text-right bg-[#0B0F0D] px-3 py-1.5 rounded-xl border border-amber-500/30">
                  <span className="font-black text-amber-400 flex items-center gap-1 text-xs">
                    <Star size={13} className="fill-amber-400" /> {currentStop.rating} / 5
                  </span>
                  <span className="text-[8px] text-slate-400 uppercase block mt-0.5">Top Rated Hub</span>
                </div>
              </div>

              {/* CHARGING SPECIFICATION BOX */}
              <div className="bg-[#141A17] rounded-2xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-[#22C55E]">
                    <Zap size={16} />
                    <span className="text-xs font-extrabold text-white">CHARGING</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-md">
                    {currentStop.charger}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Fill Range</span>
                    <span className="font-extrabold text-white">22% → 80%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Charge Time</span>
                    <span className="font-extrabold text-[#22C55E]">{currentStop.chargeTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Plugs Open</span>
                    <span className="font-bold text-white">{currentStop.avail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Power</span>
                    <span className="font-bold text-amber-400">{currentStop.charger}</span>
                  </div>
                </div>
              </div>

              {/* CAFE & REST BOX */}
              <div className="bg-[#141A17] rounded-2xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Coffee size={16} />
                    <span className="text-xs font-extrabold text-white">CAFE / REST</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
                    Open until 10 PM
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
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

              {/* CHARGE + BREAK SYNC VISUAL TIMELINE COMPONENT */}
              <div className="bg-gradient-to-br from-[#16251C] to-[#121A15] border border-[#22C55E]/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-[#22C55E]">
                  <Sparkles size={16} />
                  <span className="text-xs font-black uppercase tracking-wider">CHARGE + BREAK SYNC</span>
                </div>

                {/* Horizontal Timeline */}
                <div className="flex items-center justify-between bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800 text-[10px]">
                  <div className="text-center">
                    <span className="text-slate-400 uppercase block font-bold">ARRIVE</span>
                    <span className="text-amber-400 font-extrabold">22%</span>
                  </div>
                  <div className="text-[#22C55E] font-black">➔</div>
                  <div className="text-center bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-1 rounded-lg">
                    <span className="text-[#22C55E] font-black uppercase block">24 MIN</span>
                    <span className="text-white font-bold text-[9px]">CHARGE</span>
                  </div>
                  <div className="text-center text-amber-400 font-black">➔</div>
                  <div className="text-center bg-amber-500/15 border border-amber-500/30 px-2 py-1 rounded-lg">
                    <span className="text-amber-400 font-black uppercase block">25 MIN</span>
                    <span className="text-white font-bold text-[9px]">CAFE</span>
                  </div>
                  <div className="text-center text-[#22C55E] font-black">➔</div>
                  <div className="text-center">
                    <span className="text-[#22C55E] font-black uppercase block">READY</span>
                    <span className="text-[#22C55E] font-extrabold">80%</span>
                  </div>
                </div>

                <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-extrabold text-[#22C55E] block">
                    "Your charging time matches your break time."
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Zero extra waiting time. Enjoy meal break while EV charges.
                  </p>
                </div>
              </div>

              {/* EXPANDABLE ALTERNATIVES SECTION */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <button
                  onClick={() => setShowAlternatives(!showAlternatives)}
                  className="w-full bg-[#161C19] border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-2.5 px-3.5 rounded-xl text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Layers size={15} className="text-[#22C55E]" />
                    <span>View Alternatives ({alternatives.length - 1})</span>
                  </span>
                  <span>{showAlternatives ? '▲' : '▼'}</span>
                </button>

                {showAlternatives && (
                  <div className="space-y-2 animate-fadeIn">
                    {alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedAlternativeIndex(idx)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedAlternativeIndex === idx
                            ? 'bg-[#1E2923] border-[#22C55E] text-white'
                            : 'bg-[#0B0F0D] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between font-extrabold">
                          <span>{alt.name}</span>
                          <span className="text-amber-400 text-[11px]">⭐ {alt.rating}</span>
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

            {/* ACTION BUTTON */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleAddSmartStop}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
              >
                <Check size={18} className="stroke-[3]" />
                <span>ADD SMART STOP</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
