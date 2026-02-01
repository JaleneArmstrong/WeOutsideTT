import EventDetails from "@/components/EventDetails";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  View,
} from "react-native";
import MapLayer, { EventType } from "../components/MapLayer";
import SearchBar from "../components/SearchBar";
import { Colors } from "../constants/theme";
import { useEvents } from "../context/EventContext";
import { EXPANDED_HEIGHT, getStyles } from "../styles/mapStyles";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const COLLAPSED_HEIGHT = 0;
const SEARCH_BAR_HEIGHT = 70;
const MAX_DRAG_HEIGHT = SCREEN_HEIGHT - SEARCH_BAR_HEIGHT - 20;
const BRAND_RED = "#D90429";

export default function MapScreen() {
  const styles = getStyles(Colors.light);
  const router = useRouter();
  const { events } = useEvents();

  const mapEvents: EventType[] = events.map((e) => {
    const startDate = e.startDate || "Date TBD";
    const endDate =
      e.endDate && e.endDate !== e.startDate ? ` — ${e.endDate}` : "";
    const startTime = e.startTime ? ` • ${e.startTime}` : "";
    const endTime = e.endTime ? ` — ${e.endTime}` : "";

    const dateStr = `${startDate}${endDate}${startTime}${endTime}`;

    return {
      id: Number(e.id) || Date.now(),
      name: e.title || "Untitled Lime",
      dist: "Nearby",
      vibe: e.tags && e.tags[0] ? e.tags[0].toUpperCase() : "LIME",
      coords: {
        lat: e.location?.latitude || 10.65,
        lng: e.location?.longitude || -61.5,
      },
      status: e.startTime ? `Starts ${e.startTime}` : "Open Now",
      description: e.description || "No description provided.",
      fullDateDisplay: dateStr,
      locationName: e.location?.name || "Trinidad & Tobago",
      tags: e.tags || [],
      creator: e.creatorId || "Promoter",
    };
  });

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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <MapLayer
        events={mapEvents}
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
      <View
        style={[
          styles.floatingSearchContainer,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingHorizontal: 10,
            width: "100%",
            position: "absolute",
            top: 60,
          },
        ]}
      >
        <View style={{ width: "75%" }}>
          <SearchBar
            isExpanded={false}
            onFocus={() => {
              setSelectedEvent(undefined);
              animateTo(COLLAPSED_HEIGHT);
            }}
            onCancel={() => {
              animateTo(COLLAPSED_HEIGHT);
            }}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#FFF",
            width: 48,
            height: 48,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: BRAND_RED,
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          }}
          onPress={() => router.push("/PromoterDashboard")}
        >
          <Ionicons name="megaphone" size={22} color={BRAND_RED} />
        </TouchableOpacity>
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
