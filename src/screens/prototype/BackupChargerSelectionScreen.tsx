import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Check } from 'lucide-react';

interface BackupChargerSelectionScreenProps {
  onConfirmBackup: (stationName: string) => void;
  onBack: () => void;
}

export const BackupChargerSelectionScreen: React.FC<BackupChargerSelectionScreenProps> = ({
  onConfirmBackup,
  onBack,
}) => {
  const [selectedBackup, setSelectedBackup] = useState('Relux Fast Charger Salem');

  const backupStations = [
    {
      name: 'Relux Fast Charger Salem',
      operator: 'Relux Electric',
      distance: '2.4 km from primary stop',
      power: '120 kW DC',
      plugs: '2 / 2 Plugs Open',
      reliability: '96% Reliability',
      price: '₹18.0 / kWh',
      amenities: 'Restroom, Food Court',
    },
    {
      name: 'Tata Power Fast Charger Salem Expressway',
      operator: 'Tata Power EZ Charge',
      distance: '5.1 km from primary stop',
      power: '60 kW DC Dual',
      plugs: '1 / 2 Plugs Open',
      reliability: '92% Reliability',
      price: '₹19.5 / kWh',
      amenities: 'Restaurant, EV Parking',
    },
    {
      name: 'Jio-bp pulse Salem Service Hub',
      operator: 'Jio-bp pulse',
      distance: '8.4 km from primary stop',
      power: '150 kW DC',
      plugs: '3 / 4 Plugs Open',
      reliability: '94% Reliability',
      price: '₹18.0 / kWh',
      amenities: 'Convenience Store, Coffee',
    },
  ];

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
        <span className="font-extrabold text-sm text-[#0B0F0D]">Backup Charger Options</span>
        <div className="w-9" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#0B0F0D]">Verified Backup Chargers</h2>
        <p className="text-xs text-[#6B7280]">
          Instant fallback chargers guaranteed with 90%+ predicted availability.
        </p>
      </div>

      {/* Backup Station Cards */}
      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
        {backupStations.map((st) => {
          const isSelected = selectedBackup === st.name;
          return (
            <div
              key={st.name}
              onClick={() => setSelectedBackup(st.name)}
              className={`p-4 rounded-[20px] border transition-all cursor-pointer space-y-2 relative ${
                isSelected
                  ? 'border-[#22C55E] bg-[#EAF8EF]/50 shadow-md ring-2 ring-[#22C55E]'
                  : 'border-[#E5E7EB] bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase block">{st.operator}</span>
                  <h4 className="font-extrabold text-sm text-[#0B0F0D]">{st.name}</h4>
                  <p className="text-xs text-[#6B7280]">{st.distance}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-[#22C55E] text-white' : 'border border-slate-300'
                  }`}
                >
                  {isSelected && <Check size={14} className="stroke-[3]" />}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Power</span>
                  <span className="text-xs font-black text-[#0B0F0D]">{st.power}</span>
                </div>
                <div className="bg-[#EAF8EF] p-2 rounded-xl border border-[#22C55E]/30">
                  <span className="text-[9px] font-bold text-[#22C55E] uppercase block">Predicted Plugs</span>
                  <span className="text-xs font-black text-[#22C55E]">{st.plugs}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Reliability</span>
                  <span className="text-xs font-black text-[#0B0F0D]">{st.reliability}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Backup CTA */}
      <button
        onClick={() => onConfirmBackup(selectedBackup)}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-3.5 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <ShieldCheck size={18} className="text-[#22C55E]" />
        <span>Set as Active Backup Charger</span>
      </button>
    </div>
  );
};
