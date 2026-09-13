import React, { useState } from 'react';
import { Search, List } from 'lucide-react';

interface MapScreenViewProps {
  onSwitchToList: () => void;
  onSelectStation: (stationName: string) => void;
}

export const MapScreenView: React.FC<MapScreenViewProps> = ({
  onSwitchToList,
  onSelectStation,
}) => {
  const [activeFilter, setActiveFilter] = useState('Fast');

  const filters = ['⚡ Fast', '✅ Available', '🛡️ Reliable', '📍 Nearby'];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between relative overflow-hidden select-none animate-fadeIn">
      {/* Top Search & Filter Floating Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 space-y-2">
        <div className="flex items-center bg-white border border-[#E5E7EB] rounded-[18px] px-3.5 py-2.5 shadow-lg">
          <Search size={18} className="text-[#6B7280] mr-2" />
          <input
            type="text"
            placeholder="Search chargers, cities, highways..."
            className="w-full text-xs font-semibold text-[#0B0F0D] bg-transparent focus:outline-none"
            defaultValue="Salem Fast Chargers"
          />
          <button
            onClick={onSwitchToList}
            className="p-1.5 bg-[#F3F4F6] hover:bg-slate-200 rounded-xl text-[#0B0F0D] ml-2"
            title="List View"
          >
            <List size={16} />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f.replace(/[^a-zA-Z]/g, ''))}
              className={`py-1 px-3 rounded-full text-xs font-extrabold shrink-0 border transition-all cursor-pointer ${
                activeFilter.includes(f.replace(/[^a-zA-Z]/g, ''))
                  ? 'bg-[#0B0F0D] text-white border-[#0B0F0D] shadow-sm'
                  : 'bg-white/90 backdrop-blur-md text-[#0B0F0D] border-slate-200 hover:bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Graphic View */}
      <div className="absolute inset-0 bg-[#E2E8F0] flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 390 844">
          {/* Simulated Map Grid Roads */}
          <path d="M 0 300 H 390 M 120 0 V 844 M 280 0 V 844 M 0 550 H 390" stroke="#CBD5E1" strokeWidth="4" fill="none" />
          <path d="M 30 750 Q 180 400, 350 150" stroke="#94A3B8" strokeWidth="12" fill="none" />
          <path d="M 30 750 Q 180 400, 350 150" stroke="#22C55E" strokeWidth="4" fill="none" />

          {/* Interactive Charger Pin 1 (Zeon Salem) */}
          <g transform="translate(190, 380)" className="cursor-pointer" onClick={() => onSelectStation('Zeon Fast Charger Salem')}>
            <circle r="22" fill="#22C55E" fillOpacity="0.2" className="animate-ping" />
            <rect x="-18" y="-18" width="36" height="36" rx="10" fill="#0B0F0D" stroke="#22C55E" strokeWidth="3" shadow-lg />
            <text x="0" y="5" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="bold">⚡</text>
          </g>

          {/* Charger Pin 2 (Relux Salem) */}
          <g transform="translate(260, 280)" className="cursor-pointer" onClick={() => onSelectStation('Relux Fast Charger Salem')}>
            <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#0284C7" fontSize="11" fontWeight="bold">⚡</text>
          </g>

          {/* Charger Pin 3 (Tata Power) */}
          <g transform="translate(110, 520)" className="cursor-pointer" onClick={() => onSelectStation('Tata Power EZ Charge')}>
            <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#FFFFFF" stroke="#15803D" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#15803D" fontSize="11" fontWeight="bold">⚡</text>
          </g>
        </svg>
      </div>

      {/* Floating Station Quick Card Preview */}
      <div
        onClick={() => onSelectStation('Zeon Fast Charger Salem')}
        className="relative z-30 m-4 mt-auto bg-white border border-[#E5E7EB] rounded-[22px] p-3.5 shadow-xl space-y-2 cursor-pointer hover:border-[#22C55E] transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold bg-[#EAF8EF] text-[#22C55E] px-2 py-0.5 rounded-md">
              150 kW DC
            </span>
            <span className="text-xs font-extrabold text-[#0B0F0D]">Zeon Fast Charger Salem</span>
          </div>
          <span className="text-[10px] font-bold text-[#22C55E]">3 / 4 Plugs Open</span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#6B7280]">
          <span>NH544 Bypass • 2.4 km away</span>
          <span className="font-bold text-[#0B0F0D]">94% Reliability</span>
        </div>
      </div>
    </div>
  );
};
