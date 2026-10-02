import React from 'react';
import { Zap, BatteryCharging, Gauge, Compass } from 'lucide-react';
import Card from './Card';

export interface VehicleDetails {
  brand: string;
  model: string;
  batteryCapacity: number; // in kWh
  currentBatteryPct: number; // percentage
  efficiency: number; // Wh/km
  estimatedRange: number; // km
}

interface VehicleCardProps {
  vehicle: VehicleDetails;
  className?: string;
  compact?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  className = '',
  compact = false,
}) => {
  return (
    <Card
      className={className}
      title={`${vehicle.brand} ${vehicle.model}`}
      subtitle="Active Vehicle Profile"
      action={
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Zap className="w-3 h-3 mr-1 fill-emerald-600 text-emerald-600" /> Pure EV
        </span>
      }
    >
      <div className="space-y-4">
        {/* Battery Level Indicator */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-slate-600 flex items-center gap-1">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> Current Battery State
            </span>
            <span className="text-slate-900 font-semibold">{vehicle.currentBatteryPct}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                vehicle.currentBatteryPct > 50
                  ? 'bg-emerald-500'
                  : vehicle.currentBatteryPct > 20
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${vehicle.currentBatteryPct}%` }}
            />
          </div>
        </div>

        {/* Spec Grid */}
        <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-3'} gap-3 pt-2`}>
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">Capacity</div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">{vehicle.batteryCapacity} kWh</div>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-400" /> Efficiency
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">{vehicle.efficiency} Wh/km</div>
          </div>
          <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/60 col-span-1">
            <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <Compass className="w-3 h-3 text-emerald-600" /> Est. Range
            </div>
            <div className="text-sm font-bold text-emerald-900 mt-0.5">{vehicle.estimatedRange} km</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VehicleCard;
