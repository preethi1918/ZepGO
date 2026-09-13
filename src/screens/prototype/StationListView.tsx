import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';

interface StationListViewProps {
  onSelectStation: (name: string) => void;
  onBackToMap: () => void;
}

export const StationListView: React.FC<StationListViewProps> = ({
  onSelectStation,
  onBackToMap,
}) => {
  const stations = [
    {
      name: 'Zeon Fast Charger Salem',
      operator: 'Zeon Charging',
      power: '150 kW DC',
      plugs: '3 / 4 Plugs Open',
      distance: '214 km from origin',
      reliability: '94% Score',
      rating: 4.9,
      price: '₹18.5/kWh',
    },
    {
      name: 'Relux Fast Charger Salem Bypass',
      operator: 'Relux Electric',
      power: '120 kW DC',
      plugs: '2 / 2 Plugs Open',
      distance: '216 km from origin',
      reliability: '96% Score',
      rating: 4.8,
      price: '₹18.0/kWh',
    },
    {
      name: 'Tata Power EZ Charge Tindivanam',
      operator: 'Tata Power',
      power: '60 kW DC Dual',
      plugs: '1 / 2 Plugs Open',
      distance: '122 km from origin',
      reliability: '88% Score',
      rating: 4.6,
      price: '₹19.0/kWh',
    },
    {
      name: 'Jio-bp pulse Coimbatore Hub',
      operator: 'Jio-bp pulse',
      power: '150 kW DC',
      plugs: '4 / 4 Plugs Open',
      distance: '340 km from origin',
      reliability: '95% Score',
      rating: 4.9,
      price: '₹18.0/kWh',
    },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBackToMap}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-[#0B0F0D] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold text-sm text-[#0B0F0D]">Charging Stations List</span>
        <div className="w-9" />
      </div>

      {/* Stations Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
        {stations.map((st) => (
          <div
            key={st.name}
            onClick={() => onSelectStation(st.name)}
            className="p-4 rounded-[20px] bg-white border border-[#E5E7EB] shadow-sm hover:border-[#22C55E] transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase block">{st.operator}</span>
                <h4 className="font-extrabold text-sm text-[#0B0F0D]">{st.name}</h4>
                <p className="text-xs text-[#6B7280]">{st.distance}</p>
              </div>
              <div className="bg-[#EAF8EF] text-[#22C55E] px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1">
                <Star size={12} className="fill-[#22C55E]" />
                <span>{st.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-100">
                <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Power</span>
                <span className="text-xs font-black text-[#0B0F0D]">{st.power}</span>
              </div>
              <div className="bg-[#EAF8EF] p-2 rounded-xl border border-[#22C55E]/30">
                <span className="text-[9px] font-bold text-[#22C55E] uppercase block">Availability</span>
                <span className="text-xs font-black text-[#22C55E]">{st.plugs}</span>
              </div>
              <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-100">
                <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Reliability</span>
                <span className="text-xs font-black text-[#0B0F0D]">{st.reliability}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
