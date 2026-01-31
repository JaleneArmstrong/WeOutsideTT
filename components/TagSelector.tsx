import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EVENT_TAGS } from '../context/EventContext';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  minTags?: number;
}

export function TagSelector({ selectedTags, onTagsChange, minTags = 3 }: TagSelectorProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const remainingTags = Math.max(0, minTags - selectedTags.length);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Select Tags (minimum {minTags})</Text>
        {remainingTags > 0 && (
          <Text style={styles.hint}>
            {remainingTags} more {remainingTags === 1 ? 'tag' : 'tags'} needed
          </Text>
        )}
      </View>

      <View style={styles.tagsContainer}>
        {EVENT_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tagButton,
              selectedTags.includes(tag) && styles.selectedTag,
            ]}
            onPress={() => toggleTag(tag)}
          >
            {selectedTags.includes(tag) && (
              <Ionicons name="checkmark" size={14} color="#fff" style={styles.checkmark} />
            )}
            <Text
              style={[
                styles.tagText,
                selectedTags.includes(tag) && styles.selectedTagText,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTags.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedLabel}>Selected Tags:</Text>
          <View style={styles.selectedTagsList}>
            {selectedTags.map((tag) => (
              <View key={tag} style={styles.selectedTagBadge}>
                <Text style={styles.selectedTagBadgeText}>{tag}</Text>
                <TouchableOpacity onPress={() => toggleTag(tag)}>
                  <Ionicons name="close-circle" size={16} color="#007AFF" />
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#ff3b30',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    gap: 4,
  },
  selectedTag: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tagText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  selectedTagText: {
    color: '#fff',
  },
  checkmark: {
    marginRight: 2,
  },
  selectedContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3d9ff',
  },
  selectedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  selectedTagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 6,
  },
  selectedTagBadgeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});
