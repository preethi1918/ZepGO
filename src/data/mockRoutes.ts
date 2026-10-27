import type { RouteData } from '../types';

export const MOCK_ROUTES: RouteData[] = [
  {
    origin: 'Salem',
    destination: 'Coimbatore',
    distanceKm: 142,
    travelTimeText: '3h 20m',
    stops: ['Zeon Charging Hub - Salem Highway']
  },
  {
    origin: 'Chennai',
    destination: 'Coimbatore',
    distanceKm: 510,
    travelTimeText: '8h 30m',
    stops: ['Villupuram Fast Hub', 'Salem Charging Hub']
  },
  {
    origin: 'Bangalore',
    destination: 'Salem',
    distanceKm: 204,
    travelTimeText: '3h 25m',
    stops: ['Krishnagiri Superfast Hub']
  },
  {
    origin: 'Coimbatore',
    destination: 'Ooty Nilgiris',
    distanceKm: 88,
    travelTimeText: '2h 30m',
    stops: ['Mettupalayam Gateway EV Hub']
  },
  {
    origin: 'Chennai',
    destination: 'Bengaluru',
    distanceKm: 345,
    travelTimeText: '6h 15m',
    stops: ['Vellore Fast Charger', 'Krishnagiri Rest Stop']
  },
  {
    origin: 'Bengaluru',
    destination: 'Mysuru',
    distanceKm: 145,
    travelTimeText: '2h 40m',
    stops: ['Mandya Charger']
  }
];

export function findRoute(origin: string, destination: string, optionalStop?: string): RouteData {
  const cleanOrigin = origin.trim().toLowerCase();
  const cleanDest = destination.trim().toLowerCase();

  const exact = MOCK_ROUTES.find(
    (r) =>
      r.origin.toLowerCase() === cleanOrigin &&
      r.destination.toLowerCase() === cleanDest
  );

  if (exact) {
    return {
      ...exact,
      stops: optionalStop ? [optionalStop] : exact.stops
    };
  }

  // Reverse match fallback
  const reverse = MOCK_ROUTES.find(
    (r) =>
      r.origin.toLowerCase() === cleanDest &&
      r.destination.toLowerCase() === cleanOrigin
  );

  if (reverse) {
    return {
      origin: origin,
      destination: destination,
      distanceKm: reverse.distanceKm,
      travelTimeText: reverse.travelTimeText,
      stops: optionalStop ? [optionalStop] : reverse.stops
    };
  }

  // Dynamic realistic fallback for custom cities
  const strConcat = `${cleanOrigin}-${cleanDest}`;
  let hash = 0;
  for (let i = 0; i < strConcat.length; i++) {
    hash = (hash << 5) - hash + strConcat.charCodeAt(i);
    hash |= 0;
  }
  const fallbackDistance = 120 + (Math.abs(hash) % 280); // between 120km and 400km
  const hours = Math.floor(fallbackDistance / 65);
  const minutes = Math.round(((fallbackDistance % 65) / 65) * 60);

  return {
    origin: origin || 'Chennai',
    destination: destination || 'Coimbatore',
    distanceKm: fallbackDistance,
    travelTimeText: `${hours}h ${minutes}m`,
    stops: optionalStop ? [optionalStop] : ['Midway EV Station']
  };
}
