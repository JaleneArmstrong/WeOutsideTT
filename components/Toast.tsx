import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onDismiss?: () => void;
}

export default function Toast({ message, visible, duration = 3000, onDismiss }: ToastProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      const t = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => onDismiss && onDismiss());
      }, duration);
      return () => clearTimeout(t);
    }
  }, [visible, duration, onDismiss, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.toast}>
        <Text style={styles.message}>{message}</Text>
        {onDismiss ? (
          <TouchableOpacity onPress={onDismiss}>
            <Text style={styles.dismiss}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  message: { color: '#fff', fontSize: 14, flex: 1 },
  dismiss: { color: '#fff', marginLeft: 12, fontSize: 14 },
});
