import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'glow';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  ...props
}) => {
  const variants = {
    glass: 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300',
    solid: 'bg-white border border-slate-200 shadow-sm',
    glow: 'bg-emerald-50/50 border border-emerald-200/80 shadow-sm hover:shadow-md'
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-200 text-slate-900',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
