import React, { useState } from 'react';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  // Realistic telemetry totals
  const totalKm = 3420;
  const totalEnergyKwh = 495.6;
  const avgEfficiency = 6.9; // km/kWh
  const totalCostInr = 10400;
  const petrolCostEquivalentInr = 34200;
  const netSavedInr = petrolCostEquivalentInr - totalCostInr;
  const co2OffsetKg = 410.4;
  const predictionAccuracyScore = 98.4;

  // Monthly energy consumption data for bar chart
  const energyByMonth = [
    { month: 'Nov', kwh: 78, cost: 1630 },
    { month: 'Dec', kwh: 92, cost: 1930 },
    { month: 'Jan', kwh: 85, cost: 1780 },
    { month: 'Feb', kwh: 110, cost: 2310 },
    { month: 'Mar', kwh: 130, cost: 2750 }
  ];

  // Battery health curve over 20,000 km
  const batteryHealthTrend = [
    { km: '0 km', soh: 100 },
    { km: '5k km', soh: 99.4 },
    { km: '10k km', soh: 98.9 },
    { km: '15k km', soh: 98.3 },
    { km: '20k km', soh: 98.0 }
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto font-[Inter,sans-serif]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Fleet & Driver Intelligence</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">EV Performance & Cost Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">High-fidelity metrics across 3,420 km logged telemetry</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {[
            { id: 'month', label: '30 Days' },
            { id: 'quarter', label: 'Quarterly' },
            { id: 'year', label: 'All-Time' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id as any)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeRange === t.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TOP KPI CARDS (Prompt Section 31) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Total Distance</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{totalKm}</span>
            <span className="text-xs text-slate-400 font-bold">km</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">+420 km this month</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Total Energy</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-600">{totalEnergyKwh}</span>
            <span className="text-xs text-slate-400 font-bold">kWh</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block mt-1">Avg {avgEfficiency} km/kWh efficiency</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Charging Cost Saved</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">₹{netSavedInr.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">vs Petrol • {co2OffsetKg} kg CO2</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Prediction Accuracy</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{predictionAccuracyScore}%</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">XGBoost telemetry verified</span>
        </div>
      </div>

      {/* CHARTS ROW (Prompt Section 31) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Energy & Charging Spend Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Monthly Energy Consumed (kWh)</h3>
              <p className="text-xs text-slate-400">Highway & commuter charge sessions</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Avg ₹21/kWh
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-100">
            {energyByMonth.map((bar) => {
              const heightPct = (bar.kwh / 150) * 100;
              return (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition">
                    {bar.kwh} kWh
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl group-hover:opacity-90 transition-all duration-500"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{bar.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Battery Degradation & State of Health Curve */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Battery Health Trend (SOH)</h3>
              <p className="text-xs text-slate-400">Liquid-cooled pack retention curve</p>
            </div>
            <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
              98.0% Healthy
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-100">
            {batteryHealthTrend.map((pt) => {
              const heightPct = ((pt.soh - 95) / 5) * 100;
              return (
                <div key={pt.km} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-black text-emerald-700">{pt.soh}%</span>
                  <div className="w-full bg-emerald-50 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-emerald-500 rounded-t-xl"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{pt.km}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
