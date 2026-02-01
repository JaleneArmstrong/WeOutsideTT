import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../styles/landingStyles";

const { width, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const BACKGROUND_IMAGES = [
  {
    id: "1",
    uri: "https://images.unsplash.com/photo-1617653202545-931490e8d7e7?q=90&w=2500&auto=format&fit=crop",
  },
  {
    id: "2",
    uri: "https://images.unsplash.com/photo-1558350977-1254bd5a27b6?q=90&w=2500&auto=format&fit=crop",
  },
  {
    id: "3",
    uri: "https://images.unsplash.com/photo-1636411176422-a63a35e3f551?q=90&w=2500&auto=format&fit=crop",
  },
];

export default function LandingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    async function fixAndroidBackground() {
      if (Platform.OS === "android") {
        await SystemUI.setBackgroundColorAsync("black");
        await NavigationBar.setBehaviorAsync("overlay-swipe");
        await NavigationBar.setBackgroundColorAsync("rgba(0,0,0,0)");
        await NavigationBar.setButtonStyleAsync("light");
      }
    }
    fixAndroidBackground();

    const interval = setInterval(() => {
      let nextIndex = indexRef.current + 1;
      if (nextIndex >= BACKGROUND_IMAGES.length) nextIndex = 0;

      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      indexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== indexRef.current) {
      indexRef.current = slideIndex;
      setActiveIndex(slideIndex);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "black" }]}>
      <StatusBar
        style="light"
        translucent={true}
        backgroundColor="transparent"
      />

      <FlatList
        ref={flatListRef}
        data={BACKGROUND_IMAGES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onScroll}
        style={StyleSheet.absoluteFillObject}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={{
              width: width,
              height: SCREEN_HEIGHT,
            }}
            resizeMode="cover"
          />
        )}
      />

      <View
        style={[
          styles.darkOverlay,
          StyleSheet.absoluteFillObject,
          { zIndex: 1 },
        ]}
      />

      <View style={[styles.contentContainer, { zIndex: 2 }]}>
        <View style={styles.brandSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="map" size={48} color="#FFF" />
          </View>
          <Text style={styles.title}>WE OUTSIDE</Text>
          <Text style={styles.tagline}>No Scene? No Problem.</Text>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.paginationContainer}>
            {BACKGROUND_IMAGES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>

          <Text style={styles.description}>
            The ultimate guide to Trinidad’s hidden limes, street food, and
            cultural beats.
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.replace("/role-selection")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
