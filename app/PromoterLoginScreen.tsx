import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { getStyles } from "../styles/promoterLoginStyles";

const DOODLE_PATTERN =
  "https://www.transparenttextures.com/patterns/skulls.png";
const BRAND_RED = "#D90429";

export default function PromoterLoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const styles = getStyles(theme, colorScheme === "light");

  const [screen, setScreen] = useState<"home" | "login" | "signup">("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizerName, setOrganizerName] = useState("");

  const handleAuthAction = () => {
    router.push({
      pathname: "/PermissionsScreen",
      params: { role: "promoter" },
    });
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
                    onPress={() => setScreen("login")}
                  >
                    <Text style={styles.authButtonText}>Login</Text>
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
                      placeholderTextColor="#666666"
                    />
                  )}

                  <TextInput
                    style={styles.authInput}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#666666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <TextInput
                    style={styles.authInput}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#666666"
                  />

                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={handleAuthAction}
                  >
                    <Text style={styles.authButtonText}>
                      {screen === "login" ? "Login" : "Register"}
                    </Text>
                  </TouchableOpacity>
                  {screen === "login" ? (
                    <TouchableOpacity
                      onPress={() => setScreen("signup")}
                      style={styles.switchAuthLink}
                    >
                      <Text style={styles.switchAuthText}>
                        Don’t have an account?{" "}
                        <Text style={styles.switchAuthEmphasis}>
                          Create Account
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setScreen("login")}
                      style={styles.switchAuthLink}
                    >
                      <Text style={styles.switchAuthText}>
                        Already have an account?{" "}
                        <Text style={styles.switchAuthEmphasis}>Login</Text>
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
