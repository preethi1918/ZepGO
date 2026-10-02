import React, { useState, useEffect } from 'react';
import { Car, Zap, Save, CheckCircle2 } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { storage, calculateEstimatedRange } from '../utils/storage';
import type { Vehicle } from '../types';

export const VehiclePage: React.FC = () => {
  const [vehicle, setVehicle] = useState<Vehicle>(() => storage.getVehicleData());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setVehicle(storage.getVehicleData());
  }, []);

  const estimatedRangeKm = calculateEstimatedRange(vehicle.batteryCapacity, vehicle.soc, vehicle.efficiency);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setVehicleData(vehicle);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Car className="w-3.5 h-3.5" />}>
                Active Telemetry Specs
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/vehicle</span>
            </div>
            <PageTitle gradient>Vehicle Profile & Configuration</PageTitle>
            <PageSubtitle>
              Manage EV specs, battery pack capacity, consumption efficiency, and charging connector profiles.
            </PageSubtitle>
          </div>

          <Badge variant="neutral">Data Lineage: Vehicle Telemetry</Badge>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-700 font-bold animate-in fade-in duration-200 shadow-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>Vehicle telemetry configuration saved successfully! All journey calculations updated.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: EDITABLE FIELDS */}
          <div className="lg:col-span-7 space-y-6">
            <Card variant="solid" className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
                <Car className="w-4 h-4 text-emerald-600" />
                <span>1. Vehicle Identity & Battery Pack</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="vehicle-brand-input" className="text-xs font-semibold text-slate-700 block">Vehicle Brand</label>
                  <input
                    id="vehicle-brand-input"
                    type="text"
                    value={vehicle.brand}
                    onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="vehicle-model-input" className="text-xs font-semibold text-slate-700 block">Vehicle Model</label>
                  <input
                    id="vehicle-model-input"
                    type="text"
                    value={vehicle.model}
                    onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="battery-capacity-input" className="text-xs font-semibold text-slate-700 block">Battery Usable Capacity (kWh)</label>
                  <input
                    id="battery-capacity-input"
                    type="number"
                    step="0.1"
                    value={vehicle.batteryCapacity}
                    onChange={(e) => setVehicle({ ...vehicle, batteryCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-blue-700 outline-none focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="current-soc-input" className="text-xs font-semibold text-slate-700 block">Current Battery SOC (%)</label>
                  <input
                    id="current-soc-input"
                    type="number"
                    min="0"
                    max="100"
                    value={vehicle.soc}
                    onChange={(e) => setVehicle({ ...vehicle, soc: Number(e.target.value) })}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-emerald-700 outline-none focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </Card>

            <Card variant="solid" className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>2. Efficiency & Charging Performance</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="efficiency-input" className="text-xs font-semibold text-slate-700 block">Efficiency (Wh/km)</label>
                  <input
                    id="efficiency-input"
                    type="number"
                    value={vehicle.efficiency}
                    onChange={(e) => setVehicle({ ...vehicle, efficiency: Number(e.target.value) })}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="max-charging-speed-input" className="text-xs font-semibold text-slate-700 block">Max Charging Speed (kW)</label>
                  <input
                    id="max-charging-speed-input"
                    type="number"
                    value={vehicle.maxChargingSpeed}
                    onChange={(e) => setVehicle({ ...vehicle, maxChargingSpeed: Number(e.target.value) })}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="connector-type-select" className="text-xs font-semibold text-slate-700 block">Connector Standard</label>
                  <select
                    id="connector-type-select"
                    value={vehicle.connectorType}
                    onChange={(e) => setVehicle({ ...vehicle, connectorType: e.target.value })}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="CCS2">CCS2 (Combined Charging System 2)</option>
                    <option value="Type 2">Type 2 AC</option>
                    <option value="GB/T">GB/T Fast Charger</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                  </select>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth leftIcon={<Save className="w-4 h-4" />}>
                Save Vehicle Configuration
              </Button>
            </Card>
          </div>

          {/* RIGHT: LIVE TELEMETRY DISPLAY */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="solid" className="space-y-4 border-emerald-200 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Calculated Live Telemetry
                </h3>
                <Badge variant="success">Active Spec</Badge>
              </div>

              <div className="space-y-3">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated Current Range</span>
                  <div className="text-3xl font-black text-emerald-700">{estimatedRangeKm} km</div>
                  <span className="text-[11px] text-slate-500">Based on {vehicle.soc}% SOC & {vehicle.efficiency} Wh/km</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Battery Usable:</span>
                    <span className="font-bold text-slate-900">{vehicle.batteryCapacity} kWh</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Available Energy:</span>
                    <span className="font-bold text-blue-700">
                      {((vehicle.batteryCapacity * vehicle.soc) / 100).toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Equivalent Efficiency:</span>
                    <span className="font-bold text-slate-900">
                      {(1000 / vehicle.efficiency).toFixed(1)} km/kWh
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Max DC Fast Charge:</span>
                    <span className="font-bold text-amber-700">{vehicle.maxChargingSpeed} kW ({vehicle.connectorType})</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
