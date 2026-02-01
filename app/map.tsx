import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, TextInput, View } from "react-native";
import EventList from "../components/EventList";
import MapLayer from "../components/MapLayer";
import SearchBar from "../components/SearchBar";
import { COLLAPSED_HEIGHT, EXPANDED_HEIGHT, styles } from "../styles/mapStyles";

// TODO: Move To Database
const EVENTS = [
  {
    id: 1,
    name: "Paramin Parang",
    dist: "1.2km",
    vibe: "Cool Down",
    type: "Nature",
    coords: { lat: 10.73, lng: -61.55 },
  },
  {
    id: 2,
    name: "Felicity Ramleela",
    dist: "3.5km",
    vibe: "Cultural",
    type: "Festival",
    coords: { lat: 10.53, lng: -61.43 },
  },
  {
    id: 3,
    name: "Arima Market Lime",
    dist: "5.0km",
    vibe: "The Pump",
    type: "Food",
    coords: { lat: 10.63, lng: -61.28 },
  },
  {
    id: 4,
    name: "Maracas Bay Sunday",
    dist: "12km",
    vibe: "Belly Full",
    type: "Beach",
    coords: { lat: 10.76, lng: -61.44 },
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  const expandList = () => {
    setIsExpanded(true);
    Animated.timing(slideAnim, {
      toValue: EXPANDED_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const collapseList = () => {
    Keyboard.dismiss();
    inputRef.current?.blur();
    setIsExpanded(false);
    Animated.timing(slideAnim, {
      toValue: COLLAPSED_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      <StatusBar style="light" />
      <MapLayer
        events={EVENTS}
        isExpanded={isExpanded}
        onMapPress={isExpanded ? collapseList : undefined}
      />

      <Animated.View style={[styles.overlayContainer, { height: slideAnim }]}>
        <SearchBar
          ref={inputRef}
          isExpanded={isExpanded}
          onFocus={expandList}
          onCancel={collapseList}
        />
        <EventList events={EVENTS} isExpanded={isExpanded} />
      </Animated.View>
    </View>
  );
}
