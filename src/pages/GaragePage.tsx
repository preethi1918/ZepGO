import React, { useState, useEffect } from 'react';
import {
  Car,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { storage } from '../utils/storage';
import type { Vehicle } from '../types';

export const GaragePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => storage.getGarageVehicles());
  const [activeVehicle, setActiveVehicleState] = useState<Vehicle>(() => storage.getVehicleData());
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New vehicle form state
  const [newBrand, setNewBrand] = useState('Tata');
  const [newModel, setNewModel] = useState('Punch EV LR');
  const [newCapacity, setNewCapacity] = useState(35.0);
  const [newEfficiency, setNewEfficiency] = useState(145);
  const [newConnector, setNewConnector] = useState('CCS2');
  const [newMaxSpeed, setNewMaxSpeed] = useState(50);

  useEffect(() => {
    setVehicles(storage.getGarageVehicles());
    setActiveVehicleState(storage.getVehicleData());
  }, []);

  const handleSelectActive = (vehId: string) => {
    const selected = storage.setActiveVehicle(vehId);
    setActiveVehicleState(selected);
    setVehicles(storage.getGarageVehicles());
    setSuccessMessage(`${selected.brand} ${selected.model} is now your active vehicle!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDelete = (vehId: string) => {
    if (vehicles.length <= 1) {
      alert('You must keep at least one vehicle in your garage.');
      return;
    }
    const updated = vehicles.filter(v => v.id !== vehId);
    storage.setGarageVehicles(updated);
    setVehicles(updated);
    if (activeVehicle.id === vehId) {
      storage.setActiveVehicle(updated[0].id);
      setActiveVehicleState(updated[0]);
    }
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newVeh: Vehicle = {
      id: `veh_${Date.now()}`,
      brand: newBrand,
      model: newModel,
      soc: 80,
      batteryCapacity: Number(newCapacity),
      efficiency: Number(newEfficiency),
      connectorType: newConnector,
      maxChargingSpeed: Number(newMaxSpeed),
      status: 'Idle',
      currentLocation: 'Home Garage',
      vehicleStatus: 'Normal'
    };

    const updated = [...vehicles, newVeh];
    storage.setGarageVehicles(updated);
    setVehicles(updated);
    setShowAddModal(false);
    setSuccessMessage(`${newVeh.brand} ${newVeh.model} added to your garage!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Car className="w-3.5 h-3.5" />}>
                Multi-EV Fleet Management
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/garage</span>
            </div>
            <PageTitle gradient>EV Garage & Fleet Profiles</PageTitle>
            <PageSubtitle>
              Store and manage your electric vehicles. All trip energy calculations adapt dynamically to your active EV.
            </PageSubtitle>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Vehicle
          </Button>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-bold shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {vehicles.map((v) => {
            const isActive = v.id === activeVehicle.id;
            const kmPerKwh = (1000 / v.efficiency).toFixed(1);
            const fullRangeEst = Math.round(v.batteryCapacity * Number(kmPerKwh));

            return (
              <Card
                key={v.id}
                variant="solid"
                className={`p-5 space-y-4 transition-all relative ${
                  isActive
                    ? 'border-2 border-emerald-600 bg-emerald-50/20 shadow-md ring-2 ring-emerald-600/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-600 text-white tracking-wider">
                    Active EV
                  </span>
                )}

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">{v.brand}</span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">{v.model}</h3>
                  <div className="flex items-center gap-2 pt-0.5">
                    <Badge variant="neutral">{v.connectorType}</Badge>
                    <span className="text-xs text-slate-500 font-mono">Max {v.maxChargingSpeed} kW</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Usable Battery:</span>
                    <strong className="text-slate-900 font-bold">{v.batteryCapacity} kWh</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rated Efficiency:</span>
                    <strong className="text-slate-900 font-bold">{kmPerKwh} km/kWh</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Est. Full Range:</span>
                    <strong className="text-emerald-700 font-extrabold">~{fullRangeEst} km</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Battery SOC:</span>
                    <strong className="text-blue-700 font-bold">{v.soc}%</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {isActive ? (
                    <Button variant="outline" size="sm" fullWidth disabled>
                      ✓ Selected Active
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleSelectActive(v.id)}
                    >
                      Select Vehicle
                    </Button>
                  )}

                  {vehicles.length > 1 && !isActive && (
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                      title="Delete vehicle from garage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Modal for Adding New Vehicle */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>Add New Electric Vehicle</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Model Name</label>
                  <input
                    type="text"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Battery (kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(Number(e.target.value))}
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Efficiency (Wh/km)</label>
                    <input
                      type="number"
                      value={newEfficiency}
                      onChange={(e) => setNewEfficiency(Number(e.target.value))}
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Connector</label>
                    <select
                      value={newConnector}
                      onChange={(e) => setNewConnector(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                    >
                      <option value="CCS2">CCS2</option>
                      <option value="Type 2">Type 2</option>
                      <option value="GB/T">GB/T</option>
                      <option value="CHAdeMO">CHAdeMO</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Max DC Rate (kW)</label>
                    <input
                      type="number"
                      value={newMaxSpeed}
                      onChange={(e) => setNewMaxSpeed(Number(e.target.value))}
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save to Garage
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
