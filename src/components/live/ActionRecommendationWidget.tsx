import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, LifeBuoy, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { ActionRecommendation } from '../../types';

interface ActionRecommendationWidgetProps {
  recommendation: ActionRecommendation;
}

export const ActionRecommendationWidget: React.FC<ActionRecommendationWidgetProps> = ({ recommendation }) => {
  const navigate = useNavigate();

  const getActionTarget = () => {
    switch (recommendation.type) {
      case 'VIEW_BACKUP_CHARGER':
        return { label: 'View Backup Charger', path: '/backup-charger', icon: ShieldCheck };
      case 'CHARGE_AT_RECOMMENDED_CHARGER':
        return { label: 'Go to Chargers', path: '/chargers', icon: Zap };
      case 'EMERGENCY_ASSISTANCE':
        return { label: 'Emergency Assistance', path: '/assistance', icon: LifeBuoy };
      default:
        return { label: 'View Route Result', path: '/route-result', icon: ChevronRight };
    }
  };

  const action = getActionTarget();
  const Icon = action.icon;

  return (
    <Card
      variant="glass"
      className={`p-5 space-y-3 border transition-all ${
        recommendation.type === 'EMERGENCY_ASSISTANCE' || recommendation.type === 'FIND_SAFER_ROUTE'
          ? 'border-rose-500/40 bg-rose-950/15'
          : recommendation.type === 'VIEW_BACKUP_CHARGER'
          ? 'border-amber-500/40 bg-amber-950/15'
          : 'border-emerald-500/30 bg-emerald-950/10'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Action Recommendation Engine</span>
        </span>
        <Badge variant={recommendation.badgeVariant}>{recommendation.type.replace(/_/g, ' ')}</Badge>
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          {recommendation.type === 'NO_ACTION_REQUIRED' ? '🟢' : '⚠️'} {recommendation.title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          "{recommendation.description}"
        </p>
      </div>

      <div className="pt-2">
        <Button
          variant={recommendation.type === 'EMERGENCY_ASSISTANCE' ? 'danger' : 'primary'}
          size="sm"
          onClick={() => navigate(action.path)}
          rightIcon={<Icon className="w-4 h-4" />}
        >
          {action.label}
        </Button>
      </div>
    </Card>
  );
};
