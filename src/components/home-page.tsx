
"use client";

import { useState } from "react";
import EventCard from "@/components/event-card";
import type { Event } from "@/lib/events";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddShowModal from "@/components/add-show-modal";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/events-context";

export default function HomePage() {
  const { events } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedEvent(null);
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
        onClick={openAddModal}
        aria-label="Add new show"
      >
        <Plus className="h-8 w-8" />
      </Button>
      <AddShowModal isOpen={isModalOpen} onClose={closeModal} eventToEdit={selectedEvent} />
    </>
  );
}
