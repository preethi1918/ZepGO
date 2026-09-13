import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface TripCompletedScreenProps {
  onViewSummary: () => void;
}

export const TripCompletedScreen: React.FC<TripCompletedScreenProps> = ({ onViewSummary }) => {
  return (
    <div className="flex-1 bg-white text-[#0B0F0D] flex flex-col justify-between p-6 select-none animate-fadeIn space-y-4">
      {/* Top Tag */}
      <div className="pt-2 text-center">
        <span className="text-[11px] font-extrabold text-[#22C55E] uppercase tracking-widest bg-[#EAF8EF] px-3.5 py-1 rounded-full border border-[#22C55E]/30">
          Trip Completed Successfully
        </span>
      </div>

      {/* Main Celebration Content */}
      <div className="my-auto text-center space-y-5">
        <div className="w-24 h-24 bg-[#EAF8EF] rounded-full flex items-center justify-center border-4 border-[#22C55E]/40 mx-auto shadow-xl shadow-[#22C55E]/20">
          <CheckCircle2 size={48} className="text-[#22C55E]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#0B0F0D] tracking-tight">Arrived in Coimbatore!</h1>
          <p className="text-xs text-[#6B7280]">
            342 km completed from Chennai with zero range anxiety and zero queue time.
          </p>
        </div>

        {/* High-level Achievement Cards */}
        <div className="grid grid-cols-2 gap-3 max-w-[300px] mx-auto">
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[18px] p-3 text-center space-y-0.5">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase block">Total Distance</span>
            <span className="text-lg font-black text-[#0B0F0D]">342 km</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[18px] p-3 text-center space-y-0.5">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase block">Total Duration</span>
            <span className="text-lg font-black text-[#0B0F0D]">5h 38m</span>
          </div>

          <div className="bg-[#EAF8EF] border border-[#22C55E]/30 rounded-[18px] p-3 text-center space-y-0.5 col-span-2">
            <span className="text-[10px] font-extrabold text-[#22C55E] uppercase block">
              ZepGO Uptime & Prediction Accuracy
            </span>
            <span className="text-xl font-black text-[#22C55E]">98.4% Perfect Match</span>
          </div>
        </div>
      </div>

      {/* View Summary CTA */}
      <button
        onClick={onViewSummary}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-4 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <span>View Full Trip Analytics</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};
