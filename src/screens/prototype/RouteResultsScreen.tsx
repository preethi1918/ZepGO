import React from 'react';
import { Navigation, ShieldCheck, Zap, ChevronRight, Info, Layers } from 'lucide-react';

interface RouteResultsScreenProps {
  onStartJourney: () => void;
  onCompareRoutes: () => void;
  onViewStationDetails: () => void;
  onBack: () => void;
}

export const RouteResultsScreen: React.FC<RouteResultsScreenProps> = ({
  onStartJourney,
  onCompareRoutes,
  onViewStationDetails,
  onBack,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-4 select-none animate-fadeIn space-y-3">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#6B7280] hover:text-[#0B0F0D] bg-white border border-slate-200 px-3 py-1.5 rounded-full"
        >
          ← Edit Origin
        </button>
        <span className="font-extrabold text-xs text-[#0B0F0D] bg-white border border-slate-200 px-3 py-1.5 rounded-full">
          Chennai → Coimbatore
        </span>
        <button
          onClick={onCompareRoutes}
          className="flex items-center gap-1 text-xs font-bold text-[#22C55E] bg-[#EAF8EF] border border-[#22C55E]/30 px-3 py-1.5 rounded-full"
        >
          <Layers size={13} />
          <span>3 Routes</span>
        </button>
      </div>

      {/* Main Route Summary Banner */}
      <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-3">
        {/* Route Stats & LOW RISK Status Badge */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0B0F0D]">342 km</span>
              <span className="text-xs font-bold text-[#6B7280]">5h 42m total</span>
            </div>
            <span className="text-xs text-[#22C55E] font-semibold">1 Stop Required • 38 kWh energy</span>
          </div>

          {/* Prominent LOW RISK Badge in Green */}
          <div className="bg-[#EAF8EF] border border-[#22C55E]/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <ShieldCheck size={16} className="text-[#22C55E]" />
            <span className="text-xs font-black text-[#22C55E] tracking-wide uppercase">LOW RISK</span>
          </div>
        </div>

        {/* Visual Progress Map Bar */}
        <div className="bg-[#F8FAFC] p-3 rounded-[16px] border border-[#E5E7EB] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#0B0F0D]">
            <span>Chennai (72% SOC)</span>
            <span className="text-[#22C55E] font-extrabold">Salem Stop (22% SOC)</span>
            <span>Coimbatore (38% SOC)</span>
          </div>

          <div className="relative w-full h-3 bg-slate-200 rounded-full flex items-center p-0.5">
            <div className="w-[62%] h-full bg-[#22C55E] rounded-l-full" />
            <div className="absolute left-[62%] -translate-x-1/2 w-4 h-4 rounded-full bg-[#0B0F0D] border-2 border-[#22C55E] shadow-md flex items-center justify-center">
              <Zap size={9} className="text-[#22C55E]" />
            </div>
            <div className="w-[38%] h-full bg-[#22C55E]/70 rounded-r-full" />
          </div>
        </div>
      </div>

      {/* Planned Stop Details Card */}
      <div
        onClick={onViewStationDetails}
        className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-3 cursor-pointer hover:border-[#22C55E] transition-all"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span className="text-xs font-extrabold text-[#0B0F0D]">Planned Stop 1 (at 214 km)</span>
          </div>
          <span className="text-[11px] font-bold text-[#22C55E] underline">View Charger →</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-[#0B0F0D]">Zeon Fast Charger Salem</h4>
              <span className="text-[10px] font-extrabold bg-[#EAF8EF] text-[#22C55E] px-2 py-0.5 rounded-md">
                150 kW DC
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">NH544 Bypass, Salem • Restroom, Cafe, EV Lounge</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Arrival Time</span>
            <span className="text-xs font-black text-[#0B0F0D]">1:30 PM</span>
          </div>
          <div className="bg-[#EAF8EF] p-2 rounded-xl border border-[#22C55E]/30">
            <span className="text-[9px] font-bold text-[#22C55E] uppercase block">Pred. Plugs</span>
            <span className="text-xs font-black text-[#22C55E]">3 / 4 Open</span>
          </div>
          <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Charge Time</span>
            <span className="text-xs font-black text-[#0B0F0D]">24 mins</span>
          </div>
        </div>
      </div>

      {/* ZepGO Core Differentiator AI Explanation Card */}
      <div className="bg-[#EAF8EF] border border-[#22C55E]/40 rounded-[20px] p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-[#0B0F0D]">
          <Info size={16} className="text-[#22C55E] shrink-0" />
          <h4 className="text-xs font-extrabold">ZepGO Predictive Confidence Insight</h4>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          "Predicted arrival SOC at Salem charger is <strong className="text-[#0B0F0D]">22%</strong>. Charger is
          predicted to have <strong className="text-[#22C55E]">3 of 4 plugs open at 1:30 PM</strong> (94% confidence rating). Verified backup charger Relux 2.4 km away."
        </p>
      </div>

      {/* Main Start Journey CTA Button */}
      <button
        onClick={onStartJourney}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-4 px-6 rounded-[16px] shadow-lg shadow-[#0B0F0D]/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Navigation size={18} className="text-[#22C55E] fill-[#22C55E]" />
        <span>Start Live Journey Navigation</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
