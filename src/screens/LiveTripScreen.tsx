import React, { useState, useEffect } from 'react';
import type { Trip } from '../types/trip';
import type { GeoLocation, ChargingStation } from '../types/charging';
import { MapContainerComponent } from '../components/map/MapContainer';
import { evaluateJourneyChargingRecommendation } from '../services/recommendation/recommendationEngine';
import { XIcon, ZapIcon } from '../components/common/Icons';

export interface LiveTripScreenProps {
  trip: Trip;
  currentLocation: GeoLocation;
  availableStations?: ChargingStation[];
  onEndTrip: () => void;
}

export const LiveTripScreen: React.FC<LiveTripScreenProps> = ({
  trip,
  currentLocation,
  availableStations = [],
  onEndTrip,
}) => {
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [isChargingMode, setIsChargingMode] = useState(false);

  // Default vehicle mock state for live telemetry
  const vehicleMock = {
    brand: 'Tata',
    modelName: 'Nexon.ev LR',
    trim: 'Empowered+ LR',
    batteryCapacityKwh: 40.5,
    currentSocPercent: trip.startSocPercent || 78,
    estimatedRangeKm: 312,
    averageConsumptionWhPerKm: 135,
    minArrivalSocBufferPercent: 15,
    preferredNetworks: ['Tata Power EZ Charge', 'Zeon Charging'],
    supportedPlugs: ['CCS2' as const, 'Type 2' as const],
    healthPercent: 99,
    chargingStatus: 'discharging' as const,
    currentChargePowerKw: 0,
    licensePlate: 'KA-01-EV-4092',
    ecoScore: 92,
    totalKmDriven: 14280,
    totalCo2OffsetKg: 2850,
    totalChargingCostSavedRs: 48200,
  };

  // Run dynamic route & battery recommendation engine
  const recommendation = evaluateJourneyChargingRecommendation(
    trip,
    vehicleMock,
    currentLocation,
    availableStations
  );

  // Live Navigation Ticking Telemetry
  const [simulatedDistanceKm, setSimulatedDistanceKm] = useState(trip.totalDistanceKm || 148);
  const [simulatedDurationMins, setSimulatedDurationMins] = useState(trip.totalDurationMinutes || 150);
  const [simulatedSoc, setSimulatedSoc] = useState(trip.startSocPercent || 78);
  const [simulatedSpeed, setSimulatedSpeed] = useState(82);

  // Live Turn Banner Step
  const turnDirections = [
    `Keep straight on ${trip.originName || 'Origin'} Highway Corridor`,
    `In 1.2 km, continue towards ${trip.destinationName || 'Destination'}`,
    `In 850m, exit towards next waypoint`,
    `Destination in 12 km`,
  ];
  const [directionIndex, setDirectionIndex] = useState(0);

  useEffect(() => {
    if (isChargingMode) {
      const chargeInterval = setInterval(() => {
        setSimulatedSoc((prev) => {
          if (prev >= 80) {
            clearInterval(chargeInterval);
            setIsChargingMode(false);
            return 80;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(chargeInterval);
    } else {
      const drivingInterval = setInterval(() => {
        setSimulatedDistanceKm((prev) => Math.max(2, Math.round((prev - 0.1) * 10) / 10));
        setSimulatedSpeed((prev) => Math.max(70, Math.min(95, prev + Math.floor(Math.random() * 5) - 2)));

        if (Math.random() > 0.7) {
          setDirectionIndex((prev) => (prev + 1) % turnDirections.length);
        }

        if (Math.random() > 0.6) {
          setSimulatedSoc((prev) => Math.max(10, prev - 1));
          setSimulatedDurationMins((prev) => Math.max(3, prev - 1));
        }
      }, 1000);
      return () => clearInterval(drivingInterval);
    }
  }, [isChargingMode, turnDirections.length]);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex flex-col font-[Inter,sans-serif]">
      {/* 1. Top Turn-by-Turn Guidance Banner */}
      <div className="absolute top-4 left-4 right-4 z-20 space-y-2">
        <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-base shrink-0">
              ↗️
            </div>
            <div>
              <p className="font-bold text-slate-100">{turnDirections[directionIndex]}</p>
              <p className="text-[10px] text-blue-300 font-medium mt-0.5">{trip.title || 'Live Navigation'}</p>
            </div>
          </div>
          <button
            onClick={onEndTrip}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all shrink-0 cursor-pointer"
            title="End Navigation"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Live Trip Telemetry Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-black text-slate-900">{trip.destinationName || 'Destination'}</span>
            <span className="text-slate-400">•</span>
            <span className="font-bold text-blue-600">{simulatedDistanceKm} km ({Math.floor(simulatedDurationMins / 60)}h {simulatedDurationMins % 60}m)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
              🚀 {simulatedSpeed} km/h
            </span>
            <span className={`font-bold px-2 py-0.5 rounded-lg ${isChargingMode ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-emerald-50 text-emerald-700'}`}>
              ⚡ {simulatedSoc}% SOC
            </span>
          </div>
        </div>
      </div>

      {/* 2. Fullscreen Interactive Map */}
      <div className="flex-1 w-full h-full">
        <MapContainerComponent
          center={currentLocation}
          stations={availableStations}
          selectedStationId={null}
          activeTrip={trip}
        />
      </div>

      {/* 3. Dynamic Bottom Sheet: Recommended Stop OR No Charging Needed */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        {isChargingMode ? (
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-blue-500/50 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Fast Charging Session</span>
              </div>
              <span className="text-xs font-bold text-blue-300 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
                120 kW DC
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-white">{simulatedSoc}%</p>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  {recommendation.recommendedStop?.station.name || 'EV Fast Charger'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400">+120 kW DC</p>
                <p className="text-xs text-slate-300">Target: 80% SOC</p>
              </div>
            </div>

            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-300 shadow-lg"
                style={{ width: `${simulatedSoc}%` }}
              />
            </div>

            <button
              onClick={() => setIsChargingMode(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
            >
              Finish Charging & Resume Drive
            </button>
          </div>
        ) : recommendation.needsCharging && recommendation.recommendedStop ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Route-Aware Charger Recommendation</h3>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {recommendation.recommendedStop.station.maxPowerKw} kW DC
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{recommendation.recommendedStop.station.name}</h4>
                <p className="text-xs text-slate-500">
                  {recommendation.recommendedStop.segmentName} • {recommendation.recommendedStop.detourDistanceKm} km detour
                </p>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">
                  +{recommendation.recommendedStop.addedSocPercent}% battery in {recommendation.recommendedStop.chargingTimeMinutes} mins
                </p>
              </div>

              <button
                onClick={() => setShowWhyModal(true)}
                className="text-[11px] font-bold text-blue-600 underline hover:text-blue-700 p-1 cursor-pointer"
              >
                Why this?
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setIsChargingMode(true)}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ZapIcon size={16} />
                <span>Simulate Fast Charging</span>
              </button>

              <button
                onClick={onEndTrip}
                className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all active:scale-98 cursor-pointer"
              >
                End Navigation
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600">
                <span className="text-base">✓</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">No Charging Needed</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Safe Arrival
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">Trip looks good!</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Estimated battery on arrival at {trip.destinationName || 'destination'}: <span className="font-bold text-emerald-600">{recommendation.predictedArrivalSocPercent}%</span>
              </p>
            </div>

            <button
              onClick={onEndTrip}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all active:scale-98 cursor-pointer"
            >
              End Navigation
            </button>
          </div>
        )}
      </div>

      {/* Why Modal */}
      {showWhyModal && recommendation.recommendedStop && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                🤖
              </div>
              <h3 className="text-base font-bold text-slate-900">Why Was This Charger Recommended?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              {recommendation.recommendedStop.whyExplanation}
            </p>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
