import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { searchLocations } from "../constants/locations";
import { EventLocation } from "../context/EventContext";

interface LocationPickerProps {
  onSelectLocation: (location: EventLocation) => void;
  selectedLocation?: EventLocation;
  style?: any;
}

export function LocationPicker({
  onSelectLocation,
  selectedLocation,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const filteredLocations = searchQuery.trim()
    ? searchLocations(searchQuery)
    : [];

  const [nominatimResults, setNominatimResults] = useState<
    { name: string; latitude: number; longitude: number }[]
  >([]);
  const [nominatimLoading, setNominatimLoading] = useState(false);
  const [nominatimError, setNominatimError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!showSuggestions) return;
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
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
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=tt&q=${encodeURIComponent(q)}&limit=10&addressdetails=1`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "LimingMap/1.0",
          },
        });
        const json = await res.json();

        const results = (json || []).map((r: any) => {
          const cleanName =
            r.address.tourism ||
            r.address.amenity ||
            r.address.building ||
            r.address.road ||
            r.address.suburb ||
            r.display_name.split(",")[0];

          return {
            name: cleanName,
            latitude: parseFloat(r.lat),
            longitude: parseFloat(r.lon),
          };
        });

        setNominatimResults(results);
      } catch {
        setNominatimError("Lookup failed");
        setNominatimResults([]);
      } finally {
        setNominatimLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, showSuggestions]);

  const handleSelectLocation = (location: {
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    onSelectLocation({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const isInTrinidadAndTobago = (lat: number, lon: number) => {
    return lat >= 9.8 && lat <= 11.6 && lon >= -62.2 && lon <= -60.2;
  };

  const handleGeocode = async () => {
    if (!searchQuery.trim()) return;
    setGeoError(null);
    setGeocoding(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        if (isInTrinidadAndTobago(latitude, longitude)) {
          onSelectLocation({ name: searchQuery.trim(), latitude, longitude });
          setSearchQuery("");
          setShowSuggestions(false);
        } else {
          setGeoError("Location is outside Trinidad & Tobago");
        }
      } else {
        setGeoError("Location not found");
      }
    } catch {
      setGeoError("Unable to geocode location");
    } finally {
      setGeocoding(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? "#1A1A1A" : "#fff",
            borderColor: isDark ? "#333" : "#ddd",
          },
        ]}
      >
        <Ionicons
          name="location"
          size={18}
          color={isDark ? "#AAA" : "#666"}
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { color: isDark ? "#fff" : "#333" }]}
          placeholder="Search location (e.g., Queens park savannah)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowSuggestions(true)}
          placeholderTextColor={isDark ? "#666" : "#999"}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setShowSuggestions(false);
            }}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={isDark ? "#666" : "#999"}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {selectedLocation && !showSuggestions && (
        <View style={styles.selectedLocation}>
          <Ionicons name="checkmark-circle" size={16} color="#34C759" />
          <Text style={[styles.selectedText, { color: "#34C759" }]}>
            {selectedLocation.name}
          </Text>
        </View>
      )}

      {showSuggestions &&
        (filteredLocations.length > 0 || nominatimResults.length > 0) && (
          <View
            style={[
              styles.suggestionsContainer,
              {
                backgroundColor: isDark ? "#1A1A1A" : "#fff",
                borderColor: isDark ? "#333" : "#ddd",
              },
            ]}
          >
            <ScrollView
              style={styles.suggestionsScroll}
              keyboardShouldPersistTaps="handled"
            >
              {filteredLocations.length > 0 && (
                <>
                  <View
                    style={[
                      styles.sectionHeader,
                      {
                        backgroundColor: isDark ? "#252525" : "#f5f5f5",
                        borderBottomColor: isDark ? "#333" : "#e0e0e0",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionHeaderText,
                        { color: isDark ? "#AAA" : "#666" },
                      ]}
                    >
                      Popular Locations
                    </Text>
                  </View>
                  {filteredLocations.map((item) => (
                    <TouchableOpacity
                      key={`local-${item.name}-${item.latitude}-${item.longitude}`}
                      style={[
                        styles.suggestionItem,
                        { borderBottomColor: isDark ? "#222" : "#f0f0f0" },
                        selectedLocation?.name === item.name &&
                          (isDark
                            ? { backgroundColor: "#2D1B1E" }
                            : styles.selectedSuggestion),
                      ]}
                      onPress={() => handleSelectLocation(item)}
                    >
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <View style={styles.suggestionContent}>
                        <Text
                          style={[
                            styles.suggestionName,
                            { color: isDark ? "#fff" : "#333" },
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.suggestionCoords,
                            { color: isDark ? "#666" : "#999" },
                          ]}
                        >
                          {item.latitude.toFixed(4)}°,{" "}
                          {item.longitude.toFixed(4)}°
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {nominatimResults.length > 0 && (
                <>
                  <View
                    style={[
                      styles.sectionHeader,
                      {
                        backgroundColor: isDark ? "#252525" : "#f5f5f5",
                        borderBottomColor: isDark ? "#333" : "#e0e0e0",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionHeaderText,
                        { color: isDark ? "#AAA" : "#666" },
                      ]}
                    >
                      All Locations (OpenStreetMap)
                    </Text>
                  </View>
                  {nominatimResults.map((item, index) => (
                    <TouchableOpacity
                      key={`osm-${index}-${item.latitude}`}
                      style={[
                        styles.suggestionItem,
                        { borderBottomColor: isDark ? "#222" : "#f0f0f0" },
                        selectedLocation?.name === item.name &&
                          (isDark
                            ? { backgroundColor: "#2D1B1E" }
                            : styles.selectedSuggestion),
                      ]}
                      onPress={() => handleSelectLocation(item)}
                    >
                      <Ionicons
                        name="location"
                        size={14}
                        color={isDark ? "#D90429" : "#007AFF"}
                      />
                      <View style={styles.suggestionContent}>
                        <Text
                          style={[
                            styles.suggestionName,
                            { color: isDark ? "#fff" : "#333" },
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.suggestionCoords,
                            { color: isDark ? "#666" : "#999" },
                          ]}
                        >
                          {item.latitude.toFixed(4)}°,{" "}
                          {item.longitude.toFixed(4)}°
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {nominatimLoading && (
                <View style={{ padding: 8, alignItems: "center" }}>
                  <ActivityIndicator color={isDark ? "#D90429" : "#007AFF"} />
                  <Text
                    style={[
                      styles.loadingText,
                      { color: isDark ? "#666" : "#999" },
                    ]}
                  >
                    Searching OpenStreetMap...
                  </Text>
                </View>
              )}
              {nominatimError ? (
                <Text style={styles.geoError}>{nominatimError}</Text>
              ) : null}
            </ScrollView>
          </View>
        )}
      {showSuggestions && searchQuery && filteredLocations.length === 0 && (
        <View
          style={[
            styles.noResults,
            { backgroundColor: isDark ? "#252525" : "#f5f5f5" },
          ]}
        >
          {geocoding ? (
            <ActivityIndicator color={isDark ? "#D90429" : "#007AFF"} />
          ) : (
            <>
              <Text
                style={[
                  styles.noResultsText,
                  { color: isDark ? "#666" : "#999" },
                ]}
              >
                No locations found in list
              </Text>
              <TouchableOpacity
                style={[styles.geocodeBtn, { backgroundColor: "#D90429" }]}
                onPress={handleGeocode}
              >
                <Text style={styles.geocodeBtnText}>
                  Use {`"${searchQuery}"`} (look up)
                </Text>
              </TouchableOpacity>
              {geoError ? (
                <Text style={styles.geoError}>{geoError}</Text>
              ) : null}
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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 8,
    gap: 6,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "500",
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 300,
    overflow: "hidden",
  },
  suggestionsScroll: {
    maxHeight: 300,
  },
  sectionHeader: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  loadingText: {
    fontSize: 12,
    marginTop: 4,
  },
  suggestionItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    alignItems: "center",
    gap: 10,
  },
  selectedSuggestion: {
    backgroundColor: "#f0f8ff",
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: "500",
  },
  suggestionCoords: {
    fontSize: 12,
    marginTop: 2,
  },
  noResults: {
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  noResultsText: {
    fontSize: 14,
  },
  geocodeBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  geocodeBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  geoError: {
    marginTop: 8,
    color: "#ff3b30",
    fontSize: 13,
  },
});
