import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import { useEvents } from "../../context/EventContext";
import { findMaxiRouteByProximity } from "../../utils/maxiRoutes";
import { fetchOSRMRoute } from "../../utils/routeService";

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
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [showRoute, setShowRoute] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [showTransportOptions, setShowTransportOptions] = useState(false);
  const mapRef = useRef<MapView>(null);

  const selectedEventData = events.find((e) => e.id === selectedEvent);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show routes.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const fetchRoute = async (eventLat: number, eventLon: number) => {
    if (!userLocation) {
      Alert.alert(
        "Location Not Available",
        "Unable to get your current location.",
      );
      return;
    }

    setLoadingRoute(true);
    try {
      const coordinates = await fetchOSRMRoute(
        userLocation.latitude,
        userLocation.longitude,
        eventLat,
        eventLon,
      );

      setRouteCoordinates(coordinates);
      setShowRoute(true);

      if (mapRef.current && coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      Alert.alert("Route Not Found", "Unable to find a route to this event.");
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleMarkerPress = (eventId: string) => {
    setSelectedEvent(eventId);
    setShowEventDetails(true);
    setShowRoute(false);
    setRouteCoordinates([]);
  };

  const handleCloseDetails = () => {
    setShowEventDetails(false);
    setShowRoute(false);
    setRouteCoordinates([]);
    setShowTransportOptions(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
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
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.location.latitude,
              longitude: event.location.longitude,
            }}
            onPress={() => handleMarkerPress(event.id)}
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
                  {event.startDate}
                  {event.endDate && event.endDate !== event.startDate
                    ? ` — ${event.endDate}`
                    : ""}
                  {event.startTime ? ` • ${event.startTime}` : ""}
                  {event.endTime ? ` — ${event.endTime}` : ""}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Route polyline */}
        {showRoute && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007AFF"
            strokeWidth={4}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {showEventDetails && selectedEventData && (
        <View style={styles.detailsSheet}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>{selectedEventData.title}</Text>
            <TouchableOpacity onPress={handleCloseDetails}>
              <Ionicons name="close-circle" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailsContent}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#007AFF" />
              <Text style={styles.detailText}>
                {selectedEventData.startDate}
                {selectedEventData.endDate &&
                selectedEventData.endDate !== selectedEventData.startDate
                  ? ` — ${selectedEventData.endDate}`
                  : ""}
                {selectedEventData.startTime
                  ? ` • ${selectedEventData.startTime}`
                  : ""}
                {selectedEventData.endTime
                  ? ` — ${selectedEventData.endTime}`
                  : ""}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color="#007AFF" />
              <Text style={styles.detailText}>
                {selectedEventData.location.name}
              </Text>
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
            <Text style={styles.description}>
              {selectedEventData.description}
            </Text>

            {selectedEventData.creatorId && (
              <Text style={styles.creatorText}>
                By: {selectedEventData.creatorId}
              </Text>
            )}

            {/* Local Transport Options button */}
            <TouchableOpacity
              style={styles.transportButton}
              onPress={() => {
                if (!showTransportOptions) {
                  fetchRoute(
                    selectedEventData.location.latitude,
                    selectedEventData.location.longitude,
                  );
                  setShowTransportOptions(true);
                } else {
                  setShowTransportOptions(false);
                  setShowRoute(false);
                  setRouteCoordinates([]);
                }
              }}
              disabled={loadingRoute || !userLocation}
            >
              {loadingRoute ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="bus-outline" size={20} color="#fff" />
                  <Text style={styles.transportButtonText}>
                    {showTransportOptions
                      ? "Hide Transport Options"
                      : "Local Transport Options"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Transport Options View */}
      {showTransportOptions && selectedEventData && (
        <View style={styles.transportSheet}>
          <View style={styles.transportHeader}>
            <Text style={styles.transportTitle}>Local Transport Options</Text>
            <TouchableOpacity
              onPress={() => {
                setShowTransportOptions(false);
                setShowRoute(false);
                setRouteCoordinates([]);
              }}
            >
              <Ionicons name="close-circle" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.transportContent}>
            {/* Maxi Option */}
            <View style={styles.transportOption}>
              <View style={styles.transportOptionHeader}>
                <Ionicons name="bus" size={24} color="#007AFF" />
                <Text style={styles.transportOptionTitle}>Maxi Taxi</Text>
              </View>

              {(() => {
                if (!userLocation) {
                  return (
                    <Text style={styles.noRouteText}>
                      Getting your location...
                    </Text>
                  );
                }

                const maxiInfo = findMaxiRouteByProximity(
                  userLocation.latitude,
                  userLocation.longitude,
                  selectedEventData.location.latitude,
                  selectedEventData.location.longitude,
                );

                if (maxiInfo) {
                  const {
                    route,
                    fromStop,
                    toStop,
                    distanceToStart,
                    distanceFromEnd,
                  } = maxiInfo;
                  return (
                    <View style={styles.maxiRouteContainer}>
                      <View style={styles.maxiBandContainer}>
                        <View
                          style={[
                            styles.maxiBandTop,
                            { backgroundColor: route.colorCode },
                          ]}
                        />
                        <View style={styles.maxiBandMiddle} />
                        <View
                          style={[
                            styles.maxiBandBottom,
                            { backgroundColor: route.colorCode },
                          ]}
                        />
                      </View>
                      <View style={styles.maxiRouteInfo}>
                        <Text style={styles.maxiBandLabel}>
                          {route.color.charAt(0).toUpperCase() +
                            route.color.slice(1)}{" "}
                          Band
                        </Text>
                        <Text style={styles.maxiRouteText}>{route.route}</Text>
                        <View style={styles.routeDirectionContainer}>
                          <View style={styles.routePoint}>
                            <Ionicons
                              name="location"
                              size={16}
                              color="#007AFF"
                            />
                            <Text style={styles.routePointText}>
                              {fromStop}
                            </Text>
                          </View>
                          <Ionicons
                            name="arrow-forward"
                            size={16}
                            color="#999"
                            style={styles.routeArrow}
                          />
                          <View style={styles.routePoint}>
                            <Ionicons name="flag" size={16} color="#FF3B30" />
                            <Text style={styles.routePointText}>{toStop}</Text>
                          </View>
                        </View>
                        {distanceToStart > 1 && (
                          <View style={styles.distanceNote}>
                            <Ionicons
                              name="information-circle-outline"
                              size={14}
                              color="#FF9500"
                            />
                            <Text style={styles.distanceNoteText}>
                              Get to {fromStop} ({distanceToStart.toFixed(1)} km
                              away) to catch this maxi
                            </Text>
                          </View>
                        )}
                        {distanceFromEnd > 1 && (
                          <View style={styles.distanceNote}>
                            <Ionicons
                              name="information-circle-outline"
                              size={14}
                              color="#FF9500"
                            />
                            <Text style={styles.distanceNoteText}>
                              Event is {distanceFromEnd.toFixed(1)} km from{" "}
                              {toStop} maxi stop
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <Text style={styles.noRouteText}>
                      No direct maxi route found between your location and the
                      event. You may need to take multiple maxis or alternative
                      transport.
                    </Text>
                  );
                }
              })()}
            </View>

            {/* Bus Option (Greyed out) */}
            <View
              style={[styles.transportOption, styles.transportOptionDisabled]}
            >
              <View style={styles.transportOptionHeader}>
                <Ionicons name="bus-outline" size={24} color="#CCC" />
                <Text
                  style={[styles.transportOptionTitle, styles.disabledText]}
                >
                  Bus
                </Text>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              </View>
              <Text style={styles.disabledText}>
                Bus routes will be available in a future update.
              </Text>
            </View>

            {/* Taxi Option (Greyed out) */}
            <View
              style={[styles.transportOption, styles.transportOptionDisabled]}
            >
              <View style={styles.transportOptionHeader}>
                <Ionicons name="car-outline" size={24} color="#CCC" />
                <Text
                  style={[styles.transportOptionTitle, styles.disabledText]}
                >
                  Taxi
                </Text>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              </View>
              <Text style={styles.disabledText}>
                Taxi services will be available in a future update.
              </Text>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Event count badge */}
      {events.length > 0 && (
        <View style={styles.eventCountBadge}>
          <Text style={styles.eventCountText}>
            {events.length} event{events.length !== 1 ? "s" : ""}
          </Text>
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
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  transportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  transportSheet: {
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
    maxHeight: screenHeight * 0.7,
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
    flex: 1,
  },
  transportContent: {
    flex: 1,
  },
  transportOption: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  transportOptionDisabled: {
    opacity: 0.5,
  },
  transportOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  transportOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  comingSoonBadge: {
    backgroundColor: "#FFF3CD",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  comingSoonText: {
    fontSize: 10,
    color: "#856404",
    fontWeight: "600",
  },
  disabledText: {
    color: "#999",
  },
  maxiRouteContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  maxiBandContainer: {
    width: 40,
    height: 60,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  maxiBandTop: {
    flex: 2,
    width: "100%",
  },
  maxiBandMiddle: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  maxiBandBottom: {
    flex: 1,
    width: "100%",
  },
  maxiRouteInfo: {
    flex: 1,
  },
  maxiBandLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  maxiRouteText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    lineHeight: 16,
  },
  routeDirectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  routePointText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
  routeArrow: {
    marginHorizontal: 4,
  },
  noRouteText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    fontStyle: "italic",
  },
  distanceNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: "#FFF9E6",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#FF9500",
  },
  distanceNoteText: {
    fontSize: 11,
    color: "#856404",
    flex: 1,
    lineHeight: 14,
  },
});
