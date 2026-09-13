import React from 'react';
import { Bookmark, MapPin, Plus, Star, Home, Briefcase, Zap, ChevronRight } from 'lucide-react';

interface SavedPlacesScreenProps {
  onSelectPlace?: (placeName: string) => void;
  onBack?: () => void;
}

export const SavedPlacesScreen: React.FC<SavedPlacesScreenProps> = ({ onSelectPlace, onBack }) => {
  const savedLocations = [
    {
      id: 1,
      title: 'Home',
      address: 'Anna Nagar, Chennai 600040',
      icon: Home,
      category: 'Primary',
      charger: '7.2 kW AC Wallbox',
    },
    {
      id: 2,
      title: 'Office',
      address: 'IT Expressway, OMR, Chennai 600096',
      icon: Briefcase,
      category: 'Work',
      charger: '22 kW AC Dual Gun',
    },
    {
      id: 3,
      title: 'Zeon Salem Fast Charger Hub',
      address: 'NH544 Bypass, Salem (214 km from Home)',
      icon: Zap,
      category: 'Preferred Charger',
      charger: '150 kW DC Ultra Fast',
      rating: '4.9 ★',
    },
    {
      id: 4,
      title: 'Saravana Bhavan & EV Station',
      address: 'Vellore Highway, Ranipet',
      icon: Star,
      category: 'Smart Rest Stop',
      charger: '60 kW DC Dual',
      rating: '4.8 ★',
    },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-4 select-none animate-fadeIn space-y-4">
      {/* Header */}
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
            <Bookmark className="text-[#22C55E]" size={20} />
            Saved Places & Hubs
          </h2>
        </div>

        <button className="bg-[#0B0F0D] text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      {/* Places List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {savedLocations.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectPlace && onSelectPlace(item.title)}
              className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm hover:border-[#22C55E] transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF8EF] text-[#22C55E] flex items-center justify-center font-bold">
                    <IconComp size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#0B0F0D]">{item.title}</h4>
                      <span className="text-[10px] font-extrabold bg-[#EAF8EF] text-[#22C55E] px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                      <MapPin size={12} />
                      {item.address}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </div>

              <div className="bg-[#F8FAFC] p-2.5 rounded-xl flex items-center justify-between border border-slate-100 text-xs">
                <span className="font-bold text-[#6B7280]">Plug Availability:</span>
                <span className="font-black text-[#22C55E] flex items-center gap-1">
                  <Zap size={12} /> {item.charger}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Location Card */}
      <button className="w-full bg-[#EAF8EF] border border-[#22C55E]/40 hover:bg-[#22C55E]/15 text-[#0B0F0D] font-extrabold py-3.5 px-4 rounded-[16px] transition-all flex items-center justify-center gap-2 text-xs">
        <Plus size={16} className="text-[#22C55E]" />
        <span>Add Favorite Destination or Charger</span>
      </button>
    </div>
  );
};
