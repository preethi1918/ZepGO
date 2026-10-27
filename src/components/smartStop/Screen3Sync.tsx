import React from 'react';
import { ArrowLeft, Zap, Coffee, Sparkles, Check, ShieldCheck } from 'lucide-react';

interface Screen3SyncProps {
  onAddSmartStop: () => void;
  onBack: () => void;
}

export const Screen3Sync: React.FC<Screen3SyncProps> = ({ onAddSmartStop, onBack }) => {
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
          <span className="text-xs font-black text-white tracking-wider block uppercase">Charging & Cafe Sync</span>
          <span className="text-[10px] font-extrabold text-[#22C55E]">Screen 3 of 5 • Core Innovation</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Main Content Area */}
      <div className="space-y-3.5 my-2">
        {/* Core Slogan Hero Header */}
        <div className="bg-gradient-to-br from-[#16291E] via-[#121A15] to-[#0B0F0D] border border-[#22C55E]/40 rounded-[22px] p-4 text-center space-y-1.5 shadow-xl">
          <div className="inline-flex items-center gap-1.5 bg-[#22C55E]/15 border border-[#22C55E]/30 px-3 py-1 rounded-full text-[#22C55E] text-[10px] font-extrabold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>ZepGO AI Synchronization</span>
          </div>

          <h1 className="text-xl font-black text-white tracking-tight pt-1">
            "Charge. Eat. Continue."
          </h1>

          <p className="text-[11px] text-slate-300 leading-snug">
            ZepGO doesn't just find where to charge. It synchronizes EV charging time with your dining & rest break!
          </p>
        </div>

        {/* Visual Timeline Section */}
        <div className="bg-[#141A17] rounded-[20px] p-3 border border-slate-800 space-y-2">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block text-center">
            Synchronized Journey Timeline
          </span>

          <div className="flex items-center justify-between bg-[#0B0F0D] p-2.5 rounded-xl border border-slate-800/80 text-xs">
            {/* Step 1: Arrive */}
            <div className="text-center space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">ARRIVE</span>
              <span className="text-[10px] font-extrabold text-amber-400 block">214 km</span>
              <span className="text-[9px] text-slate-400">SOC 22%</span>
            </div>

            <div className="text-[#22C55E] font-black text-xs">➔</div>

            {/* Step 2: Charge */}
            <div className="text-center space-y-0.5 bg-[#22C55E]/10 p-1.5 rounded-lg border border-[#22C55E]/30">
              <span className="text-[9px] font-black text-[#22C55E] block uppercase">24 min</span>
              <span className="text-[10px] font-extrabold text-white block">CHARGING</span>
              <span className="text-[9px] text-[#22C55E]">150 kW DC</span>
            </div>

            <div className="text-[#22C55E] font-black text-xs">➔</div>

            {/* Step 3: Rest */}
            <div className="text-center space-y-0.5 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/30">
              <span className="text-[9px] font-black text-amber-400 block uppercase">25 min</span>
              <span className="text-[10px] font-extrabold text-white block">CAFE / REST</span>
              <span className="text-[9px] text-amber-400">120m Walk</span>
            </div>

            <div className="text-[#22C55E] font-black text-xs">➔</div>

            {/* Step 4: Continue */}
            <div className="text-center space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">CONTINUE</span>
              <span className="text-[10px] font-extrabold text-[#22C55E] block">READY</span>
              <span className="text-[9px] text-[#22C55E]">SOC 80%</span>
            </div>
          </div>
        </div>

        {/* Dual Side-by-Side Cards (EV Charging + Nearby Cafe) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: EV Charging */}
          <div className="bg-[#141A17] rounded-[18px] p-3 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <div className="w-5 h-5 rounded-md bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center">
                <Zap size={12} />
              </div>
              <span className="text-[11px] font-extrabold text-white">EV Charging</span>
            </div>

            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Battery Fill:</span>
                <span className="font-extrabold text-[#22C55E]">22% → 80%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Time:</span>
                <span className="font-extrabold text-white">24 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Charger:</span>
                <span className="font-bold text-white">150 kW DC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plugs:</span>
                <span className="font-extrabold text-[#22C55E]">3/4 available</span>
              </div>
            </div>
          </div>

          {/* Card 2: Nearby Cafe */}
          <div className="bg-[#141A17] rounded-[18px] p-3 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Coffee size={12} />
              </div>
              <span className="text-[11px] font-extrabold text-white">Nearby Cafe</span>
            </div>

            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Walk Dist:</span>
                <span className="font-bold text-white">120 m walk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rec. Break:</span>
                <span className="font-extrabold text-amber-400">25 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hours:</span>
                <span className="font-bold text-white">Open till 10 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rating:</span>
                <span className="font-extrabold text-amber-400">⭐ 4.8 / 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Synchronization Banner */}
        <div className="bg-[#16251C] border border-[#22C55E]/40 rounded-[18px] p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">"Your charging time matches your break time."</h4>
            <p className="text-[10px] text-slate-300">
              Zero extra waiting. Charge your EV while taking your coffee & dining break.
            </p>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-2 border-t border-slate-800 space-y-1">
        <button
          onClick={onAddSmartStop}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3.5 px-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
        >
          <Check size={16} className="stroke-[3]" />
          <span>Add Smart Stop</span>
        </button>
      </div>
    </div>
  );
};
