import React, { useState } from 'react';
import type { ChargingStation } from '../../types/charging';

export interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: ChargingStation[];
  onStartSessionForStation: (station: ChargingStation) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  stations,
  onStartSessionForStation,
}) => {
  const [scanning, setScanning] = useState(false);

  if (!isOpen) return null;

  const handleSelectSampleStation = (station: ChargingStation) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onStartSessionForStation(station);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl max-w-sm w-full p-5 space-y-4 relative font-[Inter,sans-serif]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Scan Charger QR Code</h2>
            <p className="text-[10px] text-slate-400">Point camera at station plug QR code</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Viewport Frame */}
        <div className="relative w-full h-56 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center">
          {/* Animated Laser Scanning Line */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-lg shadow-emerald-400/50" style={{ top: '40%' }} />

          {/* Target Box */}
          <div className="w-36 h-36 border-2 border-dashed border-emerald-400/70 rounded-2xl flex flex-col items-center justify-center bg-emerald-500/5 relative">
            <span className="text-4xl">📷</span>
            <span className="text-[10px] font-bold text-emerald-400 mt-2">
              {scanning ? 'Authenticating Plug...' : 'Align QR Code'}
            </span>
          </div>
        </div>

        {/* Quick Simulator Pick */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Or Tap Charger Plug to Scan:</p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 no-scrollbar">
            {stations.slice(0, 3).map((st) => (
              <button
                key={st.id}
                onClick={() => handleSelectSampleStation(st)}
                className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700/80 text-left flex items-center justify-between text-xs transition-all cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white line-clamp-1">{st.name}</p>
                  <p className="text-[10px] text-slate-400">{st.operator} • {st.maxPowerKw} kW DC</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  Scan ⚡
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
