import React, { useState } from 'react';
import { ArrowLeft, Battery, Check, AlertTriangle } from 'lucide-react';

interface BatteryInputScreenProps {
  onConfirm: (soc: number) => void;
  onBack: () => void;
  initialSoc?: number;
}

export const BatteryInputScreen: React.FC<BatteryInputScreenProps> = ({
  onConfirm,
  onBack,
  initialSoc = 72,
}) => {
  const [soc, setSoc] = useState(initialSoc);

  const presets = [20, 50, 72, 80, 100];
  const maxRange = 312;
  const estimatedKm = Math.round((soc / 100) * maxRange);

  return (
    <div className="flex-1 bg-white text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 text-[#0B0F0D] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold text-sm text-[#0B0F0D]">Current Battery SOC</span>
        <div className="w-9" />
      </div>

      {/* Hero Display */}
      <div className="flex flex-col items-center justify-center my-auto space-y-6 text-center">
        <div className="relative w-36 h-36 rounded-full bg-[#EAF8EF] border-4 border-[#22C55E]/30 flex flex-col items-center justify-center shadow-lg shadow-[#22C55E]/15">
          <Battery className="w-8 h-8 text-[#22C55E] fill-[#22C55E]" />
          <span className="text-4xl font-black text-[#0B0F0D] tracking-tight">{soc}%</span>
          <span className="text-[11px] font-extrabold text-[#22C55E] uppercase tracking-wider">
            State of Charge
          </span>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[18px] p-4 w-full max-w-[280px] space-y-1">
          <span className="text-xs font-semibold text-[#6B7280]">Estimated Real Range</span>
          <div className="text-2xl font-black text-[#0B0F0D]">{estimatedKm} km</div>
          <p className="text-[11px] text-[#6B7280]">Based on Tata Nexon EV 40.5kWh efficiency</p>
        </div>

        {/* Green Interactive Slider */}
        <div className="w-full space-y-3 px-2">
          <input
            type="range"
            min="5"
            max="100"
            value={soc}
            onChange={(e) => setSoc(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
          />

          {/* Quick Presets */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setSoc(preset)}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  soc === preset
                    ? 'bg-[#22C55E] text-white shadow-sm'
                    : 'bg-[#F3F4F6] text-[#0B0F0D] hover:bg-slate-200'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Warning Info box if low battery */}
      {soc < 20 && (
        <div className="bg-[#FFFBEB] border border-[#F59E0B]/40 rounded-[16px] p-3 flex items-center gap-2.5">
          <AlertTriangle size={18} className="text-[#F59E0B] shrink-0" />
          <p className="text-xs font-bold text-[#0B0F0D]">
            Low battery warning. ZepGO will automatically insert an immediate highway charger stop.
          </p>
        </div>
      )}

      {/* Confirm CTA */}
      <button
        onClick={() => onConfirm(soc)}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-bold py-3.5 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Check size={18} className="text-[#22C55E]" />
        <span>Set Battery to {soc}% & Continue</span>
      </button>
    </div>
  );
};
