import React, { useState } from 'react';
import { X, User, Zap, Save, Check } from 'lucide-react';
import { UserProfile, EVModel } from '../types';
import { saveStoredUser } from '../services/firebase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  evModels: EVModel[];
  onUpdateUser: (u: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  evModels,
  onUpdateUser
}) => {
  const [name, setName] = useState(user.name);
  const [vehicleModelId, setVehicleModelId] = useState(user.vehicleModelId || evModels[0]?.id || '');
  const [preferredConnector, setPreferredConnector] = useState(user.preferredConnector || 'CCS2');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const model = evModels.find(m => m.id === vehicleModelId) || evModels[0];

    const updated: UserProfile = {
      ...user,
      name,
      vehicleModel: model.name,
      vehicleModelId: model.id,
      batteryCapacityKwh: model.usableCapacityKwh,
      preferredConnector
    };

    saveStoredUser(updated);
    onUpdateUser(updated);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 space-y-5 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <img
            src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-500"
          />
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Driver Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary EV Model</label>
            <select
              value={vehicleModelId}
              onChange={(e) => setVehicleModelId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            >
              {evModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand} {m.name} ({m.usableCapacityKwh} kWh)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Preferred Connector Standard</label>
            <select
              value={preferredConnector}
              onChange={(e) => setPreferredConnector(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            >
              <option value="CCS2">CCS2 (Europe, Asia, Standard)</option>
              <option value="NACS">NACS (Tesla Supercharger Standard)</option>
              <option value="Type 2">Type 2 AC</option>
              <option value="CHAdeMO">CHAdeMO</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Profile Saved!' : 'Save EV Profile Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
