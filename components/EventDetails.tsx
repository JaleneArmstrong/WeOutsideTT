import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/theme";
import { getStyles } from "../styles/mapStyles";
import { MaxiRouteInfo } from "../utils/maxiRoutes";

const BRAND_RED = "#D90429";

interface EventDetailsProps {
  event: any;
  keyboardHeight?: number;
  onRequestRoute?: (event: any) => void;
  onClearRoute?: () => void;
  showTransportOptions?: boolean;
  userLocationAvailable?: boolean;
  maxiInfo?: MaxiRouteInfo | null;
}

export default function EventDetails({
  event,
  keyboardHeight = 0,
  onRequestRoute,
  onClearRoute,
  showTransportOptions = false,
  userLocationAvailable = true,
  maxiInfo,
}: EventDetailsProps) {
  const styles = getStyles(Colors.light);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date TBD";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Format Error";
    }
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const busDriveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showTransportOptions) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(busDriveAnim, {
            toValue: 5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(busDriveAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      busDriveAnim.setValue(0);
    }
  }, [showTransportOptions]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out the vibe at ${event.title} on LimingMap!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: keyboardHeight + 40 }}
      >
        <View style={styles.heroImage}>
          {event.image ? (
            <Image
              source={{ uri: event.image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: "#EEE",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="image-outline" size={40} color="#CCC" />
            </View>
          )}
        </View>

        <View style={styles.detailHeader}>
          <View style={styles.titleStack}>
            <Text style={styles.mainTitle}>
              {event.title || "Untitled Lime"}
            </Text>

            <View style={styles.metaPillContainer}>
              <View style={styles.metaPill}>
                <Ionicons name="calendar" size={14} color={BRAND_RED} />
                <Text style={styles.metaText}>
                  {formatDate(event.startDate)}
                  {event.startTime ? ` • ${event.startTime}` : ""}
                  {event.endTime ? ` - ${event.endTime}` : ""}
                </Text>
              </View>
            </View>

            <View style={[styles.metaPillContainer, { marginTop: 8 }]}>
              <View style={styles.metaPill}>
                <Ionicons name="location" size={14} color={BRAND_RED} />
                <Text style={styles.metaText}>
                  {event.locationName || "Location TBD"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {showTransportOptions && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              marginHorizontal: 16,
              marginTop: 10,
              padding: 16,
              backgroundColor: "#F8F9FA",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E9ECEF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Animated.View
                style={{ transform: [{ translateX: busDriveAnim }] }}
              >
                <Ionicons name="bus" size={25} color={BRAND_RED} />
              </Animated.View>
              <Text
                style={[
                  styles.descriptionLabel,
                  { color: BRAND_RED, marginBottom: 0, marginLeft: 10 },
                ]}
              >
                Recommended Maxi Route
              </Text>
            </View>

            {maxiInfo ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 15,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 40,
                      backgroundColor: maxiInfo.route.colorCode,
                      borderRadius: 4,
                      marginRight: 12,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "800", fontSize: 16 }}>
                      {maxiInfo.route.color.toUpperCase()} BAND
                    </Text>
                    <Text style={styles.metaText} numberOfLines={2}>
                      {maxiInfo.route.route}
                    </Text>
                    {maxiInfo.toStop === "Port of Spain" && (
                      <Text
                        style={{ fontSize: 12, color: "#666", marginTop: 4 }}
                      >
                        *Take this to City Gate, then transfer to Yellow Band.
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <Text style={styles.metaText}>No direct Maxi route found.</Text>
            )}
          </Animated.View>
        )}

        <View style={styles.tagsRow}>
          <View style={styles.tagsList}>
            {event.tags?.map((tag: string) => (
              <View key={tag} style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>{tag.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
          <Text style={styles.descriptionLabel}>About this lime:</Text>
          <Text style={styles.descriptionText}>
            {event.description || "No description available."}
          </Text>

          {event.promoter ? (
            <View
              style={{
                marginTop: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="business-outline" size={16} color="#666" />
              <Text style={[styles.creatorText, { marginLeft: 6 }]}>
                Hosted by:{" "}
                <Text style={{ fontWeight: "700" }}>{event.promoter.name}</Text>
                {event.promoter.company ? ` • ${event.promoter.company}` : ""}
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.creatorText,
                { marginTop: 15, fontStyle: "italic" },
              ]}
            >
              Private Organizer
            </Text>
          )}
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => onRequestRoute?.(event)}
            disabled={!userLocationAvailable}
          >
            <Ionicons
              name={
                showTransportOptions ? "close-circle-outline" : "bus-outline"
              }
              size={20}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#FFF", fontWeight: "800", fontSize: 16 }}>
              {showTransportOptions ? "HIDE TRANSPORT" : "LOCAL TRANSPORT"}
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
