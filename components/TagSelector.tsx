import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { EVENT_TAGS } from "../context/EventContext";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  minTags?: number;
  style?: any;
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  minTags = 3,
}: TagSelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const remainingTags = Math.max(0, minTags - selectedTags.length);
  const textColor = isDark ? "#FFFFFF" : "#333";
  const subContainerBg = isDark ? "#1A1A1A" : "#f0f8ff";
  const subContainerBorder = isDark ? "#333" : "#b3d9ff";
  const tagBg = isDark ? "#252525" : "#f5f5f5";
  const tagBorder = isDark ? "#333" : "#ddd";
  const brandRed = "#D90429";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: textColor }]}>
          Select Tags (minimum {minTags})
        </Text>
        {remainingTags > 0 && (
          <Text style={styles.hint}>
            {remainingTags} more {remainingTags === 1 ? "tag" : "tags"} needed
          </Text>
        )}
      </View>

      <View style={styles.tagsContainer}>
        {EVENT_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                { backgroundColor: tagBg, borderColor: tagBorder },
                isSelected && {
                  backgroundColor: brandRed,
                  borderColor: brandRed,
                },
              ]}
              onPress={() => toggleTag(tag)}
            >
              {isSelected && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#fff"
                  style={styles.checkmark}
                />
              )}
              <Text
                style={[
                  styles.tagText,
                  { color: textColor },
                  isSelected && styles.selectedTagText,
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedTags.length > 0 && (
        <View
          style={[
            styles.selectedContainer,
            {
              backgroundColor: subContainerBg,
              borderColor: subContainerBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.selectedLabel,
              { color: isDark ? brandRed : "#007AFF" },
            ]}
          >
            Selected Tags:
          </Text>
          <View style={styles.selectedTagsList}>
            {selectedTags.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.selectedTagBadge,
                  {
                    backgroundColor: isDark ? "#252525" : "#fff",
                    borderColor: isDark ? brandRed : "#007AFF",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.selectedTagBadgeText,
                    { color: isDark ? "#fff" : "#007AFF" },
                  ]}
                >
                  {tag}
                </Text>
                <TouchableOpacity onPress={() => toggleTag(tag)}>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={isDark ? brandRed : "#007AFF"}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: "#ff3b30",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tagButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 4,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
  },
  selectedTagText: {
    color: "#fff",
  },
  checkmark: {
    marginRight: 2,
  },
  selectedContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectedTagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedTagBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  selectedTagBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
