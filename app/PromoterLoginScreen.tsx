import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";
import { getStyles } from "../styles/promoterLoginStyles";

const DOODLE_PATTERN =
  "https://www.transparenttextures.com/patterns/skulls.png";
const BRAND_RED = "#D90429";

const API_URL = ""; // TODO: To Add Render URL

export default function PromoterLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { refreshEvents } = useEvents();

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const styles = getStyles(theme, colorScheme === "light");

  const [screen, setScreen] = useState<"home" | "login" | "signup">("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper: Email Validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // --- MAIN AUTH HANDLER ---
  const handleAuthAction = async () => {
    setErrorMsg(null);

    // 1. Client-Side Validation
    if (!email || !password || (screen === "signup" && !organizerName)) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (screen === "signup" && password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (screen === "login") {
        // --- LOGIN FLOW ---
        const success = await login(email, password);

        if (success) {
          await refreshEvents();
          router.replace("/MapScreen");
        } else {
          setErrorMsg("Invalid email or password.");
        }
      } else {
        // --- REGISTER FLOW ---
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name: organizerName,
            company,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // A. Auto-Login
          await login(email, password);
          await refreshEvents();

          // B. Check Permissions
          const { status: locationStatus } =
            await Location.getForegroundPermissionsAsync();
          const { status: mediaStatus } =
            await ImagePicker.getMediaLibraryPermissionsAsync();

          const allGranted =
            locationStatus === "granted" && mediaStatus === "granted";

          if (allGranted) {
            // Permissions exist? Go to Map.
            router.replace("/MapScreen");
          } else {
            // Missing permissions? Go to Setup.
            router.replace({
              pathname: "/PermissionsScreen",
              params: {
                role: "promoter",
                promoterId: data.id,
              },
            });
          }
        } else {
          setErrorMsg(data.error || "Could not create account");
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ImageBackground
        source={{ uri: DOODLE_PATTERN }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="repeat"
        imageStyle={styles.doodleImage}
      >
        <View style={styles.backdropOverlay} />

        <ScrollView
          contentContainerStyle={styles.authScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.homeContent}>
            <Ionicons
              name="flash-outline"
              size={60}
              color={BRAND_RED}
              style={{ marginBottom: 20 }}
            />

            <Text style={styles.authTitle}>Promoter Portal</Text>
            <Text style={styles.authSubtitle}>
              Secure access for event coordinators
            </Text>

            <View style={styles.homeButtonContainer}>
              {screen === "home" ? (
                <>
                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={() => {
                      setScreen("login");
                      setErrorMsg(null);
                    }}
                  >
                    <Text style={styles.authButtonText}>Login</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={() => {
                      setScreen("signup");
                      setErrorMsg(null);
                    }}
                  >
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ width: "100%" }}>
                  {screen === "signup" && (
                    <>
                      <TextInput
                        style={styles.authInput}
                        placeholder="Organiser Name *"
                        value={organizerName}
                        onChangeText={setOrganizerName}
                        placeholderTextColor="#666666"
                      />
                      <TextInput
                        style={styles.authInput}
                        placeholder="Company Name"
                        value={company}
                        onChangeText={setCompany}
                        placeholderTextColor="#666666"
                      />
                    </>
                  )}

                  <TextInput
                    style={styles.authInput}
                    placeholder="Email Address *"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#666666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <TextInput
                    style={styles.authInput}
                    placeholder="Password *"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#666666"
                  />

                  {/* ERROR MESSAGE DISPLAY */}
                  {errorMsg && (
                    <View
                      style={{
                        backgroundColor: "rgba(255, 59, 48, 0.1)",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: "rgba(255, 59, 48, 0.3)",
                      }}
                    >
                      <Text style={{ color: "#ff3b30", textAlign: "center" }}>
                        {errorMsg}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.authButton, loading && { opacity: 0.7 }]}
                    onPress={handleAuthAction}
                    disabled={loading}
                  >
                    <Text style={styles.authButtonText}>
                      {loading
                        ? "Processing..."
                        : screen === "login"
                          ? "Login"
                          : "Register"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setScreen(screen === "login" ? "signup" : "login");
                      setErrorMsg(null);
                    }}
                    style={styles.switchAuthLink}
                  >
                    <Text style={styles.switchAuthText}>
                      {screen === "login"
                        ? "Don't have an account? "
                        : "Already have an account? "}
                      <Text style={styles.switchAuthEmphasis}>
                        {screen === "login" ? "Create Account" : "Login"}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
