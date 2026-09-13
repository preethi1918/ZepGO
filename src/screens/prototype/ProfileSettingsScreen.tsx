import React from 'react';
import { ArrowLeft, Car, Bookmark } from 'lucide-react';

interface ProfileSettingsScreenProps {
  onBack: () => void;
  onChangeVehicle: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onBack,
  onChangeVehicle,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-[#0B0F0D]"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold text-sm text-[#0B0F0D]">Profile & Settings</span>
        <div className="w-9" />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* User Card */}
        <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0B0F0D] rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            VK
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#0B0F0D]">Vijay Kumar</h3>
            <p className="text-xs text-[#6B7280]">+91 98765 43210 • Premium EV Driver</p>
          </div>
        </div>

        {/* My Vehicle Card */}
        <div
          onClick={onChangeVehicle}
          className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-2 cursor-pointer hover:border-[#22C55E] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-[#22C55E]" />
              <span className="font-extrabold text-sm text-[#0B0F0D]">My EV Vehicle</span>
            </div>
            <span className="text-xs font-bold text-[#22C55E]">Change →</span>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#0B0F0D] block">Tata Nexon EV Max</span>
              <span className="text-[10px] text-[#6B7280]">40.5 kWh • CCS2 DC • TN 37 EV 1024</span>
            </div>
            <span className="text-xs font-black text-[#22C55E] bg-[#EAF8EF] px-2.5 py-1 rounded-md">
              98% SOH
            </span>
          </div>
        </div>

        {/* Saved Places */}
        <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Bookmark size={18} className="text-[#22C55E]" />
            <h4 className="font-extrabold text-sm text-[#0B0F0D]">Saved Places & Chargers</h4>
          </div>

          <div className="space-y-2 text-xs font-bold text-[#0B0F0D]">
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
              <span>🏠 Home (Chennai Central)</span>
              <span className="text-[10px] text-[#6B7280]">AC 7.2 kW</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
              <span>⭐ Zeon Fast Charger Salem</span>
              <span className="text-[10px] text-[#22C55E]">150 kW DC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
