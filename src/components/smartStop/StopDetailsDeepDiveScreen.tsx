import React from 'react';
import { ArrowLeft, Zap, Check, Share2, Phone, ParkingSquare } from 'lucide-react';

interface StopDetailsDeepDiveScreenProps {
  onConfirmStop: () => void;
  onBack: () => void;
}

export const StopDetailsDeepDiveScreen: React.FC<StopDetailsDeepDiveScreenProps> = ({
  onConfirmStop,
  onBack,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4 font-[Inter,sans-serif]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] text-[#0B0F0D]"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-black text-sm text-[#0B0F0D]">Stop Deep-Dive Details</span>
        <button className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] text-[#6B7280]">
          <Share2 size={16} />
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Photo Gallery Banner Graphic */}
        <div className="relative w-full h-36 bg-[#0B0F0D] rounded-[24px] overflow-hidden flex items-center justify-center border border-slate-800 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-transparent to-transparent opacity-80 z-10" />
          <div className="text-center z-20 space-y-1">
            <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest bg-[#22C55E]/10 border border-[#22C55E]/30 px-3 py-1 rounded-full">
              Verified Highway EV Hub
            </span>
            <h2 className="text-lg font-black text-white">Saravana Bhavan & Zeon Salem</h2>
            <p className="text-xs text-slate-300">NH544 Bypass, Salem, Tamil Nadu 636005</p>
          </div>
        </div>

        {/* Quick Spec Bar */}
        <div className="grid grid-cols-3 gap-2 text-center bg-white p-3 rounded-[20px] border border-[#E5E7EB] shadow-xs">
          <div>
            <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Rating</span>
            <span className="text-xs font-black text-[#0B0F0D]">⭐ 4.8 / 5.0</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Distance Off Route</span>
            <span className="text-xs font-black text-[#22C55E]">+0.2 km</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Hours</span>
            <span className="text-xs font-black text-[#0B0F0D]">6 AM - 10:30 PM</span>
          </div>
        </div>

        {/* Full Amenity & Specification Matrix */}
        <div className="bg-white rounded-[24px] p-4 border border-[#E5E7EB] shadow-xs space-y-3">
          <h3 className="font-extrabold text-sm text-[#0B0F0D]">Complete Facility Matrix</h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
              <span className="flex items-center gap-2 font-bold text-[#0B0F0D]">
                <Zap size={15} className="text-[#22C55E]" /> EV Charger Hardware
              </span>
              <span className="font-extrabold text-[#22C55E]">150 kW Dual CCS2 (Zeon)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
              <span className="flex items-center gap-2 font-bold text-[#0B0F0D]">
                🚻 Restroom Standard
              </span>
              <span className="font-bold text-slate-700">Air-Conditioned Premium (4.8★)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
              <span className="flex items-center gap-2 font-bold text-[#0B0F0D]">
                <ParkingSquare size={15} className="text-[#22C55E]" /> Parking Facility
              </span>
              <span className="font-bold text-slate-700">Dedicated EV Canopy Slots (6 Slots)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
              <span className="flex items-center gap-2 font-bold text-[#0B0F0D]">
                <Phone size={15} className="text-[#22C55E]" /> Station Phone Support
              </span>
              <span className="font-bold text-[#0B0F0D] underline">+91 94422 10890</span>
            </div>
          </div>
        </div>

        {/* Driver Reviews Summary */}
        <div className="bg-white rounded-[24px] p-4 border border-[#E5E7EB] shadow-xs space-y-2">
          <span className="text-xs font-black text-[#0B0F0D] block">Recent Verified EV Driver Reviews</span>
          <div className="bg-[#EAF8EF] border border-[#22C55E]/30 rounded-xl p-3 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-[#0B0F0D] block">"Perfect Charger & Lunch Stop!" — Karthik R.</span>
            <p className="text-[11px] text-slate-600">
              Charged my Nexon EV 20% to 80% in 24 minutes while having South Indian tiffin at Saravana Bhavan. Zero queue.
            </p>
          </div>
        </div>
      </div>

      {/* Select Stop Button */}
      <button
        onClick={onConfirmStop}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-4 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Check size={18} className="text-[#22C55E]" />
        <span>Add This Verified Stop to Route</span>
      </button>
    </div>
  );
};
