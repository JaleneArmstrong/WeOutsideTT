import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DatePicker } from "../../components/DatePicker";
import { LocationPicker } from "../../components/LocationPicker";
import { TagSelector } from "../../components/TagSelector";
import { TimePicker, timeStringToMinutes } from "../../components/TimePicker";
import Toast from "../../components/Toast";
import { Event, EventLocation, useEvents } from "../../context/EventContext";

type ScreenType = "home" | "login" | "signup" | "verification" | "events";

export default function ManageEventsScreen() {
  const { events, addEvent, deleteEvent } = useEvents();

  // Navigation & Auth State
  const [screen, setScreen] = useState<ScreenType>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coordinatorName, setCoordinatorName] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Event Form State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [eventLocation, setEventLocation] = useState<EventLocation | undefined>();
  const [eventTags, setEventTags] = useState<string[]>([]);
  const [eventDescription, setEventDescription] = useState("");

  // UI State
  // UI State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // ============ VALIDATION HELPERS ============

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEventFormValid =
    eventTitle.trim() &&
    startDate &&
    eventLocation &&
    eventTags.length >= 3 &&
    eventDescription.trim() &&
    (!isMultiDay || endDate) &&
    (!startTime ||
      !endTime ||
      (startTime &&
        endTime &&
        timeStringToMinutes(endTime) >= timeStringToMinutes(startTime)));

  // ============ AUTH HANDLERS ============

  // ============ AUTH HANDLERS ============

  const handleLogin = () => {
    if (!email || !password) {
      setToastMsg("Please fill in all fields");
      return;
    }
    if (!isValidEmail(email)) {
      setToastMsg("Please enter a valid email address");
      return;
    }

    setCoordinatorName(email.split("@")[0]);
    setIsLoggedIn(true);
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setScreen("events");
  };

  const handleSignUp = () => {
    if (!organizerName || !email || !password || !confirmPassword) {
      setToastMsg("Please fill in all fields");
      return;
    }
    if (!isValidEmail(email)) {
      setToastMsg("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setToastMsg("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setToastMsg("Passwords do not match");
      return;
    }
    setPendingEmail(email);
    setCoordinatorName(organizerName);
    setOrganizerName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setScreen("verification");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCoordinatorName("");
    setScreen("home");
  };

  // ============ EVENT HANDLERS ============

  const resetEventForm = () => {
    setEventTitle("");
    setIsMultiDay(false);
    setStartDate("");
    setEndDate("");
    setEventLocation(undefined);
    setEventTags([]);
    setEventDescription("");
    setStartTime(undefined);
    setEndTime(undefined);
    setShowAddEvent(false);
  };

  const validateEventDates = (): boolean => {
    if (isMultiDay && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) return false;
    }

    if (startDate && endDate && startDate === endDate && startTime && endTime) {
      const startMin = timeStringToMinutes(startTime);
      const endMin = timeStringToMinutes(endTime);
      if (!isNaN(startMin) && !isNaN(endMin) && endMin < startMin) return false;
    }

    return true;
  };

  const handleAddEvent = () => {
    if (!eventTitle || !startDate || !eventLocation || eventTags.length < 3 || !eventDescription) {
      return;
    }

    if (!validateEventDates()) {
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventTitle,
      startDate,
      endDate: isMultiDay ? endDate || startDate : endDate || startDate,
      location: eventLocation,
      tags: eventTags,
      description: eventDescription,
      startTime,
      endTime,
      creatorId: coordinatorName,
    };

    addEvent(newEvent);
    resetEventForm();
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
  };

  // ============ VALIDATION MESSAGE HELPER ============

  const getValidationErrors = (): string[] => {
    const missing: string[] = [];

    if (!eventTitle.trim()) missing.push("Title");
    if (!startDate) missing.push("Start date");
    if (!eventLocation) missing.push("Location");

    if (eventTags.length < 3) {
      const need = 3 - eventTags.length;
      missing.push(
        need > 0
          ? `Select ${need} more tag${need > 1 ? "s" : ""}`
          : "Select at least 3 tags"
      );
    }

    if (!eventDescription.trim()) missing.push("Description");
    if (isMultiDay && !endDate) missing.push("End date");

    if (isMultiDay && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) missing.push("End date cannot be before start date");
    }

    if (startDate && endDate && startDate === endDate && startTime && endTime) {
      const startMin = timeStringToMinutes(startTime);
      const endMin = timeStringToMinutes(endTime);
      if (!isNaN(startMin) && !isNaN(endMin) && endMin < startMin) {
        missing.push("End time cannot be before start time");
      }
    }

    return missing;
  };

  const handleCreateEventClick = () => {
    if (!isEventFormValid) {
      const errors = getValidationErrors();
      const msg =
        errors.length > 0
          ? `Missing from event details: ${errors.join(", ")}`
          : "One or more fields are incomplete";
      setToastMsg(msg);
      return;
    }
    handleAddEvent();
  };

  // ============ RENDER SECTIONS ============

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Events</Text>
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

        {showAddEvent && (
          <ScrollView
            style={styles.formSection}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>Create New Event</Text>

            <Text style={styles.label}>
              Event Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Carnival 2025"
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>
              Start Date <Text style={styles.required}>*</Text>
            </Text>
            <DatePicker selectedDate={startDate} onDateChange={setStartDate} />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => setIsMultiDay((v) => !v)}
                style={{ padding: 8 }}
              >
                <Ionicons
                  name={isMultiDay ? "square" : "square-outline"}
                  size={20}
                  color="#007AFF"
                />
              </TouchableOpacity>
              <Text style={{ color: "#666" }}>Multi-day event</Text>
            </View>

            {isMultiDay && (
              <>
                <Text style={styles.label}>
                  End Date <Text style={styles.required}>*</Text>
                </Text>
                <DatePicker selectedDate={endDate} onDateChange={setEndDate} />
              </>
            )}

            <Text style={[styles.label, { marginTop: 6 }]}>Start Time</Text>
            <TimePicker
              selectedTime={startTime}
              onTimeChange={(t) => setStartTime(t)}
            />

            <Text style={[styles.label, { marginTop: 6 }]}>End Time</Text>
            <TimePicker
              selectedTime={endTime}
              onTimeChange={(t) => setEndTime(t)}
            />

            <Text style={styles.label}>
              Location <Text style={styles.required}>*</Text>
            </Text>
            <LocationPicker
              selectedLocation={eventLocation}
              onSelectLocation={setEventLocation}
            />

            <Text style={styles.label}>
              Tags <Text style={styles.required}>*</Text>
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
              placeholder="Describe your event. Include details like cost (free, paid, etc.), ticket information, and registration links."
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
            <Text style={styles.descriptionHint}>
              💡 Include info about: admission cost, ticket details,
              registration requirements, and links to book or register.
            </Text>

            <View style={styles.formButtonContainer}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddEvent(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createBtn,
                  !isEventFormValid && styles.disabledBtn,
                ]}
                onPress={handleCreateEventClick}
              >
                <Text style={styles.createBtnText}>Create Event</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        <Toast
          message={toastMsg || ""}
          visible={!!toastMsg}
          onDismiss={() => setToastMsg(null)}
        />

        {!showAddEvent && (
          <>
            {events.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No events yet</Text>
                <Text style={styles.emptySubtext}>
                  Create your first event to get started
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.eventsList}
                showsVerticalScrollIndicator={false}
              >
                {events.map((event) => (
                  <View key={event.id} style={styles.eventCard}>
                    <View style={styles.eventCardHeader}>
                      <Text style={styles.eventCardTitle}>{event.title}</Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteEvent(event.id)}
                      >
                        <Ionicons name="trash" size={18} color="#ff3b30" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.eventCardDetail}>
                      <Ionicons name="calendar" size={14} color="#666" />
                      <Text style={styles.eventCardText}>
                        {event.startDate}
                        {event.endDate && event.endDate !== event.startDate
                          ? ` — ${event.endDate}`
                          : ""}
                        {event.startTime ? ` • ${event.startTime}` : ""}
                        {event.endTime ? ` — ${event.endTime}` : ""}
                      </Text>
                    </View>

                    <View style={styles.eventCardDetail}>
                      <Ionicons name="location" size={14} color="#666" />
                      <Text style={styles.eventCardText}>
                        {event.location.name}
                      </Text>
                    </View>

                    <View style={styles.tagsContainer}>
                      {event.tags.map((tag) => (
                        <View key={tag} style={styles.eventTag}>
                          <Text style={styles.eventTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>

                    <Text style={styles.eventDescription}>
                      {event.description}
                    </Text>
                  </View>
                ))}
                <View style={{ height: 20 }} />
              </ScrollView>
            )}
          </>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#ff3b30" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === "login") {
    return (
      <View style={styles.authContainer}>
        <ScrollView contentContainerStyle={styles.authScrollContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen("home")}
          >
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
          </TouchableOpacity>

          <Text style={styles.authTitle}>Log In</Text>
          <Text style={styles.authSubtitle}>Access your events</Text>

          <TextInput
            style={styles.authInput}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
            <Text style={styles.authButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen("signup")}>
            <Text style={styles.switchAuthLink}>
              Don&apos;t have an account? Sign up
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Toast
          message={toastMsg || ""}
          visible={!!toastMsg}
          onDismiss={() => setToastMsg(null)}
        />
      </View>
    );
  }

  if (screen === "signup") {
    return (
      <View style={styles.authContainer}>
        <ScrollView contentContainerStyle={styles.authScrollContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen("home")}
          >
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
          </TouchableOpacity>

          <Text style={styles.authTitle}>Create Account</Text>
          <Text style={styles.authSubtitle}>Sign up to manage your events</Text>

          <TextInput
            style={styles.authInput}
            placeholder="Organiser Name"
            value={organizerName}
            onChangeText={setOrganizerName}
          />

          <TextInput
            style={styles.authInput}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleSignUp}>
            <Text style={styles.authButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen("login")}>
            <Text style={styles.switchAuthLink}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Toast
          message={toastMsg || ""}
          visible={!!toastMsg}
          onDismiss={() => setToastMsg(null)}
        />
      </View>
    );
  }

  if (screen === "verification") {
    return (
      <View style={styles.authContainer}>
        <ScrollView contentContainerStyle={styles.authScrollContent}>
          <View style={styles.verificationContent}>
            <View style={styles.verificationIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#34C759" />
            </View>

            <Text style={styles.verificationTitle}>Account Under Review</Text>
            <Text style={styles.verificationMessage}>
              Thank you for signing up! Your coordinator account is currently
              being reviewed by our team.
            </Text>
            <Text style={styles.verificationMessage}>
              We will notify you via email at{" "}
              <Text style={styles.emailHighlight}>{pendingEmail}</Text>{" "}
              regarding the status of your account.
            </Text>

            <View style={styles.verificationInfoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#007AFF"
              />
              <Text style={styles.verificationInfoText}>
                Note: You can't create events while your account is under
                review.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.verificationBackButton}
              onPress={() => setScreen("home")}
            >
              <Text style={styles.verificationBackText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScrollContent}>
        <View style={styles.homeContent}>
          <Text style={styles.authTitle}>Manage Events</Text>
          <Text style={styles.authSubtitle}>Sign in to coordinate events</Text>

          <View style={styles.homeButtonContainer}>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => setScreen("login")}
            >
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => setScreen("signup")}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  authContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  authScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  homeContent: {
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  authInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
    marginTop: 10,
  },
  signUpButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchAuthLink: {
    textAlign: "center",
    marginTop: 15,
    color: "#007AFF",
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingRight: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  homeButtonContainer: {
    width: "100%",
    gap: 12,
    marginTop: 20,
  },

  verificationContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  verificationIconContainer: {
    marginBottom: 24,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  verificationMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 24,
  },
  emailHighlight: {
    fontWeight: "600",
    color: "#007AFF",
  },
  verificationInfoBox: {
    flexDirection: "row",
    backgroundColor: "#E8F4FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: "#C7E0F4",
  },
  verificationInfoText: {
    flex: 1,
    fontSize: 14,
    color: "#0066CC",
    lineHeight: 20,
  },
  verificationBackButton: {
    marginTop: 16,
    padding: 12,
  },
  verificationBackText: {
    color: "#007AFF",
    fontSize: 16,
    textAlign: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#007AFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  formSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flex: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  required: {
    color: "#ff3b30",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  descriptionInput: {
    textAlignVertical: "top",
    minHeight: 100,
  },
  descriptionHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    marginBottom: 12,
    fontStyle: "italic",
  },
  formButtonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  createBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  createBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  eventsList: {
    flex: 1,
    padding: 15,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  eventCardDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  eventCardText: {
    fontSize: 14,
    color: "#666",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 10,
  },
  eventTag: {
    backgroundColor: "#007AFF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  eventTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  eventDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginTop: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  logoutButtonText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "bold",
  },
});
