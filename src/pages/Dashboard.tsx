import React, { useState } from 'react';
import { Compass, Info, BatteryCharging, Car, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import LocationInput from '../components/LocationInput';
import Input from '../components/Input';
import VehicleCard from '../components/VehicleCard';

export const Dashboard: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState('Karur');
  const [destination, setDestination] = useState('Chennai');
  const [batteryPct, setBatteryPct] = useState('65');
  const [selectedVehicle, setSelectedVehicle] = useState('Tata Nexon EV');
  const [tempMessage, setTempMessage] = useState<string | null>(null);

  const activeVehicleStats = {
    brand: selectedVehicle.startsWith('Tata')
      ? 'Tata'
      : selectedVehicle.startsWith('MG')
      ? 'MG'
      : selectedVehicle.startsWith('Mahindra')
      ? 'Mahindra'
      : 'Hyundai',
    model: selectedVehicle,
    batteryCapacity: 40.5,
    currentBatteryPct: parseInt(batteryPct, 10) || 65,
    efficiency: 140,
    estimatedRange: Math.round(((parseInt(batteryPct, 10) || 65) / 100) * 312),
  };

  const handlePlanJourney = (e: React.FormEvent) => {
    e.preventDefault();
    setTempMessage('Journey planning will be available in the next phase.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Plan Your EV Journey
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Specify your route parameters and current battery level to configure your journey intelligence model.
        </p>
      </div>

      {/* Temporary Message Banner if clicked */}
      {tempMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start justify-between text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold">{tempMessage}</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Phase 2 will integrate live route telemetry, ML range estimation, and charger stop allocation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTempMessage(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Form */}
        <div className="lg:col-span-2">
          <Card
            title="Journey Details"
            subtitle="Configure origin, destination and vehicle state"
          >
            <form onSubmit={handlePlanJourney} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocationInput
                  label="Current Location"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="e.g. Karur"
                  isOrigin={true}
                />

                <LocationInput
                  label="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Chennai"
                  isOrigin={false}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Current Battery %"
                  type="number"
                  min="1"
                  max="100"
                  value={batteryPct}
                  onChange={(e) => setBatteryPct(e.target.value)}
                  placeholder="e.g. 65%"
                  icon={<BatteryCharging className="w-4 h-4 text-emerald-600" />}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Vehicle
                  </label>
                  <div className="relative rounded-lg shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Car className="w-4 h-4 text-emerald-600" />
                    </div>
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 text-sm py-2.5 pl-9 pr-3 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 hover:border-slate-300 transition-all"
                    >
                      <option value="Tata Nexon EV">Tata Nexon EV</option>
                      <option value="MG ZS EV">MG ZS EV</option>
                      <option value="Mahindra XUV400">Mahindra XUV400</option>
                      <option value="Hyundai Ioniq 5">Hyundai Ioniq 5</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Compass className="w-4 h-4" />}
                >
                  Plan Journey
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Side summary card */}
        <div className="lg:col-span-1 space-y-4">
          <VehicleCard vehicle={activeVehicleStats} compact={true} />

          <Card title="Quick Overview" subtitle="Phase 1 Parameters">
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Origin set to <strong>{currentLocation || 'Not set'}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Destination set to <strong>{destination || 'Not set'}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Current State: <strong>{batteryPct}% Charge</strong></span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
