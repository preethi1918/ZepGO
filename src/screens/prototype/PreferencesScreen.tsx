import React, { useState } from 'react';
import { ArrowLeft, Sliders, Shield, Check } from 'lucide-react';

interface PreferencesScreenProps {
  onSave: () => void;
  onBack: () => void;
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ onSave, onBack }) => {
  const [strategy, setStrategy] = useState<'balanced' | 'fastest' | 'safest'>('balanced');
  const [minReliability, setMinReliability] = useState(90);
  const [considerElevation, setConsiderElevation] = useState(true);
  const [trafficRerouting, setTrafficRerouting] = useState(true);

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-[#0B0F0D] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold text-sm text-[#0B0F0D]">Journey Preferences</span>
        <div className="w-9" />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Charging Strategy */}
        <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-[#22C55E]" />
            <h3 className="font-extrabold text-sm text-[#0B0F0D]">Charging Strategy</h3>
          </div>

          <div className="space-y-2">
            {[
              {
                id: 'balanced',
                title: 'Balanced (Recommended)',
                desc: 'Optimal balance between speed, 20% arrival SOC buffer, and verified 90%+ chargers.',
                badge: 'AI Preferred',
              },
              {
                id: 'fastest',
                title: 'Fastest (Min Stops)',
                desc: 'Pushes charging stops to 15% SOC, preferring 120kW+ Ultra Fast DC chargers.',
                badge: 'Time Saver',
              },
              {
                id: 'safest',
                title: 'Maximum Safety (Max Buffer)',
                desc: 'Maintains minimum 30% battery buffer at all times with 2 backup chargers.',
                badge: 'Extra Buffer',
              },
            ].map((opt) => {
              const isSelected = strategy === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setStrategy(opt.id as any)}
                  className={`p-3.5 rounded-[16px] border cursor-pointer transition-all space-y-1 ${
                    isSelected
                      ? 'border-[#22C55E] bg-[#EAF8EF]/60 shadow-sm ring-1 ring-[#22C55E]'
                      : 'border-[#E5E7EB] bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#0B0F0D]">{opt.title}</span>
                    <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] leading-snug">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reliability Score Slider */}
        <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#22C55E]" />
              <h3 className="font-extrabold text-sm text-[#0B0F0D]">Min Charger Reliability</h3>
            </div>
            <span className="text-xs font-black text-[#22C55E] bg-[#EAF8EF] px-2.5 py-0.5 rounded-full">
              {minReliability}%+ Score
            </span>
          </div>

          <input
            type="range"
            min="75"
            max="98"
            value={minReliability}
            onChange={(e) => setMinReliability(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
          />
          <p className="text-[11px] text-[#6B7280]">
            Filters out chargers with historical uptime issues or unpredicted crowd bottlenecks.
          </p>
        </div>

        {/* Toggles */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#0B0F0D] block">Elevation & Climate Profile</span>
              <span className="text-[11px] text-[#6B7280]">Adjust range for Ghats & AC usage</span>
            </div>
            <input
              type="checkbox"
              checked={considerElevation}
              onChange={(e) => setConsiderElevation(e.target.checked)}
              className="w-4 h-4 accent-[#22C55E] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-3">
            <div>
              <span className="text-xs font-extrabold text-[#0B0F0D] block">Predictive Traffic Rerouting</span>
              <span className="text-[11px] text-[#6B7280]">Dynamic charger swaps based on jams</span>
            </div>
            <input
              type="checkbox"
              checked={trafficRerouting}
              onChange={(e) => setTrafficRerouting(e.target.checked)}
              className="w-4 h-4 accent-[#22C55E] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-bold py-3.5 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Check size={18} className="text-[#22C55E]" />
        <span>Apply Preferences</span>
      </button>
    </div>
  );
};
