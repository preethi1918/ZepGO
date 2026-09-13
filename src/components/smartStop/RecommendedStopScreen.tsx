import React from 'react';
import { ArrowLeft, Coffee, Zap, ShieldCheck, Check, ParkingSquare } from 'lucide-react';

interface RecommendedStopScreenProps {
  onAddStop: () => void;
  onViewAlternatives: () => void;
  onBack: () => void;
}

export const RecommendedStopScreen: React.FC<RecommendedStopScreenProps> = ({
  onAddStop,
  onViewAlternatives,
  onBack,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4 font-[Inter,sans-serif]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] text-[#0B0F0D] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-black text-sm text-[#0B0F0D]">Smart Stop Recommendation</span>
        <div className="w-9" />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Main Recommendation Hero Card */}
        <div className="bg-white rounded-[24px] p-5 border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#22C55E] bg-[#EAF8EF] border border-[#22C55E]/30 px-2.5 py-0.5 rounded-full">
                  AI Preferred Stop #1
                </span>
                <span className="text-xs font-bold text-[#6B7280]">at 214 km</span>
              </div>
              <h2 className="text-lg font-black text-[#0B0F0D] tracking-tight mt-1">
                Saravana Bhavan & Zeon Fast Charger
              </h2>
              <p className="text-xs text-[#6B7280]">NH544 Salem Bypass • +0.2 km off route</p>
            </div>

            <div className="bg-[#EAF8EF] border border-[#22C55E]/30 px-3 py-1.5 rounded-2xl text-center">
              <span className="text-sm font-black text-[#0B0F0D] block">⭐ 4.8</span>
              <span className="text-[8px] font-extrabold text-[#22C55E] uppercase">1,240 Reviews</span>
            </div>
          </div>

          {/* Dual Sync Badge */}
          <div className="bg-[#EAF8EF] border border-[#22C55E]/40 rounded-[18px] p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-[#0B0F0D]">
              <ShieldCheck size={18} className="text-[#22C55E]" />
              <h4 className="text-xs font-black">Charger & Restroom Sync Alignment</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Charging takes <strong className="text-[#0B0F0D]">24 mins</strong> (22% → 80%). Saravana Bhavan is a <strong className="text-[#22C55E]">2 min walk</strong> away with AC dining, clean restrooms, and parking.
            </p>
          </div>
        </div>

        {/* Section 1: Charger Details */}
        <div className="bg-white rounded-[24px] p-4 border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#22C55E] fill-[#22C55E]" />
              <h3 className="font-extrabold text-sm text-[#0B0F0D]">EV Charger Specification</h3>
            </div>
            <span className="text-[10px] font-black text-[#22C55E] bg-[#EAF8EF] px-2.5 py-0.5 rounded-md">
              150 kW Dual DC
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Plugs Available</span>
              <span className="text-xs font-black text-[#22C55E]">3 / 4 Open</span>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Charge Window</span>
              <span className="text-xs font-black text-[#0B0F0D]">24 Mins</span>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Tariff</span>
              <span className="text-xs font-black text-[#0B0F0D]">₹18.5 / kWh</span>
            </div>
          </div>
        </div>

        {/* Section 2: Cafe & Amenity Details */}
        <div className="bg-white rounded-[24px] p-4 border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
            <div className="flex items-center gap-2">
              <Coffee size={16} className="text-[#22C55E]" />
              <h3 className="font-extrabold text-sm text-[#0B0F0D]">Cafe & Comfort Facilities</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              Open till 10:30 PM
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold text-[#6B7280]">
            <span className="bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              🍽️ South Indian & Tiffin
            </span>
            <span className="bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              🚻 Clean Premium Restrooms
            </span>
            <span className="bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <ParkingSquare size={14} className="text-[#22C55E]" /> Dedicated EV Parking
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onAddStop}
          className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-4 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
        >
          <Check size={18} className="text-[#22C55E]" />
          <span>Add Smart Stop to Journey</span>
        </button>

        <button
          onClick={onViewAlternatives}
          className="w-full bg-white hover:bg-slate-50 text-[#0B0F0D] font-bold py-3 px-6 rounded-[16px] border border-[#E5E7EB] transition-all text-xs cursor-pointer"
        >
          View Alternative Stops (3)
        </button>
      </div>
    </div>
  );
};
