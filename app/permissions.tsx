import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Colors } from "../constants/theme";
import { getStyles } from "../styles/permissionStyles";

const DOODLE_PATTERN =
  "https://www.transparenttextures.com/patterns/skulls.png";

export default function PermissionScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const isPromoter = role === "promoter";
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const styles = getStyles(theme, colorScheme === "light");

  const handlePermissions = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      if (isPromoter) {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        router.replace("/promoter-dashboard");
      } else {
        router.replace("/map");
      }
    } catch (error) {
      console.error("Permission error:", error);
      router.replace("/role-selection");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ImageBackground
        source={{ uri: DOODLE_PATTERN }}
        style={styles.imageBackground}
        resizeMode="repeat"
        imageStyle={styles.doodleImage}
      >
        <View style={styles.overlay} />

        <View style={styles.contentBox}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={isPromoter ? "megaphone-outline" : "location-outline"}
              size={32}
              color="#D90429"
            />
          </View>

          <Text style={styles.title}>
            {isPromoter ? "Architect Access" : "Find the Scene"}
          </Text>

          <Text style={styles.description}>
            {isPromoter
              ? "To list events and upload flyers, we need your location and media access."
              : "To show you the vibes nearby, 'We Outside' needs to know your location."}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePermissions}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
