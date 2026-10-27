import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { storage } from '../utils/storage';
import { MOCK_CHARGERS } from '../data/chargers';
import { checkBackupReachability, findAlternativeBackup } from '../utils/chargerEngine';
import type { Charger, Vehicle } from '../types';

export const BackupChargerPage: React.FC = () => {
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle>(() => storage.getVehicleData());
  const [primaryCharger, setPrimaryCharger] = useState<Charger>(() => storage.getPrimaryCharger());
  const [backupCharger, setBackupCharger] = useState<Charger>(() => storage.getBackupCharger());

  useEffect(() => {
    setVehicle(storage.getVehicleData());
    setPrimaryCharger(storage.getPrimaryCharger());
    setBackupCharger(storage.getBackupCharger());
  }, []);

  const analysis = checkBackupReachability(primaryCharger, backupCharger, vehicle, vehicle.soc ?? 82);

  const alternative = !analysis.isBackupReachable
    ? findAlternativeBackup(primaryCharger, MOCK_CHARGERS, vehicle, vehicle.soc ?? 82)
    : undefined;

  const handleSelectBackup = (charger: Charger) => {
    storage.setBackupCharger(charger);
    setBackupCharger(charger);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Dual-Tier Charger Intelligence
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/backup-charger</span>
            </div>
            <PageTitle gradient>Backup Charger Safety Planning</PageTitle>
            <PageSubtitle>
              Ensure continuous trip safety even if your primary fast charger fails or experiences long queues.
            </PageSubtitle>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/chargers')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Change Chargers
          </Button>
        </div>

        {/* DECISION BANNER */}
        <div
          className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-all ${
            analysis.isBackupReachable
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl border shrink-0 ${
                analysis.isBackupReachable
                  ? 'bg-white border-emerald-300 text-emerald-700'
                  : 'bg-white border-red-300 text-red-700'
              }`}
            >
              {analysis.isBackupReachable ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Backup Reachability Assessment
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                {analysis.isBackupReachable ? '🟢 BACKUP REACHABLE' : '🔴 BACKUP NOT SAFE'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                {analysis.isBackupReachable
                  ? 'You have sufficient energy to reach the backup charger with a safe battery reserve if the primary fails.'
                  : 'Selected backup charger is too far beyond your primary stop. Battery reserve drops below 15% threshold.'}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-500">Backup Arrival SOC</span>
            <span
              className={`text-2xl font-black ${
                analysis.backupArrivalSOCIfPrimaryFails >= 15 ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {analysis.backupArrivalSOCIfPrimaryFails}%
            </span>
          </div>
        </div>

        {/* VISUAL CONNECTED CARDS */}
        <div className="space-y-4">
          <Card variant="solid" className="space-y-3 bg-white border-slate-200 shadow-xs relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    PRIMARY CHARGER
                  </span>
                  <h3 className="text-base font-black text-slate-900">{primaryCharger.name}</h3>
                </div>
              </div>
              <Badge variant="success">Primary Selected</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Distance</span>
                <span className="font-extrabold text-slate-900">{analysis.primaryDistanceKm} km ahead</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Arrival SOC</span>
                <span className="font-extrabold text-emerald-700">{analysis.primaryArrivalSOC}%</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Connector</span>
                <span className="font-extrabold text-blue-700">{primaryCharger.chargingSpeed} kW ({primaryCharger.connector})</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Free Ports</span>
                <span className="font-extrabold text-slate-900">{primaryCharger.freePorts} / {primaryCharger.ports} Free</span>
              </div>
            </div>
          </Card>

          <div className="flex flex-col items-center justify-center py-1">
            <div className="w-0.5 h-6 bg-emerald-500" />
            <div className="p-2 rounded-full bg-white border border-slate-300 text-emerald-600 shadow-xs">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
            <div className="w-0.5 h-6 bg-emerald-500" />
          </div>

          <Card
            variant="solid"
            className={`space-y-3 bg-white shadow-xs relative ${
              analysis.isBackupReachable ? 'border-blue-200' : 'border-red-200 bg-red-50/20'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-xl border border-blue-200 text-blue-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    BACKUP CHARGER (FAILOVER)
                  </span>
                  <h3 className="text-base font-black text-slate-900">{backupCharger.name}</h3>
                </div>
              </div>
              <Badge variant={analysis.isBackupReachable ? 'info' : 'warning'}>
                {analysis.isBackupReachable ? 'Backup Selected' : 'Unsafe Backup'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Extra Distance</span>
                <span className="font-extrabold text-slate-900">+{analysis.extraBackupDistanceKm} km beyond primary</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Failover SOC</span>
                <span className={`font-black ${analysis.backupArrivalSOCIfPrimaryFails >= 15 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {analysis.backupArrivalSOCIfPrimaryFails}%
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Reserve Buffer</span>
                <span className="font-extrabold text-emerald-700">{analysis.requiredReserveSOC}%</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Connector</span>
                <span className="font-extrabold text-blue-700">{backupCharger.chargingSpeed} kW ({backupCharger.connector})</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ALTERNATIVE BACKUP SUGGESTION */}
        {!analysis.isBackupReachable && alternative && (
          <Card variant="solid" className="space-y-3 border-amber-300 bg-amber-50 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <h4 className="text-sm font-bold text-slate-900">Recommended Safe Alternative Backup</h4>
              </div>
              <Badge variant="warning">Auto-Detected</Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-amber-200">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-slate-900">{alternative.name}</span>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{alternative.locationName} ({alternative.distanceKm} km)</span>
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSelectBackup(alternative)}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Switch to Safe Backup
              </Button>
            </div>
          </Card>
        )}

        {/* SELECT ANOTHER BACKUP */}
        <Card variant="solid" className="space-y-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span>Select Alternative Backup Charger</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Click to assign as active backup</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_CHARGERS.filter((c) => c.id !== primaryCharger.id).map((charger) => {
              const isSelectedBackup = backupCharger?.id === charger.id;
              const testAnalysis = checkBackupReachability(primaryCharger, charger, vehicle, vehicle.soc ?? 82);

              return (
                <div
                  key={charger.id}
                  onClick={() => handleSelectBackup(charger)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelectedBackup
                      ? 'bg-emerald-50 border-emerald-400 text-slate-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold block">{charger.name}</span>
                    <span className="text-[11px] text-slate-500 block font-mono font-medium">
                      {charger.distanceKm} km • Failover SOC: {testAnalysis.backupArrivalSOCIfPrimaryFails}%
                    </span>
                  </div>

                  <Badge variant={testAnalysis.isBackupReachable ? 'success' : 'warning'}>
                    {testAnalysis.isBackupReachable ? 'Reachable' : 'Unsafe'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};
