import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
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
import { TimePicker } from "../components/TimePicker";
import { Colors } from "../constants/theme";
import { Event, EventLocation, useEvents } from "../context/EventContext";
import { getStyles } from "../styles/promoterDashboardStyles";
export default function PromoterDashboard() {
  const { events, addEvent, deleteEvent } = useEvents();
  const [showAddEvent, setShowAddEvent] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const styles = getStyles(theme);

  const [eventTitle, setEventTitle] = useState("");
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

  const handleAddEvent = () => {
    if (
      eventTitle &&
      startDate &&
      eventLocation &&
      eventTags.length >= 3 &&
      eventDescription
    ) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventTitle,
        startDate: startDate,
        endDate: isMultiDay ? endDate || startDate : startDate,
        location: eventLocation,
        tags: eventTags,
        description: eventDescription,
        startTime: startTime,
        endTime: endTime,
        creatorId: "current-user",
      };
      addEvent(newEvent);
      setShowAddEvent(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setEventTitle("");
    setStartDate("");
    setEndDate("");
    setEventLocation(undefined);
    setEventTags([]);
    setEventDescription("");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Events</Text>
          <Text style={styles.headerSubtitle}>Promoter Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddEvent(!showAddEvent)}
        >
          <Ionicons
            name={showAddEvent ? "close" : "add"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {showAddEvent ? (
        <ScrollView
          style={styles.formSection}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.formTitle}>List a New Event</Text>

          <Text style={styles.label}>
            Event Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Carnival Monday"
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholderTextColor={theme.icon}
          />

          <Text style={styles.label}>
            Start Date <Text style={styles.required}>*</Text>
          </Text>
          <DatePicker selectedDate={startDate} onDateChange={setStartDate} />

          <TouchableOpacity
            onPress={() => setIsMultiDay(!isMultiDay)}
            style={styles.checkboxRow}
          >
            <Ionicons
              name={isMultiDay ? "checkbox" : "square-outline"}
              size={22}
              color="#D90429"
            />
            <Text style={styles.checkboxLabel}>Multi-day event</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Start Time</Text>
              <TimePicker
                selectedTime={startTime}
                onTimeChange={setStartTime}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.label}>End Time</Text>
              <TimePicker selectedTime={endTime} onTimeChange={setEndTime} />
            </View>
          </View>

          <Text style={styles.label}>
            Location <Text style={styles.required}>*</Text>
          </Text>
          <LocationPicker
            selectedLocation={eventLocation}
            onSelectLocation={setEventLocation}
          />

          <Text style={styles.label}>
            Tags (Min 3) <Text style={styles.required}>*</Text>
          </Text>
          <TagSelector
            selectedTags={eventTags}
            onTagsChange={setEventTags}
            minTags={3}
          />

          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            multiline
            value={eventDescription}
            onChangeText={setEventDescription}
            placeholderTextColor={theme.icon}
          />

          <View style={styles.formButtonContainer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowAddEvent(false)}
            >
              <Text style={styles.cancelBtnText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createBtn} onPress={handleAddEvent}>
              <Text style={styles.createBtnText}>Post Event</Text>
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
              <Ionicons name="megaphone-outline" size={60} color={theme.text} />
              <Text style={styles.emptyText}>Nothing listed yet</Text>
            </View>
          ) : (
            events.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventCardHeader}>
                  <Text style={styles.eventCardTitle}>{event.title}</Text>
                  <TouchableOpacity onPress={() => deleteEvent(event.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={theme.text}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.eventCardText}>{event.startDate}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
