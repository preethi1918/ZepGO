import React from 'react';
import { Coffee, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

interface SmartStopDetectionCardProps {
  onViewRecommendation: () => void;
  onViewAlternatives: () => void;
}

export const SmartStopDetectionCard: React.FC<SmartStopDetectionCardProps> = ({
  onViewRecommendation,
  onViewAlternatives,
}) => {
  return (
    <div className="bg-white rounded-[22px] p-4 border border-[#E5E7EB] shadow-[0_4px_20px_-4px_rgba(11,15,13,0.08)] space-y-3 font-[Inter,sans-serif] animate-fadeIn">
      {/* AI Detection Header Banner */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#EAF8EF] rounded-xl flex items-center justify-center border border-[#22C55E]/30 text-[#22C55E]">
            <Coffee size={15} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-[#22C55E] tracking-wider">
                AI Break & Charge Sync
              </span>
            </div>
            <h4 className="text-xs font-black text-[#0B0F0D]">Recommended Smart Rest Stop</h4>
          </div>
        </div>

        <span className="text-[10px] font-extrabold bg-[#EAF8EF] text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-0.5 rounded-full">
          2h 15m Driving Time
        </span>
      </div>

      {/* Primary Location & Combined Telemetry */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm text-[#0B0F0D]">Saravana Bhavan & Zeon Fast Hub</h3>
            <span className="text-[9px] font-bold bg-[#F3F4F6] text-slate-700 px-2 py-0.5 rounded-md">
              NH544 Salem Bypass
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">At 214 km • +0.2 km off main route</p>
        </div>

        <div className="text-right bg-[#EAF8EF] px-2.5 py-1 rounded-xl border border-[#22C55E]/30">
          <span className="text-[9px] font-bold text-[#22C55E] uppercase block">Rating</span>
          <span className="text-xs font-black text-[#0B0F0D]">⭐ 4.8 / 5</span>
        </div>
      </div>

      {/* Synchronization Grid: Charge Time vs Driver Break Window */}
      <div className="grid grid-cols-2 gap-2 text-center bg-[#F8FAFC] p-3 rounded-[16px] border border-[#E5E7EB]">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold text-[#6B7280] uppercase flex items-center justify-center gap-1">
            <Zap size={11} className="text-[#22C55E]" /> EV Charge Window
          </span>
          <span className="text-xs font-black text-[#0B0F0D]">24 mins (22% → 80%)</span>
          <span className="text-[9px] text-[#22C55E] font-bold block">150 kW DC • 3/4 Open</span>
        </div>

        <div className="space-y-0.5 border-l border-[#E5E7EB]">
          <span className="text-[9px] font-bold text-[#6B7280] uppercase flex items-center justify-center gap-1">
            <Coffee size={11} className="text-[#22C55E]" /> Cafe Walk Time
          </span>
          <span className="text-xs font-black text-[#0B0F0D]">2 min walk (120m)</span>
          <span className="text-[9px] text-[#6B7280] block">Pure Veg • Open till 10 PM</span>
        </div>
      </div>

      {/* Alignment Badge */}
      <div className="bg-[#EAF8EF] text-[#22C55E] border border-[#22C55E]/30 rounded-xl p-2 text-center flex items-center justify-center gap-1.5 text-xs font-extrabold">
        <ShieldCheck size={14} />
        <span>Perfect timing for a 25-min lunch & rest break</span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onViewRecommendation}
          className="flex-1 bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-3 px-4 rounded-[14px] shadow-md transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-[0.98]"
        >
          <span>View Smart Stop Details</span>
          <ChevronRight size={15} />
        </button>

        <button
          onClick={onViewAlternatives}
          className="bg-white hover:bg-slate-50 text-[#0B0F0D] font-bold py-3 px-3 rounded-[14px] border border-[#E5E7EB] transition-all text-xs cursor-pointer"
        >
          Alternatives (3)
        </button>
      </div>
    </div>
  );
};
