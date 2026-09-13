import React, { useState, useEffect } from 'react';
import { Zap, Battery, CheckCircle2, Coffee } from 'lucide-react';

interface ChargingProgressScreenProps {
  onFinishCharging: () => void;
}

export const ChargingProgressScreen: React.FC<ChargingProgressScreenProps> = ({
  onFinishCharging,
}) => {
  const [soc, setSoc] = useState(32);
  const [kwhDelivered, setKwhDelivered] = useState(14.2);
  const [chargingPowerKw] = useState(118);

  useEffect(() => {
    const timer = setInterval(() => {
      setSoc((prev) => {
        if (prev < 80) {
          setKwhDelivered((k) => Number((k + 0.6).toFixed(1)));
          return prev + 1;
        } else {
          clearInterval(timer);
          return 80;
        }
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  const timeRemainingMins = Math.max(0, Math.round(((80 - soc) / 48) * 30));

  return (
    <div className="flex-1 bg-[#0B0F0D] text-white flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4">
      {/* Top Bar */}
      <div className="pt-1 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/30 px-3 py-1 rounded-full text-xs font-bold text-[#22C55E]">
          <Zap size={14} className="fill-[#22C55E] animate-bounce" />
          <span>120 kW Ultra Fast Charging</span>
        </div>
        <span className="text-xs text-slate-400">Zeon Salem Station</span>
      </div>

      {/* Hero Charging Ring / Battery Meter */}
      <div className="my-auto flex flex-col items-center justify-center space-y-5 text-center">
        <div className="relative w-44 h-44 rounded-full bg-[#111613] border-4 border-[#22C55E]/40 flex flex-col items-center justify-center shadow-2xl shadow-[#22C55E]/20">
          <div
            className="absolute inset-0 rounded-full border-4 border-[#22C55E] animate-spin"
            style={{ animationDuration: '4s' }}
          />
          <Battery size={32} className="text-[#22C55E] fill-[#22C55E]" />
          <span className="text-5xl font-black text-white tracking-tight">{soc}%</span>
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-widest">
            Charging Active
          </span>
        </div>

        {/* Live Telemetry Cards Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[320px]">
          <div className="bg-[#161C19] border border-slate-800 p-2.5 rounded-[16px] text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Power Intake</span>
            <span className="text-sm font-black text-[#22C55E]">{chargingPowerKw} kW</span>
          </div>

          <div className="bg-[#161C19] border border-slate-800 p-2.5 rounded-[16px] text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Time Remaining</span>
            <span className="text-sm font-black text-white">{timeRemainingMins} mins</span>
          </div>

          <div className="bg-[#161C19] border border-slate-800 p-2.5 rounded-[16px] text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Energy</span>
            <span className="text-sm font-black text-white">{kwhDelivered} kWh</span>
          </div>
        </div>

        {/* Nearby Amenities banner */}
        <div className="bg-[#161C19] border border-slate-800 rounded-[18px] p-3 w-full max-w-[320px] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Coffee size={16} className="text-[#22C55E]" />
            <span className="text-slate-300 font-medium">Coffee & Restroom available nearby</span>
          </div>
          <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/20 px-2 py-0.5 rounded-md">
            2 min walk
          </span>
        </div>
      </div>

      {/* Stop Charging / Complete Button */}
      <button
        onClick={onFinishCharging}
        className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-4 px-6 rounded-[16px] shadow-lg shadow-[#22C55E]/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <CheckCircle2 size={18} className="fill-[#0B0F0D]" />
        <span>Complete Charging & Resume Trip</span>
      </button>
    </div>
  );
};
