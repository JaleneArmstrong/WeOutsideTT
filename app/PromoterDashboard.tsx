import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
import { Event, EventLocation, useEvents } from "../context/EventContext";
import { getStyles } from "../styles/promoterDashboardStyles";

export default function PromoterDashboard() {
  const { events, addEvent, deleteEvent, updateEvent } = useEvents();
  const router = useRouter();

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const styles = getStyles(theme);
  const isDark = colorScheme === "dark";
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [eventTitle, setEventTitle] = useState("");
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventLocation, setEventLocation] = useState<
    EventLocation | undefined
  >();
  const [eventTags, setEventTags] = useState<string[]>([]);
  const [eventDescription, setEventDescription] = useState("");
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();

  const isEventFormValid =
    eventTitle.trim() !== "" &&
    startDate !== "" &&
    eventLocation !== undefined &&
    eventTags.length >= 3 &&
    eventDescription.trim() !== "" &&
    (!isMultiDay ||
      (isMultiDay && endDate && new Date(endDate) >= new Date(startDate))) &&
    (!startTime ||
      !endTime ||
      timeStringToMinutes(endTime) >= timeStringToMinutes(startTime));

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setEventImage(result.assets[0].uri);
    }
  };

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

  const handleEditPress = (event: Event) => {
    setEditingEventId(event.id);
    setEventTitle(event.title);
    setEventImage(event.image || null);
    setStartDate(event.startDate);
    setEndDate(event.endDate || "");
    setIsMultiDay(!!event.endDate && event.endDate !== event.startDate);
    setEventLocation(event.location);
    setEventTags(event.tags);
    setEventDescription(event.description);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setShowAddEvent(true);
  };

  const confirmDelete = (id: string, title: string) => {
    Alert.alert("Delete Event", `Are you sure you want to remove "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteEvent(id);
          setToastMsg("Event deleted.");
        },
      },
    ]);
  };

  const handleSave = () => {
    if (isEventFormValid) {
      const eventData: Event = {
        id: editingEventId || Date.now().toString(),
        title: eventTitle,
        image: eventImage,
        startDate,
        endDate: isMultiDay ? endDate || startDate : startDate,
        location: eventLocation!,
        tags: eventTags,
        description: eventDescription,
        startTime,
        endTime,
        creatorId: "current-promoter",
      };

      if (editingEventId) {
        updateEvent(editingEventId, eventData);
        setToastMsg("Event updated!");
      } else {
        addEvent(eventData);
        setToastMsg("Event posted!");
      }

      setShowAddEvent(false);
      resetForm();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Events</Text>
          <Text style={styles.headerSubtitle}>Promoter Dashboard</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.BRAND_RED }]}
            onPress={() => router.push("/MapScreen")}
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
        </View>
      </View>

      {showAddEvent ? (
        <ScrollView
          style={styles.formSection}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.formTitle}>
            {editingEventId ? "Edit Event" : "New Event"}
          </Text>

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
              overflow: "hidden",
              marginBottom: 15,
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

          <Text style={styles.label}>
            Event Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholder="Title"
            placeholderTextColor={isDark ? "#666" : "#AAA"}
          />

          <Text style={styles.label}>
            Start Date <Text style={styles.required}>*</Text>
          </Text>
          <DatePicker
            selectedDate={startDate}
            onDateChange={setStartDate}
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
            <DatePicker
              selectedDate={endDate}
              onDateChange={setEndDate}
              style={styles.input}
            />
          )}

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

          <Text style={styles.label}>
            Location <Text style={styles.required}>*</Text>
          </Text>
          <LocationPicker
            selectedLocation={eventLocation}
            onSelectLocation={setEventLocation}
            style={styles.input}
          />

          <Text style={styles.label}>
            Tags (Min 3) <Text style={styles.required}>*</Text>
          </Text>
          <TagSelector
            selectedTags={eventTags}
            onTagsChange={setEventTags}
            minTags={3}
            style={styles.input}
          />

          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            multiline
            value={eventDescription}
            onChangeText={setEventDescription}
            placeholderTextColor={isDark ? "#666" : "#AAA"}
          />

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
                { backgroundColor: theme.BRAND_RED },
                !isEventFormValid && { opacity: 0.5 },
              ]}
              onPress={handleSave}
            >
              <Text style={styles.createBtnText}>
                {editingEventId ? "Save Changes" : "Post Event"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
        >
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="megaphone-outline"
                size={100}
                color={theme.icon}
              />
              <Text style={[styles.emptyText, { color: theme.text }]}>
                There's Nothing Here
              </Text>
            </View>
          ) : (
            events.map((event) => (
              <View
                key={event.id}
                style={[
                  styles.eventCard,
                  { flexDirection: "row", paddingRight: 5 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventCardTitle}>{event.title}</Text>
                  <Text
                    style={[
                      styles.eventCardText,
                      { color: theme.text, marginTop: 4 },
                    ]}
                  >
                    {event.startDate}
                  </Text>
                  <Text
                    style={[
                      styles.eventDescription,
                      { color: theme.text, marginTop: 6 },
                    ]}
                    numberOfLines={2}
                  >
                    {event.description}
                  </Text>
                </View>

                <View
                  style={{
                    marginLeft: 10,
                    borderLeftWidth: 1,
                    borderLeftColor: isDark ? "#333" : "#F0F0F0",
                    paddingLeft: 10,
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleEditPress(event)}
                    style={{ padding: 12 }}
                  >
                    <Ionicons name="pencil" size={20} color={theme.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => confirmDelete(event.id, event.title)}
                    style={{ padding: 12 }}
                  >
                    <Ionicons name="trash" size={20} color={theme.BRAND_RED} />
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
