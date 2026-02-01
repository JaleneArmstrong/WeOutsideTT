import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("screen");

export const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: "transparent",
    position: "relative",
  },

  flatListBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
  },

  backgroundImage: {
    width: width,
    height: height,
  },

  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  contentContainer: {
    height: height,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80,
    paddingHorizontal: 24,
  },

  brandSection: { alignItems: "center", marginTop: 80 },
  iconCircle: {
    width: 90,
    height: 90,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    color: "#E0E0E0",
    fontWeight: "500",
    marginTop: 8,
    letterSpacing: 0.5,
  },
  bottomSection: { width: "100%", alignItems: "center", marginBottom: 40 },
  paginationContainer: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#D90429",
    width: 24,
    height: 8,
  },
  description: {
    color: "#DDDDDD",
    textAlign: "center",
    marginBottom: 32,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "400",
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#D90429",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D90429",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
});
