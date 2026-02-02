import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { DatePicker } from "../components/DatePicker";
import { LocationPicker } from "../components/LocationPicker";
import { TagSelector } from "../components/TagSelector";
import { TimePicker, timeStringToMinutes } from "../components/TimePicker";
import Toast from "../components/Toast";
import { Colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { Event, EventLocation, useEvents } from "../context/EventContext";
import { getStyles } from "../styles/promoterDashboardStyles";

const API_URL = ""; // TODO: To Add Render URL

export default function PromoterDashboard() {
  const { promoterId } = useLocalSearchParams();
  const { events, deleteEvent, refreshEvents } = useEvents();
  const { logout } = useAuth();
  const router = useRouter();

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const styles = getStyles(theme);
  const isDark = colorScheme === "dark";

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [eventLocation, setEventLocation] = useState<
    EventLocation | undefined
  >();
  const [eventTags, setEventTags] = useState<string[]>([]);
  const [eventDescription, setEventDescription] = useState("");
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/PromoterLoginScreen");
        },
      },
    ]);
  };

  // --- IMAGE PICKER ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setEventImage(result.assets[0].uri);
    }
  };

  // --- RESET FORM ---
  const resetForm = () => {
    setEditingEventId(null);
    setEventTitle("");
    setEventImage(null);
    setStartDate("");
    setEndDate("");
    setIsMultiDay(false);
    setEventLocation(undefined);
    setEventTags([]);
    setEventDescription("");
    setStartTime(undefined);
    setEndTime(undefined);
  };

  // --- EDIT HANDLER ---
  const handleEditPress = (event: Event) => {
    setEditingEventId(event.id);
    setEventTitle(event.title);
    setEventImage(event.image || null);
    setStartDate(event.startDate);
    setEndDate(event.endDate || "");
    setIsMultiDay(!!event.endDate && event.endDate !== event.startDate);
    setEventLocation({
      name: event.locationName,
      latitude: event.latitude,
      longitude: event.longitude,
    });
    setEventTags(event.tags);
    setEventDescription(event.description);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setShowAddEvent(true);
  };

  // --- DELETE HANDLER ---
  const confirmDelete = (id: string, title: string) => {
    Alert.alert("Delete Event", `Are you sure you want to remove "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteEvent(id) },
    ]);
  };

  // --- VALIDATION HELPERS (Merged from your snippet) ---
  const validateEventDates = (): boolean => {
    // 1. Check Multi-day logic
    if (isMultiDay && endDate && startDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) return false;
    }

    // 2. Check Time logic (if same day)
    const isSameDay =
      !isMultiDay || (startDate && endDate && startDate === endDate);
    if (isSameDay && startTime && endTime) {
      const startMin = timeStringToMinutes(startTime);
      const endMin = timeStringToMinutes(endTime);
      if (!isNaN(startMin) && !isNaN(endMin) && endMin < startMin) {
        return false;
      }
    }

    return true;
  };

  const getValidationErrors = (): string[] => {
    const missing: string[] = [];
    if (!eventTitle.trim()) missing.push("Title");
    if (!startDate) missing.push("Start date");
    if (!eventLocation) missing.push("Location");

    if (eventTags.length < 3) {
      const need = 3 - eventTags.length;
      missing.push(`Select ${need} more tag${need > 1 ? "s" : ""}`);
    }

    if (!eventDescription.trim()) missing.push("Description");
    if (isMultiDay && !endDate) missing.push("End date");

    if (!validateEventDates()) {
      missing.push("Check dates/times (End cannot be before Start)");
    }

    return missing;
  };

  // --- MAIN SAVE HANDLER ---
  const handleSave = async () => {
    // 1. Validate
    const errors = getValidationErrors();
    if (errors.length > 0) {
      setToastMsg(`Missing: ${errors.join(", ")}`);
      return;
    }

    setLoading(true);

    // 2. Prepare Data
    const eventData = {
      title: eventTitle,
      image: eventImage,
      startDate: new Date(startDate).toISOString(),
      endDate: isMultiDay
        ? new Date(endDate).toISOString()
        : new Date(startDate).toISOString(),
      locationName: eventLocation?.name,
      latitude: eventLocation?.latitude,
      longitude: eventLocation?.longitude,
      tags: eventTags,
      description: eventDescription,
      startTime,
      endTime,
      promoterId: Number(promoterId),
    };

    try {
      // 3. Send to API
      const endpoint = editingEventId
        ? `${API_URL}/events/${editingEventId}`
        : `${API_URL}/events`;
      const method = editingEventId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        setToastMsg(editingEventId ? "Event updated!" : "Event posted!");
        setShowAddEvent(false);
        resetForm();
        refreshEvents();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Events</Text>
          <Text style={styles.headerSubtitle}>Promoter Dashboard</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.BRAND_RED }]}
            onPress={() => router.replace("/MapScreen")}
          >
            <Ionicons name="map" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: showAddEvent ? theme.icon : theme.BRAND_RED },
            ]}
            onPress={() => {
              if (showAddEvent) resetForm();
              setShowAddEvent(!showAddEvent);
            }}
          >
            <Ionicons
              name={showAddEvent ? "close" : "add"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: "#ffebee" }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#D90429" />
          </TouchableOpacity>
        </View>
      </View>

      {/* FORM OR LIST */}
      {showAddEvent ? (
        <ScrollView
          style={styles.formSection}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.formTitle}>
            {editingEventId ? "Edit Event" : "New Event"}
          </Text>

          {/* COVER PHOTO */}
          <Text style={styles.label}>Cover Photo</Text>
          <TouchableOpacity
            style={{
              width: "100%",
              height: 180,
              backgroundColor: isDark ? "#1A1A1A" : "#F9F9F9",
              borderRadius: 15,
              borderWidth: 2,
              borderColor: isDark ? "#333" : "#DDD",
              borderStyle: "dashed",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 15,
              overflow: "hidden",
            }}
            onPress={pickImage}
          >
            {eventImage ? (
              <Image
                source={{ uri: eventImage }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Ionicons name="image-outline" size={32} color={theme.icon} />
                <Text
                  style={{ color: theme.icon, marginTop: 8, fontWeight: "600" }}
                >
                  Add Hero Image
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* TITLE */}
          <Text style={styles.label}>
            Event Title <Text style={{ color: "#ff3b30" }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholder="e.g. Arima Sunday Lime"
            placeholderTextColor="#666"
          />

          {/* DATES */}
          <Text style={styles.label}>
            Start Date <Text style={{ color: "#ff3b30" }}>*</Text>
          </Text>
          <DatePicker
            selectedDate={
              startDate
                ? new Date(startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""
            }
            onDateChange={(date) => setStartDate(date)}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setIsMultiDay(!isMultiDay)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 12,
              gap: 8,
            }}
          >
            <Ionicons
              name={isMultiDay ? "checkbox" : "square-outline"}
              size={22}
              color={theme.BRAND_RED}
            />
            <Text style={{ color: theme.text }}>Multi-day event</Text>
          </TouchableOpacity>

          {isMultiDay && (
            <>
              <Text style={styles.label}>
                End Date <Text style={{ color: "#ff3b30" }}>*</Text>
              </Text>
              <DatePicker
                selectedDate={endDate}
                onDateChange={(date) => setEndDate(date.toString())}
                style={styles.input}
              />
            </>
          )}

          {/* TIMES */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Start Time</Text>
              <TimePicker
                selectedTime={startTime}
                onTimeChange={setStartTime}
                style={styles.input}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>End Time</Text>
              <TimePicker
                selectedTime={endTime}
                onTimeChange={setEndTime}
                style={styles.input}
              />
            </View>
          </View>

          {/* LOCATION */}
          <Text style={styles.label}>
            Location <Text style={{ color: "#ff3b30" }}>*</Text>
          </Text>
          <LocationPicker
            selectedLocation={eventLocation}
            onSelectLocation={setEventLocation}
            style={styles.input}
          />

          {/* TAGS */}
          <Text style={styles.label}>
            Tags (Min 3) <Text style={{ color: "#ff3b30" }}>*</Text>
          </Text>
          <TagSelector
            selectedTags={eventTags}
            onTagsChange={setEventTags}
            minTags={3}
          />

          {/* DESCRIPTION */}
          <Text style={styles.label}>
            Description <Text style={{ color: "#ff3b30" }}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            placeholder="Describe the vibe... Cost, tickets, etc."
            value={eventDescription}
            onChangeText={setEventDescription}
            placeholderTextColor="#666"
          />
          {/* ✨ UX IMPROVEMENT FROM YOUR CODE ✨ */}
          <Text
            style={{
              fontSize: 12,
              color: "#666",
              marginTop: 6,
              marginBottom: 12,
              fontStyle: "italic",
            }}
          >
            💡 Include info about: admission cost, ticket details, registration
            requirements, and links to book or register.
          </Text>

          {/* BUTTONS */}
          <View style={styles.formButtonContainer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setShowAddEvent(false);
                resetForm();
              }}
            >
              <Text style={styles.cancelBtnText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.createBtn,
                {
                  backgroundColor: theme.BRAND_RED,
                },
              ]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.createBtnText}>
                {loading
                  ? "Saving..."
                  : editingEventId
                    ? "Save Changes"
                    : "Post Event"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* LIST VIEW */
        <ScrollView
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
        >
          {events.filter((e) => Number(e.promoter?.id) === Number(promoterId))
            .length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="megaphone-outline"
                size={100}
                color={theme.icon}
              />
              <Text style={[styles.emptyText, { color: theme.text }]}>
                No events yet.
              </Text>
            </View>
          ) : (
            events
              .filter((e) => Number(e.promoter?.id) === Number(promoterId))
              .map((event) => (
                <View
                  key={event.id}
                  style={[styles.eventCard, { flexDirection: "row" }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventCardTitle}>{event.title}</Text>
                    <Text style={{ color: theme.text, fontSize: 12 }}>
                      {new Date(event.startDate).toDateString()}
                    </Text>
                    <Text
                      style={[
                        styles.eventDescription,
                        { color: theme.text, marginTop: 4 },
                      ]}
                      numberOfLines={2}
                    >
                      {event.description}
                    </Text>
                  </View>

                  <View
                    style={{
                      borderLeftWidth: 1,
                      borderLeftColor: isDark ? "#333" : "#EEE",
                      paddingLeft: 10,
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleEditPress(event)}
                      style={{ padding: 10 }}
                    >
                      <Ionicons name="pencil" size={18} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => confirmDelete(event.id, event.title)}
                      style={{ padding: 10 }}
                    >
                      <Ionicons
                        name="trash"
                        size={18}
                        color={theme.BRAND_RED}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
          )}
        </ScrollView>
      )}

      <Toast
        message={toastMsg || ""}
        visible={!!toastMsg}
        onDismiss={() => setToastMsg(null)}
      />
    </View>
  );
}
