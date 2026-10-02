import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, MapPin, Navigation, ArrowRight, Star } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';

interface SmartStop {
  id: string;
  name: string;
  category: string;
  detourKm: number;
  openStatus: string;
  estimatedWaitTime: string;
  rating: number;
  reason: string;
  amenities: string[];
  chargingAttached: boolean;
  chargerPowerKw?: number;
  location: string;
  isRecommended: boolean;
}

export const SmartStopsPage: React.FC = () => {
  const navigate = useNavigate();

  const [stops] = useState<SmartStop[]>([
    {
      id: 'stop-1',
      name: 'Green Leaf Gourmet Café & EV Lounge',
      category: 'Café & Dining',
      detourKm: 1.2,
      openStatus: 'Open Now (6 AM - 11 PM)',
      estimatedWaitTime: '0 min (Table Available)',
      rating: 4.8,
      reason: 'Optimal 25-minute stop while your EV charges at Tata Power 250kW.',
      amenities: ['Café', 'Restroom', 'Fresh Food', 'Fast Wi-Fi', 'Air Conditioned'],
      chargingAttached: true,
      chargerPowerKw: 250,
      location: 'KM 148, NH-44 Express Highway, Salem Bypass',
      isRecommended: true
    },
    {
      id: 'stop-2',
      name: 'Highway Plaza Rest Hub & Diner',
      category: 'Rest Stop & Food Court',
      detourKm: 0.5,
      openStatus: 'Open 24/7',
      estimatedWaitTime: '5 min',
      rating: 4.5,
      reason: 'Quick restroom stop with high-speed 150kW CCS2 charger.',
      amenities: ['Restroom', 'Food Court', 'ATM', 'Convenience Store'],
      chargingAttached: true,
      chargerPowerKw: 150,
      location: 'NH-44 KM 192, Perundurai',
      isRecommended: false
    },
    {
      id: 'stop-3',
      name: 'Banyan Tree Eco Diner',
      category: 'Organic Restaurant',
      detourKm: 2.4,
      openStatus: 'Open Now',
      estimatedWaitTime: '10 min',
      rating: 4.6,
      reason: 'Peaceful dining area with shade & AC EV waiting lounge.',
      amenities: ['Café', 'Garden Lounge', 'Restroom', 'Kids Area'],
      chargingAttached: false,
      location: 'Avinashi Bypass Road',
      isRecommended: false
    }
  ]);

  const recommendedStop = stops.find((s) => s.isRecommended) || stops[0];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success" icon={<Coffee className="w-3.5 h-3.5" />}>
                Smart Stop Intelligence
              </Badge>
              <span className="text-xs text-slate-400 font-mono">/smart-stops</span>
            </div>
            <PageTitle gradient>Contextual Journey Stops</PageTitle>
            <PageSubtitle>
              ZepGO only recommends rest stops when actually useful during charging or break periods.
            </PageSubtitle>
          </div>

          <Badge variant="neutral">Data Lineage: Live Route Matched</Badge>
        </div>

        {/* PRIMARY RECOMMENDED STOP BANNER */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-slate-50 border border-emerald-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-emerald-100 rounded-xl border border-emerald-200 text-emerald-700">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                  RECOMMENDED SMART STOP
                </span>
                <h2 className="text-xl font-black text-slate-900">{recommendedStop.name}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success">{recommendedStop.detourKm} km from route</Badge>
              <Badge variant="info">Attached {recommendedStop.chargerPowerKw}kW Charger</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Why Recommended?</span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                "{recommendedStop.reason}"
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Status & Amenities</span>
              <p className="text-xs text-emerald-700 font-semibold">{recommendedStop.openStatus}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recommendedStop.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-medium text-slate-700 shadow-xs"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-end items-end gap-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/live-journey')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Navigate to Stop
              </Button>
            </div>
          </div>
        </div>

        {/* ALL AVAILABLE SMART STOPS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>All Useful En-Route Rest Areas ({stops.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stops.map((stop) => (
              <Card key={stop.id} variant="solid" className="space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{stop.category}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{stop.rating}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{stop.name}</h4>
                  <p className="text-[11px] text-slate-500">{stop.location}</p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Detour:</span>
                      <span className="font-bold text-slate-900">{stop.detourKm} km</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Wait Time:</span>
                      <span className="font-bold text-emerald-700">{stop.estimatedWaitTime}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 italic">"{stop.reason}"</p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/live-journey')}
                  leftIcon={<Navigation className="w-3.5 h-3.5" />}
                >
                  Set Stop Target
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
