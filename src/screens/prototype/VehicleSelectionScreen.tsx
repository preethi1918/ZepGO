import React, { useState } from 'react';
import { Check, ArrowLeft, Zap } from 'lucide-react';

interface VehicleSelectionScreenProps {
  onSelectVehicle: (model: string) => void;
  onBack: () => void;
  selectedModel?: string;
}

export const VehicleSelectionScreen: React.FC<VehicleSelectionScreenProps> = ({
  onSelectVehicle,
  onBack,
  selectedModel = 'Tata Nexon EV Max',
}) => {
  const [currentSelected, setCurrentSelected] = useState(selectedModel);

  const evModels = [
    {
      name: 'Tata Nexon EV Max',
      brand: 'Tata Motors',
      battery: '40.5 kWh',
      range: '312 km',
      plug: 'CCS2 Fast Charging',
      maxChargePower: '50 kW DC',
      badge: 'Popular',
    },
    {
      name: 'MG ZS EV Long Range',
      brand: 'MG Motor',
      battery: '50.3 kWh',
      range: '461 km',
      plug: 'CCS2 Fast Charging',
      maxChargePower: '80 kW DC',
      badge: 'Long Range',
    },
    {
      name: 'Hyundai Ioniq 5',
      brand: 'Hyundai',
      battery: '72.6 kWh',
      range: '631 km',
      plug: 'CCS2 800V Ultra Fast',
      maxChargePower: '235 kW DC',
      badge: 'Premium 800V',
    },
    {
      name: 'Mahindra XUV400 EV',
      brand: 'Mahindra',
      battery: '39.4 kWh',
      range: '375 km',
      plug: 'CCS2 Fast Charging',
      maxChargePower: '50 kW DC',
      badge: 'Urban SUV',
    },
  ];

  const handleConfirm = () => {
    onSelectVehicle(currentSelected);
  };

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
        <span className="font-extrabold text-sm text-[#0B0F0D]">Select Your Vehicle</span>
        <div className="w-9" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#0B0F0D]">Select EV Model</h2>
        <p className="text-xs text-[#6B7280]">
          ZepGO optimizes charging strategy based on battery degradation and max DC intake power.
        </p>
      </div>

      {/* Vehicle Models Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
        {evModels.map((ev) => {
          const isSelected = currentSelected === ev.name;
          return (
            <div
              key={ev.name}
              onClick={() => setCurrentSelected(ev.name)}
              className={`p-4 rounded-[18px] border transition-all cursor-pointer space-y-2 relative ${
                isSelected
                  ? 'border-[#22C55E] bg-[#EAF8EF]/50 shadow-sm ring-1 ring-[#22C55E]'
                  : 'border-[#E5E7EB] bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase block">{ev.brand}</span>
                  <h4 className="font-extrabold text-sm text-[#0B0F0D]">{ev.name}</h4>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-[#22C55E] text-white' : 'border border-slate-300'
                  }`}
                >
                  {isSelected && <Check size={14} className="stroke-[3]" />}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="bg-white/80 p-2 rounded-xl border border-slate-100 text-center">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Battery</span>
                  <span className="text-xs font-black text-[#0B0F0D]">{ev.battery}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-slate-100 text-center">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">ARAI Range</span>
                  <span className="text-xs font-black text-[#22C55E]">{ev.range}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-slate-100 text-center">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Max Speed</span>
                  <span className="text-xs font-black text-[#0B0F0D]">{ev.maxChargePower}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-1">
                <div className="flex items-center gap-1">
                  <Zap size={12} className="text-[#22C55E]" />
                  <span>{ev.plug}</span>
                </div>
                <span className="bg-slate-100 font-bold text-slate-700 px-2 py-0.5 rounded-md">
                  {ev.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Confirm Button */}
      <button
        onClick={handleConfirm}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-bold py-3.5 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <span>Confirm {currentSelected.split(' ')[0]} EV</span>
      </button>
    </div>
  );
};
