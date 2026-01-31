import React, { createContext, useContext, useState } from 'react';

export const EVENT_TAGS = [
  'fete',
  'historical',
  'educational',
  'food-centric',
  'festival',
  'nature',
  'music',
  'free entry',
];

export interface EventLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Event {
  id: string;
  title: string;
  // Start and end dates (endDate may equal startDate for single-day events)
  startDate: string;
  endDate?: string;
  location: EventLocation;
  tags: string[];
  description: string;
  // Human readable times like "6:00 PM"
  startTime?: string;
  endTime?: string;
  creatorId?: string;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, event: Event) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

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
    <EventContext.Provider value={{ events, addEvent, deleteEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
