import React from 'react';
import { ArrowLeft, Zap, ShieldCheck, DollarSign, Leaf, BarChart3 } from 'lucide-react';

interface TripSummaryAnalyticsScreenProps {
  onBackToHome: () => void;
}

export const TripSummaryAnalyticsScreen: React.FC<TripSummaryAnalyticsScreenProps> = ({
  onBackToHome,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBackToHome}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-[#0B0F0D] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold text-sm text-[#0B0F0D]">Trip Analytics & Summary</span>
        <div className="w-9" />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Main Route Title Header */}
        <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase">Chennai → Coimbatore</span>
            <span className="text-xs font-bold text-[#22C55E]">Completed Today</span>
          </div>
          <h2 className="text-lg font-black text-[#0B0F0D]">342 km Intelligent Journey</h2>
        </div>

        {/* Prediction Accuracy Card */}
        <div className="bg-[#EAF8EF] border border-[#22C55E]/40 rounded-[20px] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#22C55E]" />
              <h3 className="font-extrabold text-sm text-[#0B0F0D]">Prediction Accuracy</h3>
            </div>
            <span className="text-base font-black text-[#22C55E]">98.4%</span>
          </div>
          <p className="text-xs text-slate-700 leading-snug">
            Actual arrival SOC (23%) and plug availability (3/4 open) matched ZepGO AI forecast with 98.4% precision.
          </p>
        </div>

        {/* Detailed Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3.5 rounded-[18px] border border-[#E5E7EB] shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-[#6B7280]">
              <Zap size={14} className="text-[#22C55E]" />
              <span className="text-[10px] font-bold uppercase">Energy Used</span>
            </div>
            <span className="text-lg font-black text-[#0B0F0D]">42 kWh</span>
            <span className="text-[10px] text-slate-500 block">142 Wh/km efficiency</span>
          </div>

          <div className="bg-white p-3.5 rounded-[18px] border border-[#E5E7EB] shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-[#6B7280]">
              <DollarSign size={14} className="text-[#22C55E]" />
              <span className="text-[10px] font-bold uppercase">Money Saved</span>
            </div>
            <span className="text-lg font-black text-[#22C55E]">₹1,840</span>
            <span className="text-[10px] text-slate-500 block">vs Petrol SUV</span>
          </div>

          <div className="bg-white p-3.5 rounded-[18px] border border-[#E5E7EB] shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-[#6B7280]">
              <Leaf size={14} className="text-[#22C55E]" />
              <span className="text-[10px] font-bold uppercase">CO₂ Offset</span>
            </div>
            <span className="text-lg font-black text-[#0B0F0D]">48.6 kg</span>
            <span className="text-[10px] text-slate-500 block">Zero tailpipe emissions</span>
          </div>

          <div className="bg-white p-3.5 rounded-[18px] border border-[#E5E7EB] shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-[#6B7280]">
              <BarChart3 size={14} className="text-[#22C55E]" />
              <span className="text-[10px] font-bold uppercase">Wait Time</span>
            </div>
            <span className="text-lg font-black text-[#22C55E]">0 Mins</span>
            <span className="text-[10px] text-slate-500 block">Immediate plug-in</span>
          </div>
        </div>
      </div>

      {/* Done Button */}
      <button
        onClick={onBackToHome}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-3.5 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <span>Return to Home Dashboard</span>
      </button>
    </div>
  );
};
