// Popular/Featured locations in Trinidad & Tobago
// These appear first in the LocationPicker autocomplete as "Popular Locations"
// Additional locations are fetched from OpenStreetMap (Nominatim) in real-time

export const TRINIDAD_TOBAGO_LOCATIONS = [
  // Trinidad - Major locations
  { name: 'Queens Park Savannah, Port of Spain', latitude: 10.6697, longitude: -61.5167 },
  { name: 'City Gate, Port of Spain', latitude: 10.6518, longitude: -61.5170 },
  { name: 'Maracas Beach, Trinidad', latitude: 10.7592, longitude: -61.4197 },
  { name: 'Chaguaramas Bay, Chaguaramas', latitude: 10.6833, longitude: -61.6500 },
  { name: 'Asa Wright Nature Centre, Arima', latitude: 10.7217, longitude: -61.2803 },
  { name: 'Caroni Bird Sanctuary', latitude: 10.6500, longitude: -61.4167 },
  { name: 'Pitch Lake, La Brea', latitude: 10.2333, longitude: -61.6333 },
  { name: 'Manzanilla Beach', latitude: 10.4667, longitude: -61.0167 },
  { name: 'Mayaro Beach', latitude: 10.2833, longitude: -61.0167 },
  { name: 'Blanchisseuse Beach', latitude: 10.7944, longitude: -61.2972 },
  { name: 'Toco Beach', latitude: 10.8167, longitude: -60.9333 },
  { name: 'San Fernando Waterfront', latitude: 10.2797, longitude: -61.4686 },
  { name: 'Arima Town Centre', latitude: 10.6372, longitude: -61.2803 },
  { name: 'Chaguanas Borough', latitude: 10.5167, longitude: -61.4167 },
  { name: 'Tunapuna Town Centre', latitude: 10.6417, longitude: -61.3917 },
  { name: 'Point Fortin', latitude: 10.1833, longitude: -61.6833 },
  { name: 'Sangre Grande', latitude: 10.5833, longitude: -61.1333 },

  // Tobago - Major locations
  { name: 'Pigeon Point Beach, Tobago', latitude: 11.1667, longitude: -60.8333 },
  { name: 'Scarborough, Tobago', latitude: 11.1833, longitude: -60.7333 },
  { name: 'Store Bay, Tobago', latitude: 11.1500, longitude: -60.8333 },
  { name: 'Castara Beach, Tobago', latitude: 11.3083, longitude: -60.7833 },
  { name: 'Englishman\'s Bay, Tobago', latitude: 11.2917, longitude: -60.6500 },
  { name: 'Crown Point, Tobago', latitude: 11.1497, longitude: -60.8322 },
  { name: 'Argyle Waterfall, Tobago', latitude: 11.2833, longitude: -60.6333 },
  { name: 'Fort King George, Scarborough', latitude: 11.1875, longitude: -60.7353 },
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
