import React from 'react';
import type { RouteOption } from '../services/tripService';
import { RiskBadge } from './RiskBadge';
import { Check, ChevronRight } from 'lucide-react';

interface RouteComparisonProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute
}) => {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Route Comparison Matrix</h3>
          <p className="text-xs text-slate-500">Compare travel time, energy consumption, and charging stops</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isFastest = route.type === 'fastest';
          const isEco = route.type === 'energy_efficient';

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`rounded-2xl p-4.5 border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-emerald-50/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isFastest
                      ? 'bg-blue-100 text-blue-700'
                      : isEco
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {isFastest ? 'FASTEST' : isEco ? 'ENERGY EFFICIENT' : 'CHARGING SAFE'}
                </span>
                <RiskBadge level={route.risk_level} size="sm" />
              </div>

              {/* Title & Stats */}
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">{route.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">{route.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 mb-3">
                <div>
                  <span className="text-[11px] text-slate-400 block">Distance & ETA</span>
                  <span className="font-bold text-slate-800">{route.distance_km} km • {route.duration_formatted}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Energy & Arrival</span>
                  <span className="font-bold text-emerald-600">{route.energy_consumption_kwh} kWh ({route.arrival_soc_percent}% SOC)</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Charging Stop</span>
                  <span className="font-bold text-slate-800">{route.charging_required ? '1 Stop Needed' : '0 Stops Needed'}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Toll Cost</span>
                  <span className="font-bold text-slate-800">₹{route.toll_cost}</span>
                </div>
              </div>

              {/* Select Button */}
              <button
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check size={14} />
                    <span>Selected Route</span>
                  </>
                ) : (
                  <>
                    <span>Choose Route</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
