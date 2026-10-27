import React, { useState } from 'react';
import {
  Navigation,
  Volume2,
  Compass,
  RotateCcw,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

interface LiveNavigationDesktopProps {
  onEndTrip: () => void;
}

export const LiveNavigationDesktop: React.FC<LiveNavigationDesktopProps> = ({ onEndTrip }) => {
  const [showStopModal, setShowStopModal] = useState(false);

  return (
    <div className="flex-1 bg-[#090D0B] text-white flex flex-col font-[Inter,sans-serif] select-none w-full h-[calc(100vh-65px)] overflow-hidden relative">
      {/* TOP NAVIGATION STATUS BAR */}
      <div className="bg-[#0B0F0D] border-b border-slate-800 px-6 py-3 flex items-center justify-between z-20 shadow-lg shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shadow-md shadow-[#22C55E]/30 shrink-0">
            <Navigation size={22} className="fill-[#0B0F0D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.5 rounded-full">
                In 500 meters
              </span>
              <span className="text-xs font-bold text-slate-400">Head towards Salem Bypass</span>
            </div>
            <h2 className="text-sm font-black text-white leading-tight mt-0.5">
              Turn Right onto NH544 / Ooty Highway
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#141A17] border border-slate-800 px-4 py-1.5 rounded-xl text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Current Speed</span>
            <span className="text-sm font-black text-[#22C55E]">72 km/h</span>
          </div>

          <button
            onClick={onEndTrip}
            className="px-4 py-2 bg-[#141A17] hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>End Trip</span>
          </button>
        </div>
      </div>

      {/* FULL DESKTOP NATIVE 3-PANEL LIVE NAVIGATION WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANEL (360px) — TURN-BY-TURN & UPCOMING SMART STOP */}
        <aside className="w-[360px] lg:w-[380px] bg-[#0E1411] border-r border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto no-scrollbar shrink-0 space-y-4 shadow-2xl z-20">
          <div className="space-y-4">
            {/* Turn Instructions Card */}
            <div className="bg-[#141A17] rounded-2xl p-4 border border-slate-800 space-y-2.5">
              <span className="text-[9px] font-black uppercase text-[#22C55E] tracking-wider block">
                NEXT TURN INSTRUCTION
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center shrink-0 font-black">
                  <ArrowUpRight size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">↗ Take NH544 Ramp</h3>
                  <p className="text-xs text-[#22C55E] font-bold mt-0.5">In 2.4 km • Stay in right lane</p>
                </div>
              </div>
            </div>

            {/* UPCOMING SMART STOP CARD */}
            <div className="bg-gradient-to-br from-[#16251C] to-[#121A15] border border-[#22C55E]/40 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
                  <span className="text-xs font-black text-[#22C55E] uppercase tracking-wider">
                    SMART STOP 2 KM AHEAD
                  </span>
                </div>
                <span className="text-[9px] font-bold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 px-2 py-0.5 rounded-full">
                  Approaching
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-white">Zep Fast Hub + Saravana Bhavan Cafe</h3>
                <p className="text-[11px] text-slate-300">NH544 Salem Bypass • 150 kW DC Fast</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#0B0F0D]/80 p-2.5 rounded-xl border border-slate-800 text-[10px]">
                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-bold">⚡ EV Charging</span>
                  <span className="text-white font-extrabold block">24 min charging</span>
                  <span className="text-[#22C55E] block">3/4 Plugs Open</span>
                </div>
                <div className="space-y-0.5 border-l border-slate-800 pl-2">
                  <span className="text-slate-400 block font-bold">☕ Cafe / Rest</span>
                  <span className="text-white font-extrabold block">25 min break</span>
                  <span className="text-amber-400 block">120 m walk</span>
                </div>
              </div>

              <button
                onClick={() => setShowStopModal(true)}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-[0.98]"
              >
                <span>VIEW STOP DETAILS</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center">
            ZepGO Desktop Navigation Engine Active
          </div>
        </aside>

        {/* CENTER AREA — LARGE LIVE NAVIGATION MAP CANVAS */}
        <main className="flex-1 relative bg-[#0C120F] flex flex-col overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1000 650" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1000" height="650" fill="#0C120F" />
            <path
              d="M0 100H1000M0 250H1000M0 400H1000M0 550H1000M200 0V650M400 0V650M600 0V650M800 0V650"
              stroke="#14211A"
              strokeWidth="1"
              strokeDasharray="6 6"
            />

            {/* Live Navigation Route Trail */}
            <path
              d="M 500 580 C 480 450, 520 320, 500 180 L 520 20"
              stroke="#22C55E"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 500 580 C 480 450, 520 320, 500 180 L 520 20"
              stroke="#4ADE80"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="12 6"
            />

            {/* Animated Vehicle Location Marker */}
            <g transform="translate(500, 420)">
              <circle cx="0" cy="0" r="30" fill="#22C55E" fillOpacity="0.25" className="animate-ping" />
              <circle cx="0" cy="0" r="16" fill="#22C55E" stroke="#FFFFFF" strokeWidth="3" />
              <polygon points="0,-8 6,6 0,3 -6,6" fill="#0B0F0D" />
            </g>

            {/* Smart Stop Pin on Map Ahead */}
            <g transform="translate(510, 220)">
              <circle cx="0" cy="0" r="22" fill="#EAB308" fillOpacity="0.3" className="animate-ping" />
              <rect x="-16" y="-16" width="32" height="32" rx="10" fill="#EAB308" stroke="#FFFFFF" strokeWidth="2" />
              <path d="M-5 -2 L5 -2 M0 -7 L0 3 M-3 5 L3 5" stroke="#0B0F0D" strokeWidth="2.5" strokeLinecap="round" />
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

        {/* RIGHT PANEL (320px) — LIVE TRIP METRICS */}
        <aside className="w-[320px] bg-[#0E1411] border-l border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto no-scrollbar shrink-0 space-y-4 shadow-2xl z-20">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[9px] font-black uppercase text-[#22C55E] tracking-wider block">
                Telemetry Monitoring
              </span>
              <h3 className="text-base font-black text-white">LIVE TRIP METRICS</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#141A17] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Estimated Arrival</span>
                <span className="text-xl font-black text-[#22C55E]">7:05 PM</span>
                <span className="text-[10px] text-slate-400 block">+25 min break included</span>
              </div>

              <div className="bg-[#141A17] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Remaining Distance</span>
                <span className="text-xl font-black text-white">58 km</span>
                <span className="text-[10px] text-slate-400 block">Total 274 km trip</span>
              </div>

              <div className="bg-[#141A17] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Current Battery</span>
                <span className="text-xl font-black text-[#22C55E]">41% SOC</span>
                <span className="text-[10px] text-[#22C55E] font-extrabold block">
                  Expected Arrival @ Ooty: 18%
                </span>
              </div>

              <div className="bg-[#141A17] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Stop Synchronization</span>
                <span className="text-xs font-black text-white block">24m Charge • 25m Cafe</span>
                <span className="text-[10px] text-slate-300 block">Saravana Bhavan + Zep Fast Hub</span>
              </div>
            </div>
          </div>

          <button
            onClick={onEndTrip}
            className="w-full bg-[#141A17] hover:bg-slate-800 text-slate-300 font-extrabold py-3 px-4 rounded-xl border border-slate-800 transition-all text-xs cursor-pointer"
          >
            End Navigation
          </button>
        </aside>
      </div>

      {/* POPUP MODAL FOR VIEW STOP DETAILS IN LIVE NAV */}
      {showStopModal && (
        <div className="absolute inset-0 bg-[#0B0F0D]/80 backdrop-blur-md z-50 p-6 flex items-center justify-center animate-fadeIn">
          <div className="bg-[#141A17] border border-[#22C55E]/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-[#22C55E] uppercase tracking-wider">
                Upcoming Smart Stop Details
              </span>
              <button
                onClick={() => setShowStopModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="text-base font-extrabold text-white">Saravana Bhavan + Zep Fast Hub</h3>
              <p className="text-slate-300">NH544 Salem Bypass • Approaching in 2 km</p>

              <div className="bg-[#0B0F0D] p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Charger Power:</span>
                  <span className="text-[#22C55E] font-bold">150 kW DC (3/4 Plugs Open)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Charging Duration:</span>
                  <span className="text-white font-bold">24 min (22% → 80%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cafe Amenity:</span>
                  <span className="text-amber-400 font-bold">Saravana Bhavan (120m walk, 25m break)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowStopModal(false)}
              className="w-full bg-[#22C55E] text-[#0B0F0D] font-extrabold py-3 rounded-xl text-xs"
            >
              Resume Live Navigation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
