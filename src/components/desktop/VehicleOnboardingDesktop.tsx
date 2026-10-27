import React, { useState } from 'react';
import { Zap, Check, ShieldCheck, Car, Battery, Gauge } from 'lucide-react';
import type { VehicleState } from '../../types/vehicle';

interface VehicleOnboardingDesktopProps {
  onCompleteOnboarding: (vehicle: VehicleState) => void;
}

export const VehicleOnboardingDesktop: React.FC<VehicleOnboardingDesktopProps> = ({
  onCompleteOnboarding,
}) => {
  // Vehicle Setup State
  const [brand, setBrand] = useState('Tata');
  const [modelName, setModelName] = useState('Tata Nexon EV Max');
  const [trim, setTrim] = useState('Nexon EV Max 40.5 kWh');
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState(40.5);
  const [currentSocPercent, setCurrentSocPercent] = useState(34);

  // Status & Preferences
  const [chargingPreference, setChargingPreference] = useState<'Fast' | 'Normal' | 'Any'>('Fast');
  const [preferredChargerType, setPreferredChargerType] = useState<'AC' | 'DC' | 'Both'>('DC');
  const [maxChargeSpeedKw, setMaxChargeSpeedKw] = useState(150);
  const [licensePlate, setLicensePlate] = useState('KA-01-EV-2026');

  // Driving Profile Inputs
  const [drivingStyle, setDrivingStyle] = useState<'Eco' | 'Normal' | 'Performance'>('Normal');
  const [usagePattern, setUsagePattern] = useState<'City' | 'Highway' | 'Mixed'>('Mixed');
  const [acUsage, setAcUsage] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Known vehicle presets database for auto-fill
  const vehiclePresets: Record<string, { brand: string; trim: string; kwh: number; maxSpeed: number }> = {
    'Tata Nexon EV Max': { brand: 'Tata', trim: 'Nexon EV Max 40.5 kWh', kwh: 40.5, maxSpeed: 150 },
    'Tata Punch.ev': { brand: 'Tata', trim: 'Punch.ev LR 35 kWh', kwh: 35.0, maxSpeed: 120 },
    'MG ZS EV': { brand: 'MG', trim: 'ZS EV Exclusive 50.3 kWh', kwh: 50.3, maxSpeed: 150 },
    'Mahindra XUV400': { brand: 'Mahindra', trim: 'XUV400 EL Pro 39.4 kWh', kwh: 39.4, maxSpeed: 120 },
    'Hyundai Ioniq 5': { brand: 'Hyundai', trim: 'Ioniq 5 RWD 72.6 kWh', kwh: 72.6, maxSpeed: 240 },
    'BYD Atto 3': { brand: 'BYD', trim: 'Atto 3 Superior 60.48 kWh', kwh: 60.48, maxSpeed: 150 },
  };

  const handleModelChange = (selectedModel: string) => {
    setModelName(selectedModel);
    const preset = vehiclePresets[selectedModel];
    if (preset) {
      setBrand(preset.brand);
      setTrim(preset.trim);
      setBatteryCapacityKwh(preset.kwh);
      setMaxChargeSpeedKw(preset.maxSpeed);
    }
  };

  // Calculated Real-World Range
  const estimatedRangeKm = Math.round((currentSocPercent / 100) * (batteryCapacityKwh * 8.2));

  const handleSaveAndContinue = () => {
    const newVehicle: VehicleState = {
      modelName,
      brand,
      trim,
      batteryCapacityKwh,
      currentSocPercent,
      estimatedRangeKm,
      healthPercent: 98,
      chargingStatus: 'discharging',
      currentChargePowerKw: 0,
      supportedPlugs: preferredChargerType === 'DC' ? ['CCS2'] : ['CCS2', 'Type 2'],
      averageConsumptionWhPerKm: 135,
      licensePlate: licensePlate || 'KA-01-EV-2026',
      minArrivalSocBufferPercent: 15,
      preferredNetworks: ['Zeon', 'Tata Power', 'Jio-bp'],
      ecoScore: 92,
      totalKmDriven: 14200,
      totalCo2OffsetKg: 1850,
      totalChargingCostSavedRs: 42000,
    };

    onCompleteOnboarding(newVehicle);
  };

  return (
    <div className="min-h-screen bg-[#090D0B] text-white p-6 lg:p-12 flex justify-center font-[Inter,sans-serif] select-none">
      <div className="w-full max-w-5xl space-y-8 animate-fadeIn">
        {/* TOP TITLE HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#22C55E] tracking-wider bg-[#22C55E]/15 border border-[#22C55E]/30 px-2.5 py-1 rounded-full">
                Step 2 of 2 • Vehicle Setup
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mt-2">Let's set up your EV</h1>
            <p className="text-xs text-slate-300 mt-1">
              Your vehicle details help ZepGO calculate real-world range, charging needs, and smarter rest stops.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shadow-lg shadow-[#22C55E]/20">
            <Zap size={24} className="fill-[#0B0F0D]" />
          </div>
        </div>

        {/* WHY ZEPGO NEEDS VEHICLE DATA BANNER */}
        <div className="bg-gradient-to-r from-[#142318] via-[#121A15] to-[#142318] border border-[#22C55E]/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-[#22C55E] text-[#0B0F0D] flex items-center justify-center font-black shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Why ZepGO Needs Your EV Specification:</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Your vehicle details help us understand how far you can travel, when you need to charge, how long charging may take, and which Smart Stop fits your journey."
            </p>
          </div>
        </div>

        {/* MAIN FORM + SUMMARY DUAL COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS — VEHICLE FORM INPUTS */}
          <div className="lg:col-span-2 space-y-6">
            {/* SECTION 1: YOUR VEHICLE */}
            <div className="bg-[#141A17] rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Car size={18} className="text-[#22C55E]" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">SECTION 1: YOUR VEHICLE</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Brand Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300 block">Vehicle Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#0B0F0D] border border-slate-800 text-white text-xs font-bold rounded-xl px-3.5 py-3 focus:outline-none focus:border-[#22C55E] cursor-pointer"
                  >
                    <option value="Tata">Tata Motors</option>
                    <option value="MG">MG Motor India</option>
                    <option value="Mahindra">Mahindra Electric</option>
                    <option value="Hyundai">Hyundai India</option>
                    <option value="BYD">BYD India</option>
                    <option value="Other">Other EV Brand</option>
                  </select>
                </div>

                {/* Model Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300 block">Vehicle Model</label>
                  <select
                    value={modelName}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full bg-[#0B0F0D] border border-slate-800 text-white text-xs font-bold rounded-xl px-3.5 py-3 focus:outline-none focus:border-[#22C55E] cursor-pointer"
                  >
                    {Object.keys(vehiclePresets).map((modelKey) => (
                      <option key={modelKey} value={modelKey}>
                        {modelKey}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Variant */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300 block">Vehicle Variant</label>
                  <input
                    type="text"
                    value={trim}
                    onChange={(e) => setTrim(e.target.value)}
                    placeholder="Nexon EV Max 40.5 kWh"
                    className="w-full bg-[#0B0F0D] border border-slate-800 text-white text-xs font-bold rounded-xl px-3.5 py-3 focus:outline-none focus:border-[#22C55E]"
                  />
                </div>

                {/* Battery Capacity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300 block">Battery Capacity (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={batteryCapacityKwh}
                    onChange={(e) => setBatteryCapacityKwh(Number(e.target.value))}
                    className="w-full bg-[#0B0F0D] border border-slate-800 text-[#22C55E] text-xs font-black rounded-xl px-3.5 py-3 focus:outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: CURRENT VEHICLE STATUS */}
            <div className="bg-[#141A17] rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Battery size={18} className="text-[#22C55E]" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  SECTION 2: CURRENT VEHICLE STATUS
                </h3>
              </div>

              {/* Current Battery % Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-slate-300">Current Battery State of Charge (SOC %)</span>
                  <span className="text-base font-black text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-3 py-0.5 rounded-lg">
                    {currentSocPercent}% SOC
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={currentSocPercent}
                  onChange={(e) => setCurrentSocPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Charging Preference */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300 block">Charging Preference</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#0B0F0D] p-1 rounded-xl border border-slate-800 text-xs font-bold">
                    {(['Fast', 'Normal', 'Any'] as const).map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setChargingPreference(pref)}
                        className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                          chargingPreference === pref
                            ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Charger Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300 block">Preferred Charger Type</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#0B0F0D] p-1 rounded-xl border border-slate-800 text-xs font-bold">
                    {(['AC', 'DC', 'Both'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPreferredChargerType(type)}
                        className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                          preferredChargerType === type
                            ? 'bg-[#22C55E] text-[#0B0F0D] font-extrabold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Max Charging Speed */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300 block">Maximum Charging Speed (kW)</label>
                  <input
                    type="number"
                    value={maxChargeSpeedKw}
                    onChange={(e) => setMaxChargeSpeedKw(Number(e.target.value))}
                    placeholder="150"
                    className="w-full bg-[#0B0F0D] border border-slate-800 text-white text-xs font-bold rounded-xl px-3.5 py-3 focus:outline-none focus:border-[#22C55E]"
                  />
                </div>

                {/* Optional Registration Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300 block">
                    Registration Number <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="KA-01-EV-2026"
                    className="w-full bg-[#0B0F0D] border border-slate-800 text-white text-xs font-bold rounded-xl px-3.5 py-3 focus:outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: RANGE PROFILE */}
            <div className="bg-[#141A17] rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Gauge size={18} className="text-[#22C55E]" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    SECTION 3: RANGE PROFILE
                  </h3>
                  <p className="text-[11px] text-slate-400">Help us estimate your real-world range</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs font-bold">
                {/* Driving Style */}
                <div className="space-y-2">
                  <label className="text-slate-300 block text-[11px]">Typical driving style:</label>
                  {(['Eco', 'Normal', 'Performance'] as const).map((style) => (
                    <label
                      key={style}
                      onClick={() => setDrivingStyle(style)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        drivingStyle === style
                          ? 'bg-[#1E2923] border-[#22C55E] text-white font-extrabold'
                          : 'bg-[#0B0F0D] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        drivingStyle === style ? 'border-[#22C55E] bg-[#22C55E]' : 'border-slate-600'
                      }`} />
                      <span>{style}</span>
                    </label>
                  ))}
                </div>

                {/* Usage Pattern */}
                <div className="space-y-2">
                  <label className="text-slate-300 block text-[11px]">Typical usage:</label>
                  {(['City', 'Highway', 'Mixed'] as const).map((pattern) => (
                    <label
                      key={pattern}
                      onClick={() => setUsagePattern(pattern)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        usagePattern === pattern
                          ? 'bg-[#1E2923] border-[#22C55E] text-white font-extrabold'
                          : 'bg-[#0B0F0D] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        usagePattern === pattern ? 'border-[#22C55E] bg-[#22C55E]' : 'border-slate-600'
                      }`} />
                      <span>{pattern}</span>
                    </label>
                  ))}
                </div>

                {/* AC Usage */}
                <div className="space-y-2">
                  <label className="text-slate-300 block text-[11px]">AC usage:</label>
                  {(['Low', 'Medium', 'High'] as const).map((ac) => (
                    <label
                      key={ac}
                      onClick={() => setAcUsage(ac)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        acUsage === ac
                          ? 'bg-[#1E2923] border-[#22C55E] text-white font-extrabold'
                          : 'bg-[#0B0F0D] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        acUsage === ac ? 'border-[#22C55E] bg-[#22C55E]' : 'border-slate-600'
                      }`} />
                      <span>{ac}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN — VEHICLE SUMMARY CARD & CTA */}
          <div className="space-y-6">
            <div className="bg-[#141A17] rounded-3xl p-6 border border-[#22C55E]/40 space-y-5 shadow-2xl sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase text-[#22C55E] tracking-wider">YOUR EV SUMMARY</span>
                <span className="text-[10px] font-extrabold bg-[#22C55E]/15 text-[#22C55E] px-2.5 py-0.5 rounded-full border border-[#22C55E]/30">
                  Ready
                </span>
              </div>

              {/* EV Vehicle Hero Graphic Card */}
              <div className="bg-[#0B0F0D] rounded-2xl p-4 border border-slate-800 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center font-black mx-auto border border-[#22C55E]/30">
                  <Car size={32} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{modelName}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{trim}</p>
                </div>
              </div>

              {/* Telemetry Summary Rows */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-[#0B0F0D] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-bold">Battery Capacity:</span>
                  <span className="font-extrabold text-white">{batteryCapacityKwh} kWh</span>
                </div>

                <div className="flex justify-between bg-[#0B0F0D] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-bold">Current Battery:</span>
                  <span className="font-black text-[#22C55E]">{currentSocPercent}% SOC</span>
                </div>

                <div className="flex justify-between bg-[#0B0F0D] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-bold">Estimated Range:</span>
                  <span className="font-black text-white">{estimatedRangeKm} km</span>
                </div>

                <div className="flex justify-between bg-[#0B0F0D] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-bold">Charging Spec:</span>
                  <span className="font-extrabold text-[#22C55E]">{preferredChargerType} Fast Charging</span>
                </div>

                <div className="flex justify-between bg-[#0B0F0D] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-bold">Driving Profile:</span>
                  <span className="font-extrabold text-white">{drivingStyle} • {usagePattern}</span>
                </div>
              </div>

              {/* SAVE & CONTINUE CTA */}
              <button
                type="button"
                onClick={handleSaveAndContinue}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-extrabold py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-[0.98]"
              >
                <Check size={18} className="stroke-[3]" />
                <span>SAVE & CONTINUE TO ZepGO</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
