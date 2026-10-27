import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Zap,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Star,
  CheckCircle2,
  ArrowLeft,
  Plug,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { getChargerById } from '../data/chargers';
import { calculateChargerRisk, predictArrivalStatus } from '../utils/chargerEngine';
import { storage } from '../utils/storage';
import type { Charger } from '../types';

export const ChargerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [charger, setCharger] = useState<Charger | undefined>(() => (id ? getChargerById(id) : undefined));
  const [primaryCharger, setPrimaryCharger] = useState<Charger>(() => storage.getPrimaryCharger());

  useEffect(() => {
    if (id) {
      setCharger(getChargerById(id));
    }
    setPrimaryCharger(storage.getPrimaryCharger());
  }, [id]);

  if (!charger) {
    return (
      <AppLayout>
        <div className="py-12 text-center space-y-4 max-w-md mx-auto">
          <PageTitle>Charger Not Found</PageTitle>
          <PageSubtitle>The requested charger station could not be located.</PageSubtitle>
          <Button variant="primary" onClick={() => navigate('/chargers')}>
            Back to Charger Discovery
          </Button>
        </div>
      </AppLayout>
    );
  }

  const risk = calculateChargerRisk(charger);
  const arrivalPrediction = predictArrivalStatus(charger);
  const isPrimary = primaryCharger?.id === charger.id;

  const handleSetPrimary = () => {
    storage.setPrimaryCharger(charger);
    setPrimaryCharger(charger);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Zap className="w-3.5 h-3.5" />}>
                Station Telematics
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/chargers/{charger.id}</span>
            </div>
            <PageTitle gradient>{charger.name}</PageTitle>
            <PageSubtitle>{charger.locationName} • {charger.address}</PageSubtitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/chargers')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Chargers
            </Button>
            <Button
              variant={isPrimary ? 'primary' : 'outline'}
              size="sm"
              onClick={handleSetPrimary}
              leftIcon={isPrimary ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-600" />}
            >
              {isPrimary ? 'Primary Charger' : 'Set as Primary'}
            </Button>
          </div>
        </div>

        {/* ARRIVAL PREDICTION BANNER */}
        <Card variant="solid" className="p-6 border-emerald-200 bg-emerald-50/60 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-white rounded-2xl border border-emerald-200 text-emerald-700 shrink-0 shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Predicted Status At Your Arrival
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>{arrivalPrediction}</span>
                  <Badge variant="success" className="text-xs">
                    Confidence 94%
                  </Badge>
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Calculated using live queue telematics, historical plug occupancy, and travel ETA (~90 mins).
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/backup-charger')}
              rightIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Plan Backup Charger
            </Button>
          </div>
        </Card>

        {/* MAIN DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            <Card variant="solid" className="space-y-4 bg-white border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Station Hardware & Pricing</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Connector Type</span>
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Plug className="w-4 h-4 text-emerald-600" />
                    {charger.connector}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Charging Speed</span>
                  <span className="text-sm font-black text-blue-700 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    {charger.chargingSpeed} kW DC
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Pricing Rate</span>
                  <span className="text-sm font-black text-amber-700 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    ₹{charger.pricePerKwh} / kWh
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Available Ports</span>
                  <span className="text-sm font-black text-emerald-700">
                    {charger.freePorts} of {charger.ports} Free
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Queue Level</span>
                  <span className="text-sm font-black text-slate-900">{charger.queueLevel} Queue</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Distance</span>
                  <span className="text-sm font-black text-slate-900">{charger.distanceKm} km</span>
                </div>
              </div>
            </Card>

            <Card variant="solid" className="space-y-4 bg-white border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Station Risk Engine Analysis</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs text-slate-500 font-bold block">Calculated Station Risk</span>
                  <div className={`text-xl font-black flex items-center gap-2 ${
                    risk === 'Low' ? 'text-emerald-700' : risk === 'Medium' ? 'text-amber-700' : 'text-red-700'
                  }`}>
                    {risk === 'Low' && <ShieldCheck className="w-5 h-5" />}
                    {risk === 'Medium' && <AlertTriangle className="w-5 h-5" />}
                    {risk === 'High' && <AlertTriangle className="w-5 h-5" />}
                    <span>{risk} Risk Level</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Assessed using port redundancy, hardware fault probability, and uptime logs.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs text-slate-500 font-bold block">Hardware Reliability Score</span>
                  <div className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>{charger.reliabilityScore} / 100</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Based on verified EV driver charging sessions in past 30 days.
                  </p>
                </div>
              </div>

              {charger.maintenance && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 flex items-center gap-2 font-bold">
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span>Notice: Station scheduled maintenance active. One plug may be offline.</span>
                </div>
              )}
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card variant="solid" className="space-y-4 bg-white border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-3">
                Station Action Menu
              </h3>

              <div className="space-y-3">
                <Button
                  variant={isPrimary ? 'primary' : 'secondary'}
                  fullWidth
                  size="lg"
                  onClick={handleSetPrimary}
                  leftIcon={isPrimary ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-600" />}
                >
                  {isPrimary ? 'Primary Charger Selected' : 'Set as Primary Charger'}
                </Button>

                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={() => navigate('/backup-charger')}
                  rightIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  Plan Backup Charger
                </Button>
              </div>

              <div className="text-[11px] text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-medium">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>ZepGO Safety Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  Always pair your primary charger with a safe backup within battery reserve range.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
