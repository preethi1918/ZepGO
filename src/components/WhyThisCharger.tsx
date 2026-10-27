import React from 'react';
import { CheckCircle2, Sparkles, X, Navigation } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface WhyThisChargerProps {
  charger: any;
  onClose?: () => void;
  onNavigate?: () => void;
  isModal?: boolean;
}

export const WhyThisCharger: React.FC<WhyThisChargerProps> = ({
  charger,
  onClose,
  onNavigate,
  isModal = false
}) => {
  if (!charger) return null;

  const station = charger.station || charger;
  const why = charger.why_this_charger || {
    bullet_points: [
      `${station.distance_from_route_km || 0.2} km from route corridor`,
      `Compatible connector: ${station.connector_type || 'CCS2'}`,
      `Expected arrival battery: ${charger.arrival_soc_percent || 27}%`,
      `Currently ${station.availability || 'Available'} (${station.available_chargers || 3}/${station.total_chargers || 4} plugs open)`,
      `High-speed ${station.charging_speed || 120} kW DC charger`,
      `Estimated cost: ₹${charger.estimated_charging_cost_inr || 180}`,
      `Amenities: ${station.nearby_facilities?.[0]?.name || 'Cafe & Restroom adjacent'}`
    ],
    arrival_soc_percent: charger.arrival_soc_percent || 27,
    charging_time_minutes: charger.time_to_charge_minutes || 24,
    estimated_cost_inr: charger.estimated_charging_cost_inr || 180,
    safety_margin_percent: 18,
    summary: 'Optimal balance of charging speed, low queuing delay, and driver comfort.'
  };

  const content = (
    <div className="space-y-5 text-slate-800">
      {/* Station Title & Status */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300">
              {station.network || 'Zeon Charging'}
            </span>
            <RiskBadge level={charger.risk_level || 'LOW'} size="sm" />
          </div>
          <h2 className="text-xl font-black text-slate-900">{station.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{station.address || 'NH544 Salem Bypass, Tamil Nadu'}</p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* WHAT / WHY / IMPACT CARDS (Design Principle 50) */}
      <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">WHAT</span>
          <span className="text-xs font-black text-slate-800 block mt-0.5">{station.charging_speed || 120} kW DC</span>
          <span className="text-[11px] text-emerald-600 font-semibold">{station.available_chargers || 3} Plugs Open</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">WHY</span>
          <span className="text-xs font-black text-slate-800 block mt-0.5">Top Safe Option</span>
          <span className="text-[11px] text-slate-500">{station.distance_from_route_km || 0.2} km detour</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">IMPACT</span>
          <span className="text-xs font-black text-emerald-600 block mt-0.5">+{why.charging_time_minutes || 24} min</span>
          <span className="text-[11px] text-slate-500 font-semibold">₹{why.estimated_cost_inr || 180} • +18% buffer</span>
        </div>
      </div>

      {/* EXPLICIT WHY THIS CHARGER REASONS */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Sparkles size={15} className="text-amber-500" />
          <span>Why ZepGO Selected This Charger</span>
        </div>

        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200/70 space-y-2.5">
          {why.bullet_points.map((point: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-slate-800">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NEARBY AMENITIES SYNC */}
      {station.nearby_facilities && station.nearby_facilities.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">While You Charge</span>
            <span className="text-[11px] text-slate-400 font-medium">Within 150m walking</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {station.nearby_facilities.slice(0, 2).map((fac: any, idx: number) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block truncate">{fac.name}</span>
                <span className="text-[11px] text-slate-500 capitalize">{fac.category} • {fac.distance_m}m away</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTION BUTTON */}
      {onNavigate && (
        <button
          onClick={onNavigate}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <Navigation size={16} />
          <span>Navigate to This Charger</span>
        </button>
      )}
    </div>
  );

  if (!isModal) {
    return <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {content}
      </div>
    </div>
  );
};
