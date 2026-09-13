import React, { useState } from 'react';
import { ArrowLeft, Check, Sliders, Sparkles } from 'lucide-react';

interface SmartStopPreferencesScreenProps {
  onSavePreferences: (selected: string[]) => void;
  onBack: () => void;
}

export const SmartStopPreferencesScreen: React.FC<SmartStopPreferencesScreenProps> = ({
  onSavePreferences,
  onBack,
}) => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'cafe',
    'restroom_clean',
    'family_friendly',
    'fast_stop',
  ]);

  const preferenceChips = [
    { id: 'cafe', label: '☕ Specialty Cafe & Coffee', category: 'Food & Drink' },
    { id: 'restaurant', label: '🍽️ Pure Veg / South Indian Restaurant', category: 'Food & Drink' },
    { id: 'restroom_clean', label: '🚻 Verified Clean Restrooms (4.5★+)', category: 'Comfort' },
    { id: 'quiet_place', label: '🤫 Quiet Relaxing Space', category: 'Ambience' },
    { id: 'family_friendly', label: '👨‍👩‍👧 Family & Kid Friendly', category: 'Ambience' },
    { id: 'fast_stop', label: '⚡ Fast 15-min Pit Stop', category: 'Timing' },
    { id: 'scenic_place', label: '🏞️ Scenic Highway Viewpoint', category: 'Ambience' },
    { id: 'wifi_lounge', label: '📶 High-speed WiFi Work Lounge', category: 'Amenities' },
    { id: 'ev_parking', label: '🅿️ Dedicated Canopy EV Parking', category: 'Charger' },
  ];

  const toggleChip = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
        <span className="font-black text-sm text-[#0B0F0D]">Smart Stop Preferences</span>
        <div className="w-9" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#0B0F0D]">Customize Your Journey Stops</h2>
        <p className="text-xs text-[#6B7280]">
          Multi-select preferences. ZepGO AI prioritizes stops matching these tags.
        </p>
      </div>

      {/* Multi-Select Chips Container */}
      <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar py-1">
        <div className="bg-white rounded-[24px] p-4 border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-[#22C55E]" />
            <h3 className="font-extrabold text-sm text-[#0B0F0D]">Driver Rest Preferences</h3>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {preferenceChips.map((chip) => {
              const isSelected = selectedPreferences.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => toggleChip(chip.id)}
                  className={`py-2.5 px-3.5 rounded-[16px] text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#22C55E] text-white shadow-md shadow-[#22C55E]/20'
                      : 'bg-[#F3F4F6] text-[#0B0F0D] hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{chip.label}</span>
                  {isSelected && <Check size={14} className="stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Alignment Info Note */}
        <div className="bg-[#EAF8EF] border border-[#22C55E]/40 rounded-[20px] p-3.5 space-y-1.5 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 text-[#0B0F0D] font-extrabold">
            <Sparkles size={16} className="text-[#22C55E]" />
            <span>AI Preference Priority Active</span>
          </div>
          <p className="text-slate-600">
            {selectedPreferences.length} preferences active. ZepGO will filter out non-matching rest areas on NH544.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => onSavePreferences(selectedPreferences)}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-4 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Check size={18} className="text-[#22C55E]" />
        <span>Save Journey Preferences</span>
      </button>
    </div>
  );
};
