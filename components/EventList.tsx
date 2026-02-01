import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/mapStyles";

interface EventListProps {
  events: any[];
  isExpanded: boolean;
}

export default function EventList({ events, isExpanded }: EventListProps) {
  return (
    <View style={styles.bottomCard}>
      {!isExpanded && <View style={styles.dragHandle} />}

      <Text style={styles.sectionTitle}>Nearest Limes</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventItem}>
            <View style={styles.eventImagePlaceholder} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{event.name}</Text>
              <View style={styles.row}>
                <Text style={styles.eventDist}>{event.dist}</Text>
                <View style={styles.vibeBadge}>
                  <Text style={styles.vibeText}>{event.vibe}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
