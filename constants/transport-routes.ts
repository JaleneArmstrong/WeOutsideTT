// Trinidad & Tobago Transportation Routes
// This file contains hardcoded routes for buses, taxis, and maxis (maxi-taxis)

export interface TransportStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface InterIslandTransit {
  id: string;
  type: 'airport' | 'ferry';
  name: string;
  latitude: number;
  longitude: number;
  island: 'trinidad' | 'tobago';
  travelTime: string; // e.g., "20 min flight" or "2.5 hours ferry"
  fare: string;
}

export interface BusRoute {
  routeNumber: string;
  routeName: string;
  stops: TransportStop[];
  color: string;
}

export interface TaxiStand {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  destinations: string[];
  estimatedWait: string; // e.g., "5-10 min"
}

export interface MaxiRoute {
  id: string;
  routeName: string;
  color: string; // Color of the maxi
  colorCode: string; // Hex color for display
  stops: TransportStop[];
  fare: string;
}

// Inter-island transit points (airports and ferry terminals)
export const INTER_ISLAND_TRANSITS: InterIslandTransit[] = [
  {
    id: 'piarco-airport',
    type: 'airport',
    name: 'Piarco International Airport',
    latitude: 10.5953,
    longitude: -61.3372,
    island: 'trinidad',
    travelTime: '20 min flight',
    fare: 'TT$200-400',
  },
  {
    id: 'pos-ferry',
    type: 'ferry',
    name: 'Port of Spain Ferry Terminal',
    latitude: 10.6519,
    longitude: -61.5189,
    island: 'trinidad',
    travelTime: '2.5 hours ferry',
    fare: 'TT$50-100',
  },
  {
    id: 'anr-airport',
    type: 'airport',
    name: 'ANR Robinson International Airport',
    latitude: 11.1497,
    longitude: -60.8322,
    island: 'tobago',
    travelTime: '20 min flight',
    fare: 'TT$200-400',
  },
  {
    id: 'scarborough-ferry',
    type: 'ferry',
    name: 'Scarborough Ferry Terminal',
    latitude: 11.1833,
    longitude: -60.7333,
    island: 'tobago',
    travelTime: '2.5 hours ferry',
    fare: 'TT$50-100',
  },
];

