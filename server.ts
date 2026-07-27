import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI SDK lazily or server-side safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Pre-populated EV Models catalog
const EV_MODELS = [
  {
    id: 'tesla-model-y-lr',
    name: 'Tesla Model Y Long Range',
    brand: 'Tesla',
    batteryCapacityKwh: 75,
    usableCapacityKwh: 72.7,
    avgConsumptionKwhPer100Km: 16.8, // ~270 Wh/mi
    connectorTypes: ['NACS', 'CCS2 (Adapter)'],
    maxChargingPowerKw: 250,
    rangeKm: 531,
  },
  {
    id: 'tesla-model-3-sr',
    name: 'Tesla Model 3 Standard Range',
    brand: 'Tesla',
    batteryCapacityKwh: 60,
    usableCapacityKwh: 57.5,
    avgConsumptionKwhPer100Km: 14.4,
    connectorTypes: ['NACS', 'CCS2 (Adapter)'],
    maxChargingPowerKw: 170,
    rangeKm: 438,
  },
  {
    id: 'hyundai-ioniq-5-awd',
    name: 'Hyundai Ioniq 5 Long Range AWD',
    brand: 'Hyundai',
    batteryCapacityKwh: 77.4,
    usableCapacityKwh: 74.0,
    avgConsumptionKwhPer100Km: 18.0,
    connectorTypes: ['CCS2', 'Type 2'],
    maxChargingPowerKw: 235,
    rangeKm: 488,
  },
  {
    id: 'tata-nexon-ev-max',
    name: 'Tata Nexon EV Max',
    brand: 'Tata',
    batteryCapacityKwh: 40.5,
    usableCapacityKwh: 38.5,
    avgConsumptionKwhPer100Km: 13.5,
    connectorTypes: ['CCS2', 'Type 2'],
    maxChargingPowerKw: 50,
    rangeKm: 312,
  },
  {
    id: 'mg-zs-ev',
    name: 'MG ZS EV Long Range',
    brand: 'MG',
    batteryCapacityKwh: 50.3,
    usableCapacityKwh: 48.0,
    avgConsumptionKwhPer100Km: 15.6,
    connectorTypes: ['CCS2', 'Type 2'],
    maxChargingPowerKw: 75,
    rangeKm: 320,
  },
  {
    id: 'porsche-taycan-4s',
    name: 'Porsche Taycan 4S Performance Plus',
    brand: 'Porsche',
    batteryCapacityKwh: 93.4,
    usableCapacityKwh: 83.7,
    avgConsumptionKwhPer100Km: 21.0,
    connectorTypes: ['CCS2', 'Type 2'],
    maxChargingPowerKw: 270,
    rangeKm: 463,
  },
  {
    id: 'bmw-i4-edrive40',
    name: 'BMW i4 eDrive40',
    brand: 'BMW',
    batteryCapacityKwh: 83.9,
    usableCapacityKwh: 80.7,
    avgConsumptionKwhPer100Km: 16.1,
    connectorTypes: ['CCS2', 'Type 2'],
    maxChargingPowerKw: 205,
    rangeKm: 590,
  },
  {
    id: 'chevy-bolt-euv',
    name: 'Chevrolet Bolt EUV',
    brand: 'Chevrolet',
    batteryCapacityKwh: 65,
    usableCapacityKwh: 63.0,
    avgConsumptionKwhPer100Km: 16.5,
    connectorTypes: ['CCS2', 'Type 2'],
    maxChargingPowerKw: 55,
    rangeKm: 397,
  }
];

