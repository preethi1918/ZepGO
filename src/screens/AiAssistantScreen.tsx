import React, { useState } from 'react';
import type { VehicleState } from '../types/vehicle';
import { BotIcon, SparklesIcon, NavigationIcon, ZapIcon } from '../components/common/Icons';

export interface AiAssistantScreenProps {
  vehicle?: VehicleState;
  onNavigateToTrips?: () => void;
  onNavigateToChargers?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  cardData?: {
    battery: string;
    distance: string;
    arrivalSoc: string;
    traffic: string;
    weather: string;
    recommendedStop: string;
  };
}

export const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({
  vehicle = {
    modelName: 'Hyundai Ioniq 5',
    brand: 'Hyundai',
    trim: 'Long Range AWD',
    batteryCapacityKwh: 77.4,
    currentSocPercent: 78,
    estimatedRangeKm: 265,
    healthPercent: 99,
    chargingStatus: 'discharging',
    currentChargePowerKw: 0,
    supportedPlugs: ['CCS2'],
    averageConsumptionWhPerKm: 160,
    licensePlate: 'KA-01-EV-2026',
    minArrivalSocBufferPercent: 15,
    preferredNetworks: ['Zeon', 'Tata Power'],
    ecoScore: 94,
    totalKmDriven: 12450,
    totalCo2OffsetKg: 410,
    totalChargingCostSavedRs: 14280,
  },
  onNavigateToTrips,
  onNavigateToChargers,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Can I reach Bangalore from Trichy with my current battery?',
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: 'Yes, you can reach Bangalore comfortably with 18% remaining battery. I recommend a 15-minute fast charge stop at Salem.',
      cardData: {
        battery: `${vehicle.currentSocPercent}% / ${vehicle.estimatedRangeKm} km`,
        distance: '332 km total',
        arrivalSoc: '18%',
        traffic: 'Moderate',
        weather: '24°C, Clear',
        recommendedStop: 'Zeon Charging Hub, Salem (150 kW DC • 15 min • +40%)',
      },
    },
  ]);

  const suggestedQuestions = [
    'Where should I charge?',
    "What's the cheapest charger in Salem?",
    'Can I reach Bangalore directly?',
    'Find Tata Power chargers near me',
  ];

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');

    // Generate smart AI response
    setTimeout(() => {
      let aiText = 'I evaluated your vehicle telemetry, road conditions, and live charger availability across India.';
      let card: ChatMessage['cardData'] | undefined = undefined;

      const lower = textToSend.toLowerCase();

      if (lower.includes('charge') || lower.includes('where') || lower.includes('salem')) {
        aiText = 'I recommend stopping at Zeon Charging Hub, Salem on NH-44. It provides 150 kW DC fast charging speed with 4 available plugs.';
        card = {
          battery: `${vehicle.currentSocPercent}% / ${vehicle.estimatedRangeKm} km`,
          distance: '138 km to stop',
          arrivalSoc: '34% at stop',
          traffic: 'Light Traffic',
          weather: '26°C Ideal',
          recommendedStop: 'Zeon Salem (150 kW DC Fast • 15 min stop)',
        };
      } else if (lower.includes('cheapest') || lower.includes('price')) {
        aiText = 'The cheapest fast charger along your corridor is Jio-BP Pulse at ₹16.00/kWh in Dharmapuri.';
        card = {
          battery: `${vehicle.currentSocPercent}%`,
          distance: '185 km away',
          arrivalSoc: '28%',
          traffic: 'Normal',
          weather: '25°C Clear',
          recommendedStop: 'Jio-BP Pulse, Dharmapuri (60 kW DC • ₹16/kWh)',
        };
      } else if (lower.includes('tata') || lower.includes('power')) {
        aiText = 'The nearest Tata Power EZ Charge hub is located at Hosur Main Road (120 kW DC, ₹18.50/kWh) with 3 active CCS2 plugs.';
        card = {
          battery: `${vehicle.currentSocPercent}%`,
          distance: '290 km away',
          arrivalSoc: '22%',
          traffic: 'Moderate',
          weather: '24°C Clear',
          recommendedStop: 'Tata Power EZ Charge, Hosur (120 kW DC)',
        };
      } else {
        aiText = `Yes! ZepGO AI analyzed your route. Recommended stop is Zeon Salem Hub to maintain a 15% minimum battery safety buffer.`;
        card = {
          battery: `${vehicle.currentSocPercent}% / ${vehicle.estimatedRangeKm} km`,
          distance: '332 km total',
          arrivalSoc: '18%',
          traffic: 'Moderate',
          weather: '24°C Clear',
          recommendedStop: 'Zeon Charging Hub, Salem (15 min • +40%)',
        };
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        cardData: card,
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  return (
    <div className="w-full space-y-6 pb-24 pt-2 px-2 sm:px-4 font-[Inter,sans-serif]">
      {/* 2-Column Responsive Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Conversational Assistant Chat (7 Cols on Desktop) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[650px] lg:h-[720px] overflow-hidden">
          {/* Assistant Header */}
          <div className="p-4 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <BotIcon size={22} />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 tracking-tight">ZepGO Journey AI</h1>
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <SparklesIcon size={12} /> Real-time EV Journey Optimizer
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              🟢 Online & Connected
            </span>
          </div>

          {/* Chat Messages Scroll Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl p-4 space-y-3 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-semibold text-xs rounded-br-xs shadow-xs'
                      : 'bg-slate-50 text-slate-900 border border-slate-200/80 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p className="text-xs font-semibold leading-relaxed">{msg.text}</p>

                  {/* Formatted Information Card */}
                  {msg.cardData && (
                    <div className="bg-white text-slate-900 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5 text-xs shadow-2xs">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium">Battery:</span>
                          <p className="font-bold text-slate-900">{msg.cardData.battery}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Arrival Battery:</span>
                          <p className="font-bold text-emerald-600">{msg.cardData.arrivalSoc}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Distance:</span>
                          <p className="font-bold text-slate-900">{msg.cardData.distance}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Conditions:</span>
                          <p className="font-bold text-slate-900">{msg.cardData.weather}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-slate-400 font-medium">Recommended Stop:</span>
                        <p className="font-bold text-slate-900 mt-0.5">{msg.cardData.recommendedStop}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        {onNavigateToTrips && (
                          <button
                            onClick={onNavigateToTrips}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <NavigationIcon size={12} />
                            <span>View Route</span>
                          </button>
                        )}
                        {onNavigateToChargers && (
                          <button
                            onClick={onNavigateToChargers}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <ZapIcon size={12} />
                            <span>Chargers</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Questions Chips */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold whitespace-nowrap transition-all border border-slate-200/80 cursor-pointer shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask ZepGO AI anything (e.g. Where should I charge on NH-44?)..."
                className="w-full text-xs font-semibold text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: AI Live Telemetry Overview Widget (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Live EV Telemetry</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Connected
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-600">Vehicle</span>
                <span className="font-black text-slate-900">{vehicle.brand} {vehicle.modelName}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-600">Current Battery</span>
                <span className="font-black text-emerald-600">{vehicle.currentSocPercent}% SOC</span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-600">Estimated Range</span>
                <span className="font-black text-blue-600">{vehicle.estimatedRangeKm} km</span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-600">Safety Arrival Buffer</span>
                <span className="font-black text-slate-900">{vehicle.minArrivalSocBufferPercent || 15}% SOC</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              {onNavigateToTrips && (
                <button
                  onClick={onNavigateToTrips}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <NavigationIcon size={16} />
                  <span>View Trip Options</span>
                </button>
              )}

              {onNavigateToChargers && (
                <button
                  onClick={onNavigateToChargers}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ZapIcon size={16} />
                  <span>Find Fast Charger</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
