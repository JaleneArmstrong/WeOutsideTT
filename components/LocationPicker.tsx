import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchLocations } from '../constants/locations';
import { EventLocation } from '../context/EventContext';

interface LocationPickerProps {
  onSelectLocation: (location: EventLocation) => void;
  selectedLocation?: EventLocation;
}

export function LocationPicker({ onSelectLocation, selectedLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const filteredLocations = searchQuery.trim()
    ? searchLocations(searchQuery)
    : [];

  const [nominatimResults, setNominatimResults] = useState<{ name: string; latitude: number; longitude: number }[]>([]);
  const [nominatimLoading, setNominatimLoading] = useState(false);
  const [nominatimError, setNominatimError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!showSuggestions) return;
    const q = searchQuery.trim();
    if (!q || q.length < 3) {
      setNominatimResults([]);
      setNominatimError(null);
      setNominatimLoading(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setNominatimLoading(true);
      setNominatimError(null);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=tt&q=${encodeURIComponent(q)}&limit=6&addressdetails=1`;
        const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'LimingMap/1.0' } });
        const json = await res.json();
        const results = (json || []).map((r: any) => ({ name: r.display_name, latitude: parseFloat(r.lat), longitude: parseFloat(r.lon) }));
        setNominatimResults(results);
      } catch {
        setNominatimError('Lookup failed');
        setNominatimResults([]);
      } finally {
        setNominatimLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, showSuggestions]);

  const handleSelectLocation = (location: { name: string; latitude: number; longitude: number }) => {
    onSelectLocation({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Bounding box for Trinidad & Tobago (approx)
  const isInTrinidadAndTobago = (lat: number, lon: number) => {
    // lat roughly between 10.0 and 11.6, lon roughly between -62.2 and -60.4
    return lat >= 9.8 && lat <= 11.6 && lon >= -62.2 && lon <= -60.2;
  };

  const handleGeocode = async () => {
    // fallback using device geocoding (kept for environments where nominatim isn't available)
    if (!searchQuery.trim()) return;
    setGeoError(null);
    setGeocoding(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        if (isInTrinidadAndTobago(latitude, longitude)) {
          onSelectLocation({ name: searchQuery.trim(), latitude, longitude });
          setSearchQuery('');
          setShowSuggestions(false);
        } else {
          setGeoError('Location is outside Trinidad & Tobago');
        }
      } else {
        setGeoError('Location not found');
      }
    } catch {
      setGeoError('Unable to geocode location');
    } finally {
      setGeocoding(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="location" size={18} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search location (e.g., Queens park savannah)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowSuggestions(true)}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => { setSearchQuery(''); setShowSuggestions(false); }}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {selectedLocation && !showSuggestions && (
        <View style={styles.selectedLocation}>
          <Ionicons name="checkmark-circle" size={16} color="#34C759" />
          <Text style={styles.selectedText}>{selectedLocation.name}</Text>
        </View>
      )}

      {showSuggestions && (filteredLocations.length > 0 || nominatimResults.length > 0) && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={[...filteredLocations, ...nominatimResults]}
            keyExtractor={(item) => `${item.name}-${item.latitude}-${item.longitude}`}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.suggestionItem,
                  selectedLocation?.name === item.name && styles.selectedSuggestion,
                ]}
                onPress={() => handleSelectLocation(item)}
              >
                <Ionicons name="location" size={14} color="#007AFF" />
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionName}>{item.name}</Text>
                  <Text style={styles.suggestionCoords}>
                    {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          {nominatimLoading && (
            <View style={{ padding: 8, alignItems: 'center' }}>
              <ActivityIndicator />
            </View>
          )}
          {nominatimError ? <Text style={styles.geoError}>{nominatimError}</Text> : null}
        </View>
      )}
      {showSuggestions && searchQuery && filteredLocations.length === 0 && (
        <View style={styles.noResults}>
          {geocoding ? (
            <ActivityIndicator />
          ) : (
            <>
              <Text style={styles.noResultsText}>No locations found in list</Text>
              <TouchableOpacity style={styles.geocodeBtn} onPress={handleGeocode}>
                <Text style={styles.geocodeBtnText}>Use {`"${searchQuery}"`} (look up)</Text>
              </TouchableOpacity>
              {geoError ? <Text style={styles.geoError}>{geoError}</Text> : null}
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    gap: 6,
  },
  selectedText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    gap: 10,
  },
  selectedSuggestion: {
    backgroundColor: '#f0f8ff',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  suggestionCoords: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  noResults: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  noResultsText: {
    color: '#999',
    fontSize: 14,
  },
  geocodeBtn: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  geocodeBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  geoError: {
    marginTop: 8,
    color: '#ff3b30',
    fontSize: 13,
  },
});
