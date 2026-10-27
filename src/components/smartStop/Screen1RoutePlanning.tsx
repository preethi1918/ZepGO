import React from 'react';
import { MapPin, Navigation, Zap, Clock, ChevronRight, AlertTriangle, Coffee } from 'lucide-react';

interface Screen1RoutePlanningProps {
  onViewSmartStop: () => void;
}

export const Screen1RoutePlanning: React.FC<Screen1RoutePlanningProps> = ({ onViewSmartStop }) => {
  return (
    <div className="flex-1 bg-[#0B0F0D] text-white flex flex-col justify-between p-4 select-none font-[Inter,sans-serif] overflow-y-auto no-scrollbar animate-fadeIn">
      {/* Top Header / App Brand */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#22C55E] text-[#0B0F0D] rounded-xl flex items-center justify-center font-black shadow-md shadow-[#22C55E]/20">
            <Zap size={18} className="fill-[#0B0F0D]" />
          </div>
          <div>
            <span className="text-xs font-black text-white tracking-wider block uppercase">ZepGO Route AI</span>
            <span className="text-[10px] text-slate-400 font-medium">Bengaluru ➔ Ooty Trip</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#161C19] border border-[#22C55E]/30 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[10px] font-extrabold text-[#22C55E]">Live Range AI</span>
        </div>
      </div>

      {/* Main Content Scroll Area */}
      <div className="space-y-3.5 my-2">
        {/* Route Input Card */}
        <div className="bg-[#141A17] rounded-[20px] p-3.5 border border-slate-800 space-y-2.5">
          {/* Current Location */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <Navigation size={14} />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Starting Location</span>
              <span className="text-xs font-extrabold text-white">MG Road, Bengaluru</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">GPS Active</span>
          </div>

          <div className="ml-3.5 border-l-2 border-dashed border-slate-700 h-3" />

          {/* Destination */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <MapPin size={14} />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
              <span className="text-xs font-extrabold text-white">Ooty Lake, Tamil Nadu</span>
            </div>
            <span className="text-[10px] font-extrabold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">274 km</span>
          </div>
        </div>

        {/* Live Vehicle Telemetry Card */}
        <div className="bg-[#141A17] rounded-[20px] p-3.5 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tata Nexon EV Max</span>
            <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] px-2 py-0.5 rounded-md border border-[#22C55E]/20">
              SOC 34%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800/80 space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Zap size={11} className="text-[#22C55E]" /> Current Range
              </span>
              <span className="text-sm font-black text-white block">110 km</span>
              <span className="text-[9px] text-amber-400 font-bold block flex items-center gap-1">
                <AlertTriangle size={10} /> Needs Recharge
              </span>
            </div>

            <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800/80 space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Clock size={11} className="text-slate-400" /> Est. Drive Time
              </span>
              <span className="text-sm font-black text-white block">5h 45m</span>
              <span className="text-[9px] text-red-400 font-bold block flex items-center gap-1">
                Arrival SOC: -12% ⚠️
              </span>
            </div>
          </div>
        </div>

        {/* Visual Interactive Map Preview */}
        <div className="relative h-36 bg-[#161C19] rounded-[20px] border border-slate-800 overflow-hidden group">
          {/* Mock Map Background SVG */}
          <svg className="w-full h-full opacity-60" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="160" fill="#121815" />
            {/* Grid lines */}
            <path d="M0 40H400M0 80H400M0 120H400M100 0V160M200 0V160M300 0V160" stroke="#1E2923" strokeWidth="1" strokeDasharray="4 4" />
            {/* Main Highway Route line */}
            <path d="M 30 130 Q 120 110, 214 75 T 370 30" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <path d="M 30 130 Q 120 110, 214 75 T 370 30" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 4" />
            {/* Start Pin */}
            <circle cx="30" cy="130" r="6" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2" />
            {/* Stop Pin (214 km) */}
            <circle cx="214" cy="75" r="9" fill="#EAB308" className="animate-ping opacity-75" />
            <circle cx="214" cy="75" r="7" fill="#EAB308" stroke="#FFFFFF" strokeWidth="2" />
            {/* End Pin */}
            <circle cx="370" cy="30" r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
          </svg>

          {/* Map Overlay Badges */}
          <div className="absolute top-2.5 left-2.5 bg-[#0B0F0D]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5">
            <Navigation size={12} className="text-[#22C55E]" />
            <span>NH 544 Salem Route (274 km)</span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 bg-[#EAB308]/20 border border-[#EAB308]/40 text-[#EAB308] text-[9px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1">
            <Zap size={11} /> Stop Needed @ 214 km
          </div>
        </div>

        {/* Compact Smart Stop Detection Card (Naturally Integrated) */}
        <div className="bg-gradient-to-r from-[#16251C] to-[#121A15] rounded-[20px] p-3.5 border border-[#22C55E]/40 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black">
                <Coffee size={14} />
              </div>
              <span className="text-xs font-black text-white">Smart Stop Detected</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.5 rounded-full">
              Best match for journey
            </span>
          </div>

          <p className="text-[11px] text-slate-300">
            Recommended after <strong className="text-white font-black">214 km</strong>. Recharges battery in{' '}
            <strong className="text-[#22C55E] font-black">24 min</strong> while you take a cafe break.
          </p>

          <div className="flex items-center justify-between bg-[#0B0F0D]/60 p-2 rounded-xl border border-slate-800 text-[10px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Zap size={12} className="text-[#22C55E]" />
              <span>Charging: <strong>24 min</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Coffee size={12} className="text-amber-400" />
              <span>Rest Stop: <strong>Saravana Bhavan</strong></span>
            </div>
          </div>

          <button
            onClick={onViewSmartStop}
            className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-[0.98]"
          >
            <span>View Smart Stop</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Screen 1 Footer note */}
      <div className="pt-1 text-center border-t border-slate-800/80">
        <p className="text-[9px] text-slate-500 font-medium">Screen 1 of 5 • Route Planning + Smart Stop Detection</p>
      </div>
    </div>
  );
};
