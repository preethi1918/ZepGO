import React from 'react';
import { Car, Battery, ShieldCheck, Zap, RefreshCw, Sliders, ChevronRight } from 'lucide-react';

interface MyVehicleScreenProps {
  vehicleModel: string;
  batterySoc: number;
  onChangeVehicle: () => void;
  onChangeBattery: () => void;
  onBack?: () => void;
}

export const MyVehicleScreen: React.FC<MyVehicleScreenProps> = ({
  vehicleModel,
  batterySoc,
  onChangeVehicle,
  onChangeBattery,
  onBack,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-4 select-none animate-fadeIn space-y-3">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-1 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#6B7280] bg-white border border-slate-200 px-3 py-1 rounded-full"
            >
              ← Back
            </button>
          )}
          <h2 className="text-lg font-black text-[#0B0F0D] flex items-center gap-2">
            <Car className="text-[#22C55E]" size={20} />
            My EV Garage
          </h2>
        </div>

        <button
          onClick={onChangeVehicle}
          className="text-xs font-extrabold text-[#22C55E] bg-[#EAF8EF] border border-[#22C55E]/30 px-3 py-1.5 rounded-full flex items-center gap-1"
        >
          <RefreshCw size={13} />
          Switch EV
        </button>
      </div>

      {/* Vehicle Hero Card */}
      <div className="bg-[#0B0F0D] text-white rounded-[24px] p-5 shadow-xl space-y-4 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[10px] font-extrabold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Connected Vehicle
            </span>
            <h3 className="text-xl font-black text-white mt-2">{vehicleModel}</h3>
            <p className="text-xs text-slate-400">40.5 kWh Pack • CCS2 DC Port • Real-world 320 km Range</p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#22C55E]">
            <Car size={26} />
          </div>
        </div>

        {/* Battery Telemetry Card */}
        <div
          onClick={onChangeBattery}
          className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-[18px] flex items-center justify-between cursor-pointer hover:border-[#22C55E] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center font-black text-sm">
              <Battery size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Current State of Charge</span>
              <span className="text-lg font-black text-white">{batterySoc}% SOC</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-[#22C55E] block">
              ~{Math.round((batterySoc / 100) * 320)} km Range
            </span>
            <span className="text-[10px] text-slate-400 underline">Tap to adjust →</span>
          </div>
        </div>
      </div>

      {/* EV Specs & Calibration */}
      <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-3">
        <h4 className="font-extrabold text-xs text-[#0B0F0D] uppercase tracking-wider">
          Intelligent Battery Calibration Specs
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold text-[#6B7280] block">Max DC Fast Charge</span>
            <span className="font-black text-[#0B0F0D] flex items-center gap-1">
              <Zap size={14} className="text-[#22C55E]" /> 80 kW Peak DC
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold text-[#6B7280] block">AC Home Charger</span>
            <span className="font-black text-[#0B0F0D]">7.2 kW Single-Phase</span>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold text-[#6B7280] block">Efficiency Rate</span>
            <span className="font-[#0B0F0D] font-black">128 Wh/km (AC on)</span>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold text-[#6B7280] block">Battery Health (SOH)</span>
            <span className="font-black text-[#22C55E] flex items-center gap-1">
              <ShieldCheck size={14} /> 98% Optimal
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle Settings CTA */}
      <button
        onClick={onChangeVehicle}
        className="w-full bg-white border border-[#E5E7EB] hover:border-[#0B0F0D] text-[#0B0F0D] font-extrabold py-3.5 px-4 rounded-[16px] transition-all flex items-center justify-between text-xs cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-[#22C55E]" />
          <span>Calibrate Range & AC Consumption Curves</span>
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </button>
    </div>
  );
};
