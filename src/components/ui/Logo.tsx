import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn('flex flex-col items-start select-none', className)}>
      <div className="flex items-center gap-2.5 group">
        <div className="flex items-center justify-center rounded-xl bg-[#16A34A] p-2 text-white shadow-xs group-hover:bg-[#15803D] transition-colors">
          <Zap className={cn('fill-white', iconSizes[size])} />
        </div>
        <div className="flex flex-col">
          <span className={cn('font-black tracking-tight text-slate-900 flex items-center gap-0.5', textSizes[size])}>
            ZEP<span className="text-[#16A34A]">GO</span>
          </span>
        </div>
      </div>
      {showTagline && (
        <span className="mt-1 text-xs font-bold tracking-wider uppercase text-emerald-700">
          Intelligent EV Navigation. Smarter Charging.
        </span>
      )}
    </div>
  );
};
