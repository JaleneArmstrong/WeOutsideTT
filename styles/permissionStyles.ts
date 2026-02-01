import { StyleSheet } from "react-native";

const BRAND_RED = "#D90429";

export const getStyles = (theme: any, isLight: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    imageBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 25,
    },

    doodleImage: {
      opacity: theme.doodleOpacity,
      tintColor: theme.doodleTint,
    },

    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isLight ? "transparent" : "rgba(0,0,0,0.4)",
    },

    contentBox: {
      width: "100%",
      backgroundColor: isLight ? "#FFFFFF" : "rgba(20,20,20,0.9)",
      borderRadius: 30,
      padding: 30,
      alignItems: "center",
      borderWidth: 1,
      borderColor: isLight ? "#000000" : "rgba(255,255,255,0.1)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isLight ? 0.05 : 0.5,
      shadowRadius: 20,
      elevation: 10,
    },

    iconCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      borderWidth: 1,
      backgroundColor: "rgba(217, 4, 41, 0.12)",
      borderColor: BRAND_RED,
    },

    title: {
      fontSize: 22,
      fontWeight: "900",
      color: isLight ? "#000000" : "#FFFFFF",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    description: {
      fontSize: 14,
      color: isLight ? "#000000" : "#888888",
      textAlign: "center",
      marginTop: 12,
      lineHeight: 20,
      marginBottom: 10,
    },

    buttonContainer: {
      width: "100%",
      marginTop: 30,
    },

    primaryButton: {
      backgroundColor: BRAND_RED,
      paddingVertical: 18,
      borderRadius: 15,
      alignItems: "center",
      width: "100%",
    },

    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
      textTransform: "uppercase",
    },
  });
};
