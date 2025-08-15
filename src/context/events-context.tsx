
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Event } from '@/lib/events';
import { mockEvents } from '@/lib/events';

interface EventsContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: number) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    // This prevents hydration errors by ensuring dates are generated client-side.
    const today = new Date();
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const processedEvents = mockEvents.map(event => ({
      ...event,
      dateTime: addDays(today, event.dayOffset).toISOString()
    }));
    setEvents(processedEvents);
  }, []);

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: Date.now() }; // Simple unique ID generation
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prevEvents => prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };
  
  const deleteEvent = (id: number) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
