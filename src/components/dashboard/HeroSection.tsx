import React from 'react';
import { Sparkles, Shield, Compass } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card variant="solid" className="relative overflow-hidden p-6 sm:p-7 border-slate-200 bg-white shadow-sm">
      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="success" icon={<Sparkles className="w-3.5 h-3.5" />}>
            EcoTech Light Journey Platform
          </Badge>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">Active Intelligence</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          Intelligent EV Navigation. <span className="text-[#16A34A]">Smarter Charging.</span> Safer Journeys.
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">
          ZepGO evaluates your vehicle telemetry, calculates realistic battery consumption, monitors changing conditions, and plans reachable backup chargers.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/plan-trip')}
            leftIcon={<Compass className="w-4 h-4" />}
          >
            Plan Journey Now
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/chargers')}
            leftIcon={<Shield className="w-4 h-4 text-emerald-600" />}
          >
            Browse Verified Chargers
          </Button>
        </div>
      </div>
    </Card>
  );
};
