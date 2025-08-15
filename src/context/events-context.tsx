
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import type { Event } from '@/lib/events';
import { mockEvents } from '@/lib/events';

interface EventsContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: number) => void;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedEvent: Event | null;
  setSelectedEvent: Dispatch<SetStateAction<Event | null>>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'cineScheduleEvents';

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    try {
      const storedEvents = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // If no events in storage, initialize with mock data
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
      }
    } catch (error) {
        console.error("Failed to access localStorage or process events:", error);
        // Fallback to mock events in case of any error
        setEvents(mockEvents.map(e => ({...e, dateTime: new Date().toISOString()})));
    } finally {
        setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    // Save events to localStorage whenever they change, but only after initial load.
    if (isInitialized) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
        } catch(error) {
            console.error("Failed to save events to localStorage:", error);
        }
    }
  }, [events, isInitialized]);


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

  const contextValue = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    isModalOpen,
    setIsModalOpen,
    selectedEvent,
    setSelectedEvent
  };

  return (
    <EventsContext.Provider value={contextValue}>
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
