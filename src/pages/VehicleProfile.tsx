import React, { useState } from 'react';
import { Car, Zap, Gauge, Battery, CheckCircle2, Save } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import VehicleCard from '../components/VehicleCard';
import type { VehicleDetails } from '../components/VehicleCard';

export const VehicleProfile: React.FC = () => {
  const [vehicle, setVehicle] = useState<VehicleDetails>({
    brand: 'Tata',
    model: 'Nexon EV Max',
    batteryCapacity: 40.5,
    currentBatteryPct: 65,
    efficiency: 140,
    estimatedRange: 240,
  });

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleChange = (field: keyof VehicleDetails, value: string | number) => {
    setVehicle((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice('Vehicle profile updated locally for Phase 1 UI simulation.');
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Vehicle Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your electric vehicle specifications, battery health parameters, and energy efficiency parameters.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <Card title="Vehicle Specifications Form" subtitle="Enter exact EV vehicle specs">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Vehicle Brand
                  </label>
                  <select
                    value={vehicle.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 text-sm py-2.5 px-3 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 hover:border-slate-300 transition-all"
                  >
                    <option value="Tata">Tata</option>
                    <option value="MG">MG</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Hyundai">Hyundai</option>
                  </select>
                </div>

                {/* Model */}
                <Input
                  label="Vehicle Model"
                  type="text"
                  value={vehicle.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="e.g. Nexon EV Max"
                  icon={<Car className="w-4 h-4 text-emerald-600" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Battery Capacity */}
                <Input
                  label="Battery Capacity (kWh)"
                  type="number"
                  step="0.1"
                  value={vehicle.batteryCapacity}
                  onChange={(e) => handleChange('batteryCapacity', parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 40.5"
                  icon={<Zap className="w-4 h-4 text-emerald-600" />}
                />

                {/* Current Battery % */}
                <Input
                  label="Current Battery %"
                  type="number"
                  min="0"
                  max="100"
                  value={vehicle.currentBatteryPct}
                  onChange={(e) => handleChange('currentBatteryPct', parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 65"
                  icon={<Battery className="w-4 h-4 text-emerald-600" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Efficiency */}
                <Input
                  label="Efficiency (Wh/km)"
                  type="number"
                  value={vehicle.efficiency}
                  onChange={(e) => handleChange('efficiency', parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 140"
                  icon={<Gauge className="w-4 h-4 text-emerald-600" />}
                />

                {/* Estimated Range */}
                <Input
                  label="Estimated Range (km)"
                  type="number"
                  value={vehicle.estimatedRange}
                  onChange={(e) => handleChange('estimatedRange', parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 240"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Vehicle Profile
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Preview Card Column */}
        <div className="lg:col-span-1 space-y-4">
          <VehicleCard vehicle={vehicle} />

          <Card title="Supported Brands" subtitle="Phase 1 EV Catalog">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">Tata Motors</div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">MG Motor</div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">Mahindra Electric</div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">Hyundai EV</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VehicleProfile;
