
"use client";

import { useState, useEffect } from "react";
import EventCard from "@/components/event-card";
import { mockEvents, Event } from "@/lib/events";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddShowModal from "@/components/add-show-modal";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Process events on the client to avoid hydration issues
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

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const upcomingEvents = events
    .filter(event => new Date(event.dateTime) >= new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <>
      <div className="flex justify-center min-h-full">
        <div className="w-full max-w-lg">
          <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <h1 className="text-3xl font-headline font-bold text-center">CineSchedule</h1>
            <p className="text-center text-muted-foreground">Your upcoming schedule</p>
          </header>
          <ScrollArea className="h-[calc(100vh-150px)] px-4">
             <div className="space-y-4 pb-24">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} onClick={() => handleEventClick(event)} />
                ))
              ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No upcoming events.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
       <Button
        className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90"
        size="icon"
        onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
        aria-label="Add new show"
      >
        <Plus className="h-8 w-8" />
      </Button>
      <AddShowModal isOpen={isModalOpen} onClose={closeModal} eventToEdit={selectedEvent} />
    </>
  );
}
