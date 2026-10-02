import React from 'react';
import { AlertCircle, Clock, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import Card from '../components/Card';

export const Charging: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Charging Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Predictive charging stop selection, arrival battery buffer estimations, and backup feasibility.
          </p>
        </div>

        {/* Demo Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>SAMPLE / DEMO VALUES - PHASE 1 UI</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Charging Required */}
        <Card title="Charging Status" subtitle="Journey assessment">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Charging Required?
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                YES (1 Stop)
              </span>
            </div>
            <p className="text-xs text-emerald-700 mt-2">
              Based on sample 345 km trip distance vs 240 km initial vehicle range.
            </p>
          </div>
        </Card>

        {/* Arrival Battery */}
        <Card title="Arrival Battery State" subtitle="Predicted charge level at stop">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Arrival Battery
              </span>
              <span className="text-lg font-bold text-amber-600">18%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '18%' }} />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Safe 18% buffer remaining upon reaching recommended stop.
            </p>
          </div>
        </Card>

        {/* Charging Time */}
        <Card title="Estimated Charging Duration" subtitle="Session time calculation">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Charging Time
              </span>
              <span className="text-lg font-bold text-slate-900 flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-600" /> 35 mins
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Fast charge session from 18% to 80% SOC.
            </p>
          </div>
        </Card>

        {/* Recommended Charger */}
        <Card
          className="md:col-span-2 lg:col-span-2"
          title="Recommended Charger Stop"
          subtitle="Primary high-speed station match"
          action={
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Optimal Choice
            </span>
          }
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Zeon Charging Station - Ulundurpet
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> NH 38, Ulundurpet Bypass (185 km from origin)
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-md">
                  60 kW CCS2 Dual
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <div className="text-slate-500 font-medium">Connector</div>
                <div className="font-semibold text-slate-900 mt-0.5">CCS Dual Gun</div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <div className="text-slate-500 font-medium">Availability</div>
                <div className="font-semibold text-emerald-600 mt-0.5">2 / 2 Available</div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <div className="text-slate-500 font-medium">Estimated Cost</div>
                <div className="font-semibold text-slate-900 mt-0.5">₹ 18 / kWh</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Backup Charger */}
        <Card
          className="md:col-span-2 lg:col-span-1"
          title="Backup Charger Option"
          subtitle="Redundancy planning"
        >
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Relux Charger</h4>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                30 kW Fast
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 4.2 km alternate from primary stop
            </p>
            <div className="text-xs text-slate-600 pt-2 border-t border-slate-200 flex justify-between">
              <span>Risk Rating: <strong className="text-emerald-700">Low</strong></span>
              <span>Wait Time: <strong className="text-slate-900">&lt; 5 mins</strong></span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Charging;
