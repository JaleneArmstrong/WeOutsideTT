import { StyleSheet } from "react-native";

const BRAND_RED = "#D90429";

export const getStyles = (theme: any) => {
  const isLight = theme.background === "#ECE5DD";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingTop: 60,
      paddingHorizontal: 25,
      paddingBottom: 25,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isLight ? "#FFFFFF" : "#111111",
      borderBottomWidth: 2,
      borderColor: isLight ? "#000000" : "#222222",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: isLight ? "#000000" : "#FFFFFF",
      textTransform: "uppercase",
    },
    headerSubtitle: {
      fontSize: 13,
      color: BRAND_RED,
      fontWeight: "700",
    },
    addButton: {
      backgroundColor: BRAND_RED,
      width: 45,
      height: 45,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    formSection: {
      flex: 1,
      padding: 25,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: isLight ? "#000000" : "#FFFFFF",
      marginBottom: 25,
    },
    label: {
      fontSize: 14,
      fontWeight: "700",
      color: isLight ? "#000000" : "#FFFFFF",
      marginBottom: 8,
      marginTop: 15,
    },
    required: { color: BRAND_RED },
    input: {
      backgroundColor: isLight ? "#FFFFFF" : "#1A1A1A",
      borderWidth: 2,
      borderColor: isLight ? "#000000" : "#333333",
      borderRadius: 12,
      padding: 15,
      color: isLight ? "#000000" : "#FFFFFF",
    },
    descriptionInput: {
      height: 100,
      textAlignVertical: "top",
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      gap: 10,
    },
    checkboxLabel: {
      color: isLight ? "#000000" : "#FFFFFF",
      fontWeight: "600",
    },
    row: { flexDirection: "row", marginTop: 10 },
    formButtonContainer: {
      flexDirection: "row",
      gap: 15,
      marginTop: 40,
      paddingBottom: 50,
    },
    cancelBtn: {
      flex: 1,
      padding: 18,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isLight ? "#000000" : "#333333",
      alignItems: "center",
    },
    cancelBtnText: {
      color: isLight ? "#000000" : "#FFFFFF",
      fontWeight: "700",
    },
    createBtn: {
      flex: 2,
      backgroundColor: BRAND_RED,
      padding: 18,
      borderRadius: 12,
      alignItems: "center",
    },
    createBtnText: { color: "#FFF", fontWeight: "800" },
    eventsList: { flex: 1, padding: 25 },
    eventCard: {
      backgroundColor: isLight ? "#FFFFFF" : "#1A1A1A",
      padding: 20,
      borderRadius: 15,
      marginBottom: 15,
      borderWidth: 2,
      borderColor: isLight ? "#000000" : "#333333",
    },
    eventCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    eventCardTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: isLight ? "#000000" : "#FFFFFF",
    },
    eventCardText: {
      fontSize: 14,
      color: theme.icon,
      marginTop: 5,
    },
    emptyState: {
      marginTop: 100,
      alignItems: "center",
      opacity: 0.5,
    },
    emptyText: {
      color: isLight ? "#000000" : "#FFFFFF",
      marginTop: 15,
      fontSize: 16,
      fontWeight: "600",
    },
  });
};
