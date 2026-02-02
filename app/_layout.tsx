import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { EventProvider } from "../context/EventContext";

export default function Layout() {
  return (
    <AuthProvider>
      <EventProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="MapScreen"
            options={{
              gestureEnabled: false,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="PromoterDashboard"
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen name="PromoterLoginScreen" />
        </Stack>
      </EventProvider>
    </AuthProvider>
  );
}
