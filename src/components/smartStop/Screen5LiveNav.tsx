import React, { useState } from 'react';
import { Navigation, Zap, Coffee, ChevronRight, Volume2, Compass, RotateCcw } from 'lucide-react';

interface Screen5LiveNavProps {
  onResetFlow: () => void;
  onViewStopDetails?: () => void;
}

export const Screen5LiveNav: React.FC<Screen5LiveNavProps> = ({ onResetFlow }) => {
  const [showStopDetailModal, setShowStopDetailModal] = useState(false);

  return (
    <div className="flex-1 bg-[#0B0F0D] text-white flex flex-col justify-between select-none font-[Inter,sans-serif] relative overflow-hidden animate-fadeIn">
      {/* FULL-BLEED LIVE MAP BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full" viewBox="0 0 400 700" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Map Base Canvas */}
          <rect width="400" height="700" fill="#0C120F" />

          {/* Grid lines */}
          <path d="M0 100H400M0 250H400M0 400H400M0 550H400M100 0V700M200 0V700M300 0V700" stroke="#141F1A" strokeWidth="1" strokeDasharray="6 6" />

          {/* Minor Roads */}
          <path d="M-20 200 C 100 180, 250 220, 420 190" stroke="#1E2B24" strokeWidth="6" />
          <path d="M50 720 C 80 450, 120 300, 180 -20" stroke="#1E2B24" strokeWidth="8" />

          {/* Active Navigation Highway Route Line */}
          <path d="M 200 620 C 190 500, 210 380, 200 240 L 220 50" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 200 620 C 190 500, 210 380, 200 240 L 220 50" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 6" />

          {/* Vehicle Pulsing Location Chevron */}
          <g transform="translate(200, 520)">
            <circle cx="0" cy="0" r="22" fill="#22C55E" fillOpacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="14" fill="#22C55E" stroke="#FFFFFF" strokeWidth="3" />
            <polygon points="0,-7 5,5 0,2 -5,5" fill="#0B0F0D" />
          </g>

          {/* Smart Stop Marker Pin on Map (2 km ahead at y=260) */}
          <g transform="translate(200, 260)">
            <circle cx="0" cy="0" r="18" fill="#EAB308" fillOpacity="0.25" className="animate-ping" />
            <rect x="-16" y="-16" width="32" height="32" rx="10" fill="#EAB308" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M-6 -2 L6 -2 M0 -8 L0 4 M-4 6 L4 6" stroke="#0B0F0D" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>

        {/* Map Floating Control Buttons */}
        <div className="absolute right-3 top-28 space-y-2 z-10">
          <button className="w-9 h-9 rounded-xl bg-[#0B0F0D]/80 backdrop-blur-md border border-slate-800 text-white flex items-center justify-center shadow-lg">
            <Compass size={18} className="text-[#22C55E]" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-[#0B0F0D]/80 backdrop-blur-md border border-slate-800 text-white flex items-center justify-center shadow-lg">
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      {/* TOP TURN-BY-TURN NAVIGATION OVERLAY */}
      <div className="relative z-10 p-3 pt-2">
        <div className="bg-[#0B0F0D]/95 backdrop-blur-md border border-slate-800 rounded-[20px] p-3 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shadow-md shadow-[#22C55E]/30 shrink-0">
              <Navigation size={22} className="fill-[#0B0F0D]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider">In 500 meters</span>
              </div>
              <h3 className="text-xs font-black text-white leading-tight">Turn Right onto NH44 / Ooty Highway</h3>
              <p className="text-[10px] text-slate-400">Head towards Salem Bypass</p>
            </div>
          </div>

          <button
            onClick={onResetFlow}
            title="Reset Flow"
            className="p-2 rounded-xl bg-[#161C19] border border-slate-800 text-slate-400 hover:text-white"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* MID MAP VIEW AREA (Map remains main focus!) */}
      <div className="flex-1" />

      {/* BOTTOM FLOATING SMART STOP ALERT CARD */}
      <div className="relative z-10 p-3 space-y-2">
        {/* Quick Telemetry Strip */}
        <div className="bg-[#0B0F0D]/90 backdrop-blur-md border border-slate-800/80 rounded-xl px-3 py-1.5 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1 text-slate-300">
            <Navigation size={12} className="text-[#22C55E]" />
            <span>Rem: <strong>216 km</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <span>ETA: <strong>7:05 PM</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <Zap size={12} className="text-[#22C55E]" />
            <span>Battery: <strong className="text-[#22C55E]">32%</strong></span>
          </div>
        </div>

        {/* Compact Smart Stop Alert Card */}
        <div className="bg-gradient-to-r from-[#142318] to-[#0F1A13] border border-[#22C55E]/50 rounded-[22px] p-3.5 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
              <span className="text-xs font-black text-[#22C55E] uppercase tracking-wider">
                Smart Stop in 2 km
              </span>
            </div>
            <span className="text-[9px] font-extrabold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 px-2 py-0.5 rounded-full">
              Approaching Stop
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-black text-white">Zep Fast Hub + Saravana Bhavan Cafe</h3>
              <p className="text-[10px] text-slate-300">150 kW DC • 3/4 chargers available</p>
            </div>
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

          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={() => setShowStopDetailModal(true)}
              className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 text-xs cursor-pointer active:scale-[0.98]"
            >
              <span>View Stop</span>
              <ChevronRight size={15} />
            </button>

            <button
              onClick={onResetFlow}
              className="bg-[#161C19] hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-3 rounded-xl border border-slate-800 transition-all text-xs cursor-pointer"
            >
              Restart Journey
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL FOR "VIEW STOP" IN LIVE NAV (Inline, not separate screen) */}
      {showStopDetailModal && (
        <div className="absolute inset-0 bg-[#0B0F0D]/90 backdrop-blur-md z-40 p-4 flex flex-col justify-end animate-fadeIn">
          <div className="bg-[#141A17] border border-[#22C55E]/40 rounded-[24px] p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-white">Upcoming Smart Stop Details</span>
              <button onClick={() => setShowStopDetailModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                Close ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <h3 className="font-extrabold text-white">Saravana Bhavan + Zep Fast Hub</h3>
              <p className="text-[11px] text-slate-300">NH544 Salem Bypass • In 2.1 km</p>

              <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Charger Status:</span>
                  <span className="text-[#22C55E] font-bold">3/4 Plugs Open (150 kW DC)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Charge Duration:</span>
                  <span className="text-white font-bold">24 min (22% → 80%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cafe Amenity:</span>
                  <span className="text-amber-400 font-bold">Saravana Bhavan (120m away)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowStopDetailModal(false)}
              className="w-full bg-[#22C55E] text-[#0B0F0D] font-extrabold py-3 rounded-xl text-xs"
            >
              Continue Navigation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
