import React from 'react';
import { ArrowLeft, CheckCircle2, Zap, Coffee, Navigation, Play } from 'lucide-react';

interface Screen4RouteUpdatedProps {
  onStartNavigation: () => void;
  onBack: () => void;
}

export const Screen4RouteUpdated: React.FC<Screen4RouteUpdatedProps> = ({
  onStartNavigation,
  onBack,
}) => {
  return (
    <div className="flex-1 bg-[#0B0F0D] text-white flex flex-col justify-between p-4 select-none font-[Inter,sans-serif] overflow-y-auto no-scrollbar animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-slate-800/80">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-[#161C19] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="text-center">
          <span className="text-xs font-black text-white tracking-wider block uppercase">Route Updated</span>
          <span className="text-[10px] font-extrabold text-[#22C55E]">Screen 4 of 5</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Main Content Area */}
      <div className="space-y-3.5 my-2">
        {/* Status Confirmation Banner */}
        <div className="bg-[#142318] border border-[#22C55E]/40 rounded-[20px] p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shrink-0 shadow-md">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[9px] font-black text-[#22C55E] uppercase tracking-wider block">
              Smart Stop Inserted
            </span>
            <h2 className="text-xs font-black text-white">Route Successfully Updated</h2>
            <p className="text-[10px] text-slate-300">Saravana Bhavan + Zep Fast Hub added at 214 km</p>
          </div>
        </div>

        {/* Updated Route Map Preview */}
        <div className="relative h-32 bg-[#141A17] rounded-[20px] border border-slate-800 overflow-hidden">
          <svg className="w-full h-full opacity-70" viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="140" fill="#101713" />
            <path d="M0 35H400M0 70H400M0 105H400M133 0V140M266 0V140" stroke="#1A241E" strokeWidth="1" strokeDasharray="4 4" />
            {/* Active Route Line */}
            <path d="M 30 110 Q 130 90, 214 60 T 370 25" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" />
            {/* Start Pin */}
            <circle cx="30" cy="110" r="5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2" />
            {/* Smart Stop Pin */}
            <circle cx="214" cy="60" r="7" fill="#EAB308" stroke="#FFFFFF" strokeWidth="2" />
            {/* End Pin */}
            <circle cx="370" cy="25" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
          </svg>

          <div className="absolute top-2 left-2 bg-[#0B0F0D]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-bold text-white flex items-center gap-1.5">
            <Navigation size={12} className="text-[#22C55E]" />
            <span>Bengaluru ➔ Saravana Bhavan ➔ Ooty</span>
          </div>

          <div className="absolute bottom-2 right-2 bg-[#22C55E]/20 backdrop-blur-md px-2 py-0.5 rounded border border-[#22C55E]/40 text-[9px] font-extrabold text-[#22C55E]">
            274 km Total
          </div>
        </div>

        {/* ETA & Metrics Comparison Grid */}
        <div className="bg-[#141A17] rounded-[20px] p-3.5 border border-slate-800 space-y-2.5">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">
            Trip Telemetry & Battery Summary
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* ETA Comparison */}
            <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Estimated Arrival</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 line-through text-[10px]">6:40 PM</span>
                <span className="font-black text-[#22C55E] text-sm">7:05 PM</span>
              </div>
              <span className="text-[9px] text-slate-400 block">+25 min break included</span>
            </div>

            {/* Arrival Battery */}
            <div className="bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Arrival Battery</span>
              <span className="font-black text-[#22C55E] text-sm block">18% SOC</span>
              <span className="text-[9px] text-[#22C55E] font-bold block">✓ Safe Destination Reserve</span>
            </div>
          </div>
        </div>

        {/* Concise Smart Stop Break Summary Card */}
        <div className="bg-[#141A17] rounded-[20px] p-3.5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-extrabold text-white">Smart Stop Summary</span>
            <span className="text-[10px] font-extrabold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-md">
              25 min Total Stop
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex items-center gap-2 bg-[#0B0F0D] p-2 rounded-xl border border-slate-800">
              <Zap size={14} className="text-[#22C55E]" />
              <div>
                <span className="text-slate-400 block">Charging</span>
                <span className="font-black text-white">24 min (150 kW)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#0B0F0D] p-2 rounded-xl border border-slate-800">
              <Coffee size={14} className="text-amber-400" />
              <div>
                <span className="text-slate-400 block">Cafe Break</span>
                <span className="font-black text-white">25 min Saravana Bhavan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-2 border-t border-slate-800">
        <button
          onClick={onStartNavigation}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3.5 px-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
        >
          <Play size={16} className="fill-[#0B0F0D]" />
          <span>Start Navigation</span>
        </button>
      </div>
    </div>
  );
};