// Pre-populated EV Charging Stations network
const CHARGING_STATIONS = [
  {
    id: 'sta-1',
    stationName: 'GreenCharge HyperHub - Vallejo',
    locationName: 'Vallejo Plaza, Hwy 80',
    latitude: 38.1041,
    longitude: -122.2566,
    availablePorts: 6,
    totalPorts: 12,
    waitingTimeMins: 0,
    chargerTypes: ['CCS2', 'NACS', 'Type 2'],
    maxSpeedKw: 250,
    pricePerkWh: 0.38,
    rating: 4.9,
    fastCharging: true,
    amenities: ['24/7 Restroom', 'Coffee Lounge', 'Free WiFi', 'Solar Canopy'],
    distanceKmFromSF: 45,
    elevationMeters: 12
  },
  {
    id: 'sta-2',
    stationName: 'ElectroPulse SuperStation - Sacramento Central',
    locationName: 'Sacramento Commons, I-80',
    latitude: 38.5816,
    longitude: -121.4944,
    availablePorts: 3,
    totalPorts: 16,
    waitingTimeMins: 5,
    chargerTypes: ['CCS2', 'NACS', 'CHAdeMO'],
    maxSpeedKw: 180,
    pricePerkWh: 0.34,
    rating: 4.7,
    fastCharging: true,
    amenities: ['Shopping Mall', 'Restaurants', 'Restroom'],
    distanceKmFromSF: 140,
    elevationMeters: 9
  },
  {
    id: 'sta-3',
    stationName: 'Sierra EcoCharge Express - Auburn Foothills',
    locationName: 'Auburn Gateway Exit 119',
    latitude: 38.8966,
    longitude: -121.0769,
    availablePorts: 1,
    totalPorts: 8,
    waitingTimeMins: 12,
    chargerTypes: ['CCS2', 'NACS'],
    maxSpeedKw: 150,
    pricePerkWh: 0.42,
    rating: 4.8,
    fastCharging: true,
    amenities: ['Diner', 'Restroom', 'Scenic View Point'],
    distanceKmFromSF: 195,
    elevationMeters: 374
  },
  {
    id: 'sta-4',
    stationName: 'Truckee High-Power Oasis',
    locationName: 'Truckee River Center, I-80',
    latitude: 39.328,
    longitude: -120.1833,
    availablePorts: 8,
    totalPorts: 10,
    waitingTimeMins: 0,
    chargerTypes: ['CCS2', 'NACS', 'Type 2'],
    maxSpeedKw: 350,
    pricePerkWh: 0.45,
    rating: 4.9,
    fastCharging: true,
    amenities: ['Heated Lounge', 'Hot Drinks', 'Tire Pressure Station'],
    distanceKmFromSF: 290,
    elevationMeters: 1773
  },
  {
    id: 'sta-5',
    stationName: 'VoltWay CityCharge - San Francisco Downtown',
    locationName: 'Market St Garage',
    latitude: 37.7749,
    longitude: -122.4194,
    availablePorts: 4,
    totalPorts: 6,
    waitingTimeMins: 0,
    chargerTypes: ['CCS2', 'NACS', 'Type 2'],
    maxSpeedKw: 120,
    pricePerkWh: 0.36,
    rating: 4.6,
    fastCharging: true,
    amenities: ['Underground Parking', 'Security', 'EV Detailing'],
    distanceKmFromSF: 0,
    elevationMeters: 16
  }
];

// API Routes

app.get('/api/ev-models', (req, res) => {
  res.json({ success: true, data: EV_MODELS });
});

app.get('/api/stations', (req, res) => {
  res.json({ success: true, data: CHARGING_STATIONS });
});

