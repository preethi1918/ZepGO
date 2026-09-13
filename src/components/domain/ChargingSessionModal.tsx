import React, { useState, useEffect } from 'react';
import type { ChargingStation } from '../../types/charging';
import type { VehicleState } from '../../types/vehicle';
import { ZapIcon, CheckCircleIcon } from '../common/Icons';

export interface ChargingSessionModalProps {
  isOpen: boolean;
  station: ChargingStation | null;
  vehicle: VehicleState;
  onClose: () => void;
  onFinishSession?: (addedSoc: number, cost: number, kwhAdded: number) => void;
}

export const ChargingSessionModal: React.FC<ChargingSessionModalProps> = ({
  isOpen,
  station,
  vehicle,
  onClose,
  onFinishSession,
}) => {
  const [sessionSoc, setSessionSoc] = useState(vehicle.currentSocPercent || 28);
  const [initialSoc] = useState(vehicle.currentSocPercent || 28);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentPowerKw, setCurrentPowerKw] = useState(station?.maxPowerKw || 120);
  const [kwhDelivered, setKwhDelivered] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSessionSoc(vehicle.currentSocPercent || 28);
      setElapsedSeconds(0);
      setKwhDelivered(0);
      setIsFinished(false);
      return;
    }

    const maxKw = station?.maxPowerKw || 120;
    setCurrentPowerKw(maxKw);

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      // Simulate battery SOC % incrementing (faster simulation speed)
      setSessionSoc((prevSoc) => {
        if (prevSoc >= 95) return prevSoc;
        const newSoc = prevSoc + 1;
        // Taper charging power as battery fills above 80%
        if (newSoc > 80) {
          setCurrentPowerKw(Math.round(maxKw * 0.45));
        } else if (newSoc > 60) {
          setCurrentPowerKw(Math.round(maxKw * 0.75));
        }
        return newSoc;
      });

      // Increment delivered kWh
      setKwhDelivered((prev) => parseFloat((prev + (maxKw / 3600) * 15).toFixed(2)));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, station, vehicle]);

  if (!isOpen || !station) return null;

  const addedSoc = Math.max(0, sessionSoc - initialSoc);
  const pricePerKwh = station.pricePerKwh || 21.5;
  const totalCost = Math.round(kwhDelivered * pricePerKwh);
  const addedRangeKm = Math.round((kwhDelivered * 1000) / (vehicle.averageConsumptionWhPerKm || 135));

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopCharging = () => {
    setIsFinished(true);
    if (onFinishSession) {
      onFinishSession(addedSoc, totalCost, kwhDelivered);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full p-5 space-y-5 relative overflow-hidden font-[Inter,sans-serif]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <ZapIcon size={20} className="fill-emerald-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{station.name}</h2>
              <p className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Fast Charging Active
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {!isFinished ? (
          <>
            {/* Live Charging Telemetry Dial */}
            <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 text-center space-y-4 relative">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-4 border-slate-800 border-t-emerald-500 border-r-emerald-500 animate-spin transition-all duration-1000 flex items-center justify-center" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white tracking-tighter">{sessionSoc}%</span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                    +{addedSoc}% Added
                  </span>
                </div>
              </div>

              {/* Power Rate Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full">
                <span className="text-xs font-bold text-slate-400">Rate:</span>
                <span className="text-sm font-black text-emerald-400">{currentPowerKw} kW DC</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Duration</p>
                <p className="text-base font-black text-white mt-0.5">{formatTime(elapsedSeconds)}</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Energy</p>
                <p className="text-base font-black text-blue-400 mt-0.5">{kwhDelivered} kWh</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Total Cost</p>
                <p className="text-base font-black text-emerald-400 mt-0.5">₹{totalCost}</p>
              </div>
            </div>

            {/* Vehicle & Plug Info */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚘</span>
                <div>
                  <p className="font-bold text-white">{vehicle.brand} {vehicle.modelName}</p>
                  <p className="text-[10px] text-slate-400">CCS2 Plug 04 • {addedRangeKm} km added</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                Plugged In
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                onClick={handleStopCharging}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⏹ Stop Charging Session</span>
              </button>
            </div>
          </>
        ) : (
          /* Session Completed Digital Receipt Invoice */
          <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircleIcon size={28} />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Charging Complete!</h3>
              <p className="text-xs text-slate-400">Digital receipt generated successfully</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Station:</span>
                <span className="font-bold text-white">{station.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Energy Added:</span>
                <span className="font-bold text-blue-400">{kwhDelivered} kWh (+{addedSoc}%)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Added Range:</span>
                <span className="font-bold text-emerald-400">+{addedRangeKm} km</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Charging Rate:</span>
                <span className="font-bold text-white">₹{pricePerKwh}/kWh</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black">
                <span className="text-white">Total Amount Paid:</span>
                <span className="text-emerald-400">₹{totalCost}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
