import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

interface CafeDuringChargingScreenProps {
  onSelectCafe: (cafeName: string) => void;
  onClose: () => void;
}

export const CafeDuringChargingScreen: React.FC<CafeDuringChargingScreenProps> = ({
  onSelectCafe,
  onClose,
}) => {
  const cafes = [
    {
      name: 'Saravana Bhavan Pure Veg',
      cuisine: 'South Indian Tiffin & Filter Coffee',
      walkTime: '2 min walk (120m)',
      timingFit: 'Perfect (18 min meal time)',
      rating: 4.8,
      closingTime: 'Closes 10:30 PM',
      highlight: 'Recommended for 24-min charge window',
    },
    {
      name: 'A2B Adyar Ananda Bhavan',
      cuisine: 'Sweets, Snacks & Fast Food',
      walkTime: '3 min walk (210m)',
      timingFit: 'Good (15 min snack time)',
      rating: 4.6,
      closingTime: 'Closes 11:00 PM',
      highlight: 'Quick takeaway option',
    },
    {
      name: 'Cafe Coffee Day Express',
      cuisine: 'Espresso, Sandwiches & WiFi',
      walkTime: '1 min walk (60m)',
      timingFit: 'Ideal for 15-min coffee break',
      rating: 4.5,
      closingTime: 'Open 24/7',
      highlight: 'Air-conditioned lounge',
    },
  ];

  return (
    <div className="flex-1 bg-[#0B0F0D] text-white flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4 font-[Inter,sans-serif]">
      {/* Active Charging Status Banner Header */}
      <div className="pt-1 flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#22C55E] text-[#0B0F0D] rounded-xl flex items-center justify-center font-black text-sm">
            <Zap size={18} className="fill-[#0B0F0D] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white">Active 120 kW Fast Charge</span>
              <span className="text-[9px] font-extrabold bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-md">
                24 Mins Remaining
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Zeon Salem Hub • SOC 42% → 80%</p>
          </div>
        </div>

        <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold">
          Close ✕
        </button>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-black text-white tracking-tight">
          Nearby Cafes for Your 24-Min Break
        </h2>
        <p className="text-xs text-slate-400">
          Filtered to places reachable within your active charging window.
        </p>
      </div>

      {/* Nearby Cafes List matching Charge Window */}
      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
        {cafes.map((c) => (
          <div
            key={c.name}
            onClick={() => onSelectCafe(c.name)}
            className="p-4 rounded-[20px] bg-[#161C19] border border-slate-800 hover:border-[#22C55E] transition-all cursor-pointer space-y-2.5 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-white">{c.name}</h4>
                <p className="text-xs text-slate-400">{c.cuisine}</p>
              </div>
              <span className="text-xs font-black text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-2.5 py-1 rounded-full">
                ⭐ {c.rating}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-[#0B0F0D] p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Distance</span>
                <span className="text-xs font-black text-white">{c.walkTime}</span>
              </div>
              <div className="bg-[#EAF8EF]/10 p-2 rounded-xl border border-[#22C55E]/30 text-[#22C55E]">
                <span className="text-[9px] font-bold uppercase block">Timing Alignment</span>
                <span className="text-xs font-black">{c.timingFit}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span className="flex items-center gap-1 text-[#22C55E] font-bold">
                <ShieldCheck size={12} /> {c.highlight}
              </span>
              <span>{c.closingTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
