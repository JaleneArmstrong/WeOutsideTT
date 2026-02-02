import { StyleSheet } from "react-native";

const BRAND_RED = "#D90429";

export const getStyles = (theme: any, isLight: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    doodleImage: {
      opacity: theme.doodleOpacity,
      tintColor: theme.doodleTint,
    },

    backdropOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isLight ? "transparent" : "rgba(0,0,0,0.5)",
      zIndex: -1,
    },

    authScrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 30,
    },

    homeContent: {
      alignItems: "center",
    },

    backButton: {
      position: "absolute",
      top: 50,
      left: 0,
      zIndex: 10,
    },

    authTitle: {
      fontSize: 28,
      fontWeight: "900",
      color: isLight ? "#000000" : "#FFFFFF",
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    authSubtitle: {
      fontSize: 15,
      color: isLight ? "#000000" : "#AAAAAA",
      marginBottom: 40,
      textAlign: "center",
      lineHeight: 22,
    },

    authInput: {
      backgroundColor: isLight ? "#FFFFFF" : "rgba(18,18,18,0.85)",
      color: isLight ? "#000000" : "#FFFFFF",
      padding: 16,
      marginBottom: 15,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isLight ? "#000000" : "#333333",
    },

    authButton: {
      backgroundColor: BRAND_RED,
      padding: 18,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 10,
    },

    authButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
      textTransform: "uppercase",
    },

    signUpButton: {
      padding: 18,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 15,
      borderWidth: 1,
      backgroundColor: isLight ? "#FFFFFF" : "rgba(0,0,0,0.3)",
      borderColor: isLight ? "#000000" : "#444444",
    },

    signUpButtonText: {
      fontSize: 16,
      fontWeight: "900",
      textTransform: "uppercase",
      color: isLight ? "#000000" : "#EEEEEE",
    },

    homeButtonContainer: {
      width: "100%",
    },

    switchAuthLink: {
      marginTop: 20,
      alignItems: "center",
    },

    switchAuthText: {
      fontSize: 14,
      color: isLight ? "#000000" : "#CCCCCC",
    },

    switchAuthEmphasis: {
      fontWeight: "800",
      textDecorationLine: "underline",
    },
  });
};
