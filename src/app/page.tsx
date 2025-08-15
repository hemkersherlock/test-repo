import EventCard from "@/components/event-card";
import { mockEvents, Event } from "@/lib/events";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const upcomingEvents = mockEvents
    .filter(event => new Date(event.dateTime) >= new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
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
                <EventCard key={event.id} event={event} />
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
  );
}
