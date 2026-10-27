import React, { useState } from 'react';
import { PhoneCall, AlertOctagon, Wrench, BatteryLow, Car, ShieldAlert, CheckCircle, X } from 'lucide-react';
import { TripService } from '../services/tripService';

interface SOSPanelProps {
  currentSoc?: number;
  onClose?: () => void;
}

export const SOSPanel: React.FC<SOSPanelProps> = ({ currentSoc = 14, onClose }) => {
  const [selectedIssue, setSelectedIssue] = useState<'low_battery' | 'breakdown' | 'flat_tyre' | 'accident'>('low_battery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sosResult, setSosResult] = useState<any | null>(null);

  const handleTrigger = async () => {
    setIsSubmitting(true);
    try {
      const data = await TripService.triggerSOS({
        issue_type: selectedIssue,
        latitude: 11.6643,
        longitude: 78.1460,
        current_soc_percent: currentSoc
      });
      setSosResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl max-w-xl w-full text-slate-800 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-black">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Highway Emergency Assistance (SOS)</h3>
            <p className="text-xs text-slate-500">24/7 Rapid EV roadside rescue & support along NH544</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400">
            <X size={20} />
          </button>
        )}
      </div>

      {!sosResult ? (
        <>
          {/* Issue Selector */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
              Select Emergency Situation
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'low_battery', label: 'Critically Low Battery', icon: BatteryLow, desc: 'Mobile DC charge van dispatch' },
                { id: 'breakdown', label: 'Vehicle Breakdown', icon: Wrench, desc: 'Flatbed EV tow truck' },
                { id: 'flat_tyre', label: 'Flat Tyre / Wheel Damage', icon: Car, desc: 'On-site puncture / replacement' },
                { id: 'accident', label: 'Accident / Collision', icon: AlertOctagon, desc: 'Emergency police & medical RSA' }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIssue === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIssue(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/60 border-rose-500 ring-1 ring-rose-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={16} className={isSelected ? 'text-rose-600' : 'text-slate-500'} />
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Location telemetry */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Live GPS Coordinates:</span>
              <span className="font-mono font-bold text-slate-800">11.6643° N, 78.1460° E</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location Marker:</span>
              <span className="font-semibold text-slate-800">NH544 km 214 (Salem Bypass)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Telemetry Battery SOC:</span>
              <span className="font-bold text-rose-600">{currentSoc}% (Critical Buffer)</span>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleTrigger}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <PhoneCall size={18} />
            <span>{isSubmitting ? 'Dispatching Support...' : 'Dispatch Roadside Assistance Now'}</span>
          </button>
        </>
      ) : (
        /* Result Screen */
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle size={22} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">Dispatch Request Confirmed</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                  {sosResult.ticket_id}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Estimated arrival of highway assistance van: <strong className="text-slate-900">{sosResult.eta_support_minutes} minutes</strong>.
              </p>
            </div>
          </div>

          {/* Nearest Contacts and Hubs */}
          <div className="space-y-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Nearest Authorized EV Center</span>
              <span className="font-bold text-slate-800">{sosResult.nearest_service_center.name}</span>
              <p className="text-slate-500 mt-0.5">{sosResult.nearest_service_center.address} • {sosResult.nearest_service_center.phone}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Emergency Hotline Numbers</span>
              <div className="space-y-1 mt-1">
                {sosResult.emergency_contacts.map((contact: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-0.5">
                    <span className="text-slate-700 font-medium">{contact.name}</span>
                    <a href={`tel:${contact.phone}`} className="font-bold text-emerald-600 underline">
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Safety Checklist */}
          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200/80 text-xs space-y-1">
            <span className="font-bold text-amber-900 block">Immediate Safety Instructions:</span>
            {sosResult.instructions.map((inst: string, idx: number) => (
              <p key={idx} className="text-amber-800">• {inst}</p>
            ))}
          </div>

          <button
            onClick={() => setSosResult(null)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            Create Another Support Ticket
          </button>
        </div>
      )}
    </div>
  );
};
