"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { format as formatDate, isSameDay, startOfDay } from "date-fns";
import { DayPicker } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventCard from "@/components/event-card";
import AddShowModal from "@/components/add-show-modal";
import { mockEvents, Event } from "@/lib/events";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function EventIndicator() {
  return <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary" />;
}

export default function CalendarView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const eventsByDate = useMemo(() => {
    const map = new Map<number, Event[]>();
    mockEvents.forEach(event => {
      const day = startOfDay(new Date(event.dateTime)).getTime();
      if (!map.has(day)) {
        map.set(day, []);
      }
      map.get(day)!.push(event);
    });
    return map;
  }, []);

  const eventDays = useMemo(() => {
    return Array.from(eventsByDate.keys()).map(time => new Date(time));
  }, [eventsByDate]);
  
  const selectedDateEvents = date ? eventsByDate.get(startOfDay(date).getTime()) || [] : [];
  selectedDateEvents.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="relative min-h-full flex flex-col">
      <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-3xl font-headline font-bold text-center">Calendar</h1>
      </header>
      
      <div className="p-4 flex justify-center">
         <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          modifiers={{ hasEvent: eventDays }}
          modifiersClassNames={{ hasEvent: "has-event" }}
          showOutsideDays
          className="rounded-md w-full"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-base font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex justify-around",
            head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
            row: "flex w-full mt-2 justify-around",
            cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 w-10 p-0 font-normal aria-selected:opacity-100"
            ),
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
          }}
          components={{
            DayContent: ({ date, ...props }) => {
              const hasEvent = eventDays.some(eventDate => isSameDay(eventDate, date));
              return (
                <div className="relative h-full w-full flex items-center justify-center">
                  <span>{formatDate(date, "d")}</span>
                  {hasEvent && <EventIndicator />}
                </div>
              );
            },
          }}
        />
      </div>
      
      <h2 className="text-xl font-headline font-semibold px-4 pb-2 border-t border-border pt-4">
        Schedule for {date ? formatDate(date, "PPP") : '...'}
      </h2>

      <ScrollArea className="flex-grow px-4">
        <div className="space-y-4 pb-24">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <EventCard key={event.id} event={event} onClick={() => handleEventClick(event)} />
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
      <AddShowModal isOpen={isEventModalOpen} onClose={closeEventModal} eventToEdit={selectedEvent} />
    </div>
  );
}
