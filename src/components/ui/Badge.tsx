import React from 'react';
import { cn } from '../../utils/cn';
import type { BadgeVariant } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'info',
  icon,
  ...props
}) => {
  const variants: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    info: 'bg-blue-50 text-blue-700 border-blue-200 font-bold',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 font-semibold'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border tracking-wide select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
