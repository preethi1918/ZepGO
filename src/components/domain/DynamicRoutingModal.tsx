import React, { useState } from 'react';
import type { Trip } from '../../types/trip';
import { NavigationIcon, ZapIcon, XIcon, CheckCircleIcon } from '../common/Icons';

export interface DynamicRoutingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrip: Trip;
  onSelectAlternativeRoute: (route: Trip) => void;
}

export const DynamicRoutingModal: React.FC<DynamicRoutingModalProps> = ({
  isOpen,
  onClose,
  currentTrip,
  onSelectAlternativeRoute,
}) => {
  if (!isOpen) return null;

  // Build 3 dynamic alternative routes
  const routeOptions: {
    id: string;
    name: string;
    tag: string;
    tagBg: string;
    distanceKm: number;
    durationMins: number;
    energyKwh: number;
    arrivalSoc: number;
    stopsCount: number;
    desc: string;
  }[] = [
    {
      id: 'opt-fastest',
      name: 'Dynamic Expressway Route',
      tag: 'Fastest ETA',
      tagBg: 'bg-blue-600 text-white',
      distanceKm: currentTrip.totalDistanceKm,
      durationMins: currentTrip.totalDurationMinutes,
      energyKwh: currentTrip.estimatedEnergyKwh,
      arrivalSoc: currentTrip.arrivalSocPercent,
      stopsCount: currentTrip.stops.length,
      desc: 'Max speed via Expressway. Recommended when charger availability is high.',
    },
    {
      id: 'opt-eco',
      name: 'AI Eco Energy Saver Route',
      tag: 'Max Range Buffer',
      tagBg: 'bg-emerald-600 text-white',
      distanceKm: Math.round(currentTrip.totalDistanceKm * 0.96),
      durationMins: currentTrip.totalDurationMinutes + 12,
      energyKwh: Math.round(currentTrip.estimatedEnergyKwh * 0.84 * 10) / 10,
      arrivalSoc: currentTrip.arrivalSocPercent + 14,
      stopsCount: Math.max(0, currentTrip.stops.length - 1),
      desc: 'Bypasses high-speed elevation hills. Saves 3.2 kWh and eliminates 1 charging stop.',
    },
    {
      id: 'opt-safe',
      name: '100kW+ Ultra Fast Charging Corridor',
      tag: 'Zero Wait Corridor',
      tagBg: 'bg-purple-600 text-white',
      distanceKm: currentTrip.totalDistanceKm + 8,
      durationMins: currentTrip.totalDurationMinutes - 8,
      energyKwh: currentTrip.estimatedEnergyKwh + 1.2,
      arrivalSoc: currentTrip.arrivalSocPercent + 8,
      stopsCount: 1,
      desc: 'Routes exclusively via 120kW Zeon & Tata Power Ultra-Fast hubs with 4+ open plugs.',
    },
  ];

  const [selectedRouteId, setSelectedRouteId] = useState('opt-fastest');

  const handleConfirm = () => {
    const selected = routeOptions.find((r) => r.id === selectedRouteId);
    if (selected) {
      const updatedTrip: Trip = {
        ...currentTrip,
        title: `${currentTrip.originName} to ${currentTrip.destinationName} (${selected.name})`,
        totalDistanceKm: selected.distanceKm,
        totalDurationMinutes: selected.durationMins,
        estimatedEnergyKwh: selected.energyKwh,
        arrivalSocPercent: selected.arrivalSoc,
      };
      onSelectAlternativeRoute(updatedTrip);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <NavigationIcon size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Dynamic Routing Engine</span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Alternative Routes</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Route Options Cards */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {routeOptions.map((opt) => {
            const isSelected = opt.id === selectedRouteId;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedRouteId(opt.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${opt.tagBg}`}>
                      {opt.tag}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{opt.name}</h4>
                  </div>
                  {isSelected && <CheckCircleIcon size={16} className="text-blue-600" />}
                </div>

                <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">{opt.desc}</p>

                <div className="grid grid-cols-4 gap-1 text-center text-[10px] bg-white p-2 rounded-xl border border-slate-200/60 font-semibold">
                  <div>
                    <p className="text-slate-400 font-normal">Distance</p>
                    <p className="text-slate-800">{opt.distanceKm} km</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-normal">ETA Time</p>
                    <p className="text-slate-800">{opt.durationMins}m</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-normal">Energy</p>
                    <p className="text-slate-800">{opt.energyKwh} kWh</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-normal">Arrival SOC</p>
                    <p className="text-emerald-600 font-bold">{opt.arrivalSoc}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Action */}
        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ZapIcon size={16} />
          <span>Switch to Selected Dynamic Route</span>
        </button>
      </div>
    </div>
  );
};
