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
  onFocus?: () => void;
  onCancel?: () => void;
  isExpanded: boolean;
}

const SearchBar = forwardRef<TextInput, SearchBarProps>(
  ({ isExpanded, onFocus, onCancel }, ref) => {
    const styles = getStyles(Colors.light);
    const [isFocused, setIsFocused] = useState(false);

    const handleCancel = () => {
      Keyboard.dismiss();
      setIsFocused(false);
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
            onFocus={onFocus}
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
          />
        </View>

        {(isFocused || isExpanded) && (
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

export default SearchBar;
