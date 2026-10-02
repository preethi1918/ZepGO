import React from 'react';
import { BatteryCharging, MapPin, Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { StatusIndicator } from '../ui/StatusIndicator';
import type { Vehicle } from '../../types';
import { calculateEstimatedRange } from '../../utils/storage';

interface BatteryGaugeProps {
  vehicle: Vehicle;
}

export const BatteryGauge: React.FC<BatteryGaugeProps> = ({ vehicle }) => {
  const soc = vehicle.soc ?? 82;
  const estimatedRange = calculateEstimatedRange(vehicle.batteryCapacity, soc, vehicle.efficiency);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (soc / 100) * circumference;

  return (
    <Card variant="solid" className="space-y-4 flex flex-col justify-between bg-white border-slate-200 shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
            <BatteryCharging className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            BATTERY & RANGE
          </span>
        </div>
        <StatusIndicator status="active" label="Live Telemetry" />
      </div>

      {/* Main Gauge Visual */}
      <div className="flex items-center justify-around gap-4 py-2">
        {/* Circular SVG Gauge */}
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#E2E8F0"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#16A34A"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Text inside circular gauge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{soc}%</span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              SOC Level
            </span>
          </div>
        </div>

        {/* Estimated Range Big Number */}
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Estimated Range
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {estimatedRange}
            </span>
            <span className="text-sm font-black text-emerald-700">km</span>
          </div>
          <div className="text-[11px] text-slate-600 font-medium">
            Based on {vehicle.efficiency} Wh/km efficiency
          </div>
        </div>
      </div>

      {/* Footer Location & Status Bar */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Location</span>
            <span className="text-xs font-extrabold text-slate-900">{vehicle.currentLocation || 'Chennai'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <Activity className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Vehicle Status</span>
            <span className="text-xs font-extrabold text-emerald-700">{vehicle.vehicleStatus || 'Normal'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