// Trip Analysis Endpoint with Pre-Trip Prediction & AI Score
app.post('/api/ai/analyze-trip', async (req, res) => {
  try {
    const {
      currentBattery = 35,
      vehicleModelId = 'tesla-model-y-lr',
      customVehicleName = '',
      currentLocation = 'San Francisco, CA',
      destination = 'Lake Tahoe, CA',
      distanceKm = 318,
      weather = 'Cold (10°C / 50°F)',
      traffic = 'Moderate Traffic',
      drivingStyle = 'Balanced',
      acUsage = 'On (Heating)',
      cargoWeightKg = 100
    } = req.body;

    const selectedModel = EV_MODELS.find(m => m.id === vehicleModelId) || EV_MODELS[0];
    const vehicleName = customVehicleName || selectedModel.name;
    const capacity = selectedModel.usableCapacityKwh;
    const baseConsumptionPer100Km = selectedModel.avgConsumptionKwhPer100Km;

    // Environmental adjustment factors
    let weatherFactor = 1.0;
    if (weather.toLowerCase().includes('cold') || weather.toLowerCase().includes('snow')) weatherFactor = 1.22;
    else if (weather.toLowerCase().includes('rain')) weatherFactor = 1.10;
    else if (weather.toLowerCase().includes('hot')) weatherFactor = 1.08;

    let trafficFactor = 1.0;
    if (traffic.toLowerCase().includes('heavy') || traffic.toLowerCase().includes('stop')) trafficFactor = 1.15;
    else if (traffic.toLowerCase().includes('moderate')) trafficFactor = 1.06;

    let drivingFactor = 1.0;
    if (drivingStyle.toLowerCase().includes('sport') || drivingStyle.toLowerCase().includes('fast')) drivingFactor = 1.18;
    else if (drivingStyle.toLowerCase().includes('eco')) drivingFactor = 0.90;

    let acFactor = acUsage.toLowerCase().includes('on') ? 1.08 : 1.0;
    let weightFactor = 1 + (cargoWeightKg / 1000) * 0.05;

    // Elevation gain factor (e.g. going up to Tahoe adds ~6-8 kWh)
    let elevationFactor = 1.12; 

    const totalConsumptionRate = baseConsumptionPer100Km * weatherFactor * trafficFactor * drivingFactor * acFactor * weightFactor * elevationFactor;
    const requiredKwh = (distanceKm / 100) * totalConsumptionRate;
    const currentKwh = (currentBattery / 100) * capacity;

    const remainingKwhAtDest = currentKwh - requiredKwh;
    const remainingBatteryAtDestPercent = Math.round((remainingKwhAtDest / capacity) * 100);

    const safeMarginPercent = 15; // Recommended safety buffer
    const canReachDestination = remainingBatteryAtDestPercent >= safeMarginPercent;
    const preTripChargingRequired = !canReachDestination;

    // Calculate AI Recommendation Scores for Stations
    const rankedStations = CHARGING_STATIONS.map(station => {
      // 30% Battery Safety
      const batterySafetyScore = preTripChargingRequired
        ? (station.distanceKmFromSF < 100 ? 100 : 60)
        : 90;

      // 20% Waiting Time
      const waitingTimeScore = Math.max(0, 100 - (station.waitingTimeMins * 10));

      // 15% Charging Cost (cheaper = higher score)
      const costScore = Math.max(0, Math.min(100, 100 - ((station.pricePerkWh - 0.30) * 300)));

      // 15% Distance / Detour
      const distanceScore = Math.max(0, 100 - Math.abs(station.distanceKmFromSF - 150) * 0.4);

      // 10% Compatibility
      const isCompatible = selectedModel.connectorTypes.some(type => station.chargerTypes.includes(type) || type.includes(station.chargerTypes[0]));
      const compatibilityScore = isCompatible ? 100 : 40;

      // 5% Rating
      const ratingScore = (station.rating / 5) * 100;

      // 5% Traffic
      const trafficScore = 85;

      const aiScore = Math.round(
        batterySafetyScore * 0.30 +
        waitingTimeScore * 0.20 +
        costScore * 0.15 +
        distanceScore * 0.15 +
        compatibilityScore * 0.10 +
        ratingScore * 0.05 +
        trafficScore * 0.05
      );

      return {
        ...station,
        aiScore,
        scoreBreakdown: {
          batterySafety: Math.round(batterySafetyScore),
          waitingTime: Math.round(waitingTimeScore),
          cost: Math.round(costScore),
          distance: Math.round(distanceScore),
          compatibility: Math.round(compatibilityScore),
          rating: Math.round(ratingScore),
          traffic: Math.round(trafficScore)
        },
        reasons: [
          station.fastCharging ? `✓ High-Speed ${station.maxSpeedKw} kW Fast Charger` : 'Standard Speed',
          station.pricePerkWh <= 0.38 ? `✓ Competitive Pricing ($${station.pricePerkWh}/kWh)` : 'Standard Rate',
          station.waitingTimeMins === 0 ? '✓ Zero Waiting Time' : `~${station.waitingTimeMins}m Wait`,
          isCompatible ? `✓ Fully Compatible (${station.chargerTypes.join(', ')})` : 'Adapter required',
          `✓ ${station.availablePorts}/${station.totalPorts} Ports Available Right Now`
        ]
      };
    }).sort((a, b) => b.aiScore - a.aiScore);

    const recommendedStation = rankedStations[0];

    // Prepare prompt for Gemini AI enriched summary & journey advice
    const ai = getGeminiClient();
    let geminiAnalysisText = '';

    if (ai) {
      try {
        const prompt = `You are ZepGo, an expert EV Journey Planner & Range Anxiety AI.
Analyze this EV trip and produce a concise 3-bullet personalized advice for the driver.
Vehicle: ${vehicleName} (${capacity} kWh usable capacity)
Current Battery: ${currentBattery}% (${currentKwh.toFixed(1)} kWh)
Trip: ${currentLocation} -> ${destination} (${distanceKm} km)
Conditions: Weather=${weather}, Traffic=${traffic}, Driving=${drivingStyle}, Climate=${acUsage}.
Calculated Energy Needed: ${requiredKwh.toFixed(1)} kWh
Estimated Destination Battery: ${remainingBatteryAtDestPercent}%
Can safely reach without charging? ${canReachDestination ? 'YES' : 'NO - PRE-TRIP OR EN-ROUTE CHARGING NEEDED!'}
Top Recommended Station: ${recommendedStation.stationName} (AI Score: ${recommendedStation.aiScore}/100, Price: $${recommendedStation.pricePerkWh}/kWh, Speed: ${recommendedStation.maxSpeedKw}kW)

Provide brief, encouraging, highly practical advice with numbers (e.g. recommended charge duration, target battery SoC to charge up to, and driving efficiency tip). Keep it under 150 words.`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
        });

        if (geminiRes && geminiRes.text) {
          geminiAnalysisText = geminiRes.text;
        }
      } catch (err) {
        console.warn('Gemini API call warning in analyze-trip:', err);
      }
    }

    if (!geminiAnalysisText) {
      if (preTripChargingRequired) {
        geminiAnalysisText = `⚠️ **Pre-Trip Alert**: Starting with ${currentBattery}% battery is insufficient for your ${distanceKm} km mountainous trip to ${destination}. Energy consumption is estimated at ${requiredKwh.toFixed(1)} kWh due to cold weather and elevation gain. We strongly recommend charging to at least 80% at ${recommendedStation.stationName} before departure to maintain a 20% safety margin.`;
      } else {
        geminiAnalysisText = `✅ **Safe Journey Confirmed**: You have sufficient charge (${currentBattery}%) to reach ${destination} with an estimated ${remainingBatteryAtDestPercent}% battery remaining. Maintain moderate highway speed (under 110 km/h) to optimize regenerative braking efficiency on downhills.`;
      }
    }

    // Return structured analysis
    res.json({
      success: true,
      data: {
        canReachDestination,
        preTripChargingRequired,
        currentBatteryPercent: currentBattery,
        estimatedBatteryAtDestinationPercent: Math.max(-25, remainingBatteryAtDestPercent),
        deficitKwh: Math.max(0, (requiredKwh - currentKwh + (0.15 * capacity))).toFixed(1),
        requiredKwh: Math.round(requiredKwh * 10) / 10,
        currentKwh: Math.round(currentKwh * 10) / 10,
        distanceKm,
        totalConsumptionRateKwhPer100Km: Math.round(totalConsumptionRate * 10) / 10,
        rangeConfidenceScore: preTripChargingRequired ? Math.max(20, Math.min(60, 40 + remainingBatteryAtDestPercent)) : Math.min(99, Math.max(70, 60 + remainingBatteryAtDestPercent)),
        recommendedStation,
        allStationsRanked: rankedStations,
        aiAnalysisText: geminiAnalysisText,
        vehicleDetails: {
          name: vehicleName,
          usableCapacityKwh: capacity,
          connectors: selectedModel.connectorTypes
        },
        routeSegments: [
          { name: `${currentLocation} (Start)`, batteryPercent: currentBattery, distanceKm: 0 },
          { name: recommendedStation.stationName, batteryPercent: preTripChargingRequired ? Math.max(5, currentBattery - Math.round((recommendedStation.distanceKmFromSF/100)*totalConsumptionRate/capacity*100)) : Math.round(currentBattery - 35), distanceKm: recommendedStation.distanceKmFromSF, isChargingStop: true },
          { name: `${destination} (Destination)`, batteryPercent: preTripChargingRequired ? 38 : Math.max(0, remainingBatteryAtDestPercent), distanceKm: distanceKm }
        ]
      }
    });
  } catch (error: any) {
    console.error('Error analyzing trip:', error);
    res.status(500).json({ success: false, error: error.message || 'Trip analysis failed' });
  }
});

