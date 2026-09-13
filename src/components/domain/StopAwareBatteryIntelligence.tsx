import React from 'react';
import type { Trip } from '../../types/trip';
import { ZapIcon, ChevronRightIcon } from '../common/Icons';

export interface StopAwareBatteryIntelligenceProps {
  trip: Trip;
  batteryCapacityKwh: number;
}

export const StopAwareBatteryIntelligence: React.FC<StopAwareBatteryIntelligenceProps> = ({
  trip,
  batteryCapacityKwh,
}) => {
  // Build segments array
  const segments = [];
  let currentSoc = trip.startSocPercent;

  if (trip.stops.length === 0) {
    const energyUsed = trip.estimatedEnergyKwh;
    const socDrop = Math.round((energyUsed / batteryCapacityKwh) * 100);
    const arrivalSoc = Math.max(0, currentSoc - socDrop);
    segments.push({
      title: 'Direct Non-Stop Route',
      from: trip.originName,
      to: trip.destinationName,
      distanceKm: trip.totalDistanceKm,
      departSoc: currentSoc,
      arrivalSoc: arrivalSoc,
      energyKwh: energyUsed,
      isStop: false,
    });
  } else {
    // Leg 1: Origin to Stop 1
    const firstStop = trip.stops[0];
    const leg1Distance = firstStop.distanceFromOriginKm;
    const leg1Energy = Math.round((leg1Distance * 0.13) * 10) / 10;
    const leg1SocDrop = Math.round((leg1Energy / batteryCapacityKwh) * 100);
    const leg1ArrivalSoc = Math.max(5, currentSoc - leg1SocDrop);

    segments.push({
      title: 'Segment 1 (Departure)',
      from: trip.originName,
      to: firstStop.stationName,
      distanceKm: leg1Distance,
      departSoc: currentSoc,
      arrivalSoc: leg1ArrivalSoc,
      energyKwh: leg1Energy,
      isStop: false,
    });

    // Charging Stop 1
    segments.push({
      title: `Charging Stop 1 — ${firstStop.stationName}`,
      from: firstStop.stationName,
      to: firstStop.stationName,
      distanceKm: 0,
      departSoc: leg1ArrivalSoc,
      arrivalSoc: firstStop.targetSocPercent,
      energyKwh: Math.round(((firstStop.targetSocPercent - leg1ArrivalSoc) / 100) * batteryCapacityKwh * 10) / 10,
      isStop: true,
      durationMins: firstStop.durationMinutes,
      powerKw: firstStop.chargingPowerKw,
    });

    // Leg 2: Stop 1 to Destination
    const leg2Distance = Math.max(10, trip.totalDistanceKm - firstStop.distanceFromOriginKm);
    const leg2Energy = Math.round((leg2Distance * 0.13) * 10) / 10;
    const leg2SocDrop = Math.round((leg2Energy / batteryCapacityKwh) * 100);
    const finalArrivalSoc = Math.max(10, firstStop.targetSocPercent - leg2SocDrop);

    segments.push({
      title: 'Segment 2 (En Route)',
      from: firstStop.stationName,
      to: trip.destinationName,
      distanceKm: leg2Distance,
      departSoc: firstStop.targetSocPercent,
      arrivalSoc: finalArrivalSoc,
      energyKwh: leg2Energy,
      isStop: false,
    });
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <ZapIcon size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Phase 5 Battery Intelligence</span>
            <h3 className="text-sm font-bold text-slate-900">Stop-Aware Energy Profile</h3>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          Total {trip.estimatedEnergyKwh} kWh
        </span>
      </div>

      {/* Visual Timeline Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-semibold text-slate-500">
          <span>Start: {trip.startSocPercent}%</span>
          <span>Target Arrival: {trip.arrivalSocPercent}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${trip.startSocPercent}%` }}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Segment Cards */}
      <div className="space-y-2.5">
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-xs transition-all ${
              seg.isStop
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200/80 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[11px] tracking-wide uppercase flex items-center gap-1">
                {seg.isStop && <ZapIcon size={12} className="text-amber-600" />}
                {seg.title}
              </span>
              {seg.isStop ? (
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">
                  +{seg.energyKwh} kWh in {seg.durationMins}m @ {seg.powerKw}kW
                </span>
              ) : (
                <span className="font-medium text-slate-500 text-[10px]">
                  {seg.distanceKm} km • {seg.energyKwh} kWh
                </span>
              )}
            </div>

            {!seg.isStop ? (
              <div className="flex items-center justify-between text-[11px] mt-1.5 pt-1 border-t border-slate-200/60">
                <span className="text-slate-600 font-medium line-clamp-1">{seg.from}</span>
                <div className="flex items-center gap-1 shrink-0 font-bold">
                  <span className="text-emerald-600">{seg.departSoc}%</span>
                  <ChevronRightIcon size={12} className="text-slate-400" />
                  <span className={seg.arrivalSoc < 20 ? 'text-amber-600' : 'text-blue-600'}>
                    {seg.arrivalSoc}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] mt-1.5 pt-1 border-t border-amber-200/60">
                <span className="text-amber-900 font-medium">Recharging Battery</span>
                <span className="font-bold text-amber-700">
                  {seg.departSoc}% ➔ {seg.arrivalSoc}% (+{seg.arrivalSoc - seg.departSoc}%)
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
