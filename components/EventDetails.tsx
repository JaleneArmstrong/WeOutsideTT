import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/theme";
import { getStyles } from "../styles/mapStyles";

const BRAND_RED = "#D90429";

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
        message: `Check out the vibe at ${event.name} on LimingMap!`,
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
          <View style={{ position: "absolute", top: 15, right: 15 }}>
            <View style={styles.vibeBadge}>
              <Text style={styles.vibeText}>{event.vibe}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailHeader}>
          <View style={styles.titleStack}>
            <Text style={styles.mainTitle}>{event.name}</Text>

            <View style={styles.metaPillContainer}>
              <View style={styles.metaPill}>
                <Ionicons name="calendar" size={14} color={BRAND_RED} />
                <Text style={styles.metaText}>{event.fullDateDisplay}</Text>
              </View>
            </View>

            <View style={[styles.metaPillContainer, { marginTop: 8 }]}>
              <View style={styles.metaPill}>
                <Ionicons name="location" size={14} color={BRAND_RED} />
                <Text style={styles.metaText}>{event.locationName}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tagsRow}>
          <View style={styles.tagsList}>
            {event.tags &&
              event.tags.map((tag: string) => (
                <View key={tag} style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>#{tag.toUpperCase()}</Text>
                </View>
              ))}
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.descriptionLabel}>About this lime:</Text>
          <Text style={styles.descriptionText}>
            {event.description || "No description available for this lime yet."}
          </Text>

          {event.creator && (
            <Text style={styles.creatorText}>
              Organized by: {event.creator}
            </Text>
          )}
        </View>

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
