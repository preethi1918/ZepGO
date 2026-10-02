import React from 'react';
import { Navigation, Clock, ShieldCheck, BatteryCharging, ArrowRight, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const UpcomingJourneyCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card variant="solid" className="space-y-4 flex flex-col justify-between bg-white border-slate-200 shadow-sm">
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
              <Navigation className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              ACTIVE JOURNEY TELEMETRY
            </span>
          </div>
          <Badge variant="success">Confirmed Route</Badge>
        </div>

        {/* Route Title & Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              Chennai → Coimbatore
            </h4>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>Distance: <strong className="text-slate-900">510 km</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Est Time: <strong className="text-slate-900">7h 15m</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Smart Decision Card */}
        <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
              NO CHARGING REQUIRED
            </span>
          </div>

          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            "You can reach your destination safely without charging."
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200">
            <div className="bg-white p-2 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Expected Arrival
              </span>
              <span className="text-sm font-black text-emerald-700 flex items-center gap-1">
                <BatteryCharging className="w-4 h-4" />
                21% SOC
              </span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Safety Reserve
              </span>
              <span className="text-sm font-black text-blue-700 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                18% Buffer
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        size="md"
        onClick={() => navigate('/live-journey')}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Start Live Journey
      </Button>
    </Card>
  );
};
