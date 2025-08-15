
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { SearchIcon, Film, Tv, PlusCircle } from "lucide-react";
import { searchTMDb, TMDbResult } from "@/lib/tmdb";
import AddShowModal from "@/components/add-show-modal";
import { Event } from "@/lib/events";
import { debounce } from "lodash";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDbResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<Event> | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length > 2) {
        setLoading(true);
        const searchResults = await searchTMDb(searchQuery);
        setResults(searchResults);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleAddToSchedule = (item: TMDbResult) => {
    const isShow = item.media_type === "tv";
    setSelectedItem({
      title: isShow ? item.name : item.title,
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      aiHint: isShow ? "tv series" : "movie poster",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="flex justify-center min-h-full">
        <div className="w-full max-w-lg">
          <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <h1 className="text-3xl font-headline font-bold text-center">Search</h1>
          </header>
          <div className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for movies or shows..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="px-4 pb-24">
            {loading && <p className="text-center text-muted-foreground">Searching...</p>}
            
            {!loading && query && results.length === 0 && (
                 <div className="text-center py-16">
                    <p className="text-muted-foreground">No results found for "{query}".</p>
                </div>
            )}

            {!loading && !query && (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">Start typing to search for a movie or show.</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((item) => (
                <div key={item.id} className="bg-card border-border/50 rounded-lg p-3 flex flex-col items-center text-center gap-3">
                    <div className="relative w-28 h-40 flex-shrink-0 rounded-md overflow-hidden">
                       <Image
                        src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://placehold.co/200x300.png'}
                        alt={`Poster for ${item.title || item.name}`}
                        fill
                        className="object-cover"
                        sizes="112px"
                       />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <h4 className="font-semibold leading-tight">{item.title || item.name}</h4>
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        {item.media_type === 'movie' ? <Film /> : <Tv />}
                        <span>{item.media_type === 'movie' ? 'Movie' : 'TV Show'}</span>
                      </div>
                    </div>
                    <button
                        onClick={() => handleAddToSchedule(item)}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3"
                    >
                        <PlusCircle />
                        Add to Schedule
                    </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AddShowModal isOpen={isModalOpen} onClose={closeModal} eventToEdit={selectedItem} />
    </>
  );
}
