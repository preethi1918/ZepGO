import React, { useState } from 'react';
import { ArrowLeft, Check, Coffee, Zap, ShieldCheck, Star } from 'lucide-react';

interface AlternativeStopComparisonScreenProps {
  onSelectAlternative: (optionId: string) => void;
  onBack: () => void;
}

export const AlternativeStopComparisonScreen: React.FC<AlternativeStopComparisonScreenProps> = ({
  onSelectAlternative,
  onBack,
}) => {
  const [selectedId, setSelectedId] = useState('opt1');

  const options = [
    {
      id: 'opt1',
      title: 'Option A: Saravana Bhavan + Zeon Salem (Recommended)',
      location: 'NH544 Salem Bypass • At 214 km',
      offRoute: '+0.2 km off route',
      charger: 'Zeon 150 kW DC (3/4 Plugs Open)',
      chargeTime: '24 mins (22% → 80%)',
      cafe: 'Saravana Bhavan Pure Veg (2 min walk)',
      rating: 4.8,
      amenities: ['South Indian Tiffin', 'AC Dining', 'Clean Restrooms', 'EV Parking'],
      syncTag: 'Perfect 25-min Sync',
      recommended: true,
    },
    {
      id: 'opt2',
      title: 'Option B: Cafe Coffee Day + Tata Power Salem',
      location: 'Salem Bypass Express Hub • At 216 km',
      offRoute: '+0.5 km off route',
      charger: 'Tata Power 60 kW DC (1/2 Plugs Open)',
      chargeTime: '38 mins (22% → 80%)',
      cafe: 'Cafe Coffee Day (1 min walk)',
      rating: 4.5,
      amenities: ['Espresso & Snacks', 'WiFi Lounge', 'Restrooms'],
      syncTag: 'Coffee Break Match',
      recommended: false,
    },
    {
      id: 'opt3',
      title: 'Option C: A2B Restaurant + Relux Charger',
      location: 'NH544 Salem West • At 218 km',
      offRoute: '+1.2 km off route',
      charger: 'Relux 120 kW DC (2/2 Plugs Open)',
      chargeTime: '26 mins (20% → 80%)',
      cafe: 'Adyar Ananda Bhavan (3 min walk)',
      rating: 4.6,
      amenities: ['Sweets & Fast Food', 'Family Dining', 'Restroom'],
      syncTag: 'Family Meal Sync',
      recommended: false,
    },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4 font-[Inter,sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] text-[#0B0F0D]"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-black text-sm text-[#0B0F0D]">Compare 3 Smart Stop Options</span>
        <div className="w-9" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#0B0F0D]">Alternative Stops in Salem Zone</h2>
        <p className="text-xs text-[#6B7280]">
          All options evaluated for synchronized charging duration & cafe walk distance.
        </p>
      </div>

      {/* Options Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedId(opt.id)}
              className={`p-4 rounded-[22px] border transition-all cursor-pointer space-y-3 relative ${
                isSelected
                  ? 'border-[#22C55E] bg-white shadow-md ring-2 ring-[#22C55E]'
                  : 'border-[#E5E7EB] bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0B0F0D]">{opt.title}</h4>
                  <p className="text-xs text-[#6B7280]">{opt.location}</p>
                  <p className="text-[10px] text-[#22C55E] font-bold mt-0.5">{opt.offRoute}</p>
                </div>

                <div className="bg-[#EAF8EF] text-[#22C55E] px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1">
                  <Star size={12} className="fill-[#22C55E]" />
                  <span>{opt.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block flex items-center justify-center gap-1">
                    <Zap size={11} className="text-[#22C55E]" /> Charger
                  </span>
                  <span className="text-xs font-black text-[#0B0F0D] block truncate">{opt.charger}</span>
                  <span className="text-[9px] text-[#22C55E] font-bold block">{opt.chargeTime}</span>
                </div>

                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block flex items-center justify-center gap-1">
                    <Coffee size={11} className="text-[#22C55E]" /> Cafe Match
                  </span>
                  <span className="text-xs font-black text-[#0B0F0D] block truncate">{opt.cafe}</span>
                  <span className="text-[9px] text-[#6B7280] block">{opt.syncTag}</span>
                </div>
              </div>

              {opt.recommended && (
                <div className="bg-[#EAF8EF] text-[#22C55E] text-[10px] font-extrabold px-3 py-1 rounded-lg border border-[#22C55E]/30 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} /> AI Optimal Balance (Fast Charge + Shortest Walk)
                  </span>
                  <span>⭐ Top Choice</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Select CTA */}
      <button
        onClick={() => onSelectAlternative(selectedId)}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-4 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Check size={18} className="text-[#22C55E]" />
        <span>Select Chosen Stop Alternative</span>
      </button>
    </div>
  );
};
