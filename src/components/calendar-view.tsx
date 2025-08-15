
"use client";

import { useState, useMemo, useEffect } from "react";
import { format as formatDate, isSameDay, startOfDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventCard from "@/components/event-card";
import type { Event } from "@/lib/events";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useEvents } from "@/context/events-context";
import { recommendShow, Recommendation } from "@/ai/flows/recommend-show-flow";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

function EventIndicator() {
  return <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary" />;
}

export default function CalendarView() {
  const { events, setSelectedEvent, setIsModalOpen, addEvent } = useEvents();
  const [date, setDate] = useState<Date | undefined>();
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    // Set initial date only on the client to avoid hydration mismatch
    if (!date) {
      setDate(new Date());
    }
  }, [date]);
  
  useEffect(() => {
    // Reset recommendation when date changes
    setRecommendation(null);
  }, [date]);

  const eventsByDate = useMemo(() => {
    const map = new Map<number, Event[]>();
    events.forEach(event => {
      const day = startOfDay(new Date(event.dateTime)).getTime();
      if (!map.has(day)) {
        map.set(day, []);
      }
      map.get(day)!.push(event);
    });
    return map;
  }, [events]);

  const eventDays = useMemo(() => {
    return Array.from(eventsByDate.keys()).map(time => new Date(time));
  }, [eventsByDate]);
  
  const selectedDateEvents = date ? eventsByDate.get(startOfDay(date).getTime()) || [] : [];
  selectedDateEvents.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  
  const handleGetSuggestion = async () => {
    setIsLoadingSuggestion(true);
    setRecommendation(null);
    try {
      const existingTitles = events.map(e => e.title);
      const result = await recommendShow({ existingTitles });
      setRecommendation(result);
    } catch (error) {
      console.error("Failed to get recommendation:", error);
      // You could show a toast notification here
    } finally {
      setIsLoadingSuggestion(false);
    }
  };
  
  const handleAddRecommendation = () => {
    if (!recommendation?.tmdbResult || !date) return;

    const eventDate = new Date(date);
    const now = new Date();
    eventDate.setHours(now.getHours(), now.getMinutes());

    const newEvent: Omit<Event, 'id' | 'dayOffset'> = {
      title: recommendation.tmdbResult.title || recommendation.tmdbResult.name,
      posterUrl: `https://image.tmdb.org/t/p/w500${recommendation.tmdbResult.poster_path}`,
      dateTime: eventDate.toISOString(),
      notes: recommendation.reason,
      aiHint: recommendation.type === 'show' ? 'series' : 'movie',
    };
    addEvent(newEvent);
    setRecommendation(null); // Hide recommendation card after adding
  };


  if (!date) {
    // Render nothing or a loading spinner on the server and initial client render
    return null;
  }

  return (
    <>
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
              DayContent: ({ date }) => {
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
          Schedule for {formatDate(date, "PPP")}
        </h2>

        <ScrollArea className="flex-grow px-4">
          <div className="space-y-4 pb-24">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => handleEventClick(event)} />
              ))
            ) : (
               <div className="text-center py-8">
                  {isLoadingSuggestion ? (
                     <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Finding a new show for you...</p>
                    </div>
                  ) : recommendation ? (
                     <Card className="text-left bg-card/50">
                       <CardHeader>
                         <CardTitle className="font-headline text-lg">AI Suggestion ✨</CardTitle>
                       </CardHeader>
                        <CardContent className="flex gap-4 items-start">
                           {recommendation.tmdbResult?.poster_path ? (
                            <div className="relative w-20 h-28 flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={`https://image.tmdb.org/t/p/w200${recommendation.tmdbResult.poster_path}`}
                                alt={`Poster for ${recommendation.title}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                           ) : <div className="w-20 h-28 flex-shrink-0 rounded-md bg-secondary flex items-center justify-center text-xs text-muted-foreground p-2">No Poster</div>}
                           <div className="flex flex-col">
                             <h4 className="font-semibold">{recommendation.title}</h4>
                             <p className="text-sm text-muted-foreground mt-1">{recommendation.reason}</p>
                           </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setRecommendation(null)}>Dismiss</Button>
                            <Button size="sm" onClick={handleAddRecommendation} disabled={!recommendation.tmdbResult}>Add to Schedule</Button>
                        </CardFooter>
                     </Card>
                  ) : (
                    <>
                      <p className="text-muted-foreground">Nothing scheduled for this day.</p>
                      <Button variant="default" className="mt-4" onClick={handleGetSuggestion}>
                        Get AI Suggestions
                      </Button>
                    </>
                  )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
