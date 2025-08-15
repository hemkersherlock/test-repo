
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { SearchIcon, Film, Tv, X } from "lucide-react";
import { searchTMDb, TMDbResult } from "@/lib/tmdb";
import AddShowModal from "@/components/add-show-modal";
import type { Event } from "@/lib/events";
import { debounce } from "lodash";

interface SearchOverlayProps {
  onClose: () => void;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
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
    }, 300),
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
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <div className="max-w-lg mx-auto">
          <div className="bg-background border rounded-lg shadow-2xl">
            {/* Search Results */}
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              {loading && <p className="text-center text-muted-foreground">Searching...</p>}
              {!loading && query.length > 2 && results.length === 0 && (
                <p className="text-center text-muted-foreground">No results for &quot;{query}&quot;</p>
              )}
              {results.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {results.map((item) => (
                     <div 
                        key={item.id} 
                        className="bg-card border-border/50 rounded-lg p-2 flex flex-col items-center text-center gap-2 cursor-pointer hover:bg-accent"
                        onClick={() => handleAddToSchedule(item)}
                      >
                       <div className="relative w-24 h-36 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                           src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://placehold.co/200x300.png'}
                           alt={`Poster for ${item.title || item.name}`}
                           fill
                           className="object-cover"
                           sizes="96px"
                          />
                       </div>
                       <div className="flex-grow flex flex-col justify-between">
                         <h4 className="font-semibold leading-tight text-sm">{item.title || item.name}</h4>
                         <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                           {item.media_type === 'movie' ? <Film /> : <Tv />}
                           <span>{item.media_type === 'movie' ? 'Movie' : 'TV'}</span>
                         </div>
                       </div>
                   </div>
                  ))}
                </div>
              )}
               {!query && (
                <p className="text-center text-muted-foreground">Search for movies and shows...</p>
              )}
            </div>
            
            {/* Search Input */}
            <div className="p-4 border-t">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="e.g., Blade Runner 2049..."
                  className="pl-10 pr-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                 <button onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddShowModal isOpen={isModalOpen} onClose={closeModal} eventToEdit={selectedItem} />
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-3xl font-headline font-bold">Search</h1>
        <p className="text-muted-foreground mt-2">
            This page is no longer used directly.
            <br />
            Search is now available via the floating button on the Home and Calendar pages.
        </p>
    </div>
  );
}
