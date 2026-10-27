import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Search,
  Filter,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { MOCK_CHARGERS } from '../data/chargers';
import { calculateChargerRisk, predictArrivalStatus } from '../utils/chargerEngine';
import { storage } from '../utils/storage';
import type { Charger } from '../types';

export const ChargersPage: React.FC = () => {
  const navigate = useNavigate();

  const [chargers] = useState<Charger[]>(MOCK_CHARGERS);
  const [primaryCharger, setPrimaryCharger] = useState<Charger>(() => storage.getPrimaryCharger());
  const [searchQuery, setSearchQuery] = useState('');

  const [availableOnly, setAvailableOnly] = useState(false);
  const [fastChargingOnly, setFastChargingOnly] = useState(false);
  const [lowRiskOnly, setLowRiskOnly] = useState(false);
  const [ccs2Only, setCcs2Only] = useState(false);
  const [nearRouteOnly, setNearRouteOnly] = useState(false);

  useEffect(() => {
    setPrimaryCharger(storage.getPrimaryCharger());
  }, []);

  const handleSelectPrimary = (charger: Charger, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.setPrimaryCharger(charger);
    setPrimaryCharger(charger);
  };

  const filteredChargers = chargers.filter((charger) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = charger.name.toLowerCase().includes(q);
      const matchLoc = charger.locationName.toLowerCase().includes(q);
      if (!matchName && !matchLoc) return false;
    }

    if (availableOnly && (charger.freePorts === 0 || charger.availability !== 'Available')) {
      return false;
    }

    if (fastChargingOnly && charger.chargingSpeed < 100) {
      return false;
    }

    const risk = calculateChargerRisk(charger);
    if (lowRiskOnly && risk !== 'Low') {
      return false;
    }

    if (ccs2Only && charger.connector !== 'CCS2') {
      return false;
    }

    if (nearRouteOnly && charger.distanceKm > 200) {
      return false;
    }

    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Zap className="w-3.5 h-3.5" />}>
                Live Charger Discovery
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/chargers</span>
            </div>
            <PageTitle gradient>Chargers & Station Risk Analysis</PageTitle>
            <PageSubtitle>
              Discover high-reliability EV fast chargers, predict arrival queues, and configure backups.
            </PageSubtitle>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/backup-charger')}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Plan Backup Charger
          </Button>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <Card variant="solid" className="p-4 bg-white space-y-3 border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search charger name, highway, or city..."
                className="w-full bg-slate-50 text-xs text-slate-900 font-bold pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-700">Quick Filters</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200">
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                availableOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              Available
            </button>

            <button
              onClick={() => setFastChargingOnly(!fastChargingOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                fastChargingOnly
                  ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              Fast Charging (≥100 kW)
            </button>

            <button
              onClick={() => setLowRiskOnly(!lowRiskOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                lowRiskOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              Low Risk
            </button>

            <button
              onClick={() => setCcs2Only(!ccs2Only)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                ccs2Only
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              CCS2 Plug
            </button>

            {(availableOnly || fastChargingOnly || lowRiskOnly || ccs2Only || nearRouteOnly || searchQuery) && (
              <button
                onClick={() => {
                  setAvailableOnly(false);
                  setFastChargingOnly(false);
                  setLowRiskOnly(false);
                  setCcs2Only(false);
                  setNearRouteOnly(false);
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-red-600 hover:underline pl-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </Card>

        {/* CHARGER CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChargers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3 shadow-xs">
              <Filter className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Chargers Match Your Filters</h3>
              <p className="text-xs text-slate-500 font-medium">Try loosening your filter criteria or search query.</p>
            </div>
          ) : (
            filteredChargers.map((charger) => {
              const risk = calculateChargerRisk(charger);
              const predictedStatus = predictArrivalStatus(charger);
              const isPrimary = primaryCharger?.id === charger.id;

              return (
                <Card
                  key={charger.id}
                  variant="solid"
                  onClick={() => navigate(`/chargers/${charger.id}`)}
                  className={`space-y-4 cursor-pointer hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between bg-white border-slate-200 shadow-xs ${
                    isPrimary ? 'border-emerald-500 bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                            {charger.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{charger.locationName}</span>
                        </p>
                      </div>

                      <Badge variant="info" className="shrink-0 font-mono font-bold">
                        {charger.distanceKm} km
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Free Ports</span>
                        <span className="font-black text-slate-900 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-emerald-600" />
                          {charger.freePorts} / {charger.ports} Free
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Charging Speed</span>
                        <span className="font-black text-blue-700">{charger.chargingSpeed} kW ({charger.connector})</span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Queue & Risk</span>
                        <span className={`font-black ${risk === 'Low' ? 'text-emerald-700' : risk === 'Medium' ? 'text-amber-700' : 'text-red-700'}`}>
                          {charger.queueLevel} Queue ({risk} Risk)
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Price & Score</span>
                        <span className="font-black text-slate-900 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          ₹{charger.pricePerKwh}/kWh ({charger.reliabilityScore}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200 font-medium">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Predicted at arrival:</span>
                      </span>
                      <span className="font-bold text-emerald-700">{predictedStatus}</span>
                    </div>

                    {charger.maintenance && (
                      <div className="bg-red-50 border border-red-200 p-2 rounded-xl text-[11px] text-red-700 flex items-center gap-1.5 font-bold">
                        <Wrench className="w-3.5 h-3.5 shrink-0" />
                        <span>Station undergoing maintenance</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                    <Button
                      variant={isPrimary ? 'primary' : 'secondary'}
                      size="sm"
                      fullWidth
                      onClick={(e) => handleSelectPrimary(charger, e)}
                      leftIcon={isPrimary ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-600" />}
                    >
                      {isPrimary ? 'Primary Charger' : 'Set as Primary'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/chargers/${charger.id}`)}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      Details
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
};