// AI Chat Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, contextHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Smart offline fallback response
      return res.json({
        success: true,
        reply: `⚡ **ZepGo AI Assistant**:
I analyzed your inquiry about "${message}".
- **Battery & Range**: Always maintain a 15-20% battery buffer when travelling in cold climates or mountainous terrain.
- **Charging Advice**: DC Fast Charging (150kW+) is most efficient between 10% and 80% State of Charge (SoC). Charging above 80% slows down significantly due to thermal management protocols.
- **Connector Compatibility**: Tesla NACS and CCS2 standards offer the fastest charging speeds across modern EV networks.`
      });
    }

    const systemInstruction = `You are ZepGo AI, an elite EV Charging & Navigation Assistant.
You specialize in electric vehicles, battery chemistry, range estimation, charging speed curves (kW/kWh), connector standards (CCS2, NACS, CHAdeMO, Type 2), cost calculations, cold weather range loss, and route optimization.
Provide clear, actionable, and mathematically accurate advice to EV drivers. Use bullet points and bold formatting for key metrics. Keep answers helpful and concise (100-200 words).`;

    const contents = [
      ...contextHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    const reply = geminiRes.text || "I'm ready to assist with your EV journey planning!";
    res.json({ success: true, reply });

  } catch (error: any) {
    console.error('Error in AI Chat:', error);
    res.status(500).json({
      success: false,
      reply: "I experienced a temporary connection hiccup, but here's a general EV tip: Keep your battery preconditioned before fast charging for maximum speeds!"
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚗 ZepGo EV Assistant Server running on http://localhost:${PORT}`);
  });
}

startServer();
