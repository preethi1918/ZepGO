import React from 'react';
import { Navigation as NavIcon, MapPin, Clock, Battery, Route, Info } from 'lucide-react';
import Card from '../components/Card';

export const NavigationPage: React.FC = () => {
  // Sample placeholder values
  const currentLocation = 'Karur';
  const destination = 'Chennai';
  const distancePlaceholder = '345 km';
  const estimatedTimePlaceholder = '5 hrs 30 mins';
  const batteryUsagePlaceholder = '115% (1 Charging Stop Required)';

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Navigation & Route Intelligence
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Route preview, distance calculation, travel time, and battery consumption estimations.
        </p>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <NavIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Origin</p>
              <p className="text-sm font-bold text-slate-900">{currentLocation}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Destination</p>
              <p className="text-sm font-bold text-slate-900">{destination}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Distance</p>
              <p className="text-sm font-bold text-slate-900">{distancePlaceholder}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Est. Time</p>
              <p className="text-sm font-bold text-slate-900">{estimatedTimePlaceholder}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Battery className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Battery Required</p>
              <p className="text-sm font-bold text-slate-900">{batteryUsagePlaceholder}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Placeholder */}
      <Card className="p-0 overflow-hidden">
        <div className="relative w-full h-96 bg-slate-100 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-300 rounded-xl m-4 w-[calc(100%-2rem)]">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <NavIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            Route intelligence will appear here.
          </h3>
          <p className="text-sm text-slate-500 max-w-md mt-2">
            Interactive route map visualization, Google Maps integration, and live corridor telemetry will be introduced in subsequent phases.
          </p>
          <div className="mt-4 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 font-medium inline-flex items-center gap-1.5 shadow-2xs">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Phase 1 UI Structure Placeholder</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NavigationPage;
