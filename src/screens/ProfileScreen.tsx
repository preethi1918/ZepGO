import React, { useState } from 'react';
import type { VehicleState } from '../types/vehicle';
import { CarIcon, ShieldCheckIcon, CheckCircleIcon } from '../components/common/Icons';

export interface ProfileScreenProps {
  vehicle: VehicleState;
  onUpdateVehicle?: (updated: VehicleState) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ vehicle, onUpdateVehicle }) => {
  const [minBuffer, setMinBuffer] = useState(vehicle.minArrivalSocBufferPercent || 15);
  const [preferredNets, setPreferredNets] = useState<string[]>(
    vehicle.preferredNetworks || ['Tata Power EZ Charge', 'Zeon Charging', 'Jio-bp pulse']
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleNetwork = (net: string) => {
    const updated = preferredNets.includes(net)
      ? preferredNets.filter((n) => n !== net)
      : [...preferredNets, net];
    setPreferredNets(updated);
  };

  const handleSaveSettings = () => {
    if (onUpdateVehicle) {
      onUpdateVehicle({
        ...vehicle,
        minArrivalSocBufferPercent: minBuffer,
        preferredNetworks: preferredNets,
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-4">
      {/* Save Success Toast */}
      {isSaved && (
        <div className="p-3 bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircleIcon size={16} />
          <span>Vehicle Settings & Preferences Saved!</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between font-[Inter,sans-serif]">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
            AT
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Alex Turner</h2>
            <p className="text-xs text-slate-500 font-medium">alex.turner@evdriver.in</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">● Connected Vehicle Active</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Eco Score</span>
          <div className="text-xl font-black text-slate-900">92<span className="text-xs text-slate-400 font-normal">/100</span></div>
        </div>
      </div>

      {/* MY EV Specs Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 font-[Inter,sans-serif]">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CarIcon size={18} className="text-emerald-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">MY EV</h3>
          </div>
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {vehicle.brand} {vehicle.modelName}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Battery Capacity</span>
            <p className="font-black text-slate-900 mt-0.5">{vehicle.batteryCapacityKwh || 40.5} kWh</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Current Efficiency</span>
            <p className="font-black text-slate-900 mt-0.5">{vehicle.averageConsumptionWhPerKm || 135} Wh/km</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Average Range</span>
            <p className="font-black text-emerald-600 mt-0.5">312 km</p>
          </div>
        </div>
      </div>

      {/* Section 1: Vehicle & Navigation Settings List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 font-[Inter,sans-serif]">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">Settings & Preferences</h3>
        
        <div className="space-y-1 text-xs font-semibold">
          {[
            { label: 'EV Settings', sub: 'Model, Battery Capacity, Health SOH' },
            { label: 'Navigation Preferences', sub: 'Elevation sensitivity, Eco Speed' },
            { label: 'Charging Preferences', sub: 'Preferred Fast Networks & Plugs' },
            { label: 'Offline Maps', sub: 'Cache routes & station coordinates' },
            { label: 'Notifications', sub: 'Low battery alerts & charging updates' },
            { label: 'Units', sub: 'Metric (km, kWh, °C)' },
            { label: 'Help & Support', sub: 'EV troubleshooting & assistance' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all">
              <div>
                <p className="font-bold text-slate-900">{item.label}</p>
                <p className="text-[10px] text-slate-500">{item.sub}</p>
              </div>
              <span className="text-slate-400 font-bold">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Journey Settings */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 font-[Inter,sans-serif]">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldCheckIcon size={18} className="text-emerald-600" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Journey Intelligence</h3>
        </div>

        {/* Minimum Target Buffer Slider */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 uppercase mb-1">
            <span>Minimum Target Arrival SOC Buffer</span>
            <span className="text-emerald-600">{minBuffer}% SOC ({Math.round((minBuffer / 100) * vehicle.batteryCapacityKwh * 10) / 10} kWh)</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="5"
            value={minBuffer}
            onChange={(e) => setMinBuffer(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <p className="text-[10px] text-slate-400 mt-1">ZepGO will automatically insert fast charging stops if projected arrival drops below {minBuffer}%.</p>
        </div>
      </div>

      {/* Section 3: Charging Preferences */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 font-[Inter,sans-serif]">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">Preferred Charging Networks</h3>
        <div className="space-y-2 text-xs">
          {['Tata Power EZ Charge', 'Zeon Charging', 'Jio-bp pulse', 'Statiq', 'ChargePoint'].map((network) => {
            const isChecked = preferredNets.includes(network);
            return (
              <label
                key={network}
                onClick={() => handleToggleNetwork(network)}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  isChecked ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-100 text-slate-700'
                }`}
              >
                <span>{network}</span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {isChecked ? 'Priority' : 'Standard'}
                </span>
              </label>
            );
          })}
        </div>

        <button
          onClick={handleSaveSettings}
          className="w-full mt-3 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-sm shadow-emerald-600/20 transition-all active:scale-98 cursor-pointer"
        >
          Save Preferences
        </button>
      </div>

      {/* Section 4: App Information & Offline Mode */}
      <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200/80 space-y-2 font-[Inter,sans-serif]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">App Storage & Connectivity</span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">● Online Mode</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Vehicle telemetry, custom routes, and offline station cache stored securely in LocalStorage.
        </p>
      </div>
    </div>
  );
};
