import { TripPlanRequest, TripAnalysisResult, EVModel, ChargingStation } from '../types';

export async function fetchEvModels(): Promise<EVModel[]> {
  try {
    const res = await fetch('/api/ev-models');
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.data;
    }
  } catch (err) {
    console.warn('Failed to fetch EV models from API, using fallback:', err);
  }
  return [
    {
      id: 'tesla-model-y-lr',
      name: 'Tesla Model Y Long Range',
      brand: 'Tesla',
      batteryCapacityKwh: 75,
      usableCapacityKwh: 72.7,
      avgConsumptionKwhPer100Km: 16.8,
      connectorTypes: ['NACS', 'CCS2 (Adapter)'],
      maxChargingPowerKw: 250,
      rangeKm: 531,
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
      id: 'porsche-taycan-4s',
      name: 'Porsche Taycan 4S',
      brand: 'Porsche',
      batteryCapacityKwh: 93.4,
      usableCapacityKwh: 83.7,
      avgConsumptionKwhPer100Km: 21.0,
      connectorTypes: ['CCS2', 'Type 2'],
      maxChargingPowerKw: 270,
      rangeKm: 463,
    }
  ];
}

export async function fetchStations(): Promise<ChargingStation[]> {
  try {
    const res = await fetch('/api/stations');
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.data;
    }
  } catch (err) {
    console.warn('Failed to fetch stations from API:', err);
  }
  return [];
}

export async function analyzeTrip(req: TripPlanRequest): Promise<TripAnalysisResult> {
  const res = await fetch('/api/ai/analyze-trip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });

  if (!res.ok) {
    throw new Error('Trip analysis failed on server');
  }

  const result = await res.json();
  if (!result.success) {
    throw new Error(result.error || 'Server error during trip analysis');
  }

  return result.data;
}

export async function sendChatMessage(message: string, contextHistory: any[] = []): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, contextHistory })
  });

  if (!res.ok) {
    return "I'm having trouble connecting to the network right now. Please verify your connection or try again.";
  }

  const data = await res.json();
  return data.reply || "I'm here to help with your EV charging needs!";
}
