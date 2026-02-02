import { StyleSheet } from "react-native";

const BRAND_RED = "#D90429";

export const getStyles = (theme: any) => {
  const isDark =
    theme.text === "#ECEDEE" ||
    theme.text === "#FFFFFF" ||
    theme.text === "#fff" ||
    theme.background === "#151718" ||
    theme.background === "#000000";

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
      backgroundColor: theme.background,
      borderBottomWidth: 2,
      borderColor: isDark ? "#222222" : "#EEEEEE",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: theme.text,
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
      backgroundColor: theme.background,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 20,
    },
    label: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
      marginTop: 18,
      textTransform: "uppercase",
    },
    required: { color: BRAND_RED },
    input: {
      backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
      borderWidth: 1.5,
      borderColor: isDark ? "#333333" : "#E0E0E0",
      borderRadius: 12,
      padding: 15,
      color: theme.text,
      fontSize: 16,
      minHeight: 55,
      justifyContent: "center",
    },
    descriptionInput: {
      height: 120,
      textAlignVertical: "top",
    },

    imagePlaceholder: {
      width: "100%",
      height: 180,
      backgroundColor: isDark ? "#1A1A1A" : "#F9F9F9",
      borderRadius: 15,
      borderWidth: 2,
      borderColor: isDark ? "#333333" : "#DDD",
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      marginBottom: 15,
    },

    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 15,
      gap: 10,
    },
    checkboxLabel: {
      color: theme.text,
      fontWeight: "600",
    },
    row: {
      flexDirection: "row",
      gap: 15,
    },
    formButtonContainer: {
      flexDirection: "row",
      gap: 12,
      marginTop: 30,
      paddingBottom: 60,
    },
    cancelBtn: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: isDark ? "#333333" : "#E0E0E0",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    cancelBtnText: {
      color: isDark ? "#AAA" : "#666",
      fontWeight: "700",
    },
    createBtn: {
      flex: 2,
      backgroundColor: BRAND_RED,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    createBtnText: {
      color: "#FFF",
      fontWeight: "800",
    },

    eventsList: {
      flex: 1,
      padding: 20,
    },
    eventCard: {
      backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1.5,
      borderColor: isDark ? "#333333" : "#F0F0F0",
      flexDirection: "row",
      paddingRight: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0 : 0.1,
      shadowRadius: 4,
      elevation: isDark ? 0 : 3,
    },

    actionDivider: {
      marginLeft: 10,
      borderLeftWidth: 1,
      borderLeftColor: isDark ? "#333333" : "#F0F0F0",
      paddingLeft: 10,
      justifyContent: "space-around",
    },

    eventCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    eventCardTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.text,
    },
    eventCardText: {
      fontSize: 14,
      color: isDark ? "#999999" : "#666666",
      marginTop: 4,
    },
    eventDescription: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
      marginTop: 10,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 100,
    },
    emptyText: {
      color: theme.text,
      marginTop: 15,
      fontSize: 16,
      fontWeight: "400",
    },
  });
};
