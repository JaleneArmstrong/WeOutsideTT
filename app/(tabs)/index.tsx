import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

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

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

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
      />
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
});
