import React, { useState } from 'react';
import { ArrowLeft, Coffee, Utensils, ShoppingBag, Trees, MapPin, Check, Plus } from 'lucide-react';

interface AddStopSelectionMenuProps {
  onSelectCategory: (category: string) => void;
  onBack: () => void;
}

export const AddStopSelectionMenu: React.FC<AddStopSelectionMenuProps> = ({
  onSelectCategory,
  onBack,
}) => {
  const [selectedCat, setSelectedCat] = useState('cafe');

  const categories = [
    {
      id: 'cafe',
      icon: <Coffee className="w-6 h-6 text-[#22C55E]" />,
      title: 'Cafe & Coffee',
      desc: 'Quick espresso, filter coffee, light snacks & WiFi lounge',
      badge: 'Popular for 15-20 min breaks',
    },
    {
      id: 'restaurant',
      icon: <Utensils className="w-6 h-6 text-[#22C55E]" />,
      title: 'Restaurant & Dining',
      desc: 'Full meal lunch/dinner dining with family-friendly seating',
      badge: 'Ideal for 30-45 min charges',
    },
    {
      id: 'restroom',
      icon: <span className="text-xl">🚻</span>,
      title: 'Restroom & Washroom',
      desc: 'Clean, verified highway restrooms with high hygiene ratings',
      badge: '5-min fast pit stop',
    },
    {
      id: 'store',
      icon: <ShoppingBag className="w-6 h-6 text-[#22C55E]" />,
      title: 'Supermarket & Store',
      desc: 'Convenience store for snacks, bottled water & travel supplies',
      badge: 'Quick highway shop',
    },
    {
      id: 'rest_area',
      icon: <Trees className="w-6 h-6 text-[#22C55E]" />,
      title: 'Scenic Rest Area',
      desc: 'Open green garden spaces, viewpoint parks & fresh air stops',
      badge: 'Relaxing stretch break',
    },
    {
      id: 'custom',
      icon: <MapPin className="w-6 h-6 text-[#22C55E]" />,
      title: 'Custom Destination Stop',
      desc: 'Search & add any specific address or point of interest off route',
      badge: 'Custom coordinate',
    },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4 font-[Inter,sans-serif]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] text-[#0B0F0D]"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-black text-sm text-[#0B0F0D]">Add Journey Stop Type</span>
        <div className="w-9" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#0B0F0D]">What type of stop do you need?</h2>
        <p className="text-xs text-[#6B7280]">
          ZepGO AI will match your selection with compatible fast chargers along your route.
        </p>
      </div>

      {/* Categories Grid List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 no-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedCat === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`p-4 rounded-[20px] border transition-all cursor-pointer space-y-2 relative ${
                isSelected
                  ? 'border-[#22C55E] bg-[#EAF8EF]/60 shadow-md ring-2 ring-[#22C55E]'
                  : 'border-[#E5E7EB] bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-[#E5E7EB] shadow-xs">
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0B0F0D]">{cat.title}</h4>
                    <p className="text-xs text-[#6B7280]">{cat.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#22C55E] text-white' : 'border border-slate-300'
                  }`}
                >
                  {isSelected && <Check size={14} className="stroke-[3]" />}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-[#E5E7EB]/60">
                <span className="font-bold text-[#22C55E]">{cat.badge}</span>
                <span>ZepGO AI Matched</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Select CTA Button */}
      <button
        onClick={() => onSelectCategory(selectedCat)}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-4 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Plus size={18} className="text-[#22C55E]" />
        <span>Find Matched {categories.find((c) => c.id === selectedCat)?.title} Stops</span>
      </button>
    </div>
  );
};
