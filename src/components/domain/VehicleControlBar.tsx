import React, { useState } from 'react';
import type { VehicleState } from '../../types/vehicle';
import { LockIcon, UnlockIcon, FanIcon, Volume2Icon, ZapIcon } from '../common/Icons';

export interface VehicleControlBarProps {
  vehicle: VehicleState;
  onUpdateVehicle?: (updated: VehicleState) => void;
  onTriggerToast?: (title: string, description?: string, type?: 'success' | 'warning' | 'info' | 'charging') => void;
}

export const VehicleControlBar: React.FC<VehicleControlBarProps> = ({
  vehicle,
  onUpdateVehicle,
  onTriggerToast,
}) => {
  const [isLocked, setIsLocked] = useState(true);
  const [isClimateOn, setIsClimateOn] = useState(false);
  const [targetChargeLimit, setTargetChargeLimit] = useState(80);
  const [isPreconditioning, setIsPreconditioning] = useState(false);
  const [flashingState, setFlashingState] = useState(false);

  const handleToggleLock = () => {
    const nextState = !isLocked;
    setIsLocked(nextState);
    if (onTriggerToast) {
      onTriggerToast(
        nextState ? 'Vehicle Doors Locked' : 'Vehicle Doors Unlocked',
        `${vehicle.brand} ${vehicle.modelName} security state updated.`,
        nextState ? 'info' : 'warning'
      );
    }
  };

  const handleToggleClimate = () => {
    const nextState = !isClimateOn;
    setIsClimateOn(nextState);
    if (onTriggerToast) {
      onTriggerToast(
        nextState ? 'Climate Control On' : 'Climate Control Off',
        nextState ? 'Cabin set to 21°C. Pre-cooling active.' : 'A/C compressor standby.',
        'success'
      );
    }
  };

  const handleTogglePrecondition = () => {
    const nextState = !isPreconditioning;
    setIsPreconditioning(nextState);
    if (onTriggerToast) {
      onTriggerToast(
        nextState ? 'Battery Pre-conditioning Active' : 'Pre-conditioning Stopped',
        nextState ? 'Warming battery pack to 32°C for optimal DC fast charging.' : 'Standard battery thermals restored.',
        'charging'
      );
    }
  };

  const handleHonkFlash = () => {
    setFlashingState(true);
    if (onTriggerToast) {
      onTriggerToast('Horn & Headlights Flashed', 'Vehicle located successfully.', 'info');
    }
    setTimeout(() => setFlashingState(false), 1500);
  };

  const handleChargeLimitChange = (limit: number) => {
    setTargetChargeLimit(limit);
    if (onUpdateVehicle) {
      onUpdateVehicle({
        ...vehicle,
      });
    }
    if (onTriggerToast) {
      onTriggerToast(
        `Charge Limit Set to ${limit}%`,
        limit === 100 ? 'Trip Mode: 100% capacity target.' : 'Daily Mode: 80% battery longevity target.',
        'info'
      );
    }
  };

  return (
    <div className={`bg-slate-900 text-white rounded-3xl p-4 sm:p-5 border shadow-xl relative overflow-hidden transition-all duration-300 font-[Inter,sans-serif] ${
      flashingState ? 'ring-4 ring-emerald-400 border-emerald-400 bg-slate-800' : 'border-slate-800/80'
    }`}>
      {/* Header telemetry info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">EV Remote Controls</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
              isLocked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {isLocked ? <LockIcon size={10} /> : <UnlockIcon size={10} />}
              <span>{isLocked ? 'Locked' : 'Unlocked'}</span>
            </span>
          </div>
          <p className="text-sm font-black text-white mt-0.5">
            {vehicle.brand} {vehicle.modelName}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Cabin Temp</p>
          <p className="text-sm font-black text-emerald-400">{isClimateOn ? '21°C' : '28°C'}</p>
        </div>
      </div>

      {/* Main Remote Actions Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Lock/Unlock */}
        <button
          onClick={handleToggleLock}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
            isLocked
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              : 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-lg shadow-emerald-600/30'
          }`}
        >
          <div className="mb-1">{isLocked ? <LockIcon size={20} /> : <UnlockIcon size={20} />}</div>
          <span className="text-[10px] font-bold tracking-tight">{isLocked ? 'Unlock' : 'Lock'}</span>
        </button>

        {/* Climate AC */}
        <button
          onClick={handleToggleClimate}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
            isClimateOn
              ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
        >
          <div className={`mb-1 ${isClimateOn ? 'animate-spin' : ''}`}><FanIcon size={20} /></div>
          <span className="text-[10px] font-bold tracking-tight">{isClimateOn ? 'A/C 21°' : 'Climate'}</span>
        </button>

        {/* Preconditioning */}
        <button
          onClick={handleTogglePrecondition}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
            isPreconditioning
              ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
        >
          <div className="mb-1"><ZapIcon size={20} /></div>
          <span className="text-[10px] font-bold tracking-tight">{isPreconditioning ? 'Preheat' : 'Warm Pack'}</span>
        </button>

        {/* Honk & Flash */}
        <button
          onClick={handleHonkFlash}
          className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-2xl transition-all active:scale-95 cursor-pointer"
        >
          <div className="mb-1"><Volume2Icon size={20} /></div>
          <span className="text-[10px] font-bold tracking-tight">Flash/Honk</span>
        </button>
      </div>

      {/* Charge Target Limit Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-semibold">Target Charge Limit</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChargeLimitChange(80)}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                targetChargeLimit === 80 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              80% Daily
            </button>
            <button
              onClick={() => handleChargeLimitChange(100)}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                targetChargeLimit === 100 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              100% Trip
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={targetChargeLimit}
            onChange={(e) => handleChargeLimitChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs font-black text-white w-8 text-right">{targetChargeLimit}%</span>
        </div>
      </div>
    </div>
  );
};
