import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const SCREEN_HEIGHT = height;
export const COLLAPSED_HEIGHT = height * 0.45;
export const EXPANDED_HEIGHT = height;

export const styles = StyleSheet.create({
  container: { flex: 1 },

  mapContainer: { width: "100%", height: "100%", position: "absolute" },
  map: { width: "100%", height: "100%" },

  overlayContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    backgroundColor: "transparent",
  },

  searchContainer: {
    position: "absolute",
    top: -30,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },
  searchBarRow: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFF",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  input: { flex: 1, fontSize: 16, color: "#000", height: "100%" },
  cancelButton: {
    marginLeft: 10,
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 5,
  },
  cancelText: { color: "#CE1126", fontWeight: "bold" },

  bottomCard: {
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
    paddingTop: 35,
    paddingHorizontal: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
    color: "#333",
  },

  eventItem: { flexDirection: "row", marginBottom: 20, alignItems: "center" },
  eventImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#EEE",
    borderRadius: 8,
    marginRight: 15,
  },
  eventInfo: { flex: 1 },
  eventName: { fontSize: 16, fontWeight: "700", color: "#000" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  eventDist: { fontSize: 14, color: "#666", marginRight: 10 },
  vibeBadge: {
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  vibeText: { fontSize: 10, color: "#CE1126", fontWeight: "bold" },
});
