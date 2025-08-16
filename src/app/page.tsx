
"use client";

import { useState, useCallback } from "react";
import EventCard from "@/components/event-card";
import { useEvents } from "@/context/events-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Event } from "@/lib/events";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchTMDb, TMDbResult } from "@/lib/tmdb";
import { debounce } from "lodash";
import Image from "next/image";
import SearchResultModal from "@/components/search-result-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { events, setSelectedEvent, setIsModalOpen } = useEvents();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDbResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TMDbResult | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length > 2) {
        setIsSearching(true);
        const results = await searchTMDb(query);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleResultClick = (result: TMDbResult) => {
    setSelectedResult(result);
    setIsResultModalOpen(true);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleNotificationClick = async () => {
    if (!('Notification' in window)) {
      toast({ title: "Error", description: "This browser does not support desktop notification." });
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification("You're all set!", {
        body: "You will receive notifications for upcoming shows.",
      });
      toast({ title: "Success!", description: "Notifications are already enabled." });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification("Notifications Enabled!", {
          body: "You will now be notified about your scheduled shows.",
        });
        toast({ title: "Success!", description: "Notifications have been enabled." });
      } else {
        toast({ title: "Info", description: "You have not enabled notifications." });
      }
    } else {
       toast({ title: "Notifications Blocked", description: "Please enable notifications in your browser settings." });
    }
  };
  
  const upcomingEvents = events
    .filter(event => new Date(event.dateTime) >= new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <>
      <div className="flex justify-center min-h-full">
        <div className="w-full max-w-lg">
          <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col gap-4">
            <div className="flex justify-between items-center">
               <h1 className="text-3xl font-headline font-bold text-center">CineSchedule</h1>
               <Button variant="ghost" size="icon" onClick={handleNotificationClick} aria-label="Enable Notifications">
                  <Bell className="h-6 w-6" />
               </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search movies & shows..." 
                className="pl-10" 
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              {(searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full mt-1 w-full z-50 bg-card border rounded-md shadow-lg max-h-80 overflow-y-auto">
                  {isSearching && <p className="p-4 text-sm text-muted-foreground">Searching...</p>}
                  {searchResults.map(result => (
                    <div key={result.id} className="flex items-center p-2 hover:bg-accent cursor-pointer" onClick={() => handleResultClick(result)}>
                      <div className="relative w-12 h-[72px] mr-3 flex-shrink-0">
                        <Image 
                          src={result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : 'https://placehold.co/200x300.png'} 
                          alt="poster" 
                          fill 
                          className="rounded-sm object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{result.title || result.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.media_type === 'tv' ? 'TV Show' : 'Movie'}
                          {result.release_date && ` (${result.release_date.substring(0,4)})`}
                          {result.first_air_date && ` (${result.first_air_date.substring(0,4)})`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
             <h2 className="text-lg font-headline font-semibold text-center pt-2">Upcoming Schedule</h2>
          </header>
          <ScrollArea className="h-[calc(100vh-214px)] px-4">
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
      {selectedResult && (
        <SearchResultModal 
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          result={selectedResult}
        />
      )}
    </>
  );
}
