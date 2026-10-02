import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  Clock,
  BatteryCharging,
  LifeBuoy,
  MapPin,
  Wifi,
  WifiOff,
  CloudSun,
  Car,
  Route,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { SimulatedControlPanel } from '../components/live/SimulatedControlPanel';
import { JourneyAlertList } from '../components/live/JourneyAlertList';
import { ActionRecommendationWidget } from '../components/live/ActionRecommendationWidget';
import { storage } from '../utils/storage';
import { recalculateJourneyState } from '../utils/liveJourneyEngine';
import type { LiveJourneyState, Vehicle, EnvironmentalConditions } from '../types';

export const LiveJourneyPage: React.FC = () => {
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle>(() => storage.getVehicleData());

  const [journeyState, setJourneyState] = useState<LiveJourneyState>(() => {
    const defaultVeh = storage.getVehicleData();
    const soc = defaultVeh.soc ?? 82;
    const initialConditions: EnvironmentalConditions = { traffic: 'normal', weather: 'normal', road: 'good' };

    return {
      origin: 'Chennai',
      destination: 'Coimbatore',
      currentLocation: 'NH-44 Salem Corridor',
      etaText: '2h 45m',
      distanceRemainingKm: 180,
      startingSOC: soc,
      currentSOC: soc,
      arrivalSOC: 21,
      remainingRangeKm: 397,
      reservePercent: 15,
      safetyMarginPercent: 21,
      conditions: initialConditions,
      isOnline: true,
      alerts: [
        {
          id: 'init_1',
          title: 'Live Journey Initialized',
          message: 'Real-time telemetry stream active. All EV systems optimal.',
          severity: 'info',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      recommendation: {
        type: 'NO_ACTION_REQUIRED',
        title: 'No Action Required — Route Optimal',
        description: 'Battery state of charge is optimal. Continue along current route with confidence.',
        badgeVariant: 'success'
      }
    };
  });

  useEffect(() => {
    const activeVeh = storage.getVehicleData();
    setVehicle(activeVeh);
  }, []);

  const handleConditionChange = (newConditions: EnvironmentalConditions) => {
    const updated = recalculateJourneyState(journeyState, newConditions, vehicle);
    setJourneyState(updated);
  };

  const handleToggleOnline = () => {
    setJourneyState((prev) => ({
      ...prev,
      isOnline: !prev.isOnline,
      alerts: [
        {
          id: `net_${Date.now()}`,
          title: prev.isOnline ? 'Offline Mode Active' : 'Network Reconnected',
          message: prev.isOnline
            ? 'Operating on cached route telematics & offline battery model.'
            : 'Live cloud telematics synchronization restored.',
          severity: prev.isOnline ? 'warning' : 'info',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev.alerts
      ]
    }));
  };

  const handleReset = () => {
    const normalConditions: EnvironmentalConditions = { traffic: 'normal', weather: 'normal', road: 'good' };
    const updated = recalculateJourneyState(journeyState, normalConditions, vehicle);
    setJourneyState(updated);
  };

  const isLowMargin = journeyState.safetyMarginPercent < 15 || journeyState.arrivalSOC < 15;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* JOURNEY HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Navigation className="w-3.5 h-3.5" />}>
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                Journey Active
              </Badge>

              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white border border-slate-200 flex items-center gap-1 shadow-xs">
                {journeyState.isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    <span className="text-amber-700 font-bold">Offline Mode Active</span>
                  </>
                )}
              </span>
            </div>

            <PageTitle gradient>
              {journeyState.origin} → {journeyState.destination}
            </PageTitle>
            <PageSubtitle>
              Current Location: <strong className="text-slate-900">{journeyState.currentLocation}</strong>
            </PageSubtitle>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold">ETA</span>
                <span className="text-base font-black text-slate-900 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  {journeyState.etaText}
                </span>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Remaining</span>
                <span className="text-base font-black text-emerald-700 flex items-center gap-1">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  {journeyState.distanceRemainingKm} km
                </span>
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => navigate('/assistance')}
              leftIcon={<LifeBuoy className="w-4 h-4" />}
            >
              Emergency Assistance
            </Button>
          </div>
        </div>

        {/* CONTROL PANEL */}
        <SimulatedControlPanel
          conditions={journeyState.conditions}
          isOnline={journeyState.isOnline}
          onConditionChange={handleConditionChange}
          onToggleOnline={handleToggleOnline}
          onReset={handleReset}
        />

        {/* VECTOR ROUTE MAP */}
        <Card variant="solid" className="relative overflow-hidden p-5 bg-white border-slate-200 space-y-3 shadow-sm">
          <div className="flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  REAL-TIME TELEMATICS MAP
                </h3>
                <p className="text-xs font-bold text-slate-900">Live Vehicle Position Tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="info">Speed: 85 km/h</Badge>
              <Badge variant="success">Radar Active</Badge>
            </div>
          </div>

          <div className="relative w-full h-72 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #CBD5E1 1px, transparent 1px), linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)',
                backgroundSize: '28px 28px'
              }}
            />

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 240" preserveAspectRatio="none">
              <path
                d="M 60,180 C 180,200 260,60 400,140 L 540,80"
                stroke="#16A34A"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 60,180 C 180,200 260,60 400,140 L 540,80"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeDasharray="10 10"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>

            <div className="absolute left-[38%] top-[38%] flex flex-col items-center z-20">
              <div className="relative">
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-500 opacity-75" />
                <div className="relative p-2 rounded-full bg-[#16A34A] text-white shadow-md ring-4 ring-emerald-100">
                  <Car className="w-5 h-5 fill-white" />
                </div>
              </div>
              <span className="mt-1 text-[11px] font-black text-white bg-[#16A34A] px-2.5 py-0.5 rounded-full shadow-xs">
                YOUR EV (Live)
              </span>
            </div>

            <div className="absolute left-[8%] bottom-[20%] flex flex-col items-center z-10">
              <div className="p-1.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1">
                {journeyState.origin}
              </span>
            </div>

            <div className="absolute right-[6%] top-[25%] flex flex-col items-center z-10">
              <div className="p-1.5 rounded-full bg-blue-600 text-white shadow-xs">
                <Navigation className="w-4 h-4 fill-white" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1">
                {journeyState.destination}
              </span>
            </div>
          </div>
        </Card>

        {/* DYNAMIC BATTERY GAUGE & STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-6 flex flex-col">
            <Card variant="solid" className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-white border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <BatteryCharging className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    DYNAMIC BATTERY STATUS
                  </h3>
                </div>
                <Badge variant={isLowMargin ? 'warning' : 'success'}>
                  {isLowMargin ? 'Buffer Warning' : 'Battery Optimal'}
                </Badge>
              </div>

              {isLowMargin && (
                <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl flex items-start gap-3 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-red-800 uppercase tracking-wider">
                      ⚠️ LOW SAFETY MARGIN
                    </span>
                    <p className="text-[11px] text-red-700 font-medium">
                      Arrival SOC predicted at {journeyState.arrivalSOC}%. Buffer margin dropped below 15% reserve limit.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Current SOC</span>
                  <span className="text-2xl font-black text-slate-900">{journeyState.currentSOC}%</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated Range</span>
                  <span className="text-2xl font-black text-emerald-700">{journeyState.remainingRangeKm} km</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Expected Arrival SOC</span>
                  <span className={`text-2xl font-black ${journeyState.arrivalSOC > 15 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {journeyState.arrivalSOC}%
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Safety Reserve</span>
                  <span className="text-2xl font-black text-blue-700">{journeyState.reservePercent}%</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-6 flex flex-col space-y-4">
            <Card variant="solid" className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-white border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>ENVIRONMENTAL TELEMETRY</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Live Sensors</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                    <Car className="w-3.5 h-3.5 text-blue-600" />
                    <span>Traffic</span>
                  </div>
                  <span className="text-sm font-black capitalize text-slate-900 block">
                    {journeyState.conditions.traffic}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                    <CloudSun className="w-3.5 h-3.5 text-amber-600" />
                    <span>Weather</span>
                  </div>
                  <span className="text-sm font-black capitalize text-slate-900 block">
                    {journeyState.conditions.weather}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                    <Route className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Road</span>
                  </div>
                  <span className="text-sm font-black capitalize text-slate-900 block">
                    {journeyState.conditions.road}
                  </span>
                </div>
              </div>

              <ActionRecommendationWidget recommendation={journeyState.recommendation} />
            </Card>
          </div>
        </div>

        <JourneyAlertList alerts={journeyState.alerts} />
      </div>
    </AppLayout>
  );
};
