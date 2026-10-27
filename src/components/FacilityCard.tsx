import React from 'react';
import { Coffee, Utensils, Bath, ShoppingBag, Car, Star } from 'lucide-react';
import type { NearbyFacility } from '../services/chargingService';

interface FacilityCardProps {
  facility: NearbyFacility;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility }) => {
  const getCategoryIcon = () => {
    switch (facility.category) {
      case 'cafe':
        return <Coffee size={16} className="text-amber-600" />;
      case 'restaurant':
        return <Utensils size={16} className="text-orange-600" />;
      case 'restroom':
        return <Bath size={16} className="text-blue-600" />;
      case 'store':
        return <ShoppingBag size={16} className="text-purple-600" />;
      case 'parking':
        return <Car size={16} className="text-emerald-600" />;
      default:
        return <Coffee size={16} className="text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
          {getCategoryIcon()}
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
          <Star size={12} className="fill-amber-400" />
          <span>{facility.rating}</span>
        </div>
      </div>

      <h4 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-1">{facility.name}</h4>
      {facility.speciality && (
        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{facility.speciality}</p>
      )}

      <div className="flex items-center justify-between text-xs text-slate-400 font-medium mt-3 pt-2 border-t border-slate-100">
        <span>{facility.distance_m}m walk</span>
        <span className={`font-semibold ${facility.is_open ? 'text-emerald-600' : 'text-slate-400'}`}>
          {facility.is_open ? 'Open Now' : 'Closed'}
        </span>
      </div>
    </div>
  );
};
