/**
 * Format distance in kilometers or meters
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format duration in hours and minutes
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = Math.round(minutes % 60);
  if (remainingMins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMins} min`;
}

/**
 * Format power output in kW
 */
export function formatPower(kw: number): string {
  return `${kw} kW`;
}

/**
 * Format energy in kWh
 */
export function formatEnergy(kwh: number): string {
  return `${kwh.toFixed(1)} kWh`;
}

/**
 * Format price per kWh in Indian Rupees (₹)
 */
export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}/kWh`;
}

/**
 * Format SOC percentage string
 */
export function formatSoc(percent: number): string {
  return `${Math.round(percent)}%`;
}
