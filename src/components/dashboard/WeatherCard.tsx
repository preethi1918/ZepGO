import React from 'react';
import { ShieldCheck, Car, Route, CloudSun } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const WeatherCard: React.FC = () => {
  return (
    <Card variant="solid" className="space-y-4 flex flex-col justify-between bg-white border-slate-200 shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-700">
            <CloudSun className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            WEATHER & ROAD
          </span>
        </div>
        <Badge variant="success" icon={<ShieldCheck className="w-3 h-3" />}>
          Optimal Conditions
        </Badge>
      </div>

      {/* Weather Info */}
      <div className="flex items-center justify-between py-1">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Current Location
          </span>
          <h4 className="text-lg font-black text-slate-900">Chennai</h4>
          <p className="text-xs text-slate-500 font-medium">Partly Clear • 6.2 km/kWh</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-amber-600">32°C</span>
          <p className="text-[11px] text-slate-500 font-semibold">Humidity 64%</p>
        </div>
      </div>

      {/* Conditions Checklist below */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
            <Car className="w-3 h-3 text-blue-600" />
            <span>Traffic</span>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 block mt-0.5">Normal</span>
        </div>

        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
            <Route className="w-3 h-3 text-emerald-600" />
            <span>Road</span>
          </div>
          <span className="text-xs font-extrabold text-slate-900 block mt-0.5">Good</span>
        </div>

        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Weather</span>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 block mt-0.5">Clear</span>
        </div>
      </div>
    </Card>
  );
};
