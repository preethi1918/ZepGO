import React, { useState } from 'react';
import { History, Calendar, MapPin, ChevronRight, X } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';

interface TripLog {
  id: string;
  date: string;
  origin: string;
  destination: string;
  distanceKm: number;
  travelTime: string;
  energyConsumedKwh: number;
  efficiencyWhKm: number;
  chargingTimeMin: number;
  chargingCost: number;
  startingSOC: number;
  arrivalSOC: number;
  chargerUsed?: string;
  vehicleModel: string;
}

export const HistoryPage: React.FC = () => {
  const [trips] = useState<TripLog[]>([
    {
      id: 'trip-101',
      date: 'Sep 18, 2026',
      origin: 'Chennai',
      destination: 'Coimbatore',
      distanceKm: 510,
      travelTime: '7h 15m',
      energyConsumedKwh: 82.2,
      efficiencyWhKm: 161,
      chargingTimeMin: 28,
      chargingCost: 450,
      startingSOC: 92,
      arrivalSOC: 22,
      chargerUsed: 'Tata Power 250kW Salem Highway Hub',
      vehicleModel: 'Tata Nexon EV (40.5 kWh)'
    },
    {
      id: 'trip-102',
      date: 'Sep 10, 2026',
      origin: 'Bengaluru',
      destination: 'Mysuru',
      distanceKm: 145,
      travelTime: '2h 40m',
      energyConsumedKwh: 23.5,
      efficiencyWhKm: 162,
      chargingTimeMin: 0,
      chargingCost: 0,
      startingSOC: 85,
      arrivalSOC: 27,
      chargerUsed: 'None (Direct Journey)',
      vehicleModel: 'Tata Nexon EV (40.5 kWh)'
    },
    {
      id: 'trip-103',
      date: 'Aug 28, 2026',
      origin: 'Chennai',
      destination: 'Puducherry',
      distanceKm: 152,
      travelTime: '2h 50m',
      energyConsumedKwh: 24.1,
      efficiencyWhKm: 158,
      chargingTimeMin: 0,
      chargingCost: 0,
      startingSOC: 78,
      arrivalSOC: 19,
      chargerUsed: 'None (Direct Journey)',
      vehicleModel: 'Tata Nexon EV (40.5 kWh)'
    }
  ]);

  const [selectedTrip, setSelectedTrip] = useState<TripLog | null>(null);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<History className="w-3.5 h-3.5" />}>
                Telemetry & Analytics Log
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/history</span>
            </div>
            <PageTitle gradient>Journey History & Energy Logs</PageTitle>
            <PageSubtitle>
              Review past trip metrics, actual vs calculated battery consumption, and total charging costs.
            </PageSubtitle>
          </div>

          <Badge variant="neutral">Data Lineage: Stored Local History</Badge>
        </div>

        {/* TRIP LOGS TABLE / CARDS */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                variant="solid"
                className="p-4 hover:border-emerald-300 cursor-pointer transition-all space-y-3 shadow-xs hover:shadow-md"
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {trip.origin} → {trip.destination}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trip.date}</span>
                        <span>•</span>
                        <span>{trip.distanceKm} km</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Arrival SOC</span>
                      <span className="text-base font-extrabold text-emerald-700">{trip.arrivalSOC}%</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block">Energy Consumed</span>
                    <span className="font-extrabold text-blue-700">{trip.energyConsumedKwh} kWh</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block">Efficiency</span>
                    <span className="font-extrabold text-slate-900">{trip.efficiencyWhKm} Wh/km</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block">Charging Time</span>
                    <span className="font-extrabold text-amber-700">{trip.chargingTimeMin} mins</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold block">Charging Cost</span>
                    <span className="font-extrabold text-emerald-700">₹{trip.chargingCost}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* TRIP DETAIL MODAL */}
        {selectedTrip && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setSelectedTrip(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <Badge variant="success">Complete Telemetry Record</Badge>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {selectedTrip.origin} → {selectedTrip.destination}
                </h3>
                <p className="text-xs text-slate-500">{selectedTrip.date} • {selectedTrip.travelTime}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-bold text-slate-900">{selectedTrip.vehicleModel}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Distance:</span>
                  <span className="font-bold text-slate-900">{selectedTrip.distanceKm} km</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Starting SOC:</span>
                  <span className="font-bold text-slate-900">{selectedTrip.startingSOC}%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Arrival SOC:</span>
                  <span className="font-bold text-emerald-700">{selectedTrip.arrivalSOC}%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Energy Consumed:</span>
                  <span className="font-bold text-blue-700">{selectedTrip.energyConsumedKwh} kWh</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Charger Used:</span>
                  <span className="font-bold text-amber-700">{selectedTrip.chargerUsed}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Charging Cost:</span>
                  <span className="font-bold text-emerald-700">₹{selectedTrip.chargingCost}</span>
                </div>
              </div>

              <Button variant="secondary" fullWidth onClick={() => setSelectedTrip(null)}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
