import React from 'react';
import { CheckCircle2, Navigation, Zap, Coffee } from 'lucide-react';

interface RouteUpdatedScreenProps {
  onStartNavigation: () => void;
  onViewRouteDetails: () => void;
}

export const RouteUpdatedScreen: React.FC<RouteUpdatedScreenProps> = ({
  onStartNavigation,
  onViewRouteDetails,
}) => {
  return (
    <div className="flex-1 bg-white text-[#0B0F0D] flex flex-col justify-between p-6 select-none animate-fadeIn space-y-4 font-[Inter,sans-serif]">
      {/* Top Banner Tag */}
      <div className="pt-2 text-center">
        <span className="text-[11px] font-black text-[#22C55E] uppercase tracking-widest bg-[#EAF8EF] px-3.5 py-1 rounded-full border border-[#22C55E]/30">
          ✓ Journey & Smart Stop Confirmed
        </span>
      </div>

      {/* Hero Success Icon & Headline */}
      <div className="my-auto text-center space-y-4">
        <div className="w-20 h-20 bg-[#EAF8EF] rounded-full flex items-center justify-center border-4 border-[#22C55E]/40 mx-auto shadow-xl shadow-[#22C55E]/20">
          <CheckCircle2 size={44} className="text-[#22C55E]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#0B0F0D] tracking-tight">Route Successfully Updated</h1>
          <p className="text-xs text-[#6B7280]">
            Chennai → Coimbatore (342 km) with 1 Synchronized Charge & Cafe Stop.
          </p>
        </div>

        {/* Recalculated Journey Metrics Summary Card */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[24px] p-4 text-left space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
            <span className="text-xs font-black text-[#0B0F0D]">Recalculated Journey Metrics</span>
            <span className="text-[10px] font-bold text-[#22C55E] bg-[#EAF8EF] px-2 py-0.5 rounded-md">
              ETA: 5h 42m Total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Total Distance</span>
              <span className="text-sm font-black text-[#0B0F0D]">342.4 km</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Arrival Battery</span>
              <span className="text-sm font-black text-[#22C55E]">38% SOC</span>
            </div>

            <div className="bg-[#EAF8EF] p-2.5 rounded-xl border border-[#22C55E]/30 text-[#0B0F0D]">
              <span className="text-[9px] font-extrabold text-[#22C55E] uppercase block flex items-center justify-center gap-1">
                <Zap size={11} /> 1 Charging Stop
              </span>
              <span className="text-xs font-black">24 mins (120 kW)</span>
            </div>

            <div className="bg-[#EAF8EF] p-2.5 rounded-xl border border-[#22C55E]/30 text-[#0B0F0D]">
              <span className="text-[9px] font-extrabold text-[#22C55E] uppercase block flex items-center justify-center gap-1">
                <Coffee size={11} /> 1 Rest Stop
              </span>
              <span className="text-xs font-black">25 mins meal break</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pb-2">
        <button
          onClick={onStartNavigation}
          className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-4 px-6 rounded-[16px] shadow-lg shadow-[#0B0F0D]/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
        >
          <Navigation size={18} className="text-[#22C55E] fill-[#22C55E]" />
          <span>Start Navigation with Smart Stop</span>
        </button>

        <button
          onClick={onViewRouteDetails}
          className="w-full bg-[#F3F4F6] hover:bg-slate-200 text-[#0B0F0D] font-bold py-3 px-6 rounded-[16px] text-xs transition-colors"
        >
          View Detailed Itinerary
        </button>
      </div>
    </div>
  );
};
