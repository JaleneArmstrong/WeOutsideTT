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
  Keyboard,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapLayer, { EventType } from "../components/MapLayer";
import SearchBar from "../components/SearchBar";
import { Colors } from "../constants/theme";
import { EVENT_TAGS, useEvents } from "../context/EventContext";
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
        lat: e.location?.latitude || 10.65,
        lng: e.location?.longitude || -61.5,
      },
      status: e.startTime ? `Starts ${e.startTime}` : "Open Now",
      description: e.description || "No description provided.",
      fullDateDisplay: dateStr,
      locationName: e.location?.name || "Trinidad & Tobago",
      tags: e.tags || [],
      creator: e.creatorId || "Promoter",
      image: e.image,
    };
  });

  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef<any>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredEvents = mapEvents.filter((e) => {
    const q = searchText.trim().toLowerCase();
    const matchesSearch = !q
      ? true
      : e.name.toLowerCase().includes(q) ||
        (e.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (e.description || "").toLowerCase().includes(q) ||
        (e.locationName || "").toLowerCase().includes(q);

    const matchesTags =
      selectedTags.length === 0 ||
      (e.tags || []).some((t) =>
        selectedTags.some((st) => st.toLowerCase() === t.toLowerCase()),
      );

    return matchesSearch && matchesTags;
  });

  // When search expands, ensure keyboard shows and suggestions/filters are visible
  const handleFocusSearch = () => {
    setSelectedEvent(undefined);
    animateTo(COLLAPSED_HEIGHT);
    setSearchExpanded(true);
  };

  const handleCancelSearch = () => {
    setSearchText("");
    setSelectedEvent(undefined);
    animateTo(COLLAPSED_HEIGHT);
    setSearchExpanded(false);
  };

  const handleSearchSubmit = (text: string) => {
    const q = text.trim().toLowerCase();
    if (!q) return;
    const match = filteredEvents.find(
      (ev) =>
        ev.name.toLowerCase().includes(q) ||
        (ev.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (ev.description || "").toLowerCase().includes(q) ||
        (ev.locationName || "").toLowerCase().includes(q),
    );

    if (match) {
      setSelectedEvent(match);
      setShowTransportOptions(false);
      setRoutePath([]);
      animateTo(EXPANDED_HEIGHT);
    }
  };

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
        events={filteredEvents}
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
            justifyContent: "center",
            gap: 8,
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
          },
        ]}
      >
        <View style={{ width: "80%", alignSelf: "center" }}>
          <SearchBar
            ref={searchRef}
            value={searchText}
            onChangeText={setSearchText}
            onSubmit={handleSearchSubmit}
            isExpanded={false}
            showCancel={false}
            onFocus={handleFocusSearch}
            onCancel={handleCancelSearch}
          />

          {searchText.trim() !== "" && !searchExpanded && (
            <View style={styles.searchSuggestions}>
              {filteredEvents.length === 0 ? (
                <View style={styles.suggestionItem}>
                  <Text style={styles.suggestionTitle}>No results</Text>
                </View>
              ) : (
                filteredEvents.slice(0, 5).map((ev) => (
                  <TouchableOpacity
                    key={ev.id}
                    style={styles.suggestionItem}
                    onPress={() => {
                      Keyboard.dismiss();
                      searchRef.current?.blur();
                      setSearchText("");
                      setSelectedEvent(ev);
                      setShowTransportOptions(false);
                      setRoutePath([]);
                      setSearchExpanded(false);
                      animateTo(EXPANDED_HEIGHT);
                    }}
                  >
                    <Text style={styles.suggestionTitle} numberOfLines={1}>
                      {ev.name}
                    </Text>
                    <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                      {ev.locationName}
                    </Text>
                  </TouchableOpacity>
                ))
              )}

              {/* Tag filter chips */}
              <View style={{ marginTop: 8 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {EVENT_TAGS.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        style={[
                          styles.tagFilterChip,
                          active && styles.tagFilterChipActive,
                        ]}
                      >
                        <Text
                          style={
                            active
                              ? styles.tagFilterChipTextActive
                              : styles.tagFilterChipText
                          }
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 16,
            backgroundColor: "#FFF",
            width: 40,
            height: 40,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1.2,
            borderColor: BRAND_RED,
          }}
          onPress={() => router.push("/PromoterDashboard")}
        >
          <Ionicons name="megaphone" size={20} color={BRAND_RED} />
        </TouchableOpacity>
      </View>

      {/* Expanded search overlay */}
      {searchExpanded && (
        <View style={styles.searchOverlay} pointerEvents="box-none">
          <View style={{ padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>Search Results</Text>
              {searchText.trim() !== "" && (
                <Text style={styles.searchQueryText} numberOfLines={1}>
                  Results for: "{searchText.trim()}"
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={handleCancelSearch} style={{ padding: 8 }}>
              <Text style={{ color: "#D90429", fontWeight: "700" }}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchOverlayInner}>
            <ScrollView style={styles.searchResults}>
              {filteredEvents.length === 0 ? (
                <View style={styles.suggestionItem}>
                  <Text style={styles.suggestionTitle}>No results</Text>
                </View>
              ) : (
                filteredEvents.map((ev) => (
                  <TouchableOpacity
                    key={ev.id}
                    style={styles.suggestionItem}
                    onPress={() => {
                      Keyboard.dismiss();
                      searchRef.current?.blur();
                      setSearchText("");
                      setSelectedEvent(ev);
                      setShowTransportOptions(false);
                      setRoutePath([]);
                      setSearchExpanded(false);
                      animateTo(EXPANDED_HEIGHT);
                    }}
                  >
                    <Text style={styles.suggestionTitle}>{ev.name}</Text>
                    <Text style={styles.suggestionSubtitle}>{ev.locationName}</Text>
                    <Text style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
                      {ev.tags?.slice(0, 3).join(" • ")}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <View style={styles.filtersPanel}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12 }}>
                <Text style={styles.sectionTitle}>Filters</Text>
                <TouchableOpacity
                  onPress={() => setSelectedTags([])}
                  style={{ padding: 8 }}
                >
                  <Text style={{ color: "#D90429", fontWeight: "700" }}>Clear</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ padding: 12 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {EVENT_TAGS.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        style={[
                          styles.tagFilterChip,
                          active && styles.tagFilterChipActive,
                        ]}
                      >
                        <Text
                          style={
                            active
                              ? styles.tagFilterChipTextActive
                              : styles.tagFilterChipText
                          }
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}

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
