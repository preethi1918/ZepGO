import React, { useState } from 'react';
import { Car, Battery, Plus, Edit3 } from 'lucide-react';
import type { VehicleState } from '../../types/vehicle';

interface MyVehicleDesktopProps {
  activeVehicle: VehicleState;
  onUpdateVehicle: (updatedVehicle: VehicleState) => void;
  onEditVehicleClick: () => void;
}

export const MyVehicleDesktop: React.FC<MyVehicleDesktopProps> = ({
  activeVehicle,
  onUpdateVehicle,
  onEditVehicleClick,
}) => {
  const [vehiclesList, setVehiclesList] = useState<VehicleState[]>([
    activeVehicle,
    {
      modelName: 'MG ZS EV',
      brand: 'MG',
      trim: 'ZS EV Exclusive 50.3 kWh',
      batteryCapacityKwh: 50.3,
      currentSocPercent: 68,
      estimatedRangeKm: 280,
      healthPercent: 99,
      chargingStatus: 'discharging',
      currentChargePowerKw: 0,
      supportedPlugs: ['CCS2'],
      averageConsumptionWhPerKm: 140,
      licensePlate: 'KA-05-EV-1918',
      minArrivalSocBufferPercent: 15,
      preferredNetworks: ['Zeon', 'Tata Power'],
      ecoScore: 94,
      totalKmDriven: 8500,
      totalCo2OffsetKg: 1100,
      totalChargingCostSavedRs: 28000,
    },
  ]);

  const [isUpdatingBatteryModal, setIsUpdatingBatteryModal] = useState(false);
  const [tempSoc, setTempSoc] = useState(activeVehicle.currentSocPercent);

  const handleSelectActiveVehicle = (veh: VehicleState) => {
    onUpdateVehicle(veh);
  };

  const handleConfirmSocUpdate = () => {
    const updatedRange = Math.round((tempSoc / 100) * (activeVehicle.batteryCapacityKwh * 8.2));
    const updated = {
      ...activeVehicle,
      currentSocPercent: tempSoc,
      estimatedRangeKm: updatedRange,
    };
    onUpdateVehicle(updated);
    setVehiclesList((prev: VehicleState[]) =>
      prev.map((v: VehicleState) => (v.modelName === activeVehicle.modelName ? updated : v))
    );
    setIsUpdatingBatteryModal(false);
  };

  return (
    <div className="flex-1 bg-[#090D0B] text-white p-6 lg:p-10 space-y-8 font-[Inter,sans-serif] select-none overflow-y-auto no-scrollbar">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-[#22C55E] tracking-wider bg-[#22C55E]/15 border border-[#22C55E]/30 px-2.5 py-1 rounded-full">
              EV Garage & Range AI
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1.5">MY VEHICLES & SPECS</h1>
          <p className="text-xs text-slate-400">
            Manage your registered electric vehicles and live battery status for intelligent range calculations.
          </p>
        </div>

        <button
          onClick={onEditVehicleClick}
          className="px-4 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>+ Add New Vehicle</span>
        </button>
      </div>

      {/* ACTIVE VEHICLE HERO CARD MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HERO CARD (2 COLUMNS) */}
        <div className="lg:col-span-2 bg-[#141A17] border border-[#22C55E]/40 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Active Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs font-black text-[#22C55E] uppercase tracking-wider">
                ACTIVE VEHICLE FOR RANGE AI
              </span>
            </div>
            <span className="text-xs font-extrabold bg-[#0B0F0D] border border-slate-800 text-slate-300 px-3 py-1 rounded-xl">
              Reg: {activeVehicle.licensePlate || 'KA-01-EV-2026'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Vehicle Graphic Container */}
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#1E2923] to-[#0B0F0D] border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] shadow-inner shrink-0">
              <Car size={64} />
            </div>

            <div className="space-y-2 text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="text-2xl font-black text-white">{activeVehicle.modelName}</h2>
                <span className="text-xs font-extrabold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-0.5 rounded-md">
                  {activeVehicle.batteryCapacityKwh} kWh
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">{activeVehicle.trim}</p>
              <p className="text-[11px] text-slate-500">
                Primary vehicle driving live range estimation, battery warnings, and Smart Stop & Cafe Sync recommendations.
              </p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-[#0B0F0D] p-3 rounded-2xl border border-slate-800 space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Current Battery</span>
              <span className="font-black text-[#22C55E] text-base">{activeVehicle.currentSocPercent}% SOC</span>
            </div>
            <div className="bg-[#0B0F0D] p-3 rounded-2xl border border-slate-800 space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Est. Range</span>
              <span className="font-black text-white text-base">{activeVehicle.estimatedRangeKm} km</span>
            </div>
            <div className="bg-[#0B0F0D] p-3 rounded-2xl border border-slate-800 space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Plug Support</span>
              <span className="font-extrabold text-white text-xs mt-1 block">CCS2 Dual DC</span>
            </div>
            <div className="bg-[#0B0F0D] p-3 rounded-2xl border border-slate-800 space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Max Speed</span>
              <span className="font-extrabold text-amber-400 text-xs mt-1 block">150 kW DC</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsUpdatingBatteryModal(true)}
              className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
            >
              <Battery size={16} />
              <span>Update Battery %</span>
            </button>

            <button
              onClick={onEditVehicleClick}
              className="bg-[#0B0F0D] hover:bg-slate-800 text-slate-300 font-extrabold py-3 px-4 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Edit3 size={16} />
              <span>Edit Vehicle</span>
            </button>
          </div>
        </div>

        {/* MY VEHICLES LIST (1 COLUMN) */}
        <div className="bg-[#141A17] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">REGISTERED EVS ({vehiclesList.length})</h3>
              <span className="text-[10px] text-slate-400 font-bold">Multi-EV Ready</span>
            </div>

            <div className="space-y-2.5">
              {vehiclesList.map((veh: VehicleState, idx: number) => {
                const isActive = veh.modelName === activeVehicle.modelName;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectActiveVehicle(veh)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isActive
                        ? 'bg-[#1E2923] border-[#22C55E] text-white shadow-md'
                        : 'bg-[#0B0F0D] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-white">{veh.modelName}</span>
                      {isActive ? (
                        <span className="text-[9px] font-black bg-[#22C55E] text-[#0B0F0D] px-2 py-0.5 rounded-full">
                          ✓ Active
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-500">Select</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{veh.batteryCapacityKwh} kWh Pack</span>
                      <span className="font-bold text-[#22C55E]">{veh.currentSocPercent}% SOC</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onEditVehicleClick}
            className="w-full bg-[#0B0F0D] hover:bg-slate-800 text-slate-300 font-extrabold py-3 px-4 rounded-xl border border-slate-800 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Plus size={15} />
            <span>+ Add Another Vehicle</span>
          </button>
        </div>
      </div>

      {/* UPDATE BATTERY % MODAL */}
      {isUpdatingBatteryModal && (
        <div className="fixed inset-0 bg-[#0B0F0D]/80 backdrop-blur-md z-50 p-6 flex items-center justify-center animate-fadeIn">
          <div className="bg-[#141A17] border border-[#22C55E]/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-[#22C55E] uppercase tracking-wider">
                Quick Battery Update
              </span>
              <button
                onClick={() => setIsUpdatingBatteryModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel ✕
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-white">{activeVehicle.modelName}</h3>
              <p className="text-xs text-slate-300">
                Adjust your current battery percentage to automatically update range estimates across ZepGO route planner.
              </p>

              <div className="space-y-2 bg-[#0B0F0D] p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-slate-400">State of Charge:</span>
                  <span className="text-lg font-black text-[#22C55E]">{tempSoc}% SOC</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={tempSoc}
                  onChange={(e) => setTempSoc(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmSocUpdate}
              className="w-full bg-[#22C55E] text-[#0B0F0D] font-extrabold py-3.5 rounded-xl text-xs shadow-lg cursor-pointer"
            >
              Update SOC & Recalculate Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
