import React from 'react';
import { MapPin, Navigation, Battery, Zap, ChevronRight, Shield, Sliders } from 'lucide-react';

interface HomeScreenPrototypeProps {
  onPlanJourney: () => void;
  onChangeVehicle: () => void;
  onChangeBattery: () => void;
  onOpenPreferences: () => void;
  onNavigateTab: (tab: string) => void;
  batterySoc?: number;
  vehicleModel?: string;
}

export const HomeScreenPrototype: React.FC<HomeScreenPrototypeProps> = ({
  onPlanJourney,
  onChangeVehicle,
  onChangeBattery,
  onOpenPreferences,
  onNavigateTab,
  batterySoc = 72,
  vehicleModel = 'Tata Nexon EV Max',
}) => {
  const estimatedRangeKm = Math.round((batterySoc / 100) * 312);

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-4 select-none animate-fadeIn space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0B0F0D] rounded-2xl flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-[#22C55E] fill-[#22C55E]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#0B0F0D]">ZepGO Intelligent</h3>
            <p className="text-xs text-[#6B7280]">Chennai • Clear weather 28°C</p>
          </div>
        </div>
        <div className="bg-[#EAF8EF] text-[#22C55E] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#22C55E]/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
          <span>AI Active</span>
        </div>
      </div>

      {/* Vehicle Telemetry & Battery Card (72% Display) */}
      <div
        onClick={onChangeBattery}
        className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E5E7EB] cursor-pointer hover:border-[#22C55E]/50 transition-all space-y-3"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-[#0B0F0D]">{vehicleModel}</span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
              CCS2 DC
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChangeVehicle();
            }}
            className="text-xs font-bold text-[#22C55E] hover:underline"
          >
            Change EV
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-[#EAF8EF] flex items-center justify-center border border-[#22C55E]/30">
              <Battery className="w-6 h-6 text-[#22C55E] fill-[#22C55E]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#0B0F0D]">{batterySoc}%</span>
                <span className="text-xs font-medium text-[#6B7280]">SOC</span>
              </div>
              <p className="text-xs font-semibold text-[#22C55E]">~{estimatedRangeKm} km real range</p>
            </div>
          </div>

          <div className="text-right bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase block">Health</span>
            <span className="text-xs font-extrabold text-[#0B0F0D]">98% SOH</span>
          </div>
        </div>

        {/* Battery Fill Progress */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-[#22C55E] rounded-full transition-all duration-500"
            style={{ width: `${batterySoc}%` }}
          />
        </div>
      </div>

      {/* Main "Where are you going?" Input Card */}
      <div className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E5E7EB] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-[#0B0F0D]">Where are you going?</h4>
          <button
            onClick={onOpenPreferences}
            className="flex items-center gap-1 text-xs font-bold text-[#6B7280] hover:text-[#0B0F0D] bg-slate-100 px-2.5 py-1 rounded-lg"
          >
            <Sliders size={12} />
            <span>Preferences</span>
          </button>
        </div>

        {/* Route Inputs */}
        <div className="space-y-2.5 relative">
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase block">Origin</span>
              <input
                type="text"
                readOnly
                value="Chennai Central, TN"
                className="w-full text-xs font-bold text-[#0B0F0D] bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#22C55E]/40 rounded-[16px] p-3 shadow-sm">
            <MapPin className="w-4 h-4 text-[#22C55E] shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] font-bold text-[#22C55E] uppercase block">Destination</span>
              <input
                type="text"
                readOnly
                value="Coimbatore Junction, TN"
                className="w-full text-xs font-extrabold text-[#0B0F0D] bg-transparent focus:outline-none"
              />
            </div>
            <span className="text-[11px] font-bold text-[#22C55E] bg-[#EAF8EF] px-2 py-0.5 rounded-md">
              342 km
            </span>
          </div>
        </div>

        {/* Plan My Journey Main CTA */}
        <button
          onClick={onPlanJourney}
          className="w-full bg-[#0B0F0D] hover:bg-[#1A221E] text-white font-extrabold py-3.5 px-6 rounded-[16px] shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98]"
        >
          <Navigation size={18} className="text-[#22C55E] fill-[#22C55E]" />
          <span>Plan Intelligent Journey</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Quick AI Reliability Guarantee Badge */}
      <div className="bg-[#EAF8EF] border border-[#22C55E]/30 rounded-[16px] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield size={18} className="text-[#22C55E]" />
          <div>
            <span className="text-xs font-extrabold text-[#0B0F0D] block">Predictive Charger Guarantee</span>
            <span className="text-[11px] text-slate-600">Arrival availability monitored in real-time</span>
          </div>
        </div>
        <span className="text-xs font-black text-[#22C55E]">98%</span>
      </div>

      {/* Persistent Bottom Navigation (Home | Map | Charge | Trips | Profile) */}
      <div className="bg-white border-t border-[#E5E7EB] rounded-b-[20px] -mx-4 -mb-4 px-4 py-2.5 flex items-center justify-around text-[#6B7280]">
        <button
          onClick={() => onNavigateTab('home')}
          className="flex flex-col items-center gap-0.5 text-[#0B0F0D] font-bold"
        >
          <Zap size={18} className="text-[#22C55E]" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onNavigateTab('map')}
          className="flex flex-col items-center gap-0.5 hover:text-[#0B0F0D]"
        >
          <MapPin size={18} />
          <span className="text-[10px]">Map</span>
        </button>

        <button
          onClick={() => onNavigateTab('charge')}
          className="flex flex-col items-center gap-0.5 hover:text-[#0B0F0D]"
        >
          <Battery size={18} />
          <span className="text-[10px]">Charge</span>
        </button>

        <button
          onClick={() => onNavigateTab('trips')}
          className="flex flex-col items-center gap-0.5 hover:text-[#0B0F0D]"
        >
          <Navigation size={18} />
          <span className="text-[10px]">Trips</span>
        </button>

        <button
          onClick={() => onNavigateTab('profile')}
          className="flex flex-col items-center gap-0.5 hover:text-[#0B0F0D]"
        >
          <Sliders size={18} />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </div>
  );
};
