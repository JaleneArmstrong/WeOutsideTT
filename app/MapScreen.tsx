import EventDetails from "@/components/EventDetails";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
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
import { findMaxiRouteByProximity, MaxiRouteInfo } from "../utils/maxiRoutes";
import { fetchOSRMRoute } from "../utils/routeService";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const COLLAPSED_HEIGHT = 0;
const SEARCH_BAR_HEIGHT = 70;
const MAX_DRAG_HEIGHT = SCREEN_HEIGHT - SEARCH_BAR_HEIGHT - 20;
const BRAND_RED = "#D90429";

export default function MapScreen() {
  const styles = getStyles(Colors.light);
  const router = useRouter();
  const { events } = useEvents();

  const [selectedEvent, setSelectedEvent] = useState<EventType | undefined>();
  const [showTransportOptions, setShowTransportOptions] = useState(false);
  const [maxiInfo, setMaxiInfo] = useState<MaxiRouteInfo | null>(null);
  const [routePath, setRoutePath] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userLocationAvailable, setUserLocationAvailable] = useState(false);

  const slideAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const slideValueRef = useRef(COLLAPSED_HEIGHT);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    async function startTracking() {
      try {
        const lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown) {
          setUserLocation({
            latitude: lastKnown.coords.latitude,
            longitude: lastKnown.coords.longitude,
          });
          setUserLocationAvailable(true);
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (newLocation) => {
            setUserLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            });
            setUserLocationAvailable(true);
          },
        );
      } catch (error) {
        console.error("Location tracking error:", error);
        setUserLocationAvailable(false);
      }
    }

    startTracking();

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, []);

  const mapEvents: EventType[] = events.map((e) => {
    const startDate = e.startDate || "Date TBD";
    const dateStr = `${startDate}${e.startTime ? ` • ${e.startTime}` : ""}`;

    return {
      id: Number(e.id) || Date.now(),
      name: e.title || "Untitled Lime",
      dist: "Nearby",
      vibe: e.tags?.[0]?.toUpperCase() || "LIME",
      coords: {
        lat: e.location.latitude,
        lng: e.location.longitude,
      },
      status: e.startTime ? `Starts ${e.startTime}` : "Open Now",
      description: e.description || "No description provided.",
      fullDateDisplay: dateStr,
      locationName: e.location.name,
      tags: e.tags || [],
      creator: e.creatorId || "Promoter",
      image: e.image,
    };
  });

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

  const handleRequestRoute = async (event: EventType) => {
    if (!userLocation) {
      Alert.alert(
        "Locating...",
        "Please wait while we find your GPS position.",
      );
      return;
    }

    if (showTransportOptions) {
      setShowTransportOptions(false);
      setRoutePath([]);
      setMaxiInfo(null);
      return;
    }

    try {
      const info = findMaxiRouteByProximity(
        userLocation.latitude,
        userLocation.longitude,
        event.coords.lat,
        event.coords.lng,
      );

      setMaxiInfo(info);
      setShowTransportOptions(true);
      animateTo(MAX_DRAG_HEIGHT);

      const path = await fetchOSRMRoute(
        userLocation.latitude,
        userLocation.longitude,
        event.coords.lat,
        event.coords.lng,
      );
      setRoutePath(path);
    } catch (error) {
      Alert.alert(
        "Route Error",
        "Could not calculate path. Check your data connection.",
      );
    }
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
        if (gestureState.dy < -80) animateTo(MAX_DRAG_HEIGHT);
        else if (gestureState.dy > 80) animateTo(COLLAPSED_HEIGHT);
        else {
          if (current >= (EXPANDED_HEIGHT + MAX_DRAG_HEIGHT) / 2)
            animateTo(MAX_DRAG_HEIGHT);
          else if (current >= EXPANDED_HEIGHT / 2) animateTo(EXPANDED_HEIGHT);
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
        routePath={routePath}
        onMapPress={() => {
          setSelectedEvent(undefined);
          setShowTransportOptions(false);
          setRoutePath([]);
          animateTo(COLLAPSED_HEIGHT);
        }}
        onPinPress={(event) => {
          setSelectedEvent(event);
          setShowTransportOptions(false);
          setRoutePath([]);
          animateTo(EXPANDED_HEIGHT);
        }}
      />

      <View
        style={[
          styles.floatingSearchContainer,
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            position: "absolute",
            top: 60,
            paddingHorizontal: 10,
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
          }}
          onPress={() => router.push("/PromoterDashboard")}
        >
          <Ionicons name="megaphone" size={22} color={BRAND_RED} />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.overlayContainer, { height: slideAnim, zIndex: 101 }]}
      >
        <View
          style={{
            width: "100%",
            height: 45,
            justifyContent: "center",
            alignItems: "center",
          }}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragHandle} />
        </View>

        <View style={{ flex: 1 }}>
          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onRequestRoute={() => handleRequestRoute(selectedEvent)}
              showTransportOptions={showTransportOptions}
              maxiInfo={maxiInfo}
              userLocationAvailable={userLocationAvailable}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
}
