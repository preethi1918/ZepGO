import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const getStyles = () => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: ShieldCheck,
          label: 'LOW RISK'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: AlertTriangle,
          label: 'MEDIUM RISK'
        };
      case 'HIGH':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: AlertOctagon,
          label: 'HIGH RISK'
        };
    }
  };

  const { bg, icon: Icon, label } = getStyles();
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3.5 py-1.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold rounded-full border ${bg} ${padding} uppercase tracking-wider`}>
      {showIcon && <Icon size={size === 'sm' ? 12 : 14} />}
      <span>{label}</span>
    </span>
  );
};
