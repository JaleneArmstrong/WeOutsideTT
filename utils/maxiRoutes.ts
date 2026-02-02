// Maxi stops with coordinates
export const MAXI_STOPS = [
  { name: 'Port of Spain', lat: 10.6549, lon: -61.5019 },
  { name: 'San Fernando', lat: 10.2799, lon: -61.4651 },
  { name: 'Arima', lat: 10.6372, lon: -61.2821 },
  { name: 'Chaguanas', lat: 10.5167, lon: -61.4167 },
  { name: 'Princes Town', lat: 10.2667, lon: -61.3833 },
  { name: 'Mayaro', lat: 10.3000, lon: -61.0000 },
  { name: 'Siparia', lat: 10.1333, lon: -61.5000 },
  { name: 'La Romaine', lat: 10.2833, lon: -61.5167 },
  { name: 'Curepe', lat: 10.6500, lon: -61.4167 },
  { name: 'Sangre Grande', lat: 10.5833, lon: -61.1333 },
  { name: 'Diego Martin', lat: 10.7167, lon: -61.5500 },
  { name: 'Petit Valley', lat: 10.6833, lon: -61.5333 },
  { name: 'Chaguaramas', lat: 10.6833, lon: -61.6333 },
  { name: 'La Brea', lat: 10.2167, lon: -61.6167 },
  { name: 'Point Fortin', lat: 10.1833, lon: -61.6833 },
  { name: 'Erin', lat: 10.1000, lon: -61.6500 },
  { name: 'Moruga', lat: 10.0667, lon: -61.2833 },
];

// Maxi route information with stops
export const MAXI_ROUTES = [
  {
    color: 'black',
    colorCode: '#000000',
    route: 'San Fernando – Princes Town connecting to Mayaro',
    stops: ['San Fernando', 'Princes Town', 'Mayaro'],
  },
  {
    color: 'brown',
    colorCode: '#8B4513',
    route: 'San Fernando-La Brea-Point Fortin-Siparia-Erin-Moruga',
    stops: ['San Fernando', 'La Brea', 'Point Fortin', 'Siparia', 'Erin', 'Moruga'],
  },
  {
    color: 'green',
    colorCode: '#008000',
    route: 'Port of Spain-Curepe-Chaguanas-San Fernando',
    stops: ['Port of Spain', 'Curepe', 'Chaguanas', 'San Fernando'],
  },
  {
    color: 'red',
    colorCode: '#FF0000',
    route: 'Port of Spain – Arima, connecting to Sangre Grande',
    stops: ['Port of Spain', 'Arima', 'Sangre Grande'],
  },
  {
    color: 'yellow',
    colorCode: '#FFD700',
    route: 'Port of Spain-Diego Martin-Petit Valley-Chaguaramas',
    stops: ['Port of Spain', 'Diego Martin', 'Petit Valley', 'Chaguaramas'],
  },
];

export interface MaxiRoute {
  color: string;
  colorCode: string;
  route: string;
  stops: string[];
}

export interface MaxiStop {
  name: string;
  lat: number;
  lon: number;
}

export interface MaxiRouteInfo {
  route: MaxiRoute;
  fromStop: string;
  toStop: string;
  distanceToStart: number;
  distanceFromEnd: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the nearest maxi stop to a given location
 */
export function findNearestStop(lat: number, lon: number) {
  let nearestStop = MAXI_STOPS[0];
  let minDistance = calculateDistance(lat, lon, nearestStop.lat, nearestStop.lon);

  for (const stop of MAXI_STOPS) {
    const distance = calculateDistance(lat, lon, stop.lat, stop.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestStop = stop;
    }
  }

  return { stop: nearestStop, distance: minDistance };
}

/**
 * Find maxi route between two locations using proximity to maxi stops
 */
export function findMaxiRouteByProximity(
  userLat: number,
  userLon: number,
  eventLat: number,
  eventLon: number
): MaxiRouteInfo | null {
  const nearestToUser = findNearestStop(userLat, userLon);
  const nearestToEvent = findNearestStop(eventLat, eventLon);

  // Find a maxi route that connects these two stops
  for (const maxiRoute of MAXI_ROUTES) {
    const hasUserStop = maxiRoute.stops.includes(nearestToUser.stop.name);
    const hasEventStop = maxiRoute.stops.includes(nearestToEvent.stop.name);

    if (hasUserStop && hasEventStop) {
      return {
        route: maxiRoute,
        fromStop: nearestToUser.stop.name,
        toStop: nearestToEvent.stop.name,
        distanceToStart: nearestToUser.distance,
        distanceFromEnd: nearestToEvent.distance,
      };
    }
  }

  return null;
}
