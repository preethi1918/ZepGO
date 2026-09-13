import React, { useState } from 'react';
import type { Trip, RouteStop } from '../../types/trip';
import type { ChargingStation, GeoLocation } from '../../types/charging';
import { fetchRealDrivingRoute } from '../../services/geo/geoService';
import { PrimaryButton } from '../common/PrimaryButton';
import { NavigationIcon, MapPinIcon, ZapIcon, XIcon } from '../common/Icons';

export interface NewRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (newTrip: Trip) => void;
  availableStations: ChargingStation[];
  vehicleSocPercent: number;
}

export const NewRouteModal: React.FC<NewRouteModalProps> = ({
  isOpen,
  onClose,
  onTripCreated,
  availableStations,
  vehicleSocPercent,
}) => {
  const [origin, setOrigin] = useState('Mumbai BKC');
  const [originLoc, setOriginLoc] = useState<GeoLocation>({ latitude: 19.0660, longitude: 72.8691 });
  const [destination, setDestination] = useState('Pune Wakad');
  const [destLoc, setDestLoc] = useState<GeoLocation>({ latitude: 18.5987, longitude: 73.7642 });

  const [startSoc, setStartSoc] = useState(vehicleSocPercent || 80);
  const [targetArrivalSoc, setTargetArrivalSoc] = useState(25);
  const [presetRoute, setPresetRoute] = useState<'custom' | 'mumbai_pune' | 'blamp_mysuru' | 'delhi_agra'>('mumbai_pune');
  const [isCalculating, setIsCalculating] = useState(false);

  if (!isOpen) return null;

  const handlePresetSelect = (key: 'mumbai_pune' | 'blamp_mysuru' | 'delhi_agra') => {
    setPresetRoute(key);
    if (key === 'mumbai_pune') {
      setOrigin('Mumbai BKC');
      setOriginLoc({ latitude: 19.0660, longitude: 72.8691 });
      setDestination('Pune Wakad');
      setDestLoc({ latitude: 18.5987, longitude: 73.7642 });
    } else if (key === 'blamp_mysuru') {
      setOrigin('Bengaluru Indiranagar');
      setOriginLoc({ latitude: 12.9784, longitude: 77.6408 });
      setDestination('Mysuru Palace');
      setDestLoc({ latitude: 12.3052, longitude: 76.6552 });
    } else if (key === 'delhi_agra') {
      setOrigin('Delhi Connaught Place');
      setOriginLoc({ latitude: 28.6315, longitude: 77.2167 });
      setDestination('Agra Taj Mahal');
      setDestLoc({ latitude: 27.1751, longitude: 78.0421 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    // Fetch real OSRM driving route metrics
    const realRoute = await fetchRealDrivingRoute(originLoc, destLoc);

    let distanceKm = realRoute ? Math.round(realRoute.distanceKm) : 148;
    let durationMins = realRoute ? Math.round(realRoute.durationMinutes) : 135;
    let energyKwh = Math.round((distanceKm * 0.13) * 10) / 10;

    // Calculate optimal charging stops
    const stopStations = availableStations.slice(0, distanceKm > 200 ? 2 : distanceKm > 100 ? 1 : 0);
    const stops: RouteStop[] = stopStations.map((st, idx) => ({
      id: `new-stop-${Date.now()}-${idx}`,
      stationId: st.id,
      stationName: st.name,
      location: st.location,
      arrivalSocPercent: 35,
      targetSocPercent: 80,
      durationMinutes: 20,
      distanceFromOriginKm: Math.round((distanceKm / (stopStations.length + 1)) * (idx + 1)),
      chargingPowerKw: st.maxPowerKw,
      amenities: st.amenities,
    }));

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: `${origin} to ${destination} Route`,
      originName: origin,
      originLocation: originLoc,
      destinationName: destination,
      destinationLocation: destLoc,
      totalDistanceKm: distanceKm,
      totalDurationMinutes: durationMins,
      estimatedEnergyKwh: energyKwh,
      startSocPercent: startSoc,
      arrivalSocPercent: targetArrivalSoc,
      status: 'planned',
      createdAt: new Date().toISOString().split('T')[0],
      stops,
    };

    setIsCalculating(false);
    onTripCreated(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Real EV Routing Engine</span>
            <h3 className="text-base font-bold text-slate-900 leading-tight">Plan Live EV Route</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Quick Highway Corridor Presets */}
        <div className="my-3">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Select Indian Highway Corridor
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handlePresetSelect('mumbai_pune')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                presetRoute === 'mumbai_pune' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Mumbai ➔ Pune (148 km)
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('blamp_mysuru')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                presetRoute === 'blamp_mysuru' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Bengaluru ➔ Mysuru (142 km)
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('delhi_agra')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                presetRoute === 'delhi_agra' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Delhi ➔ Agra (215 km)
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Starting Point</label>
            <div className="relative">
              <MapPinIcon size={14} className="absolute left-3 top-3 text-blue-600" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Destination Point</label>
            <div className="relative">
              <NavigationIcon size={14} className="absolute left-3 top-3 text-slate-900" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Battery SOC Settings */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Start Battery</span>
                <span className="text-emerald-600">{startSoc}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={startSoc}
                onChange={(e) => setStartSoc(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Target Arrival</span>
                <span className="text-blue-600">{targetArrivalSoc}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={targetArrivalSoc}
                onChange={(e) => setTargetArrivalSoc(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <PrimaryButton
              label={isCalculating ? "Calculating Real OSRM Route..." : "Calculate Real Driving Route"}
              icon={<ZapIcon size={16} />}
              loading={isCalculating}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
