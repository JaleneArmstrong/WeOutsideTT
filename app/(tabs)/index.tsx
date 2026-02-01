import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import {
  findNearestTaxiStands,
  findRelevantBusRoutes,
  findRelevantMaxiRoutes
} from "../../constants/transport-routes";
import { useEvents } from "../../context/EventContext";

const CLEAN_MAP_STYLE = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

const { height: screenHeight } = Dimensions.get("window");

export default function App() {
  const { events } = useEvents();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showTransportOptions, setShowTransportOptions] = useState(false);
  const [transportMode, setTransportMode] = useState<'bus' | 'taxi' | 'maxi' | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const selectedEventData = events.find((e) => e.id === selectedEvent);

  // Fetch actual route from OSRM
  const fetchRoute = async (start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }) => {
    setLoadingRoute(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map(
          ([lon, lat]: [number, number]) => ({ latitude: lat, longitude: lon })
        );
        setRouteCoordinates(coords);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      // Fallback to straight line
      setRouteCoordinates([start, end]);
    } finally {
      setLoadingRoute(false);
    }
  };

  // Fetch route when transport options are shown
  useEffect(() => {
    if (showTransportOptions && userLocation && selectedEventData) {
      fetchRoute(userLocation, selectedEventData.location);
    } else {
      setRouteCoordinates([]);
    }
  }, [showTransportOptions, userLocation, selectedEventData]);

  // Get relevant transport data based on location
  const relevantBusRoutes = (showTransportOptions && transportMode === 'bus' && userLocation && selectedEventData)
    ? findRelevantBusRoutes(userLocation.latitude, userLocation.longitude, selectedEventData.location.latitude, selectedEventData.location.longitude)
    : [];

  const relevantMaxiRoutes = (showTransportOptions && transportMode === 'maxi' && userLocation && selectedEventData)
    ? findRelevantMaxiRoutes(userLocation.latitude, userLocation.longitude, selectedEventData.location.latitude, selectedEventData.location.longitude)
    : [];

  const nearbyTaxiStands = (showTransportOptions && transportMode === 'taxi' && userLocation)
    ? findNearestTaxiStands(userLocation.latitude, userLocation.longitude, 3)
    : [];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        customMapStyle={CLEAN_MAP_STYLE}
        showsCompass={false}
        showsMyLocationButton={false}
        showsIndoors={false}
        showsTraffic={false}
        initialRegion={{
          latitude: 10.45,
          longitude: -61.3,
          latitudeDelta: 0.9,
          longitudeDelta: 0.9,
        }}
        showsUserLocation={true}
      >
        {/* Event markers */}
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.location.latitude,
              longitude: event.location.longitude,
            }}
            onPress={() => {
              setSelectedEvent(event.id);
              setShowEventDetails(true);
            }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Ionicons name="calendar" size={16} color="#fff" />
              </View>
            </View>
            <Callout style={styles.callout} tooltip>
              <View style={styles.calloutContent}>
                <Text style={styles.calloutTitle}>{event.title}</Text>
                <Text style={styles.calloutSubtext}>
                  {event.startDate}{event.endDate && event.endDate !== event.startDate ? ` — ${event.endDate}` : ''}
                  {event.startTime ? ` • ${event.startTime}` : ''}{event.endTime ? ` — ${event.endTime}` : ''}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Route line from user location to event using actual road route */}
        {showTransportOptions && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}

        {/* Bus route and stop markers */}
        {transportMode === 'bus' && relevantBusRoutes.map((route) => (
          <React.Fragment key={route.routeNumber}>
            {/* Bus route line */}
            <Polyline
              coordinates={route.stops.map(s => ({ latitude: s.latitude, longitude: s.longitude }))}
              strokeColor={route.color}
              strokeWidth={3}
              lineDashPattern={[10, 5]}
            />
            {/* Bus stops */}
            {route.stops.map((stop) => (
              <Marker
                key={stop.id}
                coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              >
                <View style={styles.busStopMarker}>
                  <Ionicons name="bus" size={20} color="#fff" />
                </View>
                <Callout style={styles.callout} tooltip>
                  <View style={styles.calloutContent}>
                    <Text style={styles.calloutTitle}>{stop.name}</Text>
                    <Text style={styles.calloutSubtext}>Route {route.routeNumber} - {route.routeName}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </React.Fragment>
        ))}

        {/* Maxi taxi route markers */}
        {transportMode === 'maxi' && relevantMaxiRoutes.map((route) => (
          <React.Fragment key={route.id}>
            {/* Maxi route polyline */}
            <Polyline
              coordinates={route.stops.map(stop => ({
                latitude: stop.latitude,
                longitude: stop.longitude,
              }))}
              strokeColor={route.colorCode}
              strokeWidth={4}
            />
            {/* Maxi stops */}
            {route.stops.map((stop) => (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }}
              >
                <View style={[styles.maxiStopMarker, { backgroundColor: route.colorCode }]}>
                  <Ionicons name="car-sport" size={18} color="#fff" />
                </View>
                <Callout style={styles.callout} tooltip>
                  <View style={styles.calloutContent}>
                    <Text style={styles.calloutTitle}>{stop.name}</Text>
                    <Text style={styles.calloutSubtext}>{route.color} - {route.routeName}</Text>
                    <Text style={styles.calloutSubtext}>Fare: {route.fare}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </React.Fragment>
        ))}

        {/* Taxi stand markers */}
        {transportMode === 'taxi' && nearbyTaxiStands.map((stand) => (
          <Marker
            key={stand.id}
            coordinate={{
              latitude: stand.latitude,
              longitude: stand.longitude,
            }}
          >
            <View style={styles.taxiStandMarker}>
              <Ionicons name="car" size={20} color="#fff" />
            </View>
            <Callout style={styles.callout} tooltip>
              <View style={styles.calloutContent}>
                <Text style={styles.calloutTitle}>{stand.name}</Text>
                <Text style={styles.calloutSubtext}>To: {stand.destinations.join(', ')}</Text>
                <Text style={styles.calloutSubtext}>Wait: {stand.estimatedWait}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Event details sheet */}
      {showEventDetails && selectedEventData && !showTransportOptions && (
        <View style={styles.detailsSheet}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>{selectedEventData.title}</Text>
            <TouchableOpacity onPress={() => setShowEventDetails(false)}>
              <Ionicons name="close-circle" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailsContent}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#007AFF" />
              <Text style={styles.detailText}>
                {selectedEventData.startDate}{selectedEventData.endDate && selectedEventData.endDate !== selectedEventData.startDate ? ` — ${selectedEventData.endDate}` : ''}
                {selectedEventData.startTime ? ` • ${selectedEventData.startTime}` : ''}{selectedEventData.endTime ? ` — ${selectedEventData.endTime}` : ''}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color="#007AFF" />
              <Text style={styles.detailText}>{selectedEventData.location.name}</Text>
            </View>

            <View style={styles.tagsRow}>
              <Ionicons name="pricetags" size={16} color="#007AFF" />
              <View style={styles.tagsList}>
                {selectedEventData.tags.map((tag) => (
                  <View key={tag} style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.descriptionLabel}>About this event:</Text>
            <Text style={styles.description}>{selectedEventData.description}</Text>

            {selectedEventData.creatorId && (
              <Text style={styles.creatorText}>By: {selectedEventData.creatorId}</Text>
            )}

            {/* Local transport options button */}
            <TouchableOpacity
              style={styles.transportButton}
              onPress={() => {
                setShowTransportOptions(true);
                setTransportMode('bus'); // Default to bus
              }}
            >
              <Ionicons name="bus" size={18} color="#fff" />
              <Text style={styles.transportButtonText}>Local transport options</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Transportation mode selector */}
      {showTransportOptions && selectedEventData && (
        <View style={styles.transportPanel}>
          <View style={styles.transportHeader}>
            <Text style={styles.transportTitle}>Choose Transport</Text>
            <TouchableOpacity
              onPress={() => {
                setShowTransportOptions(false);
                setTransportMode(null);
              }}
            >
              <Ionicons name="close-circle" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.transportModeContainer}>
            <TouchableOpacity
              style={[
                styles.transportModeButton,
                transportMode === 'bus' && styles.transportModeButtonActive,
              ]}
              onPress={() => setTransportMode('bus')}
            >
              <Ionicons
                name="bus"
                size={24}
                color={transportMode === 'bus' ? '#fff' : '#007AFF'}
              />
              <Text
                style={[
                  styles.transportModeText,
                  transportMode === 'bus' && styles.transportModeTextActive,
                ]}
              >
                Bus
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.transportModeButton,
                transportMode === 'maxi' && styles.transportModeButtonActive,
              ]}
              onPress={() => setTransportMode('maxi')}
            >
              <Ionicons
                name="car-sport"
                size={24}
                color={transportMode === 'maxi' ? '#fff' : '#007AFF'}
              />
              <Text
                style={[
                  styles.transportModeText,
                  transportMode === 'maxi' && styles.transportModeTextActive,
                ]}
              >
                Maxi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.transportModeButton,
                transportMode === 'taxi' && styles.transportModeButtonActive,
              ]}
              onPress={() => setTransportMode('taxi')}
            >
              <Ionicons
                name="car"
                size={24}
                color={transportMode === 'taxi' ? '#fff' : '#007AFF'}
              />
              <Text
                style={[
                  styles.transportModeText,
                  transportMode === 'taxi' && styles.transportModeTextActive,
                ]}
              >
                Taxi
              </Text>
            </TouchableOpacity>
          </View>

          {loadingRoute && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Finding best route...</Text>
            </View>
          )}

          {/* Transport info */}
          <ScrollView style={styles.transportInfoScroll} showsVerticalScrollIndicator={false}>
            {transportMode === 'bus' && relevantBusRoutes.length > 0 && (
              <View style={styles.transportInfo}>
                <Text style={styles.transportInfoTitle}>Bus Routes</Text>
                <Text style={styles.transportInfoText}>
                  {relevantBusRoutes.length} bus route{relevantBusRoutes.length !== 1 ? 's' : ''} available
                </Text>
                {relevantBusRoutes.map((route, index) => (
                  <View key={route.routeNumber} style={styles.stopItem}>
                    <View style={[styles.stopNumber, { backgroundColor: route.color }]}>
                      <Text style={styles.stopNumberText}>{route.routeNumber}</Text>
                    </View>
                    <View style={styles.stopInfo}>
                      <Text style={styles.stopName}>{route.routeName}</Text>
                      <Text style={styles.stopDetail}>{route.stops.length} stops along the route</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {transportMode === 'maxi' && relevantMaxiRoutes.length > 0 && (
              <View style={styles.transportInfo}>
                <Text style={styles.transportInfoTitle}>Maxi Taxi Routes</Text>
                <Text style={styles.transportInfoText}>
                  {relevantMaxiRoutes.length} maxi route{relevantMaxiRoutes.length !== 1 ? 's' : ''} available
                </Text>
                {relevantMaxiRoutes.map((route, index) => (
                  <View key={route.id} style={styles.stopItem}>
                    <View style={[styles.stopNumber, { backgroundColor: route.colorCode }]}>
                      <Ionicons name="car-sport" size={16} color="#fff" />
                    </View>
                    <View style={styles.stopInfo}>
                      <Text style={styles.stopName}>{route.color} - {route.routeName}</Text>
                      <Text style={styles.stopDetail}>
                        Fare: {route.fare} • {route.stops.length} stops
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {transportMode === 'taxi' && nearbyTaxiStands.length > 0 && (
              <View style={styles.transportInfo}>
                <Text style={styles.transportInfoTitle}>Taxi Stand Information</Text>
                <Text style={styles.transportInfoText}>
                  {nearbyTaxiStands.length} taxi stand{nearbyTaxiStands.length !== 1 ? 's' : ''} nearby
                </Text>
                {nearbyTaxiStands.map((stand, index) => (
                  <View key={stand.id} style={styles.stopItem}>
                    <View style={styles.stopNumber}>
                      <Text style={styles.stopNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.stopInfo}>
                      <Text style={styles.stopName}>{stand.name}</Text>
                      <Text style={styles.stopDetail}>
                        To: {stand.destinations.join(', ')}
                      </Text>
                      <Text style={styles.stopDetail}>
                        Wait: {stand.estimatedWait}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {transportMode && (
              (transportMode === 'bus' && relevantBusRoutes.length === 0) ||
              (transportMode === 'maxi' && relevantMaxiRoutes.length === 0) ||
              (transportMode === 'taxi' && nearbyTaxiStands.length === 0)
            ) && !loadingRoute && (
              <View style={styles.noTransportInfo}>
                <Ionicons name="information-circle" size={48} color="#ccc" />
                <Text style={styles.noTransportText}>
                  No {transportMode} {transportMode === 'maxi' ? 'routes' : transportMode === 'bus' ? 'routes' : 'stands'} found for this location
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Event count badge */}
      {events.length > 0 && (
        <View style={styles.eventCountBadge}>
          <Text style={styles.eventCountText}>{events.length} event{events.length !== 1 ? 's' : ''}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  callout: {
    width: 200,
  },
  calloutContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  calloutSubtext: {
    fontSize: 12,
    color: "#666",
  },
  detailsSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    maxHeight: screenHeight * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  detailsContent: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    gap: 6,
  },
  tagBadge: {
    backgroundColor: "#E8F4FF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  tagBadgeText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  descriptionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  description: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  creatorText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginTop: 8,
  },
  eventCountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  eventCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  transportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34C759",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  transportButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  busStopMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF9500",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  taxiStandMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD60A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  transportPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    maxHeight: screenHeight * 0.65,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  transportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  transportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  transportModeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  transportModeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    backgroundColor: "#fff",
    gap: 8,
  },
  transportModeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  transportModeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  transportModeTextActive: {
    color: "#fff",
  },
  transportInfo: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
  },
  transportInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  transportInfoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  stopItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  stopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  stopNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  stopDetail: {
    fontSize: 12,
    color: "#666",
  },
  maxiStopMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  maxiStops: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  transportInfoScroll: {
    maxHeight: screenHeight * 0.4,
  },
  noTransportInfo: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  noTransportText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
