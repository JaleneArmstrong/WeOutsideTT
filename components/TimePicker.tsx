import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TimePickerProps {
  selectedTime?: string;
  onTimeChange: (time: string) => void;
  label?: string;
}

function formatTime(h: number, m: number, ampm: 'AM' | 'PM') {
  const hh = h.toString().padStart(1, '0');
  const mm = m.toString().padStart(2, '0');
  return `${hh}:${mm} ${ampm}`;
}

export function TimePicker({ selectedTime, onTimeChange, label }: TimePickerProps) {
  const [show, setShow] = useState(false);
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('PM');
  const [hourInput, setHourInput] = useState<string>('12');
  const [minuteInput, setMinuteInput] = useState<string>('00');

  useEffect(() => {
    if (selectedTime) {
      const parts = selectedTime.split(/[: ]/).filter(Boolean);
      if (parts.length >= 3) {
        const h = parseInt(parts[0], 10);
        const mm = parseInt(parts[1], 10);
        const ap = parts[2] === 'AM' ? 'AM' : 'PM';
        if (!isNaN(h)) setHour(h);
        if (!isNaN(mm)) setMinute(mm);
        setAmpm(ap as 'AM' | 'PM');
        setHourInput(h.toString());
        setMinuteInput(mm.toString().padStart(2, '0'));
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
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity style={styles.input} onPress={() => setShow(!show)}>
        <Ionicons name="time" size={16} color="#666" style={{ marginRight: 8 }} />
        <Text style={styles.inputText}>{selectedTime || 'Select time'}</Text>
        <Ionicons name={show ? 'chevron-up' : 'chevron-down'} size={16} color="#666" />
      </TouchableOpacity>

      {show && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.pickerWrapper}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.pickerScroll}>
            <View style={styles.picker}>
              <View style={styles.row}>
            <View style={styles.segment}>
              <Text style={styles.segLabel}>Hour</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.timeInput}
                  value={hourInput}
                  onChangeText={(val) => {
                    setHourInput(val);
                    const h = parseInt(val, 10);
                    if (!isNaN(h) && h >= 1 && h <= 12) setHour(h);
                  }}
                  placeholder="HH"
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <View style={styles.spinControls}>
                <TouchableOpacity onPress={() => { const nh = hour === 12 ? 1 : hour + 1; setHour(nh); setHourInput(nh.toString()); }}>
                  <Ionicons name="chevron-up" size={16} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { const nh = hour === 1 ? 12 : hour - 1; setHour(nh); setHourInput(nh.toString()); }}>
                  <Ionicons name="chevron-down" size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.segment}>
              <Text style={styles.segLabel}>Minute</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.timeInput}
                  value={minuteInput}
                  onChangeText={(val) => {
                    setMinuteInput(val);
                    const m = parseInt(val, 10);
                    if (!isNaN(m) && m >= 0 && m <= 59) setMinute(m);
                  }}
                  placeholder="MM"
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <View style={styles.spinControls}>
                <TouchableOpacity onPress={() => { const nm = minute >= 55 ? 0 : minute + 5; setMinute(nm); setMinuteInput(nm.toString().padStart(2, '0')); }}>
                  <Ionicons name="chevron-up" size={16} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { const nm = minute <= 0 ? 55 : minute - 5; setMinute(nm); setMinuteInput(nm.toString().padStart(2, '0')); }}>
                  <Ionicons name="chevron-down" size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.segment}>
              <Text style={styles.segLabel}>AM/PM</Text>
              <View style={styles.ampmControls}>
                <TouchableOpacity onPress={() => setAmpm('AM')}>
                  <Text style={[styles.ampm, ampm === 'AM' && styles.ampmActive]}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAmpm('PM')}>
                  <Text style={[styles.ampm, ampm === 'PM' && styles.ampmActive]}>PM</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

              <View style={styles.pickerFooter}>
                <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
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
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  inputText: { flex: 1, fontSize: 16, color: '#333' },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  segment: { alignItems: 'center', flex: 1 },
  segLabel: { fontSize: 12, color: '#666', marginBottom: 6 },
  inputGroup: { alignItems: 'center', marginBottom: 8 },
  timeInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    backgroundColor: '#f0f8ff',
  },
  spinControls: { alignItems: 'center', gap: 2, rowGap: 2 },
  pickerWrapper: { width: '100%' },
  pickerScroll: { flexGrow: 1 },
  ampmControls: { flexDirection: 'column', gap: 8, alignItems: 'center' },
  ampm: { fontSize: 16, color: '#666', padding: 6 },
  ampmActive: { color: '#007AFF', fontWeight: '700' },
  pickerFooter: { marginTop: 12, alignItems: 'center' },
  doneBtn: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  doneText: { color: '#fff', fontWeight: '700' },
});

export function timeStringToMinutes(t: string) {
  // expects format "H:MM AM" or "HH:MM PM"
  const parts = t.split(/[: ]/).filter(Boolean);
  if (parts.length < 3) return NaN;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const ap = parts[2] === 'PM' ? 'PM' : 'AM';
  let hours = h % 12;
  if (ap === 'PM') hours += 12;
  return hours * 60 + m;
}
