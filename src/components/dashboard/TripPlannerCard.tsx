import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Plus, Compass, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const TripPlannerCard: React.FC = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('Chennai');
  const [to, setTo] = useState('Coimbatore');
  const [stop, setStop] = useState('');
  const [showStopInput, setShowStopInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/plan-trip');
  };

  return (
    <Card variant="solid" className="space-y-4 flex flex-col justify-between bg-white border-slate-200 shadow-sm">
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              PLAN TRIP
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold">Smart Optimizer</span>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative space-y-2">
            {/* From Input */}
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex-1">
                <label htmlFor="from-city" className="text-[10px] text-slate-500 font-bold block uppercase">Origin</label>
                <input
                  id="from-city"
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 w-full outline-none"
                  placeholder="Starting Location"
                />
              </div>
            </div>

            {/* Optional Stop Input */}
            {showStopInput ? (
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 animate-in fade-in duration-200">
                <Plus className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="flex-1">
                  <label htmlFor="stop-city" className="text-[10px] text-slate-500 font-bold block uppercase">Optional Stop</label>
                  <input
                    id="stop-city"
                    type="text"
                    value={stop}
                    onChange={(e) => setStop(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-900 w-full outline-none"
                    placeholder="e.g. Salem Charging Station"
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowStopInput(true)}
                className="w-full py-1.5 px-3 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Stopping Area</span>
              </button>
            )}

            {/* To Input */}
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="flex-1">
                <label htmlFor="to-city" className="text-[10px] text-slate-500 font-bold block uppercase">Destination</label>
                <input
                  id="to-city"
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 w-full outline-none"
                  placeholder="Destination City"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Plan Journey
          </Button>
        </form>
      </div>
    </Card>
  );
};
