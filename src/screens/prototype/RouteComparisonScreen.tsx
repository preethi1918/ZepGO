import React, { useState } from 'react';
import { ArrowLeft, Check, Zap } from 'lucide-react';

interface RouteComparisonScreenProps {
  onSelectRoute: (routeId: string) => void;
  onBack: () => void;
}

export const RouteComparisonScreen: React.FC<RouteComparisonScreenProps> = ({
  onSelectRoute,
  onBack,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState('recommended');

  const routes = [
    {
      id: 'recommended',
      title: 'Option 1: Recommended (Salem 1-Stop)',
      distance: '342 km',
      duration: '5h 42m',
      stops: '1 Stop (Zeon Salem 150kW)',
      arrivalSoc: '38%',
      confidence: 'LOW RISK',
      confidenceScore: '94% Predicted Availability',
      badgeColor: 'bg-[#EAF8EF] text-[#22C55E] border-[#22C55E]/40',
      description: 'ZepGO optimal route. Zero congestion bottleneck predicted at arrival.',
      recommended: true,
    },
    {
      id: 'fastest',
      title: 'Option 2: Direct Expressway (Tindivanam Stop)',
      distance: '338 km',
      duration: '5h 30m',
      stops: '1 Stop (Tata Power Tindivanam)',
      arrivalSoc: '18%',
      confidence: 'MODERATE RISK',
      confidenceScore: '68% Predicted Availability',
      badgeColor: 'bg-[#FFFBEB] text-[#F59E0B] border-[#F59E0B]/40',
      description: 'High charger queue expected between 12:30 PM - 1:15 PM at Tindivanam.',
      recommended: false,
    },
    {
      id: 'safest',
      title: 'Option 3: Maximum Safety (2-Stop Buffer)',
      distance: '348 km',
      duration: '6h 15m',
      stops: '2 Stops (Ulundurpet + Salem)',
      arrivalSoc: '52%',
      confidence: 'VERY LOW RISK',
      confidenceScore: '99% Predicted Availability',
      badgeColor: 'bg-[#EAF8EF] text-[#22C55E] border-[#22C55E]/40',
      description: 'Maintains 30%+ battery buffer throughout the entire trip.',
      recommended: false,
    },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-5 select-none animate-fadeIn space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-[#0B0F0D] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-extrabold text-sm text-[#0B0F0D]">Route Options</span>
        <div className="w-9" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#0B0F0D]">Compare 3 AI Routes</h2>
        <p className="text-xs text-[#6B7280]">
          Routes evaluated for predicted charger availability at your estimated arrival time.
        </p>
      </div>

      {/* Routes List */}
      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-4 rounded-[20px] border transition-all cursor-pointer space-y-3 relative ${
                isSelected
                  ? 'border-[#22C55E] bg-white shadow-md ring-2 ring-[#22C55E]'
                  : 'border-[#E5E7EB] bg-white hover:border-slate-300'
              }`}
            >
              {/* Card Header & Risk Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-[#0B0F0D]">{route.title}</h4>
                  </div>
                  <span className="text-xs text-[#6B7280] font-medium">{route.stops}</span>
                </div>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full border border-current ${route.badgeColor}`}
                >
                  {route.confidence}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-2.5 rounded-[14px] border border-slate-100 text-center">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Distance</span>
                  <span className="text-xs font-black text-[#0B0F0D]">{route.distance}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Total Time</span>
                  <span className="text-xs font-black text-[#0B0F0D]">{route.duration}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Dest SOC</span>
                  <span className="text-xs font-black text-[#22C55E]">{route.arrivalSoc}</span>
                </div>
              </div>

              {/* AI Insight note */}
              <p className="text-[11px] text-[#6B7280] leading-snug">{route.description}</p>

              {route.recommended && (
                <div className="bg-[#EAF8EF] text-[#22C55E] text-[10px] font-extrabold px-3 py-1 rounded-lg border border-[#22C55E]/30 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Zap size={12} fill="#22C55E" />
                    ZepGO Recommended for Zero Congestion
                  </span>
                  <span>94% Uptime</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Select CTA Button */}
      <button
        onClick={() => onSelectRoute(selectedRouteId)}
        className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-3.5 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
      >
        <Check size={18} className="text-[#22C55E]" />
        <span>Confirm Selected Route</span>
      </button>
    </div>
  );
};
