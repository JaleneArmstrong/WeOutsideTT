import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../styles/roleSelectionStyles";

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=90&w=1200&auto=format&fit=crop",
      }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={localStyles.backdropOverlay} />
      <StatusBar style="light" />

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
        onPress={() => router.push("/map")}
      >
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=90&w=1200&auto=format&fit=crop",
          }}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 18 }}
        >
          <View style={styles.cardOverlay}>
            <View style={styles.iconBadge}>
              <Ionicons name="people-outline" size={30} color="#FFF" />
            </View>
            <View>
              <Text style={styles.roleTitle}>The Limer</Text>
              <Text style={styles.roleDescription}>
                I'm just here to find the scene and eat some food.
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
          source={{
            uri: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=90&w=1200&auto=format&fit=crop",
          }}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 18 }}
        >
          <View style={styles.cardOverlay}>
            <View style={styles.iconBadge}>
              <Ionicons name="flash-outline" size={30} color="#FFF" />
            </View>
            <View>
              <Text style={styles.roleTitle}>The Promoter</Text>
              <Text style={styles.roleDescription}>
                I'm hosting events, selling tickets, and running the show.
              </Text>
              <View style={[styles.tagContainer, styles.promoterTag]}>
                <Text style={styles.tagText}>Admin Access</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Unsure? Start as a Limer. You can switch accounts later.
      </Text>
    </ImageBackground>
  );
}

const localStyles = StyleSheet.create({
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
});
