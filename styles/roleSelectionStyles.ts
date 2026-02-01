import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");
const BRAND_RED = "#D90429";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#CCC",
    marginTop: 8,
    fontWeight: "500",
  },
  highlightText: {
    color: BRAND_RED,
  },
  cardContainer: {
    height: height * 0.28,
    width: "100%",
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardOverlay: {
    backgroundColor: "rgba(0,0,0,0.85)",
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    height: "100%",
    justifyContent: "flex-start",
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  roleDescription: {
    color: "#CCC",
    fontSize: 13,
    maxWidth: 200,
    marginBottom: 8,
    lineHeight: 18,
  },
  tagContainer: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  promoterTag: {
    backgroundColor: BRAND_RED,
  },
  tagText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 12,
  },
});
