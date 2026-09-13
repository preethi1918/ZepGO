import React from 'react';
import { ArrowLeft, Zap, Clock, Coffee, Wifi, Shield, ArrowUpRight } from 'lucide-react';

interface StationDetailsScreenProps {
  onBack: () => void;
  onSelectBackup: () => void;
  onStartSession: () => void;
}

export const StationDetailsScreen: React.FC<StationDetailsScreenProps> = ({
  onBack,
  onSelectBackup,
  onStartSession,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-[#0B0F0D] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold text-sm text-[#0B0F0D]">Charger Predictive Details</span>
        <div className="w-9" />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Main Station Header Card */}
        <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                Zeon Charging Network
              </span>
              <h2 className="text-lg font-extrabold text-[#0B0F0D]">Zeon Fast Charger Salem</h2>
              <p className="text-xs text-[#6B7280]">NH544 Salem Bypass • 214 km from origin</p>
            </div>
            <div className="bg-[#EAF8EF] border border-[#22C55E]/40 text-[#22C55E] px-3 py-1 rounded-full text-center">
              <span className="text-sm font-black block">94%</span>
              <span className="text-[8px] font-bold uppercase">Uptime Score</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Max Speed</span>
              <span className="text-xs font-black text-[#0B0F0D]">150 kW Dual DC</span>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Tariff Rate</span>
              <span className="text-xs font-black text-[#22C55E]">₹18.5 / kWh</span>
            </div>
          </div>
        </div>

        {/* Predictive Availability Feature (Core Differentiator) */}
        <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#22C55E]" />
              <h3 className="font-extrabold text-sm text-[#0B0F0D]">ZepGO Plug Predictions</h3>
            </div>
            <span className="text-[10px] font-bold text-[#22C55E] bg-[#EAF8EF] px-2 py-0.5 rounded-md">
              AI Forecasted
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-[16px] bg-[#F8FAFC] border border-slate-100">
              <span className="text-[10px] font-bold text-[#6B7280] block">Right Now</span>
              <span className="text-sm font-black text-[#22C55E]">4 / 4 Open</span>
              <span className="text-[9px] text-slate-500 block">No wait</span>
            </div>

            <div className="p-3 rounded-[16px] bg-[#EAF8EF] border border-[#22C55E]/40 shadow-sm">
              <span className="text-[10px] font-extrabold text-[#22C55E] block">At Arrival (+30m)</span>
              <span className="text-sm font-black text-[#22C55E]">3 / 4 Open</span>
              <span className="text-[9px] text-[#22C55E] font-bold block">1:30 PM Arrival</span>
            </div>

            <div className="p-3 rounded-[16px] bg-[#F8FAFC] border border-slate-100">
              <span className="text-[10px] font-bold text-[#6B7280] block">In 60 Mins</span>
              <span className="text-sm font-black text-[#0B0F0D]">2 / 4 Open</span>
              <span className="text-[9px] text-slate-500 block">Peak crowd</span>
            </div>
          </div>
        </div>

        {/* Verified Backup Charger Card */}
        <div
          onClick={onSelectBackup}
          className="bg-[#EAF8EF] border border-[#22C55E]/40 rounded-[20px] p-3.5 space-y-2 cursor-pointer hover:bg-[#EAF8EF]/80 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#0B0F0D]">
              <Shield size={16} className="text-[#22C55E]" />
              <span className="text-xs font-extrabold">Automated Backup Charger</span>
            </div>
            <span className="text-xs font-bold text-[#22C55E] flex items-center gap-0.5">
              Change <ArrowUpRight size={14} />
            </span>
          </div>
          <p className="text-xs text-slate-700">
            <strong>Relux Fast Charger Salem</strong> • 2.4 km away (2/2 Plugs predicted open). Automatically
            activated if primary gets congested.
          </p>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-2">
          <span className="text-xs font-extrabold text-[#0B0F0D] block">Station Amenities</span>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-[#6B7280]">
            <span className="bg-[#F8FAFC] border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Coffee size={14} className="text-[#22C55E]" /> Cafe & Lounge
            </span>
            <span className="bg-[#F8FAFC] border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Wifi size={14} className="text-[#22C55E]" /> High-speed WiFi
            </span>
            <span className="bg-[#F8FAFC] border border-slate-200 px-3 py-1 rounded-xl">🚻 Restrooms</span>
          </div>
        </div>
      </div>

      {/* Start Session CTA */}
      <button
        onClick={onStartSession}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-3.5 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Zap size={18} className="text-[#22C55E] fill-[#22C55E]" />
        <span>Initiate 120kW Fast Charge</span>
      </button>
    </div>
  );
};
