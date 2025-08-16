
"use client";

import { useState, useCallback } from "react";
import EventCard from "@/components/event-card";
import { useEvents } from "@/context/events-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Event } from "@/lib/events";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchTMDb, TMDbResult } from "@/lib/tmdb";
import { debounce } from "lodash";
import Image from "next/image";
import SearchResultModal from "@/components/search-result-modal";

export default function Home() {
  const { events, setSelectedEvent, setIsModalOpen } = useEvents();

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
  
  const upcomingEvents = events
    .filter(event => new Date(event.dateTime) >= new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <>
      <div className="flex justify-center min-h-full">
        <div className="w-full max-w-lg">
          <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col gap-4">
            <h1 className="text-3xl font-headline font-bold text-center">CineSchedule</h1>
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
