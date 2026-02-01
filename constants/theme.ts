import { Platform } from "react-native";

const BRAND_RED = "#D90429";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#F2F2F2",
    tint: BRAND_RED,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: BRAND_RED,
    doodleTint: "#000000",
    doodleOpacity: 0.12,
    cardBackground: "rgba(255,255,255,0.9)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#000000",
    tint: BRAND_RED,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: BRAND_RED,
    doodleTint: "#FFFFFF",
    doodleOpacity: 0.3,
    cardBackground: "rgba(0,0,0,0.85)",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "System",
    serif: "Georgia",
    rounded: "System",
    mono: "Courier",
  },
  android: {
    sans: "sans-serif",
    serif: "serif",
    rounded: "sans-serif-medium",
    mono: "monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});
