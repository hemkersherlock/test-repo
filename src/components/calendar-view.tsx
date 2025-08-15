"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { format, isSameDay } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventCard from "@/components/event-card";
import AddShowModal from "@/components/add-show-modal";
import { mockEvents } from "@/lib/events";


export default function CalendarView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateEvents = mockEvents.filter(event => {
    if (!date) return true;
    return isSameDay(new Date(event.dateTime), date);
  }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());


  return (
    <div className="relative min-h-full flex flex-col">
      <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-3xl font-headline font-bold text-center">Calendar</h1>
      </header>
      
      <div className="p-4 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border-0"
        />
      </div>
      
      <div className="px-4 pb-2">
        <div className="border-t border-border -mx-4"></div>
      </div>

      <h2 className="text-xl font-headline font-semibold px-4 pb-2">
        Schedule for {date ? format(date, "PPP") : '...'}
      </h2>
      <ScrollArea className="flex-grow px-4">
        <div className="space-y-4 pb-24">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
             <div className="text-center py-16">
                <p className="text-muted-foreground">No events scheduled.</p>
                <Button variant="link" className="text-primary" onClick={() => setIsModalOpen(true)}>Add one?</Button>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <Button
        className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90"
        size="icon"
        onClick={() => setIsModalOpen(true)}
        aria-label="Add new show"
      >
        <Plus className="h-8 w-8" />
      </Button>

      <AddShowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
