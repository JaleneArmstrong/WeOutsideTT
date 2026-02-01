import EventDetails from "@/components/EventDetails";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  PanResponder,
  View,
} from "react-native";
import MapLayer, { EventType } from "../components/MapLayer";
import SearchBar from "../components/SearchBar";
import { Colors } from "../constants/theme";
import { EXPANDED_HEIGHT, getStyles } from "../styles/mapStyles";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const COLLAPSED_HEIGHT = 0;
const SEARCH_BAR_HEIGHT = 70;
const MAX_DRAG_HEIGHT = SCREEN_HEIGHT - SEARCH_BAR_HEIGHT - 20;

const EVENTS: EventType[] = [
  {
    id: 1,
    name: "Paramin Parang",
    dist: "1.2km",
    vibe: "COOL DOWN",
    coords: { lat: 10.73, lng: -61.55 },
    status: "Open Now",
    description:
      "Experience the ultimate cool down in the hills of Paramin. Known for its chilly atmosphere and authentic parang music, this is the go-to spot for a relaxed Sunday lime.",
  },
  {
    id: 2,
    name: "Arima Market Lime",
    dist: "5.0km",
    vibe: "THE PUMP",
    coords: { lat: 10.63, lng: -61.28 },
    status: "Starting Soon",
    description:
      "The heart of the borough! Join the energy at the Arima Market. High-energy music, street food, and the best 'pump' you'll find in the East.",
  },
  {
    id: 3,
    name: "Maracas Bay Sunday",
    dist: "12km",
    vibe: "BELLY FULL",
    coords: { lat: 10.76, lng: -61.44 },
    status: "Busy",
    description:
      "No Sunday is complete without a Maracas run. Come for the Bake and Shark, stay for the sunset and the unmatched beach vibes.",
  },
];

export default function MapScreen() {
  const styles = getStyles(Colors.light);
  const [selectedEvent, setSelectedEvent] = useState<EventType | undefined>();
  const slideAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const slideValueRef = useRef(COLLAPSED_HEIGHT);

  useEffect(() => {
    const listener = slideAnim.addListener(({ value }) => {
      slideValueRef.current = value;
    });
    return () => slideAnim.removeListener(listener);
  }, [slideAnim]);

  const animateTo = (toValue: number) => {
    Animated.spring(slideAnim, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = slideValueRef.current - gestureState.dy;
        const clampedHeight = Math.max(
          COLLAPSED_HEIGHT,
          Math.min(newHeight, MAX_DRAG_HEIGHT),
        );
        slideAnim.setValue(clampedHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        const current = slideValueRef.current;
        const midExpanded = (EXPANDED_HEIGHT + MAX_DRAG_HEIGHT) / 2;
        const midCollapsed = (COLLAPSED_HEIGHT + EXPANDED_HEIGHT) / 2;

        if (gestureState.dy < -80) animateTo(MAX_DRAG_HEIGHT);
        else if (gestureState.dy > 80) animateTo(COLLAPSED_HEIGHT);
        else {
          if (current >= midExpanded) animateTo(MAX_DRAG_HEIGHT);
          else if (current >= midCollapsed) animateTo(EXPANDED_HEIGHT);
          else animateTo(COLLAPSED_HEIGHT);
        }
      },
    }),
  ).current;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {});
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {});
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <MapLayer
        events={EVENTS}
        selectedEvent={selectedEvent}
        onMapPress={() => {
          setSelectedEvent(undefined);
          animateTo(COLLAPSED_HEIGHT);
        }}
        onPinPress={(event) => {
          setSelectedEvent(event);
          animateTo(EXPANDED_HEIGHT);
        }}
      />

      <View style={styles.floatingSearchContainer}>
        <SearchBar
          isExpanded={false}
          onFocus={() => {
            setSelectedEvent(undefined);
          }}
          onCancel={() => {
            animateTo(COLLAPSED_HEIGHT);
          }}
        />
      </View>

      <Animated.View
        style={[styles.overlayContainer, { height: slideAnim, zIndex: 101 }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragHandle} />

        <View style={styles.bottomCardContent}>
          {selectedEvent && <EventDetails event={selectedEvent} />}
        </View>
      </Animated.View>
    </View>
  );
}
