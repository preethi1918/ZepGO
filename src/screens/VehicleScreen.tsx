import React, { useState } from 'react';
import type { VehicleState } from '../types/vehicle';
import { INDIAN_EV_MODELS } from '../data/indianVehicles';
import { CheckCircleIcon } from '../components/common/Icons';

export interface VehicleScreenProps {
  vehicle: VehicleState;
  onUpdateVehicle?: (updated: VehicleState) => void;
}

export const VehicleScreen: React.FC<VehicleScreenProps> = ({
  vehicle,
  onUpdateVehicle,
}) => {
  const [minArrivalSoc, setMinArrivalSoc] = useState(vehicle.minArrivalSocBufferPercent || 15);
  const [preferredNetworks, setPreferredNetworks] = useState<string[]>(
    vehicle.preferredNetworks || ['Tata Power EZ Charge', 'Zeon Charging', 'Jio-bp pulse']
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleNetwork = (network: string) => {
    if (preferredNetworks.includes(network)) {
      setPreferredNetworks(preferredNetworks.filter((n) => n !== network));
    } else {
      setPreferredNetworks([...preferredNetworks, network]);
    }
  };

  const handleSelectModel = (selected: VehicleState) => {
    if (onUpdateVehicle) {
      onUpdateVehicle({
        ...selected,
        minArrivalSocBufferPercent: minArrivalSoc,
        preferredNetworks,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSave = () => {
    if (onUpdateVehicle) {
      onUpdateVehicle({
        ...vehicle,
        minArrivalSocBufferPercent: minArrivalSoc,
        preferredNetworks,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-5 pb-24 pt-2 px-4 max-w-2xl mx-auto font-[Inter,sans-serif]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Indian EV Vehicle & Settings</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Select your Indian EV model, range specs, and fast charger networks</p>
      </div>

      {/* Indian EV Models Selector */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Select Your EV Model</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INDIAN_EV_MODELS.map((model) => {
            const isSelected = vehicle.modelName === model.modelName;

            return (
              <button
                key={model.modelName}
                onClick={() => handleSelectModel(model)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 font-semibold'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">{model.brand}</span>
                  {isSelected && <CheckCircleIcon size={14} className="text-white" />}
                </div>
                <p className="text-sm font-black mt-1 leading-tight">{model.modelName}</p>
                <p className={`text-[10px] mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {model.batteryCapacityKwh} kWh • {model.estimatedRangeKm} km
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Vehicle Specs Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
              ⚡🚘
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{vehicle.brand} {vehicle.modelName}</h2>
              <p className="text-xs text-slate-500 font-medium">{vehicle.trim} • {vehicle.licensePlate}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            🟢 Online
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Battery Pack</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">{vehicle.batteryCapacityKwh} kWh</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Charging Port</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">CCS2 DC / Type 2 AC</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Certified ARAI Range</p>
            <p className="text-sm font-black text-blue-600 mt-0.5">{vehicle.estimatedRangeKm} km</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Current Battery</p>
            <p className="text-sm font-black text-emerald-600 mt-0.5">{vehicle.currentSocPercent}% SOC</p>
          </div>
        </div>
      </div>

      {/* Charging Preferences Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">India EV Charging Preferences</h3>

        {/* Minimum Arrival Battery Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Minimum Arrival Battery Buffer</span>
            <span className="font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">{minArrivalSoc}% SOC</span>
          </div>

          <input
            type="range"
            min="10"
            max="30"
            step="1"
            value={minArrivalSoc}
            onChange={(e) => setMinArrivalSoc(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-[11px] text-slate-400">
            ZepGO AI automatically inserts fast charging stops on Indian highways to ensure you arrive with at least {minArrivalSoc}% battery.
          </p>
        </div>

        {/* Preferred Charging Networks Checkboxes */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-800 block">Preferred Indian Charging Networks</span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Tata Power EZ Charge', 'Zeon Charging', 'Jio-bp pulse', 'ChargeZone', 'Statiq', 'Ather Grid'].map((net) => {
              const isChecked = preferredNetworks.includes(net);

              return (
                <button
                  key={net}
                  type="button"
                  onClick={() => toggleNetwork(net)}
                  className={`p-3 rounded-2xl border text-left font-bold flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-blue-50 border-blue-500 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="line-clamp-1">{net}</span>
                  {isChecked && <CheckCircleIcon size={16} className="text-blue-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Action */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <CheckCircleIcon size={16} className="text-emerald-400" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Vehicle Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
