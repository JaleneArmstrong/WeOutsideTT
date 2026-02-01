import { Stack } from "expo-router";
import { EventProvider } from "../context/EventContext";

export default function Layout() {
  return (
    <EventProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="map" />
      </Stack>
    </EventProvider>
  );
}
