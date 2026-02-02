import React, { createContext, useContext, useEffect, useState } from "react";

export const EVENT_TAGS = [
  "fete",
  "historical",
  "educational",
  "food-centric",
  "festival",
  "nature",
  "music",
  "free entry",
];

export interface EventLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Event {
  id: string;
  title: string;
  image?: string | null;
  startDate: string;
  endDate?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  tags: string[];
  description: string;
  startTime?: string;
  endTime?: string;
  promoter?: {
    id: number;
    name: string;
    company?: string;
  };
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, event: Event) => void;
  refreshEvents: () => Promise<void>;
}

const API_URL = "https://weoutside-backend.onrender.com";

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  const refreshEvents = async () => {
    try {
      const response = await fetch(
        "https://weoutside-backend.onrender.com/events",
      );
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const updateEvent = (id: string, updatedEvent: Event) => {
    setEvents(events.map((e) => (e.id === id ? updatedEvent : e)));
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, deleteEvent, updateEvent, refreshEvents }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}
