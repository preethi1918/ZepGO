import React from 'react';
import { ArrowLeft, Zap, Coffee, Check, Sparkles } from 'lucide-react';

interface ChargingCafeCombinedScreenProps {
  onConfirmUnifiedStop: () => void;
  onBack: () => void;
}

export const ChargingCafeCombinedScreen: React.FC<ChargingCafeCombinedScreenProps> = ({
  onConfirmUnifiedStop,
  onBack,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4 font-[Inter,sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] text-[#0B0F0D]"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-black text-sm text-[#0B0F0D]">Unified Charger + Cafe Sync</span>
        <div className="w-9" />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Core Synchronization Banner */}
        <div className="bg-[#EAF8EF] border border-[#22C55E]/40 rounded-[22px] p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[#22C55E]">
            <Sparkles size={16} />
            <span className="text-xs font-black uppercase tracking-wider">AI Perfect Sync Match</span>
          </div>
          <h2 className="text-base font-black text-[#0B0F0D]">
            "Perfect timing for a 25-min break"
          </h2>
          <p className="text-xs text-slate-700 leading-snug">
            Your EV requires 24 minutes to charge to 80%. Saravana Bhavan is a 2-minute walk away, giving you a synchronized 20-minute meal window.
          </p>
        </div>

        {/* Side-by-Side Dual Card Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Charger Side Card */}
          <div className="bg-white rounded-[22px] p-4 border border-[#E5E7EB] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#22C55E] fill-[#22C55E]" />
                <span className="font-extrabold text-xs text-[#0B0F0D]">Zeon Fast Charger</span>
              </div>
              <span className="text-[10px] font-black text-[#22C55E] bg-[#EAF8EF] px-2 py-0.5 rounded-md">
                150 kW DC
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#0B0F0D]">
                <span>Required SOC Fill</span>
                <span>22% → 80%</span>
              </div>
              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>Est. Charge Time</span>
                <span className="font-black text-[#0B0F0D]">24 mins</span>
              </div>
              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>Plug Availability</span>
                <span className="font-black text-[#22C55E]">3 / 4 Plugs Open</span>
              </div>
            </div>
          </div>

          {/* Cafe Side Card */}
          <div className="bg-white rounded-[22px] p-4 border border-[#E5E7EB] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
              <div className="flex items-center gap-2">
                <Coffee size={16} className="text-[#22C55E]" />
                <span className="font-extrabold text-xs text-[#0B0F0D]">Saravana Bhavan</span>
              </div>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                ⭐ 4.8 Rating
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#0B0F0D]">
                <span>Walking Distance</span>
                <span>2 min walk (120m)</span>
              </div>
              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>Available Meal Time</span>
                <span className="font-black text-[#22C55E]">20 mins synchronized</span>
              </div>
              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>Closing Status</span>
                <span className="font-bold text-[#0B0F0D]">Open (till 10:30 PM)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm CTA */}
      <button
        onClick={onConfirmUnifiedStop}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-4 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Check size={18} className="text-[#22C55E]" />
        <span>Confirm Synchronized Charge & Cafe Stop</span>
      </button>
    </div>
  );
};
