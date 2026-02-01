import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { DatePicker } from "../components/DatePicker";
import { LocationPicker } from "../components/LocationPicker";
import { TagSelector } from "../components/TagSelector";
import { TimePicker } from "../components/TimePicker";
import { Event, EventLocation, useEvents } from "../context/EventContext";
import { styles } from "../styles/promoterLoginStyles";

export default function PromoterLoginScreen() {
  const { events, addEvent, deleteEvent } = useEvents();
  const [screen, setScreen] = useState<"home" | "login" | "signup" | "events">(
    "home",
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coordinatorName, setCoordinatorName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [showAddEvent, setShowAddEvent] = useState(false);

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

  const handleLogin = () => {
    if (email && password) {
      setCoordinatorName(email.split("@")[0]);
      setIsLoggedIn(true);
      setScreen("events");
    }
  };

  const handleSignUp = () => {
    if (organizerName && email && password) {
      setCoordinatorName(organizerName);
      setIsLoggedIn(true);
      setScreen("events");
    }
  };

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
        creatorId: coordinatorName,
      };
      addEvent(newEvent);
      setShowAddEvent(false);
      setEventTitle("");
    }
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Promoter Portal</Text>
            <Text style={styles.headerSubtitle}>{coordinatorName}</Text>
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
              placeholderTextColor="#333"
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
              placeholderTextColor="#333"
            />

            <View style={styles.formButtonContainer}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddEvent(false)}
              >
                <Text style={styles.cancelBtnText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={handleAddEvent}
              >
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
                <Ionicons name="megaphone-outline" size={60} color="#111" />
                <Text style={styles.emptyText}>Nothing listed yet</Text>
              </View>
            ) : (
              events.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventCardHeader}>
                    <Text style={styles.eventCardTitle}>{event.title}</Text>
                    <TouchableOpacity onPress={() => deleteEvent(event.id)}>
                      <Ionicons name="trash-outline" size={18} color="#333" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.eventCardText}>{event.startDate}</Text>
                </View>
              ))
            )}
          </ScrollView>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setIsLoggedIn(false)}
          >
            <Text style={styles.logoutButtonText}>Return to Selection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.authContainer}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.authScrollContent}>
        {screen !== "home" && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen("home")}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
        <View style={styles.homeContent}>
          <Ionicons
            name="flash-outline"
            size={60}
            color="#FFF"
            style={{ marginBottom: 20 }}
          />
          <Text style={styles.authTitle}>Promoter Portal</Text>
          <Text style={styles.authSubtitle}>Manage and list your events</Text>

          <View style={styles.homeButtonContainer}>
            {screen === "home" ? (
              <>
                <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => setScreen("login")}
                >
                  <Text style={styles.authButtonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={() => setScreen("signup")}
                >
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ width: "100%" }}>
                {screen === "signup" && (
                  <TextInput
                    style={styles.authInput}
                    placeholder="Organiser Name"
                    value={organizerName}
                    onChangeText={setOrganizerName}
                    placeholderTextColor="#444"
                  />
                )}
                <TextInput
                  style={styles.authInput}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#444"
                />
                <TextInput
                  style={styles.authInput}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#444"
                />
                <TouchableOpacity
                  style={styles.authButton}
                  onPress={screen === "login" ? handleLogin : handleSignUp}
                >
                  <Text style={styles.authButtonText}>
                    {screen === "login" ? "Enter Dashboard" : "Register"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
