export const TRINIDAD_TOBAGO_LOCATIONS = [
  // Trinidad
  { name: 'Queens Park Savannah, Port of Spain', latitude: 10.6333, longitude: -61.5 },
  { name: 'Maraval Beach, Port of Spain', latitude: 10.7458, longitude: -61.5583 },
  { name: 'Chaguaramas Bay, Chaguaramas', latitude: 10.7333, longitude: -61.6333 },
  { name: 'Asa Wright Nature Centre, Arima', latitude: 10.7667, longitude: -61.25 },
  { name: 'Nariva Swamp', latitude: 10.4, longitude: -61.2 },
  { name: 'Caroni Swamp', latitude: 10.5, longitude: -61.5833 },
  { name: 'Pitch Lake, La Brea', latitude: 10.2333, longitude: -61.9333 },
  { name: 'Manzanilla Beach', latitude: 10.35, longitude: -61.15 },
  { name: 'Mayaro Beach', latitude: 10.2, longitude: -61.0 },
  { name: 'Galera Point, Blanchisseuse', latitude: 10.85, longitude: -61.3 },
  { name: 'Blanchisseuse Beach', latitude: 10.8167, longitude: -61.3167 },
  { name: 'Toco Beach', latitude: 10.8333, longitude: -60.95 },
  { name: 'Icacos Beach, Point-à-Pierre', latitude: 10.05, longitude: -61.4333 },
  { name: 'San Fernando Waterfront', latitude: 10.2833, longitude: -61.45 },
  { name: 'Port of Spain Market, Port of Spain', latitude: 10.6417, longitude: -61.5083 },
  { name: 'Arima Town Centre', latitude: 10.6333, longitude: -61.3 },
  { name: 'San Fernando City Centre', latitude: 10.2833, longitude: -61.45 },
  { name: 'Couva Town Centre', latitude: 10.3833, longitude: -61.5 },
  { name: 'Tunapuna Town Centre', latitude: 10.5833, longitude: -61.4167 },
  { name: 'Carapichaima Town Centre', latitude: 10.45, longitude: -61.5833 },

  // Tobago
  { name: 'Pigeon Point Beach, Tobago', latitude: 11.1667, longitude: -60.8333 },
  { name: 'Scarborough, Tobago', latitude: 11.2167, longitude: -60.8 },
  { name: 'Store Bay, Tobago', latitude: 11.2333, longitude: -60.8 },
  { name: 'Parlatuvier Beach, Tobago', latitude: 11.2833, longitude: -60.85 },
  { name: 'Englishman\'s Bay, Tobago', latitude: 11.2917, longitude: -60.8667 },
  { name: 'Castara Beach, Tobago', latitude: 11.3083, longitude: -60.85 },
  { name: 'Speyside Beach, Tobago', latitude: 11.3333, longitude: -60.75 },
  { name: 'Lover\'s Beach, Tobago', latitude: 11.3, longitude: -60.8333 },
  { name: 'Little Tobago Island', latitude: 11.3667, longitude: -60.6667 },
  { name: 'Argyle Waterfall, Tobago', latitude: 11.2667, longitude: -60.7667 },
  { name: 'Fort King George, Scarborough', latitude: 11.2167, longitude: -60.8 },
  { name: 'Tobago Cays', latitude: 11.3667, longitude: -60.6333 },
];

// Helper function to search locations
export function searchLocations(query: string): typeof TRINIDAD_TOBAGO_LOCATIONS {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return TRINIDAD_TOBAGO_LOCATIONS.filter(
    (location) =>
      location.name.toLowerCase().includes(lowerQuery)
  );
}
