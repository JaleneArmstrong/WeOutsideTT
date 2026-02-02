import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { getStyles } from "../styles/mapStyles";

export interface EventType {
  id: number;
  name: string;
  dist: string;
  vibe: string;
  coords: {
    lat: number;
    lng: number;
  };
  status?: string;
  description?: string;
  image?: string | null;
  fullDateDisplay?: string;
  locationName?: string;
  tags?: string[];
  creator?: string;
}

const afternoonStyle = [
  { elementType: "geometry", stylers: [{ color: "#fde7c2" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f9a66f" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e78b6d" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f47c5b" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d9534f" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#6ea8d1" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a78b0" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#a8d5ba" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3b6e3b" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f08a5d" }],
  },
];

const nightStyle = [
  { elementType: "geometry", stylers: [{ color: "#080a12" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#080a12" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#f2f2f2" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e2b44" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0a0c14" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2c3e60" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0a0c14" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#06112f" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5da4ff" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#0e3a27" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6ce29c" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#ffc966" }],
  },
];

const TnT_BOUNDS = { north: 11.4, south: 10.0, east: -60.7, west: -61.9 };
const ZOOM_LIMITS = { minLatDelta: 0.002, maxLatDelta: 1.4 };

interface MapLayerProps {
  events: EventType[];
  selectedEvent?: EventType | null;
  onMapPress?: () => void;
  onPinPress?: (event: EventType) => void;
  routePath?: { latitude: number; longitude: number }[];
}

export default function MapLayer({
  events = [],
  selectedEvent,
  onMapPress,
  onPinPress,
  routePath = [],
}: MapLayerProps) {
  const styles = getStyles("light");
  const mapRef = useRef<MapView>(null);
  const isInteracting = useRef(false);
  const pendingPopupEvent = useRef<EventType | null>(null);

  const [mapStyle, setMapStyle] = useState<any[]>([]);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) setMapStyle(nightStyle);
    else if (hour >= 16 && hour < 18) setMapStyle(afternoonStyle);
    else setMapStyle([]);
  }, []);

  // When an outside component selects an event programmatically,
  // animate the map and queue a popup for it (so popupPos is calculated)
  useEffect(() => {
    if (selectedEvent && mapRef.current) {
      pendingPopupEvent.current = selectedEvent;
      mapRef.current.animateToRegion(
        {
          latitude: selectedEvent.coords.lat,
          longitude: selectedEvent.coords.lng,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        },
        400,
      );
    }
  }, [selectedEvent]);
  const handlePinPress = (event: EventType) => {
    setPopupPos(null);
    pendingPopupEvent.current = event;
    onPinPress?.(event);

    mapRef.current?.animateToRegion(
      {
        latitude: event.coords.lat,
        longitude: event.coords.lng,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      400,
    );
  };

  const handleRegionChange = () => {
    if (isInteracting.current && popupPos) {
      setPopupPos(null);
      onMapPress?.();
    }
  };

  const handleRegionChangeComplete = async (region: Region) => {
    isInteracting.current = false;

    let latitudeDelta = Math.max(
      ZOOM_LIMITS.minLatDelta,
      Math.min(region.latitudeDelta, ZOOM_LIMITS.maxLatDelta),
    );

    let longitudeDelta =
      latitudeDelta / (region.latitudeDelta / region.longitudeDelta);

    const clampedLat = Math.max(
      TnT_BOUNDS.south + latitudeDelta / 2,
      Math.min(region.latitude, TnT_BOUNDS.north - latitudeDelta / 2),
    );

    const clampedLng = Math.max(
      TnT_BOUNDS.west + longitudeDelta / 2,
      Math.min(region.longitude, TnT_BOUNDS.east - longitudeDelta / 2),
    );

    const needsClamp =
      clampedLat !== region.latitude ||
      clampedLng !== region.longitude ||
      latitudeDelta !== region.latitudeDelta ||
      longitudeDelta !== region.longitudeDelta;

    if (needsClamp) {
      mapRef.current?.animateToRegion(
        {
          latitude: clampedLat,
          longitude: clampedLng,
          latitudeDelta,
          longitudeDelta,
        },
        250,
      );
      return;
    }

    if (pendingPopupEvent.current && mapRef.current) {
      try {
        const point = await mapRef.current.pointForCoordinate({
          latitude: pendingPopupEvent.current.coords.lat,
          longitude: pendingPopupEvent.current.coords.lng,
        });

        setPopupPos(point);
      } catch (e) {
        console.warn("Popup calculation failed");
      } finally {
        pendingPopupEvent.current = null;
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider="google"
        style={{ flex: 1 }}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: 10.63,
          longitude: -61.28,
          latitudeDelta: 1.4,
          longitudeDelta: 1.4,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        scrollEnabled
        zoomEnabled
        pitchEnabled={false}
        onPanDrag={() => {
          isInteracting.current = true;
        }}
        onPress={() => {
          setPopupPos(null);
          onMapPress?.();
        }}
        onRegionChange={handleRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.coords.lat,
              longitude: event.coords.lng,
            }}
            pinColor="#CE1126"
            onPress={() => handlePinPress(event)}
          />
        ))}
      </MapView>

      {selectedEvent && popupPos && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: popupPos.x - 130,
            top: popupPos.y - 155,
            width: 260,
            zIndex: 100,
          }}
        >
          <View style={styles.popupBubble}>
            <View style={styles.popupHeader}>
              <View style={styles.popupIcon}>
                <Ionicons name="musical-notes" size={20} color="#fff" />
              </View>
              <View style={styles.popupTextContainer}>
                <Text style={styles.popupTitle} numberOfLines={1}>
                  {selectedEvent.name}
                </Text>
                <Text style={styles.popupVibe}>{selectedEvent.vibe}</Text>
              </View>
            </View>
          </View>
          <View style={styles.popupPointer} />
        </View>
      )}
    </View>
  );
}
