import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
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
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const selectedEventData = events.find((e) => e.id === selectedEvent);

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
      </MapView>

      {showEventDetails && selectedEventData && (
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
          </View>
        </View>
      )}

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
});
