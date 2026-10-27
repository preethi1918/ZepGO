import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Zap,
  Leaf,
  DollarSign,
  BatteryCharging,
  Gauge,
  Calendar,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';

export const AnalyticsPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'30days' | 'quarterly' | 'alltime'>('quarterly');

  const monthlyData = [
    { month: 'November', distanceKm: 620, energyKwh: 89.5, costInr: 1790, efficiency: 6.9, petrolEquiv: 4960 },
    { month: 'December', distanceKm: 740, energyKwh: 107.2, costInr: 2144, efficiency: 6.9, petrolEquiv: 5920 },
    { month: 'January', distanceKm: 810, energyKwh: 119.1, costInr: 2382, efficiency: 6.8, petrolEquiv: 6480 },
    { month: 'February', distanceKm: 590, energyKwh: 84.3, costInr: 1686, efficiency: 7.0, petrolEquiv: 4720 },
    { month: 'March', distanceKm: 660, energyKwh: 95.5, costInr: 1910, efficiency: 6.9, petrolEquiv: 5280 }
  ];

  const degradationCurve = [
    { checkpoint: 'Delivery (0 km)', soh: 100 },
    { checkpoint: '1,000 km', soh: 99.4 },
    { checkpoint: '2,000 km', soh: 98.9 },
    { checkpoint: '3,000 km', soh: 98.3 },
    { checkpoint: 'Current (3,420 km)', soh: 98.0 }
  ];

  const maxDistance = Math.max(...monthlyData.map(d => d.distanceKm));

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<BarChart3 className="w-3.5 h-3.5" />}>
                Telemetry Analytics Engine
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/analytics</span>
            </div>
            <PageTitle gradient>EV Performance & Cost Analytics</PageTitle>
            <PageSubtitle>
              Comprehensive energy consumption, cost savings vs internal combustion engines, and battery health telemetry.
            </PageSubtitle>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setTimeFilter('30days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === '30days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeFilter('quarterly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === 'quarterly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setTimeFilter('alltime')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === 'alltime' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All-Time
            </button>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="solid" className="p-5 border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Distance</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Gauge className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">3,420 km</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs last period</span>
            </div>
          </Card>

          <Card variant="solid" className="p-5 border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Energy Consumed</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">495.6 kWh</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500">
              <span>Avg Efficiency: <strong className="text-slate-900">6.9 km/kWh</strong></span>
            </div>
          </Card>

          <Card variant="solid" className="p-5 border-emerald-200 bg-emerald-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Charging Cost Saved</span>
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-800 tracking-tight">₹23,800</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
              <span>vs Equivalent Petrol Vehicle</span>
            </div>
          </Card>

          <Card variant="solid" className="p-5 border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prediction Accuracy</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">98.4%</div>
            <div className="flex items-center gap-1 mt-2 text-[11px] font-medium text-slate-400">
              <Info className="w-3 h-3 text-purple-500 shrink-0" />
              <span>Prototype ML validation benchmark</span>
            </div>
          </Card>
        </div>

        {/* Monthly Energy & Cost Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card variant="solid" className="p-6 space-y-6 bg-white border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Monthly Energy & Distance Traveled</span>
                  </h3>
                  <p className="text-xs text-slate-500">Distance (km) and total energy consumed per billing cycle</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
                    <span className="text-slate-600">Distance (km)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-blue-500 inline-block" />
                    <span className="text-slate-600">Energy (kWh)</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="space-y-5 pt-2">
                {monthlyData.map((item) => (
                  <div key={item.month} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span className="w-24 font-bold text-slate-900">{item.month}</span>
                      <div className="flex items-center gap-4 text-right">
                        <span className="text-emerald-700 font-bold">{item.distanceKm} km</span>
                        <span className="text-blue-700 font-bold w-20">{item.energyKwh} kWh</span>
                        <span className="text-slate-500 font-mono w-16">₹{item.costInr}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(item.distanceKm / maxDistance) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cost Per Trip (Avg)</span>
                  <span className="text-base font-extrabold text-slate-900">₹215</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Unit Electricity Rate</span>
                  <span className="text-base font-extrabold text-emerald-700">₹9.80 / kWh</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated CO2 Abated</span>
                  <span className="text-base font-extrabold text-teal-700">840 kg CO₂</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Petrol Comparison & Battery Health Section */}
          <div className="lg:col-span-4 space-y-6">
            {/* Petrol vs EV Cost Comparison */}
            <Card variant="solid" className="p-5 space-y-4 bg-white border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Fuel vs Electricity Economics</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Petrol Car (14 km/l @ ₹102/l)</span>
                    <span className="font-extrabold text-slate-800">₹38,200</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-full rounded-full" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-800 font-semibold">ZepGO EV Actual Spent</span>
                    <span className="font-extrabold text-emerald-700">₹14,400</span>
                  </div>
                  <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-[38%] rounded-full" />
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-600 text-white rounded-xl shadow-xs text-center space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 block">Net Driver Savings</span>
                  <span className="text-xl font-black">₹23,800 Saved</span>
                  <span className="text-[10px] opacity-80 block">Equivalent to 62% operating expense reduction</span>
                </div>
              </div>
            </Card>

            {/* Battery Health Analytics Section */}
            <Card variant="solid" className="p-5 space-y-4 bg-white border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <BatteryCharging className="w-4 h-4 text-blue-600" />
                  <span>Battery Health (SOH)</span>
                </h3>
                <Badge variant="success">98.0% SOH</Badge>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs text-slate-500 leading-relaxed">
                  State of Health degradation tracking modeled over 3,420 km:
                </div>

                <div className="space-y-2">
                  {degradationCurve.map((deg, i) => (
                    <div key={deg.checkpoint} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-600 font-medium">{deg.checkpoint}</span>
                      <span className={`font-mono font-bold ${i === degradationCurve.length - 1 ? 'text-emerald-700 font-extrabold' : 'text-slate-800'}`}>
                        {deg.soh}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Pack thermals optimal (28°C). Battery cell degradation is well within manufacturer warranty specs.</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
