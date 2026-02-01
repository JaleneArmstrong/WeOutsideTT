import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/theme";
import { getStyles } from "../styles/mapStyles";

interface EventDetailsProps {
  event: any;
  keyboardHeight?: number;
}

export default function EventDetails({
  event,
  keyboardHeight = 0,
}: EventDetailsProps) {
  const styles = getStyles(Colors.light);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out the vibe at ${event.name} on the Outside app!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: keyboardHeight + 40 }}
      >
        <View style={styles.heroImage}>
          {/* TODO: Use real Image from Database: 
              <Image source={{ uri: event.image }} style={StyleSheet.absoluteFill} /> 
          */}
          <View style={{ position: "absolute", top: 15, right: 15 }}>
            <View
              style={[
                styles.vibeBadge,
                { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
              ]}
            >
              <Text
                style={[
                  styles.vibeText,
                  { fontSize: 12, textTransform: "uppercase" },
                ]}
              >
                {event.vibe}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailHeader}>
          <View style={styles.titleStack}>
            <Text style={styles.mainTitle}>{event.name}</Text>

            <View style={styles.metaPillContainer}>
              <View style={styles.metaPill}>
                <Ionicons name="location" size={14} color="#666" />
                <Text style={styles.metaText}>{event.dist || "Nearby"}</Text>
              </View>

              {event.status && (
                <View style={styles.metaPill}>
                  <Ionicons name="time" size={14} color="#666" />
                  <Text style={styles.metaText}>{event.status}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.descriptionText}>
          {event.description || "No description available for this lime yet."}
        </Text>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => {
              console.log("Navigating to:", event.coords);
            }}
          >
            <Ionicons
              name="navigate"
              size={20}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#FFF", fontWeight: "800", fontSize: 16 }}>
              DIRECTIONS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={onShare}
          >
            <Ionicons name="share-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
