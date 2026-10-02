import React from 'react';
import { Car, Zap, Gauge, Plug, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/StatusIndicator';
import type { Vehicle } from '../../types';
import { useNavigate } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();

  return (
    <Card variant="solid" className="space-y-4 flex flex-col justify-between bg-white border-slate-200 shadow-sm">
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
              <Car className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              YOUR EV SPECS
            </span>
          </div>
          <StatusIndicator status={vehicle.status === 'Active' ? 'active' : 'offline'} label={vehicle.status} />
        </div>

        {/* Vehicle Model Title */}
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {vehicle.id}</p>
        </div>

        {/* Vehicle Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Usable Battery
            </span>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{vehicle.batteryCapacity} kWh</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Efficiency
            </span>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
              <Gauge className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{vehicle.efficiency} Wh/km</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Connector
            </span>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
              <Plug className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{vehicle.connectorType}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Max DC Speed
            </span>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{vehicle.maxChargingSpeed} kW</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        fullWidth
        onClick={() => navigate('/vehicle')}
        rightIcon={<ChevronRight className="w-4 h-4" />}
        className="mt-2"
      >
        View Spec Details
      </Button>
    </Card>
  );
};
