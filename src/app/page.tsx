
"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { CineItem } from "@/lib/types";
import { Search, Bell, Clapperboard, Calendar, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchTMDb, TMDbResult, getTrending } from "@/lib/tmdb";
import { debounce } from "lodash";
import Image from "next/image";
import SearchResultModal from "@/components/search-result-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCine } from "@/context/cine-context";
import EventCard from "@/components/event-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import WatchingCard from "@/components/watching-card";
import TrendingCard from "@/components/trending-card";
import EmptyState from "@/components/empty-state";

export default function Home() {
  const { items, setModalOpen, setSelectedItem, fabAction, setFabAction } = useCine();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDbResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TMDbResult | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [trendingItems, setTrendingItems] = useState<TMDbResult[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pageTopRef = useRef<HTMLDivElement>(null);

  // Memoize upcoming events to prevent expensive recalculations on every render
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return items
      .filter(item => item.status === 'scheduled' && item.scheduleDate && new Date(item.scheduleDate) >= now)
      .sort((a, b) => new Date(a.scheduleDate!).getTime() - new Date(b.scheduleDate!).getTime())
      .slice(0, 5);
  }, [items]);


  // Handle FAB click action
  useEffect(() => {
    if (fabAction) {
      pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      searchInputRef.current?.focus();
      setFabAction(false); // Reset the action
    }
  }, [fabAction, setFabAction]);


  // Fetch trending items on component mount
  useEffect(() => {
    const fetchTrending = async () => {
      const items = await getTrending();
      setTrendingItems(items);
    };
    fetchTrending();
  }, []);

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
    }, 300),
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

  const handleNotificationClick = async () => {
    if (!('Notification' in window)) {
      toast({ title: "Error", description: "This browser does not support desktop notification." });
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification("You're all set!", {
        body: "You will receive notifications for upcoming shows.",
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification("Notifications Enabled!", {
          body: "You will now be notified about your scheduled shows.",
        });
      }
    } else {
       toast({ title: "Notifications Blocked", description: "Please enable notifications in your browser settings." });
    }
  };
  
  const continueWatchingItems = useMemo(() => 
    items.filter(item => item.status === 'watching' && item.progress && item.progress.current > 0 && item.progress.current < 100), 
  [items]);

  return (
    <>
      <div ref={pageTopRef} className="flex justify-center min-h-full">
        <div className="w-full max-w-lg">
          <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col gap-4">
            <div className="flex justify-between items-center">
               <h1 className="text-3xl font-headline font-bold text-center">CineSchedule</h1>
               <Button variant="ghost" size="icon" onClick={handleNotificationClick} aria-label="Enable Notifications">
                  <Bell className="h-6 w-6" />
               </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                ref={searchInputRef}
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
          </header>
          
          <div className="pb-24 space-y-8">
            <section>
              <h2 className="text-lg font-headline font-semibold px-4 pb-2 pt-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming
              </h2>
              {upcomingEvents.length > 0 ? (
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex w-max space-x-4 px-4">
                    {upcomingEvents.map((item) => (
                      <div key={item.id} className="w-32">
                         <EventCard event={item} layout="vertical" onClick={() => { setSelectedItem(item); setModalOpen(true); }} />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <EmptyState
                  icon={<Calendar className="w-12 h-12" />}
                  title="No upcoming events"
                  description="Use the search above to find and schedule something to watch!"
                />
              )}
            </section>

            {continueWatchingItems.length > 0 && (
              <section>
                <h2 className="text-lg font-headline font-semibold px-4 pb-2 flex items-center gap-2">
                  <Clapperboard className="w-5 h-5" />
                  Continue Watching
                </h2>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex w-max space-x-4 px-4">
                    {continueWatchingItems.map((item) => (
                      <div key={item.id} className="w-32">
                        <WatchingCard item={item} layout="vertical" />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </section>
            )}

            {trendingItems.length > 0 && (
              <section>
                 <h2 className="text-lg font-headline font-semibold px-4 pb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending This Week
                </h2>
                 <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex w-max space-x-4 px-4">
                    {trendingItems.map((item) => (
                      <div key={item.id} className="w-40">
                        <TrendingCard item={item} onClick={() => handleResultClick(item)} />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </section>
            )}

          </div>
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
