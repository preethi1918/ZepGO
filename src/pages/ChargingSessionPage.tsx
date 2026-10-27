import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  BatteryCharging,
  Clock,
  DollarSign,
  Coffee,
  UtensilsCrossed,
  ShieldCheck,
  Sparkles,
  MapPin,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';
import { storage } from '../utils/storage';

export const ChargingSessionPage: React.FC = () => {
  const navigate = useNavigate();

  // Active vehicle and charging states
  const [currentSoc, setCurrentSoc] = useState(22);
  const targetSoc = 80;
  const powerKw = 120;
  const [energyDeliveredKwh, setEnergyDeliveredKwh] = useState(4.2);
  const [costInr, setCostInr] = useState(88);
  const [timeRemainingMin, setTimeRemainingMin] = useState(24);
  const [isCharging, setIsCharging] = useState(true);

  // Live charging simulation
  useEffect(() => {
    if (!isCharging) return;
    const interval = setInterval(() => {
      setCurrentSoc(prev => {
        if (prev >= targetSoc) {
          setIsCharging(false);
          return targetSoc;
        }
        return Number((prev + 0.2).toFixed(1));
      });
      setEnergyDeliveredKwh(prev => Number((prev + 0.08).toFixed(2)));
      setCostInr(prev => Math.round(prev + 1.7));
      setTimeRemainingMin(prev => Math.max(1, prev > 1 ? prev - 0.1 : 1));
    }, 2500);

    return () => clearInterval(interval);
  }, [isCharging, targetSoc]);

  const amenities = [
    {
      name: 'Saravana Bhavan Highway Hub',
      category: 'Pure Veg Restaurant & Meals',
      distance: '80m walk',
      walkMin: 1,
      rating: 4.6,
      status: 'Open Now',
      facilities: ['South Indian Meals', 'Filter Coffee', 'AC Seating', 'Restrooms'],
      fitWindow: true
    },
    {
      name: 'Highway Restrooms & Executive Lounge',
      category: 'Restrooms & Refreshment',
      distance: '40m walk',
      walkMin: 1,
      rating: 4.7,
      status: 'Open 24/7',
      facilities: ['Clean Restrooms', 'Baby Care Room', 'Cold Water Dispenser'],
      fitWindow: true
    },
    {
      name: 'Cafe Coffee Day Express',
      category: 'Coffee & Snacks',
      distance: '120m walk',
      walkMin: 2,
      rating: 4.3,
      status: 'Open Now',
      facilities: ['Espresso', 'Light Sandwiches', 'Free High-Speed WiFi'],
      fitWindow: true
    },
    {
      name: 'Apollo Pharmacy Express',
      category: 'Health & First-Aid',
      distance: '160m walk',
      walkMin: 2,
      rating: 4.8,
      status: 'Open Now',
      facilities: ['Medicines', 'Electrolytes', 'First Aid'],
      fitWindow: true
    }
  ];

  const handleFinishSession = () => {
    // Update active vehicle SOC in storage
    storage.setVehicleData({ soc: Math.round(currentSoc) });
    navigate('/live-journey');
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Zap className="w-3.5 h-3.5" />}>
                Live High-Power DC Session
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/charging-session</span>
            </div>
            <PageTitle gradient>Charging Session & Smart Amenities</PageTitle>
            <PageSubtitle>
              Real-time charging telemetry paired with synchronized break-time activities along your highway corridor.
            </PageSubtitle>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Charging Optimal
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleFinishSession}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Resume Journey
            </Button>
          </div>
        </div>

        {/* Live Charging Telemetry Station Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Card variant="solid" className="p-6 space-y-6 bg-white border-slate-200">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Connected Station</span>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Zeon Charging Hub – Salem Highway</span>
                    <Badge variant="neutral">Bay #02 (CCS2)</Badge>
                  </h3>
                  <p className="text-xs text-slate-500">NH-544 Salem Bypass, Opp. Saravana Bhavan</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Live Power</span>
                  <div className="text-2xl font-black text-emerald-600 font-mono">{powerKw} kW</div>
                  <span className="text-[10px] text-slate-500 font-semibold">DC Fast Charge</span>
                </div>
              </div>

              {/* Animated Battery Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline text-sm font-bold">
                  <span className="text-slate-600 flex items-center gap-2">
                    <BatteryCharging className="w-5 h-5 text-emerald-600 animate-bounce" />
                    <span>Current Battery: <strong className="text-emerald-700 text-lg font-black">{currentSoc}%</strong></span>
                  </span>
                  <span className="text-slate-500">Target: <strong className="text-slate-900">{targetSoc}%</strong></span>
                </div>

                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-xs"
                    style={{ width: `${(currentSoc / targetSoc) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>Starting: 22%</span>
                  <span>Safety Margin: +58% gained</span>
                  <span>Target Buffer: 80%</span>
                </div>
              </div>

              {/* 4 Real-time Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Time Left</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">{Math.round(timeRemainingMin)} min</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivered</span>
                  <span className="text-base font-extrabold text-blue-700 font-mono">{energyDeliveredKwh} kWh</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <DollarSign className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Cost</span>
                  <span className="text-base font-extrabold text-emerald-700 font-mono">₹{costInr}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <ShieldCheck className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Safety Rate</span>
                  <span className="text-base font-extrabold text-slate-900">₹21/kWh</span>
                </div>
              </div>
            </Card>

            {/* Break-Time Synchronization Section */}
            <Card variant="solid" className="p-5 space-y-4 bg-emerald-50/60 border-emerald-200">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Synchronized Rest Window ({Math.round(timeRemainingMin)} Minutes)</span>
                </h3>
                <Badge variant="success">Optimal Break Window</Badge>
              </div>

              <p className="text-xs text-emerald-800 leading-relaxed">
                Your 24-minute charging stop perfectly matches standard break intervals. We have aligned nearby highway amenities so you return right as your pack hits the 80% target.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-bold text-slate-700 flex flex-col items-center gap-1">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <span>Filter Coffee (10m)</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-bold text-slate-700 flex flex-col items-center gap-1">
                  <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                  <span>Quick Dining (15m)</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-bold text-slate-700 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Restroom (5m)</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-bold text-slate-700 flex flex-col items-center gap-1">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                  <span>Snacks/Store (5m)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Smart Amenities List */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="solid" className="p-5 space-y-4 bg-white border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-emerald-600" />
                  <span>Nearby Smart Amenities</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Within 200m</span>
              </div>

              <div className="space-y-3">
                {amenities.map((item) => (
                  <div
                    key={item.name}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                        <span className="text-[11px] text-slate-500">{item.category}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ★ {item.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <strong className="text-slate-800">{item.distance}</strong> ({item.walkMin} min)
                      </span>
                      <span className="text-emerald-700 font-semibold">• {item.status}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.facilities.map((fac) => (
                        <span key={fac} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white border border-slate-200 text-slate-600">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
