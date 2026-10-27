import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Car, BatteryCharging, Bell, LogOut, Shield, Save, CheckCircle2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Alex EV Explorer');
  const [userEmail, setUserEmail] = useState('driver@zepgo.ev');
  const [minArrivalBattery, setMinArrivalBattery] = useState('15');
  const [preferredNetworks, setPreferredNetworks] = useState('Zeon, Tata Power, Relux');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Settings saved locally for Phase 1 demo.');
    setTimeout(() => setNotice(null), 3500);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profile & Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage user preferences, default EV configurations, charging network priorities, and notifications.
        </p>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Information */}
        <Card
          title="User Information"
          subtitle="Account identity & profile credentials"
          action={
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> EV Driver Account
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              icon={<User className="w-4 h-4 text-emerald-600" />}
            />

            <Input
              label="Email Address"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
        </Card>

        {/* Vehicle Information Summary */}
        <Card title="Vehicle Information" subtitle="Primary registered EV specs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Tata Nexon EV Max</h4>
                <p className="text-xs text-slate-500">40.5 kWh Capacity • 140 Wh/km Efficiency</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/vehicle')}
            >
              Edit Vehicle Profile
            </Button>
          </div>
        </Card>

        {/* Preferred Charging Settings */}
        <Card title="Preferred Charging Settings" subtitle="Routing optimization targets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Min Arrival Battery Buffer (%)"
              type="number"
              min="5"
              max="40"
              value={minArrivalBattery}
              onChange={(e) => setMinArrivalBattery(e.target.value)}
              icon={<BatteryCharging className="w-4 h-4 text-emerald-600" />}
              helperText="Safety margin threshold before suggesting a stop."
            />

            <Input
              label="Preferred Charging Networks"
              type="text"
              value={preferredNetworks}
              onChange={(e) => setPreferredNetworks(e.target.value)}
              helperText="Comma separated list of preferred CPOs."
            />
          </div>
        </Card>

        {/* Notification Settings */}
        <Card title="Notification Settings" subtitle="Alerts and live trip updates">
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300"
              />
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <Bell className="w-4 h-4 text-slate-500" />
                <span>Receive range warning alerts & charger availability updates</span>
              </div>
            </label>
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Logout
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
