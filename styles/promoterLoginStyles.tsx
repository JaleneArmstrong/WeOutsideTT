import { StyleSheet } from "react-native";

const BRAND_RED = "#D90429";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  authContainer: {
    flex: 1,
    backgroundColor: "#000",
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
    left: 20,
    zIndex: 10,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  authSubtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 22,
  },
  authInput: {
    backgroundColor: "#121212",
    color: "#FFF",
    padding: 16,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  authButton: {
    backgroundColor: BRAND_RED,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  authButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  signUpButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 15,
  },
  signUpButtonText: {
    color: "#EEE",
    fontSize: 16,
    fontWeight: "700",
  },
  switchAuthLink: {
    textAlign: "center",
    marginTop: 25,
    color: "#444",
    fontSize: 14,
  },
  header: {
    padding: 25,
    paddingTop: 60,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#111",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFF",
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginTop: 2,
  },
  addButton: {
    backgroundColor: BRAND_RED,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  formSection: {
    padding: 20,
    backgroundColor: "#000",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    marginBottom: 8,
    marginTop: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  required: {
    color: BRAND_RED,
  },
  input: {
    backgroundColor: "#121212",
    color: "#FFF",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },
  checkboxLabel: {
    color: "#888",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  formButtonContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: 30,
    marginBottom: 50,
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#121212",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#666",
    fontWeight: "700",
  },
  createBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: BRAND_RED,
    alignItems: "center",
  },
  createBtnText: {
    color: "#FFF",
    fontWeight: "800",
  },
  disabledBtn: {
    opacity: 0.3,
  },
  eventsList: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: "#0A0A0A",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  eventCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  eventCardTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
  },
  eventCardText: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    color: "#444",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
  },
  emptySubtext: {
    color: "#222",
    marginTop: 5,
  },
  footer: {
    padding: 20,
    backgroundColor: "#000",
  },
  logoutButton: {
    alignItems: "center",
    padding: 15,
  },
  logoutButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 12,
  },
  homeButtonContainer: {
    width: "100%",
  },
});
