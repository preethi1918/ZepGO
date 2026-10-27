import React, { useState } from 'react';
import { Settings, ShieldCheck, Bell, Globe, Save, CheckCircle2, CloudOff } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';

export const SettingsPage: React.FC = () => {
  const [reservePercent, setReservePercent] = useState(15);
  const [units, setUnits] = useState<'km' | 'mi'>('km');
  const [preferredConnector, setPreferredConnector] = useState('CCS2');
  const [notifications, setNotifications] = useState({
    batteryAlerts: true,
    chargerQueueAlerts: true,
    trafficAlerts: true,
    backupChargerAlerts: true
  });
  const [offlineCacheMode, setOfflineCacheMode] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('zepgo_settings', JSON.stringify({
        reservePercent,
        units,
        preferredConnector,
        notifications,
        offlineCacheMode
      }));
    } catch (err) {
      console.error('Failed to save settings', err);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Settings className="w-3.5 h-3.5" />}>
                System Configuration
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/settings</span>
            </div>
            <PageTitle gradient>Application Settings & Safety Margins</PageTitle>
            <PageSubtitle>
              Configure safety battery reserve thresholds, preferred charging networks, notifications, and offline caching.
            </PageSubtitle>
          </div>

          <Badge variant="neutral">Data Lineage: User Preferences</Badge>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-700 font-bold animate-in fade-in duration-200 shadow-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>Settings saved successfully! Safety reserve updated to {reservePercent}%.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            {/* Safety Reserve Threshold */}
            <Card variant="solid" className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>1. Minimum Battery Reserve Percentage</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="reserve-slider" className="text-xs font-semibold text-slate-700">Safety Buffer Reserve</label>
                  <span className="text-sm font-extrabold text-emerald-700 font-mono">{reservePercent}% (Default 15%)</span>
                </div>

                <input
                  id="reserve-slider"
                  type="range"
                  min="10"
                  max="30"
                  step="1"
                  value={reservePercent}
                  onChange={(e) => setReservePercent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  ZepGO will flag any journey that drops arrival battery below this reserve as requiring a charger stop.
                </p>
              </div>
            </Card>

            {/* Notifications & Alert System */}
            <Card variant="solid" className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>2. Alert System Preferences</span>
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-white">
                  <span className="text-slate-800 font-medium">Battery SOC Safety Alerts</span>
                  <input
                    type="checkbox"
                    checked={notifications.batteryAlerts}
                    onChange={(e) => setNotifications({ ...notifications, batteryAlerts: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-white">
                  <span className="text-slate-800 font-medium">Charger Queue & Availability Warnings</span>
                  <input
                    type="checkbox"
                    checked={notifications.chargerQueueAlerts}
                    onChange={(e) => setNotifications({ ...notifications, chargerQueueAlerts: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-white">
                  <span className="text-slate-800 font-medium">Heavy Traffic & Weather Energy Penalties</span>
                  <input
                    type="checkbox"
                    checked={notifications.trafficAlerts}
                    onChange={(e) => setNotifications({ ...notifications, trafficAlerts: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-white">
                  <span className="text-slate-800 font-medium">Backup Charger Failover Notifications</span>
                  <input
                    type="checkbox"
                    checked={notifications.backupChargerAlerts}
                    onChange={(e) => setNotifications({ ...notifications, backupChargerAlerts: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>
              </div>
            </Card>

            <Button type="submit" variant="primary" size="lg" fullWidth leftIcon={<Save className="w-4 h-4" />}>
              Save All Settings
            </Button>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Units & Offline Sync */}
            <Card variant="solid" className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-200 pb-3">
                <Globe className="w-4 h-4 text-amber-600" />
                <span>3. Regional & Network Settings</span>
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="distance-unit-select" className="text-xs font-semibold text-slate-700 block">Distance Units</label>
                  <select
                    id="distance-unit-select"
                    value={units}
                    onChange={(e) => setUnits(e.target.value as 'km' | 'mi')}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="km">Kilometers (km)</option>
                    <option value="mi">Miles (mi)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="preferred-connector-select" className="text-xs font-semibold text-slate-700 block">Preferred Charging Network Connector</label>
                  <select
                    id="preferred-connector-select"
                    value={preferredConnector}
                    onChange={(e) => setPreferredConnector(e.target.value)}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="CCS2">CCS2 (Recommended)</option>
                    <option value="Type 2">Type 2 AC</option>
                    <option value="GB/T">GB/T</option>
                  </select>
                </div>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer pt-2 hover:bg-white">
                  <div className="flex items-center gap-2">
                    <CloudOff className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Offline Pre-Route Caching</span>
                      <span className="text-[10px] text-slate-500">Cache active routes for weak network zones</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={offlineCacheMode}
                    onChange={(e) => setOfflineCacheMode(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
