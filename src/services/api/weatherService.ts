import type { GeoLocation } from '../../types/charging';

export interface RealtimeWeatherData {
  temperatureC: number;
  windSpeedKmh: number;
  weatherCode: number;
  weatherDescription: string;
  isDaytime: boolean;
  rangeMultiplier: number; // e.g. 0.88 for 12% loss, 1.04 for ideal condition
  rangeImpactPercent: number; // e.g. -12 or +4
  impactReason: string;
}

/**
 * Weather codes interpretation (WMO Weather interpretation codes)
 */
function parseWmoWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Rain / Drizzle';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Overcast';
}

/**
 * Calculate dynamic EV battery range impact based on ambient temperature & wind speed
 */
function calculateEvRangeImpact(tempC: number, windSpeedKmh: number): {
  multiplier: number;
  impactPercent: number;
  impactReason: string;
} {
  let multiplier = 1.0;
  let reasons: string[] = [];

  // Temperature impact (Ideal battery cell efficiency temperature is 20°C - 26°C)
  if (tempC < 5) {
    multiplier -= 0.18; // Cold battery chemistry loss + cabin heater load
    reasons.push('Cold Ambient (-18%)');
  } else if (tempC < 15) {
    multiplier -= 0.08;
    reasons.push('Mild Cold (-8%)');
  } else if (tempC > 36) {
    multiplier -= 0.10; // HVAC AC cooling load
    reasons.push('High Ambient Heat (-10%)');
  } else if (tempC >= 20 && tempC <= 28) {
    multiplier += 0.04;
    reasons.push('Ideal Battery Temp (+4%)');
  }

  // Wind speed impact
  if (windSpeedKmh > 25) {
    multiplier -= 0.06;
    reasons.push('Strong Headwind (-6%)');
  }

  const impactPercent = Math.round((multiplier - 1.0) * 100);
  const impactReason = reasons.length > 0 ? reasons.join(' • ') : 'Optimal Conditions (0%)';

  return {
    multiplier: Math.round(multiplier * 100) / 100,
    impactPercent,
    impactReason,
  };
}

/**
 * Fetch real-time live weather from Open-Meteo free API (no key required)
 */
export async function fetchRealtimeWeather(loc: GeoLocation): Promise<RealtimeWeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Weather API returned ${res.status}`);

    const data = await res.json();
    const current = data.current_weather || {};

    const tempC = Math.round(current.temperature ?? 24);
    const windSpeed = Math.round(current.windspeed ?? 12);
    const code = current.weathercode ?? 0;
    const isDay = current.is_day !== 0;

    const desc = parseWmoWeatherCode(code);
    const { multiplier, impactPercent, impactReason } = calculateEvRangeImpact(tempC, windSpeed);

    return {
      temperatureC: tempC,
      windSpeedKmh: windSpeed,
      weatherCode: code,
      weatherDescription: desc,
      isDaytime: isDay,
      rangeMultiplier: multiplier,
      rangeImpactPercent: impactPercent,
      impactReason,
    };
  } catch (err) {
    console.warn('Real-time Weather API offline, using fallback:', err);
    return {
      temperatureC: 24,
      windSpeedKmh: 10,
      weatherCode: 0,
      weatherDescription: 'Sunny / Clear',
      isDaytime: true,
      rangeMultiplier: 1.04,
      rangeImpactPercent: 4,
      impactReason: 'Ideal Battery Temp (+4%)',
    };
  }
}