// Maxi taxi routes with color coding
export const MAXI_ROUTES: MaxiRoute[] = [
  {
    id: 'red-band-1',
    routeName: 'Port of Spain to San Fernando',
    color: 'Red Band',
    colorCode: '#DC143C',
    fare: 'TT$8-12',
    stops: [
      { id: 'red-1', name: 'City Gate, Port of Spain', latitude: 10.6518, longitude: -61.5170 },
      { id: 'red-2', name: 'Woodbrook', latitude: 10.6667, longitude: -61.5167 },
      { id: 'red-3', name: 'St. James', latitude: 10.6500, longitude: -61.5333 },
      { id: 'red-4', name: 'Chaguanas', latitude: 10.5167, longitude: -61.4167 },
      { id: 'red-5', name: 'Couva', latitude: 10.4167, longitude: -61.4667 },
      { id: 'red-6', name: 'San Fernando', latitude: 10.2833, longitude: -61.4667 },
    ],
  },
  {
    id: 'yellow-band-1',
    routeName: 'Port of Spain to Arima',
    color: 'Yellow Band',
    colorCode: '#FFD700',
    fare: 'TT$6-8',
    stops: [
      { id: 'yellow-1', name: 'City Gate, Port of Spain', latitude: 10.6518, longitude: -61.5170 },
      { id: 'yellow-2', name: 'Beetham', latitude: 10.6333, longitude: -61.4833 },
      { id: 'yellow-3', name: 'Tunapuna', latitude: 10.6500, longitude: -61.3833 },
      { id: 'yellow-4', name: 'Arouca', latitude: 10.6333, longitude: -61.3333 },
      { id: 'yellow-5', name: 'Arima', latitude: 10.6333, longitude: -61.2833 },
    ],
  },
  {
    id: 'green-band-1',
    routeName: 'Port of Spain to Sangre Grande',
    color: 'Green Band',
    colorCode: '#228B22',
    fare: 'TT$10-15',
    stops: [
      { id: 'green-1', name: 'City Gate, Port of Spain', latitude: 10.6518, longitude: -61.5170 },
      { id: 'green-2', name: 'Tunapuna', latitude: 10.6500, longitude: -61.3833 },
      { id: 'green-3', name: 'Arima', latitude: 10.6333, longitude: -61.2833 },
      { id: 'green-4', name: 'Valencia', latitude: 10.6500, longitude: -61.2000 },
      { id: 'green-5', name: 'Sangre Grande', latitude: 10.5833, longitude: -61.1333 },
    ],
  },
  // Tobago maxi routes
  {
    id: 'tobago-blue-1',
    routeName: 'Scarborough to Crown Point',
    color: 'Blue Band',
    colorCode: '#0000FF',
    fare: 'TT$5-7',
    stops: [
      { id: 'tobago-blue-1', name: 'Scarborough', latitude: 11.1833, longitude: -60.7333 },
      { id: 'tobago-blue-2', name: 'Canaan', latitude: 11.1500, longitude: -60.7833 },
      { id: 'tobago-blue-3', name: 'Bon Accord', latitude: 11.1333, longitude: -60.8167 },
      { id: 'tobago-blue-4', name: 'Crown Point', latitude: 11.1497, longitude: -60.8322 },
    ],
  },
  {
    id: 'tobago-brown-1',
    routeName: 'Scarborough to Charlotteville',
    color: 'Brown Band',
    colorCode: '#8B4513',
    fare: 'TT$8-12',
    stops: [
      { id: 'tobago-brown-1', name: 'Scarborough', latitude: 11.1833, longitude: -60.7333 },
      { id: 'tobago-brown-2', name: 'Roxborough', latitude: 11.2667, longitude: -60.6167 },
      { id: 'tobago-brown-3', name: 'Speyside', latitude: 11.3000, longitude: -60.5333 },
      { id: 'tobago-brown-4', name: 'Charlotteville', latitude: 11.3167, longitude: -60.5500 },
    ],
  },
];

// Bus routes (PTSC - Public Transport Service Corporation)
export const BUS_ROUTES: BusRoute[] = [
  {
    routeNumber: '12',
    routeName: 'Port of Spain - San Fernando',
    color: '#4169E1',
    stops: [
      { id: 'bus-12-1', name: 'City Gate Terminal', latitude: 10.6518, longitude: -61.5170 },
      { id: 'bus-12-2', name: 'Woodbrook', latitude: 10.6667, longitude: -61.5167 },
      { id: 'bus-12-3', name: 'Mucurapo', latitude: 10.6500, longitude: -61.5333 },
      { id: 'bus-12-4', name: 'Chaguanas', latitude: 10.5167, longitude: -61.4167 },
      { id: 'bus-12-5', name: 'San Fernando', latitude: 10.2833, longitude: -61.4667 },
    ],
  },
  {
    routeNumber: '45',
    routeName: 'Port of Spain - Arima',
    color: '#4169E1',
    stops: [
      { id: 'bus-45-1', name: 'City Gate Terminal', latitude: 10.6518, longitude: -61.5170 },
      { id: 'bus-45-2', name: 'Laventille', latitude: 10.6500, longitude: -61.5000 },
      { id: 'bus-45-3', name: 'Tunapuna', latitude: 10.6500, longitude: -61.3833 },
      { id: 'bus-45-4', name: 'Arouca', latitude: 10.6333, longitude: -61.3333 },
      { id: 'bus-45-5', name: 'Arima', latitude: 10.6333, longitude: -61.2833 },
    ],
  },
  {
    routeNumber: '67',
    routeName: 'Circular Route - Savannah',
    color: '#4169E1',
    stops: [
      { id: 'bus-67-1', name: 'Queens Park Savannah', latitude: 10.6667, longitude: -61.5167 },
      { id: 'bus-67-2', name: 'St. Anns', latitude: 10.6667, longitude: -61.5000 },
      { id: 'bus-67-3', name: 'Cascade', latitude: 10.6833, longitude: -61.5000 },
      { id: 'bus-67-4', name: 'St. James', latitude: 10.6500, longitude: -61.5333 },
      { id: 'bus-67-5', name: 'Woodbrook', latitude: 10.6667, longitude: -61.5167 },
    ],
  },
  // Tobago bus routes
  {
    routeNumber: 'T1',
    routeName: 'Scarborough - Crown Point',
    color: '#4169E1',
    stops: [
      { id: 'bus-t1-1', name: 'Scarborough Terminal', latitude: 11.1833, longitude: -60.7333 },
      { id: 'bus-t1-2', name: 'Canaan', latitude: 11.1500, longitude: -60.7833 },
      { id: 'bus-t1-3', name: 'Crown Point Airport', latitude: 11.1497, longitude: -60.8322 },
    ],
  },
];

