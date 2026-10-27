import React, { useState, useEffect } from 'react';
import { ChargingService, type NearbyFacility } from '../services/chargingService';
import { FacilityCard } from '../components/FacilityCard';
import { BatteryCharging, Sparkles } from 'lucide-react';

interface ChargingPageProps {
  onBackToDashboard: () => void;
}

export const ChargingPage: React.FC<ChargingPageProps> = ({ onBackToDashboard }) => {
  const [currentSoc, setCurrentSoc] = useState(22);
  const [targetSoc] = useState(80);
  const [timeRemainingMins, setTimeRemainingMins] = useState(24);
  const [powerKw] = useState(120);
  const [energyDeliveredKwh, setEnergyDeliveredKwh] = useState(4.2);
  const [facilities, setFacilities] = useState<NearbyFacility[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'cafe' | 'restaurant' | 'restroom'>('all');

  useEffect(() => {
    async function fetchAmenities() {
      const data = await ChargingService.getNearbyFacilities('cs-zeon-salem');
      setFacilities(data);
    }
    fetchAmenities();

    // Charging simulation interval
    const interval = setInterval(() => {
      setCurrentSoc((prev) => {
        if (prev >= 80) return 80;
        return prev + 1;
      });
      setTimeRemainingMins((prev) => Math.max(0, prev - 1));
      setEnergyDeliveredKwh((prev) => Number((prev + 0.4).toFixed(1)));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const filteredFacilities = activeTab === 'all'
    ? facilities
    : facilities.filter((f) => f.category === activeTab);

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto font-[Inter,sans-serif]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Live Session Active</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Charging Session & Smart Amenities</h1>
          <p className="text-xs text-slate-500 mt-0.5">Zeon Fast Charging Hub - Salem Bypass (Bay #02, CCS2)</p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer self-start sm:self-auto"
        >
          Return to Dashboard
        </button>
      </div>

      {/* CHARGING GAUGE & METRICS (Prompt Section 24) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charging Progress Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BatteryCharging size={24} className="animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Live Rate</span>
                <span className="text-sm font-extrabold text-slate-900">{powerKw} kW High-Power DC</span>
              </div>
            </div>

            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Charging Optimal
            </span>
          </div>

          {/* Progress Bar & SOC Percentages */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Current Battery</span>
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{currentSoc}%</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium block">Target Buffer</span>
                <span className="text-3xl font-black text-emerald-600 tracking-tight">{targetSoc}%</span>
              </div>
            </div>

            <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ width: `${currentSoc}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 font-medium pt-1">
              <span>Time Remaining: <strong className="text-slate-900 font-extrabold">{timeRemainingMins} minutes</strong></span>
              <span>Delivered: <strong className="text-slate-900 font-extrabold">{energyDeliveredKwh} kWh</strong></span>
              <span>Cost: <strong className="text-slate-900 font-extrabold">₹{Math.round(energyDeliveredKwh * 21)}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Driver Comfort Summary */}
        <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={15} />
              <span>Break Time Synchronization</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Synchronized Rest Window</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your 24-minute charging window perfectly aligns with a relaxing coffee and South Indian snack break at <strong>Saravana Bhavan</strong>, located just 80 meters away.
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-emerald-200/60 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Restroom Cleanliness:</span>
              <span className="font-bold text-emerald-700">Verified 4.7/5 ⭐</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Food Prep Time:</span>
              <span className="font-bold text-slate-800">~8 to 10 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* "WHILE YOU CHARGE" SECTION (Prompt Section 24 & 25) */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">While You Charge</h3>
            <p className="text-xs text-slate-500">Recommended amenities within 150 meters of your charging bay</p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {[
              { id: 'all', label: 'All Places' },
              { id: 'restaurant', label: 'Restaurants' },
              { id: 'cafe', label: 'Cafes' },
              { id: 'restroom', label: 'Restrooms' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredFacilities.map((fac) => (
            <FacilityCard key={fac.id} facility={fac} />
          ))}
        </div>
      </div>
    </div>
  );
};
