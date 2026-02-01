import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface DatePickerProps {
  selectedDate?: string;
  onDateChange: (date: string) => void;
  style?: any;
}

export function DatePicker({
  selectedDate,
  onDateChange,
  style,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (m: number, y: number) =>
    new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m: number, y: number) =>
    new Date(y, m, 1).getDay();

  const handleDateSelect = (day: number) => {
    const date = new Date(year, month, day);
    if (date >= today) {
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      onDateChange(formatted);
      setShowPicker(false);
    }
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const days: (number | null)[] = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isPastDate = (day: number) => new Date(year, month, day) < today;
  const textColor = isDark ? "#FFFFFF" : "#333333";
  const subTextColor = isDark ? "#AAAAAA" : "#666666";
  const surfaceColor = isDark ? "#1A1A1A" : "#FFFFFF";
  const borderColor = isDark ? "#333333" : "#DDDDDD";
  const buttonGrey = isDark ? "#2A2A2A" : "#F0F0F0";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.inputContainer,
          { backgroundColor: surfaceColor, borderColor: borderColor },
          style,
        ]}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Ionicons
          name="calendar"
          size={18}
          color={subTextColor}
          style={styles.icon}
        />
        <Text
          style={[
            styles.dateText,
            { color: textColor },
            !selectedDate && styles.placeholder,
          ]}
        >
          {selectedDate || "Select a date"}
        </Text>
        <Ionicons
          name={showPicker ? "chevron-up" : "chevron-down"}
          size={18}
          color={subTextColor}
        />
      </TouchableOpacity>

      {showPicker && (
        <View
          style={[
            styles.pickerContainer,
            { backgroundColor: surfaceColor, borderColor: borderColor },
          ]}
        >
          <View style={styles.monthYearContainer}>
            <TouchableOpacity onPress={handlePrevMonth}>
              <Ionicons name="chevron-back" size={24} color="#D90429" />
            </TouchableOpacity>
            <Text style={[styles.monthYearText, { color: textColor }]}>
              {monthNames[month]} {year}
            </Text>
            <TouchableOpacity onPress={handleNextMonth}>
              <Ionicons name="chevron-forward" size={24} color="#D90429" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekdaysContainer}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={[styles.weekday, { color: subTextColor }]}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysContainer}>
            {days.map((day, index) => (
              <View key={index} style={styles.dayCell}>
                {day === null ? (
                  <View />
                ) : (
                  <TouchableOpacity
                    disabled={isPastDate(day)}
                    style={[
                      styles.dayButton,
                      { backgroundColor: buttonGrey },
                      isPastDate(day) && styles.disabledDay,
                      selectedDate ===
                        new Date(year, month, day).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) && styles.selectedDay,
                    ]}
                    onPress={() => handleDateSelect(day)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        { color: textColor },
                        isPastDate(day) && styles.disabledDayText,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <View style={[styles.pickerFooter, { borderTopColor: borderColor }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 12,
  },
  icon: { marginRight: 8 },
  dateText: { flex: 1, fontSize: 16 },
  placeholder: { color: "#999" },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  monthYearContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthYearText: { fontSize: 16, fontWeight: "bold" },
  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekday: {
    fontSize: 12,
    fontWeight: "600",
    width: "14.28%",
    textAlign: "center",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledDay: { opacity: 0.3 },
  selectedDay: { backgroundColor: "#D90429" },
  dayText: { fontSize: 14 },
  disabledDayText: { color: "#999" },
  pickerFooter: { marginTop: 12, borderTopWidth: 1, paddingTop: 12 },
  closeButton: {
    backgroundColor: "#D90429",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
