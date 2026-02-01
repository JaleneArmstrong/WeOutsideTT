import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { getStyles } from "../styles/roleSelectionStyles";

const DOODLE_URI = "https://www.transparenttextures.com/patterns/skulls.png";

const ROLE_IMAGES = {
  light: {
    limer:
      "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?q=80&w=800",
    promoter:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800",
  },
  dark: {
    limer:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
    promoter:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800",
  },
};

export default function RoleSelectionScreen() {
  const router = useRouter();

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const styles = getStyles(theme);

  const currentImages = ROLE_IMAGES[colorScheme];

  return (
    <ImageBackground
      source={{ uri: DOODLE_URI }}
      style={styles.container}
      resizeMode="repeat"
      imageStyle={styles.doodleImage}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Who is <Text style={styles.highlightText}>Outside?</Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            Choose your vibe to get started.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cardContainer}
          activeOpacity={0.9}
          onPress={() =>
            router.push({ pathname: "/permissions", params: { role: "limer" } })
          }
        >
          <ImageBackground
            source={{ uri: currentImages.limer }}
            style={styles.cardImage}
          >
            <View style={styles.cardOverlay}>
              <View style={styles.iconBadge}>
                <Ionicons name="people-outline" size={30} color="#FFF" />
              </View>
              <View>
                <Text style={styles.roleTitle}>The Limer</Text>
                <Text style={styles.roleDescription}>
                  I'm just here to find the scene.
                </Text>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>No Sign-up Needed</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardContainer}
          activeOpacity={0.9}
          onPress={() => router.push("/promoter-login")}
        >
          <ImageBackground
            source={{ uri: currentImages.promoter }}
            style={styles.cardImage}
          >
            <View style={styles.cardOverlay}>
              <View style={styles.iconBadge}>
                <Ionicons name="flash-outline" size={30} color="#FFF" />
              </View>
              <View>
                <Text style={styles.roleTitle}>The Promoter</Text>
                <Text style={styles.roleDescription}>
                  I'm hosting and running the show.
                </Text>
                <View style={[styles.tagContainer, styles.promoterTag]}>
                  <Text style={styles.tagText}>Admin Access</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Unsure? Start as a Limer. You can switch roles later.
        </Text>
      </View>
    </ImageBackground>
  );
}
