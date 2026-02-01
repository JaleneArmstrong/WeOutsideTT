import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface TimePickerProps {
  selectedTime?: string;
  onTimeChange: (time: string) => void;
  label?: string;
  style?: any;
}

function formatTime(h: number, m: number, ampm: "AM" | "PM") {
  const hh = h.toString();
  const mm = m.toString().padStart(2, "0");
  return `${hh}:${mm} ${ampm}`;
}

export function TimePicker({
  selectedTime,
  onTimeChange,
  label,
  style,
}: TimePickerProps) {
  const [show, setShow] = useState(false);
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [ampm, setAmpm] = useState<"AM" | "PM">("PM");
  const [hourInput, setHourInput] = useState<string>("12");
  const [minuteInput, setMinuteInput] = useState<string>("00");

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#333333";
  const subTextColor = isDark ? "#AAAAAA" : "#666666";
  const surfaceColor = isDark ? "#1A1A1A" : "#FFFFFF";
  const borderColor = isDark ? "#333333" : "#DDDDDD";
  const inputBg = isDark ? "#252525" : "#F0F8FF";
  const brandColor = "#D90429";

  useEffect(() => {
    if (selectedTime) {
      const parts = selectedTime.split(/[: ]/).filter(Boolean);
      if (parts.length >= 3) {
        const h = parseInt(parts[0], 10);
        const mm = parseInt(parts[1], 10);
        const ap = parts[2] === "AM" ? "AM" : "PM";
        if (!isNaN(h)) setHour(h);
        if (!isNaN(mm)) setMinute(mm);
        setAmpm(ap as "AM" | "PM");
        setHourInput(h.toString());
        setMinuteInput(mm.toString().padStart(2, "0"));
      }
    }
  }, [selectedTime]);

  const onDone = () => {
    const formatted = formatTime(hour, minute, ampm);
    onTimeChange(formatted);
    setShow(false);
  };

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      ) : null}
      <TouchableOpacity
        style={[
          styles.input,
          { backgroundColor: surfaceColor, borderColor: borderColor },
          style,
        ]}
        onPress={() => setShow(!show)}
      >
        <Ionicons
          name="time"
          size={16}
          color={subTextColor}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.inputText, { color: textColor }]}>
          {selectedTime || "Select time"}
        </Text>
        <Ionicons
          name={show ? "chevron-up" : "chevron-down"}
          size={16}
          color={subTextColor}
        />
      </TouchableOpacity>

      {show && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.pickerWrapper}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.pickerScroll}
          >
            <View
              style={[
                styles.picker,
                { backgroundColor: surfaceColor, borderColor: borderColor },
              ]}
            >
              <View style={styles.row}>
                <View style={styles.segment}>
                  <Text style={[styles.segLabel, { color: subTextColor }]}>
                    Hour
                  </Text>
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: inputBg,
                          color: textColor,
                          borderColor: brandColor,
                        },
                      ]}
                      value={hourInput}
                      onChangeText={(val) => {
                        setHourInput(val);
                        const h = parseInt(val, 10);
                        if (!isNaN(h) && h >= 1 && h <= 12) setHour(h);
                      }}
                      placeholder="HH"
                      placeholderTextColor={subTextColor}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.spinControls}>
                    <TouchableOpacity
                      onPress={() => {
                        const nh = hour === 12 ? 1 : hour + 1;
                        setHour(nh);
                        setHourInput(nh.toString());
                      }}
                    >
                      <Ionicons
                        name="chevron-up"
                        size={16}
                        color={brandColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        const nh = hour === 1 ? 12 : hour - 1;
                        setHour(nh);
                        setHourInput(nh.toString());
                      }}
                    >
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color={brandColor}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.segment}>
                  <Text style={[styles.segLabel, { color: subTextColor }]}>
                    Minute
                  </Text>
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: inputBg,
                          color: textColor,
                          borderColor: brandColor,
                        },
                      ]}
                      value={minuteInput}
                      onChangeText={(val) => {
                        setMinuteInput(val);
                        const m = parseInt(val, 10);
                        if (!isNaN(m) && m >= 0 && m <= 59) setMinute(m);
                      }}
                      placeholder="MM"
                      placeholderTextColor={subTextColor}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.spinControls}>
                    <TouchableOpacity
                      onPress={() => {
                        const nm = minute >= 55 ? 0 : minute + 5;
                        setMinute(nm);
                        setMinuteInput(nm.toString().padStart(2, "0"));
                      }}
                    >
                      <Ionicons
                        name="chevron-up"
                        size={16}
                        color={brandColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        const nm = minute <= 0 ? 55 : minute - 5;
                        setMinute(nm);
                        setMinuteInput(nm.toString().padStart(2, "0"));
                      }}
                    >
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color={brandColor}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.segment}>
                  <Text style={[styles.segLabel, { color: subTextColor }]}>
                    AM/PM
                  </Text>
                  <View style={styles.ampmControls}>
                    <TouchableOpacity onPress={() => setAmpm("AM")}>
                      <Text
                        style={[
                          styles.ampm,
                          { color: subTextColor },
                          ampm === "AM" && {
                            color: brandColor,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        AM
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setAmpm("PM")}>
                      <Text
                        style={[
                          styles.ampm,
                          { color: subTextColor },
                          ampm === "PM" && {
                            color: brandColor,
                            fontWeight: "700",
                          },
                        ]}
                      >
                        PM
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View
                style={[styles.pickerFooter, { borderTopColor: borderColor }]}
              >
                <TouchableOpacity
                  style={[styles.doneBtn, { backgroundColor: brandColor }]}
                  onPress={onDone}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 12,
    justifyContent: "space-between",
  },
  inputText: { flex: 1, fontSize: 16 },
  picker: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  segment: { alignItems: "center", flex: 1 },
  segLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  inputGroup: { alignItems: "center", marginBottom: 8 },
  timeInput: {
    width: 55,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  spinControls: { alignItems: "center", gap: 4 },
  pickerWrapper: { width: "100%" },
  pickerScroll: { flexGrow: 1 },
  ampmControls: {
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
    marginTop: 5,
  },
  ampm: { fontSize: 16, padding: 4 },
  pickerFooter: {
    marginTop: 15,
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  doneBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  doneText: { color: "#fff", fontWeight: "800", textTransform: "uppercase" },
});

export function timeStringToMinutes(t: string) {
  const parts = t.split(/[: ]/).filter(Boolean);
  if (parts.length < 3) return NaN;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const ap = parts[2] === "PM" ? "PM" : "AM";
  let hours = h % 12;
  if (ap === "PM") hours += 12;
  return hours * 60 + m;
}