// Taxi stands with destinations
export const TAXI_STANDS: TaxiStand[] = [
  {
    id: 'taxi-pos-1',
    name: 'City Gate Taxi Stand',
    latitude: 10.6518,
    longitude: -61.5170,
    destinations: ['San Fernando', 'Arima', 'Chaguanas', 'Diego Martin'],
    estimatedWait: '5-15 min',
  },
  {
    id: 'taxi-pos-2',
    name: 'Independence Square Taxi Stand',
    latitude: 10.6500,
    longitude: -61.5167,
    destinations: ['St. James', 'Woodbrook', 'Maraval'],
    estimatedWait: '2-10 min',
  },
  {
    id: 'taxi-chag-1',
    name: 'Chaguanas Main Road Taxi Stand',
    latitude: 10.5167,
    longitude: -61.4167,
    destinations: ['Port of Spain', 'San Fernando', 'Couva'],
    estimatedWait: '3-8 min',
  },
  {
    id: 'taxi-sf-1',
    name: 'San Fernando Taxi Stand',
    latitude: 10.2833,
    longitude: -61.4667,
    destinations: ['Port of Spain', 'Princes Town', 'Point Fortin'],
    estimatedWait: '5-12 min',
  },
  {
    id: 'taxi-arima-1',
    name: 'Arima Taxi Stand',
    latitude: 10.6333,
    longitude: -61.2833,
    destinations: ['Port of Spain', 'Sangre Grande', 'Piarco'],
    estimatedWait: '3-10 min',
  },
  // Tobago taxi stands
  {
    id: 'taxi-scarborough-1',
    name: 'Scarborough Taxi Stand',
    latitude: 11.1833,
    longitude: -60.7333,
    destinations: ['Crown Point', 'Plymouth', 'Roxborough'],
    estimatedWait: '5-15 min',
  },
  {
    id: 'taxi-crown-point-1',
    name: 'Crown Point Taxi Stand',
    latitude: 11.1497,
    longitude: -60.8322,
    destinations: ['Scarborough', 'Buccoo', 'Store Bay'],
    estimatedWait: '2-8 min',
  },
];

// Helper to determine which island a coordinate is on
export function getIsland(latitude: number, longitude: number): 'trinidad' | 'tobago' | 'unknown' {
  // Tobago is roughly 11.1-11.4 lat, -60.9 to -60.5 lon
  if (latitude >= 11.0 && latitude <= 11.5 && longitude >= -60.9 && longitude <= -60.5) {
    return 'tobago';
  }
  // Trinidad is roughly 10.0-10.8 lat, -61.9 to -60.9 lon
  if (latitude >= 10.0 && latitude <= 10.9 && longitude >= -61.95 && longitude <= -60.9) {
    return 'trinidad';
  }
  return 'unknown';
}

// Helper to get best inter-island transit points based on preference
export function getInterIslandTransits(
  fromIsland: 'trinidad' | 'tobago',
  preferFerry: boolean = false
): InterIslandTransit[] {
  const transits = INTER_ISLAND_TRANSITS.filter((t) => t.island === fromIsland);
  // Sort by preference: ferry first if preferred, otherwise airport first
  return transits.sort((a, b) => {
    if (preferFerry) {
      return a.type === 'ferry' ? -1 : 1;
    }
    return a.type === 'airport' ? -1 : 1;
  });
}

