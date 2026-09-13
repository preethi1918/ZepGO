import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, InfoIcon, ZapIcon } from './Icons';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'charging';
  title: string;
  description?: string;
}

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2.5 max-w-xs sm:max-w-sm w-full pointer-events-none select-none">
      {toasts.map((toast) => {
        let icon = <InfoIcon size={18} className="text-blue-500 shrink-0" />;
        let borderClass = 'border-blue-500/30 bg-slate-900/90 text-white';

        if (toast.type === 'success') {
          icon = <CheckCircleIcon size={18} className="text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/40 bg-slate-900/95 text-white';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangleIcon size={18} className="text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/40 bg-slate-900/95 text-white';
        } else if (toast.type === 'charging') {
          icon = <ZapIcon size={18} className="text-emerald-400 fill-emerald-400 animate-pulse shrink-0" />;
          borderClass = 'border-emerald-500/50 bg-slate-950 text-white ring-1 ring-emerald-500/30';
        }

        return (
          <div
            key={toast.id}
            onClick={() => onDismiss(toast.id)}
            className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 transform animate-in slide-in-from-bottom-2 cursor-pointer ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold leading-snug">{toast.title}</h4>
              {toast.description && (
                <p className="text-[11px] text-slate-300 font-medium mt-0.5 leading-tight line-clamp-2">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(toast.id);
              }}
              className="text-slate-400 hover:text-white text-xs font-bold p-0.5"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
