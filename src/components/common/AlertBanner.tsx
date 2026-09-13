import React from 'react';
import { AlertTriangleIcon, InfoIcon, CheckIcon, XIcon } from './Icons';

export interface AlertBannerProps {
  type?: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  message,
  onDismiss,
  actionLabel,
  onAction,
}) => {
  const styles = {
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      iconBg: 'text-amber-600',
      IconComponent: AlertTriangleIcon,
      actionBtn: 'bg-amber-600 text-white hover:bg-amber-700',
    },
    error: {
      bg: 'bg-red-50 border-red-200 text-red-900',
      iconBg: 'text-red-600',
      IconComponent: AlertTriangleIcon,
      actionBtn: 'bg-red-600 text-white hover:bg-red-700',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      iconBg: 'text-blue-600',
      IconComponent: InfoIcon,
      actionBtn: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      iconBg: 'text-emerald-600',
      IconComponent: CheckIcon,
      actionBtn: 'bg-emerald-600 text-white hover:bg-emerald-700',
    },
  };

  const { bg, iconBg, IconComponent, actionBtn } = styles[type];

  return (
    <div className={`relative p-3.5 rounded-xl border ${bg} shadow-sm transition-all duration-200 my-2`}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 ${iconBg}`}>
          <IconComponent size={18} />
        </div>
        <div className="flex-1 pr-4">
          <h4 className="text-xs font-semibold tracking-tight">{title}</h4>
          <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{message}</p>

          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className={`mt-2.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-95 shadow-2xs ${actionBtn}`}
            >
              {actionLabel}
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            aria-label="Dismiss alert"
          >
            <XIcon size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
