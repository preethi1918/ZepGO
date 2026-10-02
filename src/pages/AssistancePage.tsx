import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy, AlertTriangle, ShieldCheck, Wrench, Zap, Phone, Navigation, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';

type EmergencyType = 'Tyre Problem' | 'Vehicle Problem' | 'Low Battery' | 'Charger Unavailable' | 'Need Safe Stopping Place';

export const AssistancePage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedIssue, setSelectedIssue] = useState<EmergencyType>('Tyre Problem');

  const issues: { type: EmergencyType; desc: string; icon: React.ReactNode }[] = [
    { type: 'Tyre Problem', desc: 'Puncture, pressure drop or blowout', icon: <Wrench className="w-5 h-5 text-amber-600" /> },
    { type: 'Vehicle Problem', desc: 'System error, warning light or power reduction', icon: <AlertTriangle className="w-5 h-5 text-rose-600" /> },
    { type: 'Low Battery', desc: 'Critically low battery (<10% SOC)', icon: <Zap className="w-5 h-5 text-amber-600" /> },
    { type: 'Charger Unavailable', desc: 'Selected charger offline or occupied', icon: <Zap className="w-5 h-5 text-rose-600" /> },
    { type: 'Need Safe Stopping Place', desc: 'Fatigue, weather hazard or rest stop', icon: <ShieldCheck className="w-5 h-5 text-emerald-600" /> }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="warning" icon={<LifeBuoy className="w-3.5 h-3.5" />}>
                Emergency & Roadside Safety
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/assistance</span>
            </div>
            <PageTitle gradient>Emergency Roadside Assistance</PageTitle>
            <PageSubtitle>
              Instant emergency rerouting to safe stopping bays, EV mechanics, backup chargers, and tow support.
            </PageSubtitle>
          </div>

          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-xs text-rose-700 font-bold">
            <Phone className="w-4 h-4 shrink-0" />
            <span>Emergency Hotline: 1800-ZEPGO-HELP</span>
          </div>
        </div>

        {/* ISSUE SELECTOR GRID */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Select Your Current Vehicle Situation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {issues.map((issue) => {
              const isSelected = selectedIssue === issue.type;
              return (
                <button
                  key={issue.type}
                  onClick={() => setSelectedIssue(issue.type)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-rose-50 border-rose-300 text-slate-900 shadow-sm font-bold ring-2 ring-rose-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {issue.icon}
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{issue.type}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{issue.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE RESOLUTION MATRIX FOR SELECTED ISSUE */}
        <Card variant="solid" className="p-6 space-y-6 border-rose-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">
                ACTIVE ASSISTANCE PLAN FOR
              </span>
              <h2 className="text-xl font-black text-slate-900">{selectedIssue}</h2>
            </div>
            <Badge variant="warning">Prioritizing Nearest Safe Option</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Safe Stopping Location */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Safe Stopping Location</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">NH-44 Emergency Bay #14</h4>
                <p className="text-xs font-extrabold text-emerald-700">500 m away</p>
                <p className="text-[11px] text-slate-600">Paved shoulder with emergency call box & lighting.</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => navigate('/live-journey')}
                rightIcon={<Navigation className="w-3.5 h-3.5" />}
              >
                Navigate to Safe Stop
              </Button>
            </div>

            {/* Nearest Mechanic */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                  <Wrench className="w-4 h-4" />
                  <span>Nearest EV Repair & Tyre</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Salem QuickFix EV Service</h4>
                <p className="text-xs font-extrabold text-amber-700">1.4 km away</p>
                <p className="text-[11px] text-slate-600">24/7 Tyre repair, mobile air & battery assistance.</p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => navigate('/live-journey')}
                rightIcon={<Navigation className="w-3.5 h-3.5" />}
              >
                Find Mechanic
              </Button>
            </div>

            {/* Nearest Charger */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-blue-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <Zap className="w-4 h-4" />
                  <span>Nearest Fast Charger</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Tata Power 250kW Station</h4>
                <p className="text-xs font-extrabold text-blue-700">2.1 km away</p>
                <p className="text-[11px] text-slate-600">2 free ports, CCS2 connector, coffee lounge.</p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => navigate('/chargers')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Find Charger
              </Button>
            </div>

            {/* Roadside Emergency Hotline */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-rose-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <Phone className="w-4 h-4" />
                  <span>ZepGO Emergency Dispatch</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">24/7 Mobile Towing Truck</h4>
                <p className="text-xs font-extrabold text-rose-700">3.2 km away (ETA 12m)</p>
                <p className="text-[11px] text-slate-600">Flatbed EV towing and mobile high-speed charging.</p>
              </div>

              <a
                href="tel:1800937466"
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 fill-white" />
                <span>Call Emergency Support</span>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};
