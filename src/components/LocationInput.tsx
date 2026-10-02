import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isOrigin?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter city or location',
  isOrigin = true,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative rounded-lg shadow-2xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isOrigin ? (
            <Navigation className="w-4 h-4 text-emerald-600" />
          ) : (
            <MapPin className="w-4 h-4 text-emerald-700" />
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-slate-200 text-sm py-2.5 pl-9 pr-3 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 hover:border-slate-300 transition-all ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default LocationInput;
