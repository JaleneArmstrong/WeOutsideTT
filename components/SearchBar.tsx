import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/theme";
import { getStyles } from "../styles/mapStyles";

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onFocus?: () => void;
  onCancel?: () => void;
  onBlur?: () => void;
  isExpanded: boolean;
  showCancel?: boolean;
}

const SearchBar = forwardRef<TextInput, SearchBarProps>(
  ({ value, onChangeText, isExpanded, onFocus, onCancel, onSubmit, showCancel = true, onBlur }, ref) => {
    const styles = getStyles(Colors.light);
    const [isFocused, setIsFocused] = useState(false);

    const handleCancel = () => {
      Keyboard.dismiss();
      setIsFocused(false);
      if (onChangeText) onChangeText("");
      if (onCancel) onCancel();
    };

    const handleFocus = () => {
      setIsFocused(true);
      if (onFocus) onFocus();
    };

    return (
      <View style={styles.searchBarRow}>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={{ marginRight: 10 }}
          />
          <TextInput
            ref={ref}
            placeholder="Find a lime..."
            placeholderTextColor="#999"
            style={styles.input}
            onFocus={handleFocus}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            returnKeyType="search"
            blurOnSubmit={true}
            onSubmitEditing={(e) => {
              Keyboard.dismiss();
              onSubmit?.(e.nativeEvent.text);
            }}
            value={value}
            onChangeText={onChangeText}
          />
        </View>

        {(isFocused || isExpanded) && showCancel && (
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

export default SearchBar;
