import React, { useState } from 'react';
import { Sparkles, Battery, BatteryCharging, MapPin, Navigation, Thermometer, ShieldAlert, CheckCircle2, ArrowRight, Gauge, DollarSign, Clock, Zap, Sliders, ChevronDown, RefreshCw, AlertTriangle, Info, Star } from 'lucide-react';
import { EVModel, TripPlanRequest, TripAnalysisResult, ChargingStation } from '../types';
import { RangeAnxietyMeter } from './RangeAnxietyMeter';

interface PreTripPlannerProps {
  evModels: EVModel[];
  onAnalyze: (req: TripPlanRequest) => Promise<TripAnalysisResult>;
  onSelectStation: (station: ChargingStation) => void;
  onNavigateToMap: () => void;
}

export const PreTripPlanner: React.FC<PreTripPlannerProps> = ({
  evModels,
  onAnalyze,
  onSelectStation,
  onNavigateToMap
}) => {
  // Form Inputs
  const [currentBattery, setCurrentBattery] = useState<number>(35);
  const [selectedModelId, setSelectedModelId] = useState<string>(evModels[0]?.id || 'tesla-model-y-lr');
  const [currentLocation, setCurrentLocation] = useState<string>('San Francisco, CA');
  const [destination, setDestination] = useState<string>('Lake Tahoe, CA');
  const [distanceKm, setDistanceKm] = useState<number>(318);
  const [weather, setWeather] = useState<string>('Cold (10°C / 50°F)');
  const [traffic, setTraffic] = useState<string>('Moderate Traffic');
  const [drivingStyle, setDrivingStyle] = useState<string>('Balanced');
  const [acUsage, setAcUsage] = useState<string>('On (Heating)');
  const [cargoWeightKg, setCargoWeightKg] = useState<number>(100);

  // Advanced toggles & analysis state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<TripAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Preset Handlers
  const loadPreset = (type: 'tahoe-low' | 'vegas-med' | 'city-safe') => {
    if (type === 'tahoe-low') {
      setCurrentBattery(32);
      setSelectedModelId('tesla-model-y-lr');
      setCurrentLocation('San Francisco, CA');
      setDestination('Lake Tahoe, CA');
      setDistanceKm(318);
      setWeather('Cold (8°C / 46°F)');
      setTraffic('Moderate Traffic');
      setAcUsage('On (Heating)');
    } else if (type === 'vegas-med') {
      setCurrentBattery(48);
      setSelectedModelId('hyundai-ioniq-5-awd');
      setCurrentLocation('Los Angeles, CA');
      setDestination('Las Vegas, NV');
      setDistanceKm(435);
      setWeather('Hot (36°C / 97°F)');
      setTraffic('Heavy Traffic');
      setAcUsage('On (AC Cooling)');
    } else {
      setCurrentBattery(85);
      setSelectedModelId('tata-nexon-ev-max');
      setCurrentLocation('Downtown Center');
      setDestination('Suburban Mall & Park');
      setDistanceKm(65);
      setWeather('Mild (22°C / 72°F)');
      setTraffic('Light Traffic');
      setAcUsage('Off');
    }
  };

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const selectedModel = evModels.find(m => m.id === selectedModelId);
      const res = await onAnalyze({
        currentBattery,
        vehicleModelId: selectedModelId,
        customVehicleName: selectedModel?.name,
        currentLocation,
        destination,
        distanceKm,
        weather,
        traffic,
        drivingStyle,
        acUsage,
        cargoWeightKg
      });
      setAnalysisResult(res);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || 'Failed to complete trip analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Pre-Trip Charging Prediction Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Predict & Prevent Range Anxiety <span className="text-sky-400">Before</span> You Drive
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            ZepGo continuously simulates elevation, cold weather degradation, traffic queues, and charger availability to determine if you need to charge <strong className="text-white">before departure</strong> or en route.
          </p>

          {/* Quick Preset Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Test Scenarios:</span>
            <button
              onClick={() => loadPreset('tahoe-low')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/10"
            >
              🏔️ SF to Tahoe (32% Battery - Needs Charge)
            </button>
            <button
              onClick={() => loadPreset('vegas-med')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/10"
            >
              🌵 LA to Vegas (48% Battery - Hot Climate)
            </button>
            <button
              onClick={() => loadPreset('city-safe')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/10"
            >
              🏙️ City Drive (85% Battery - Safe)
            </button>
          </div>
        </div>
      </div>

      {/* Main Input Form & Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Trip Configuration Input Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5 text-sky-600" />
                Trip Parameters
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Step 1 & 2</span>
            </div>

            <form onSubmit={handleRunAnalysis} className="mt-5 space-y-5">
              {/* Vehicle Model Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Vehicle Model
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                >
                  {evModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brand} {m.name} ({m.usableCapacityKwh} kWh usable)
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Battery % Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Battery className="w-4 h-4 text-sky-600" />
                    Current Battery Level
                  </label>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    currentBattery > 60 ? 'bg-emerald-100 text-emerald-800' :
                    currentBattery > 35 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {currentBattery}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={currentBattery}
                  onChange={(e) => setCurrentBattery(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5% (Critical)</span>
                  <span>50%</span>
                  <span>100% (Full)</span>
                </div>
              </div>

              {/* Origin & Destination Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Current Location
                  </label>
                  <input
                    type="text"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-sky-600" />
                    Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="e.g. Lake Tahoe, CA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Distance (km)
                  </label>
                  <input
                    type="number"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Advanced Environment Conditions Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 hover:text-sky-600 py-2 border-t border-slate-100"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Environmental & Driving Factors
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>

                {showAdvanced && (
                  <div className="mt-3 space-y-3 pt-3 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Weather & Temp</label>
                      <select
                        value={weather}
                        onChange={(e) => setWeather(e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Cold (10°C / 50°F)">Cold (10°C) - Range Loss ~20%</option>
                        <option value="Freezing (0°C / 32°F)">Freezing (0°C) - Range Loss ~30%</option>
                        <option value="Mild (20°C / 68°F)">Mild (20°C) - Optimal Range</option>
                        <option value="Hot (35°C / 95°F)">Hot (35°C) - AC Power Loss ~10%</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Traffic Conditions</label>
                      <select
                        value={traffic}
                        onChange={(e) => setTraffic(e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Light Traffic">Light Traffic</option>
                        <option value="Moderate Traffic">Moderate Traffic</option>
                        <option value="Heavy Stop-and-Go">Heavy Stop-and-Go</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Driving Style & AC</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={drivingStyle}
                          onChange={(e) => setDrivingStyle(e.target.value)}
                          className="p-2 text-xs border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="Eco">Eco Mode</option>
                          <option value="Balanced">Balanced</option>
                          <option value="Sport Fast">Sport / High Speed</option>
                        </select>

                        <select
                          value={acUsage}
                          onChange={(e) => setAcUsage(e.target.value)}
                          className="p-2 text-xs border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="On (Heating)">Heating On</option>
                          <option value="On (AC Cooling)">AC Cooling On</option>
                          <option value="Off">Cabin Climate Off</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI Analyzing Route & Weather...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sky-200" />
                    <span>Analyze Pre-Trip Battery Requirements</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: AI Analysis Results & Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!analysisResult && !isAnalyzing && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Ready for AI Analysis</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                  Click "Analyze Pre-Trip Battery Requirements" to generate real-time AI charging predictions, battery degradation factors, and optimal station scoring.
                </p>
              </div>
              <button
                onClick={() => handleRunAnalysis()}
                className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-sm hover:bg-sky-700 transition-all inline-flex items-center gap-2"
              >
                Run Quick Demo Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"></div>
                <Zap className="w-6 h-6 text-sky-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">ZepGo AI Engine Working</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Evaluating elevation profiles, cold weather degradation, live traffic, and ranking charger waiting times...
                </p>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-6 animate-fade-in">
              {/* Range Anxiety Meter Banner */}
              <RangeAnxietyMeter
                score={analysisResult.rangeConfidenceScore}
                currentBattery={analysisResult.currentBatteryPercent}
                canReachDestination={analysisResult.canReachDestination}
                preTripChargingRequired={analysisResult.preTripChargingRequired}
                deficitKwh={analysisResult.deficitKwh}
              />

              {/* Status Alert Box */}
              {analysisResult.preTripChargingRequired ? (
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-900">
                        Pre-Trip Warning
                      </span>
                      <h3 className="font-extrabold text-lg text-rose-950 mt-0.5">
                        ⚠️ Battery Insufficient to Safely Reach Destination
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-rose-800 leading-relaxed">
                    Based on your trip parameters ({analysisResult.distanceKm} km trip in {weather}), your battery would drop to <strong className="font-extrabold text-rose-950">{analysisResult.estimatedBatteryAtDestinationPercent}%</strong>.
                    You need approx <strong>{analysisResult.deficitKwh} kWh</strong> additional energy buffer.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-rose-200/80">
                    <div className="text-xs font-semibold text-rose-900">
                      Recommended Action: Charge before starting or stop en-route at {analysisResult.recommendedStation.stationName}.
                    </div>
                    <button
                      onClick={() => {
                        onSelectStation(analysisResult.recommendedStation);
                        onNavigateToMap();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Charge Here Before Starting</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900">
                        Safe Journey
                      </span>
                      <h3 className="font-extrabold text-lg text-emerald-950 mt-0.5">
                        ✅ Safe to Start Journey Directly
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Predicted destination battery: <strong className="font-bold text-emerald-950">{analysisResult.estimatedBatteryAtDestinationPercent}%</strong>. Confidence Score: {analysisResult.rangeConfidenceScore}/100.
                  </p>
                </div>
              )}

              {/* Top Recommended Charging Station Card */}
              <div className="bg-white rounded-2xl border-2 border-sky-500/80 p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-sky-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  #1 AI Recommendation
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-xl">
                        {analysisResult.recommendedStation.stationName}
                      </h3>
                      <span className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {analysisResult.recommendedStation.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {analysisResult.recommendedStation.locationName}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-sky-600">
                      {analysisResult.recommendedStation.aiScore}<span className="text-xs font-semibold text-slate-400">/100</span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      AI Match Score
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Max Speed</span>
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-sky-600" />
                      {analysisResult.recommendedStation.maxSpeedKw} kW Fast
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Waiting Time</span>
                    <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {analysisResult.recommendedStation.waitingTimeMins === 0 ? 'Zero Waiting' : `${analysisResult.recommendedStation.waitingTimeMins} min wait`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Charging Cost</span>
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                      ${analysisResult.recommendedStation.pricePerkWh}/kWh
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Available Ports</span>
                    <span className="text-xs font-extrabold text-sky-700 flex items-center gap-1 mt-0.5">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      {analysisResult.recommendedStation.availablePorts}/{analysisResult.recommendedStation.totalPorts} Open
                    </span>
                  </div>
                </div>

                {/* AI Score Breakdown & Reasons */}
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    AI Decision Reasons
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {analysisResult.recommendedStation.reasons?.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-sky-50/50 text-slate-800 border border-sky-100/60 font-medium">
                        <span className="text-sky-600 font-bold">✓</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Scoring Weight Explanation Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    Score Algorithm Weights:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-100">
                      <div className="font-bold text-sky-800">30%</div>
                      <div className="text-slate-500 truncate">Safety</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                      <div className="font-bold text-emerald-800">20%</div>
                      <div className="text-slate-500 truncate">Wait Time</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
                      <div className="font-bold text-indigo-800">15%</div>
                      <div className="text-slate-500 truncate">Cost</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="font-bold text-purple-800">15%</div>
                      <div className="text-slate-500 truncate">Distance</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="font-bold text-amber-800">10%</div>
                      <div className="text-slate-500 truncate">Connectors</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                      <div className="font-bold text-slate-700">5%</div>
                      <div className="text-slate-500 truncate">Rating</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                      <div className="font-bold text-slate-700">5%</div>
                      <div className="text-slate-500 truncate">Traffic</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gemini AI Personalized Trip Narrative */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Route & Efficiency Insights</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line">
                  {analysisResult.aiAnalysisText}
                </div>
              </div>

              {/* Route Itinerary Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-sky-600" />
                  Step-by-Step Battery Itinerary
                </h3>
                <div className="relative pl-6 border-l-2 border-sky-200 space-y-6">
                  {analysisResult.routeSegments.map((segment, idx) => (
                    <div key={idx} className="relative group">
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white ring-2 ${
                        segment.isChargingStop ? 'bg-amber-500 ring-amber-300' : 'bg-sky-600 ring-sky-300'
                      }`}></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {segment.name}
                          </h4>
                          <span className="text-xs text-slate-500">
                            {segment.distanceKm === 0 ? 'Departure Point' : `${segment.distanceKm} km along route`}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          segment.batteryPercent > 50 ? 'bg-emerald-100 text-emerald-800' :
                          segment.batteryPercent > 20 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {segment.batteryPercent}% Battery
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
