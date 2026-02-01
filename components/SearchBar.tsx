import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/mapStyles";

interface SearchBarProps {
  isExpanded: boolean;
  onFocus: () => void;
  onCancel: () => void;
}

const SearchBar = forwardRef<TextInput, SearchBarProps>(
  ({ isExpanded, onFocus, onCancel }, ref) => {
    return (
      <View
        style={[styles.searchContainer, { paddingTop: isExpanded ? 50 : 0 }]}
      >
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
            />
          </View>

          {isExpanded && (
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

export default SearchBar;
