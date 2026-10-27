import React from 'react';
import { cn } from '../../utils/cn';

interface StatusIndicatorProps {
  status?: 'active' | 'warning' | 'offline';
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = 'active',
  label,
  className
}) => {
  const statusStyles = {
    active: 'bg-emerald-600 shadow-emerald-500/40',
    warning: 'bg-amber-500 shadow-amber-500/40',
    offline: 'bg-slate-400 shadow-slate-400/40'
  };

  const pingStyles = {
    active: 'bg-emerald-500',
    warning: 'bg-amber-500',
    offline: 'bg-slate-400'
  };

  return (
    <div className={cn('inline-flex items-center gap-2 text-xs font-semibold text-slate-700', className)}>
      <span className="relative flex h-2.5 w-2.5">
        {status !== 'offline' && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', pingStyles[status])} />
        )}
        <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5 shadow-xs', statusStyles[status])} />
      </span>
      {label && <span>{label}</span>}
    </div>
  );
};