// Helper function to find nearest stops to a location
export function findNearestStops(
  latitude: number,
  longitude: number,
  stops: TransportStop[],
  maxDistance: number = 0.1 // degrees, roughly 11km
): TransportStop[] {
  return stops
    .map((stop) => ({
      stop,
      distance: Math.sqrt(
        Math.pow(stop.latitude - latitude, 2) + Math.pow(stop.longitude - longitude, 2)
      ),
    }))
    .filter((item) => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .map((item) => item.stop);
}

// Helper to find relevant routes between two points
export function findRelevantMaxiRoutes(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
): MaxiRoute[] {
  // Check if inter-island travel is needed
  const startIsland = getIsland(startLat, startLon);
  const endIsland = getIsland(endLat, endLon);

  // Filter routes by island
  const relevantRoutes = MAXI_ROUTES.filter((route) => {
    // Check which island this route is on by looking at first stop
    const routeIsland = getIsland(route.stops[0].latitude, route.stops[0].longitude);
    
    const nearStart = findNearestStops(startLat, startLon, route.stops, 0.05);
    const nearEnd = findNearestStops(endLat, endLon, route.stops, 0.05);
    
    // If inter-island, we need routes on both islands
    if (startIsland !== endIsland && startIsland !== 'unknown' && endIsland !== 'unknown') {
      return (routeIsland === startIsland && nearStart.length > 0) ||
             (routeIsland === endIsland && nearEnd.length > 0);
    }
    
    // Same island or unknown - use normal logic
    return nearStart.length > 0 && nearEnd.length > 0;
  });

  return relevantRoutes;
}

export function findRelevantBusRoutes(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
): BusRoute[] {
  // Check if inter-island travel is needed
  const startIsland = getIsland(startLat, startLon);
  const endIsland = getIsland(endLat, endLon);

  // Filter routes by island
  const relevantRoutes = BUS_ROUTES.filter((route) => {
    // Check which island this route is on by looking at first stop
    const routeIsland = getIsland(route.stops[0].latitude, route.stops[0].longitude);
    
    const nearStart = findNearestStops(startLat, startLon, route.stops, 0.05);
    const nearEnd = findNearestStops(endLat, endLon, route.stops, 0.05);
    
    // If inter-island, we need routes on both islands
    if (startIsland !== endIsland && startIsland !== 'unknown' && endIsland !== 'unknown') {
      return (routeIsland === startIsland && nearStart.length > 0) ||
             (routeIsland === endIsland && nearEnd.length > 0);
    }
    
    // Same island or unknown - use normal logic
    return nearStart.length > 0 && nearEnd.length > 0;
  });

  return relevantRoutes;
}

export function findNearestTaxiStands(
  latitude: number,
  longitude: number,
  maxResults: number = 3
): TaxiStand[] {
  // Only return taxi stands from the same island
  const currentIsland = getIsland(latitude, longitude);
  
  const filteredStands = TAXI_STANDS.filter((stand) => {
    const standIsland = getIsland(stand.latitude, stand.longitude);
    return currentIsland === 'unknown' || standIsland === currentIsland;
  });

  return filteredStands.map((stand) => ({
    stand,
    distance: Math.sqrt(
      Math.pow(stand.latitude - latitude, 2) + Math.pow(stand.longitude - longitude, 2)
    ),
  }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults)
    .map((item) => item.stand);
}

// Helper to check if inter-island travel is needed and get transit info
export function getInterIslandInfo(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
): { needsInterIsland: boolean; transitPoints: InterIslandTransit[] } | null {
  const startIsland = getIsland(startLat, startLon);
  const endIsland = getIsland(endLat, endLon);

  if (startIsland === 'unknown' || endIsland === 'unknown') {
    return null;
  }

  if (startIsland === endIsland) {
    return { needsInterIsland: false, transitPoints: [] };
  }

  // Inter-island travel needed - get transit points
  const departureTransits = getInterIslandTransits(startIsland, false); // Prefer airport
  const arrivalTransits = INTER_ISLAND_TRANSITS.filter(
    (t) => t.island === endIsland && t.type === departureTransits[0].type
  );

  return {
    needsInterIsland: true,
    transitPoints: [departureTransits[0], arrivalTransits[0]],
  };
}
