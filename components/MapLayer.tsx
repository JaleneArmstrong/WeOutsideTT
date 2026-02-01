import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { COLLAPSED_HEIGHT, styles } from "../styles/mapStyles";

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
];

interface MapLayerProps {
  events: any[];
  isExpanded: boolean;
  onMapPress?: () => void;
}

export default function MapLayer({
  events,
  isExpanded,
  onMapPress,
}: MapLayerProps) {
  return (
    <View style={styles.mapContainer} onTouchEnd={onMapPress}>
      <MapView
        style={styles.map}
        customMapStyle={CLEAN_MAP_STYLE}
        showsUserLocation={true}
        mapPadding={{
          top: 0,
          right: 0,
          bottom: isExpanded ? 0 : COLLAPSED_HEIGHT - 20,
          left: 0,
        }}
        initialRegion={{
          latitude: 10.6,
          longitude: -61.3,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.coords.lat,
              longitude: event.coords.lng,
            }}
            pinColor="#CE1126"
          />
        ))}
      </MapView>
    </View>
  );
}
