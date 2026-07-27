import React, { useState } from 'react';
import { BarChart3, Leaf, DollarSign, Zap, Clock, Calendar, Plus, BatteryCharging, CheckCircle2 } from 'lucide-react';
import { ChargingHistoryRecord, UserProfile } from '../types';
import { getChargingHistory, saveChargingHistory } from '../services/firebase';

interface AnalyticsHistoryProps {
  user: UserProfile | null;
}

export const AnalyticsHistory: React.FC<AnalyticsHistoryProps> = ({ user }) => {
  const [history, setHistory] = useState<ChargingHistoryRecord[]>(getChargingHistory());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state for logging a session
  const [stationName, setStationName] = useState('GreenCharge Fast Hub');
  const [unitsKwh, setUnitsKwh] = useState(38.5);
  const [costDollar, setCostDollar] = useState(14.63);
  const [durationMins, setDurationMins] = useState(25);
  const [chargerType, setChargerType] = useState('CCS2 180kW');

  const totalKwh = history.reduce((acc, h) => acc + h.unitsKwh, 0);
  const totalCost = history.reduce((acc, h) => acc + h.costDollar, 0);
  const totalCo2 = history.reduce((acc, h) => acc + h.co2SavedKg, 0);

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ChargingHistoryRecord = {
      id: `ch-${Date.now()}`,
      stationName,
      location: 'Route Highway Hub',
      unitsKwh: Number(unitsKwh),
      costDollar: Number(costDollar),
      durationMins: Number(durationMins),
      date: new Date().toISOString().split('T')[0],
      chargerType,
      co2SavedKg: Math.round(unitsKwh * 0.67)
    };

    const updated = saveChargingHistory(newRecord);
    setHistory(updated);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-600" />
            EV Battery Analytics & Charging History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track total energy consumed (kWh), financial savings vs petrol, and CO2 greenhouse gas reduction.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Charging Session</span>
        </button>
      </div>

      {/* Summary Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Energy Charged</span>
            <Zap className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            {totalKwh.toFixed(1)} <span className="text-xs font-extrabold text-slate-400">kWh</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Across {history.length} fast charging sessions</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Charging Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            ${totalCost.toFixed(2)}
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-2">Saved ~${(totalCost * 2.4).toFixed(0)} vs gasoline fill-ups!</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Carbon CO2 Prevented</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            {totalCo2.toFixed(0)} <span className="text-xs font-extrabold text-slate-400">kg CO2</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Equivalent to ~{Math.round(totalCo2 / 20)} mature trees planted!</p>
        </div>
      </div>

      {/* Charging History Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <BatteryCharging className="w-5 h-5 text-sky-600" />
          Recent Charging Log
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Station & Location</th>
                <th className="p-3">Date</th>
                <th className="p-3">Charger Type</th>
                <th className="p-3">Energy (kWh)</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Total Cost</th>
                <th className="p-3">CO2 Offset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{record.stationName}</div>
                    <div className="text-[11px] text-slate-400">{record.location}</div>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{record.date}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-md font-semibold text-[11px]">
                      {record.chargerType}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-900">{record.unitsKwh} kWh</td>
                  <td className="p-3 text-slate-600">{record.durationMins} mins</td>
                  <td className="p-3 font-extrabold text-slate-900">${record.costDollar.toFixed(2)}</td>
                  <td className="p-3 font-bold text-emerald-700">+{record.co2SavedKg} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Log Charging Session</h3>
            <form onSubmit={handleSaveSession} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Station Name</label>
                <input
                  type="text"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Energy (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={unitsKwh}
                    onChange={(e) => setUnitsKwh(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costDollar}
                    onChange={(e) => setCostDollar(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Charger Type</label>
                  <input
                    type="text"
                    value={chargerType}
                    onChange={(e) => setChargerType(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
