import React from 'react';
import type { SmartAlert } from '../../types/alert';
import { AlertTriangleIcon, CheckCircleIcon, ZapIcon, XIcon } from '../common/Icons';

export interface SmartAlertsDrawerProps {
  alerts: SmartAlert[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onTriggerAction?: (alert: SmartAlert) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SmartAlertsDrawer: React.FC<SmartAlertsDrawerProps> = ({
  alerts,
  onDismiss,
  onClearAll,
  onTriggerAction,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-4 shadow-2xl border border-slate-100 space-y-3 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Phase 13 Smart Alerts</span>
            <h3 className="text-sm font-bold text-slate-900">Notifications ({alerts.length})</h3>
          </div>
          <div className="flex items-center gap-2">
            {alerts.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <XIcon size={14} />
            </button>
          </div>
        </div>

        {/* List of Alerts */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {alerts.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No active notifications or alerts.</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-2xl border text-xs relative transition-all ${
                  alert.type === 'critical'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : alert.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : alert.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {alert.type === 'critical' || alert.type === 'warning' ? (
                      <AlertTriangleIcon size={16} className={alert.type === 'critical' ? 'text-rose-600 shrink-0 mt-0.5' : 'text-amber-600 shrink-0 mt-0.5'} />
                    ) : alert.type === 'success' ? (
                      <CheckCircleIcon size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <ZapIcon size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-xs leading-snug">{alert.title}</h4>
                      <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">{alert.message}</p>

                      {alert.actionLabel && (
                        <button
                          onClick={() => {
                            if (onTriggerAction) onTriggerAction(alert);
                            onDismiss(alert.id);
                          }}
                          className="mt-2 text-[11px] font-bold underline cursor-pointer hover:opacity-80"
                        >
                          {alert.actionLabel} ➔
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <XIcon size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
