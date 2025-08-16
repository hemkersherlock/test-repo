
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TMDbResult } from "@/lib/tmdb";
import { useEvents } from "@/context/events-context";
import { useWatching } from "@/context/watching-context";
import { ScrollArea } from "./ui/scroll-area";

interface SearchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TMDbResult;
}

export default function SearchResultModal({ isOpen, onClose, result }: SearchResultModalProps) {
  const { setSelectedEvent, setIsModalOpen } = useEvents();
  const { addWatchingItem } = useWatching();

  const handleSchedule = () => {
    // This will open the AddShowModal with pre-filled data
    const isShow = result.media_type === 'tv';
    
    // Create a mock event object to pass to the context
    // The AddShowModal will use this to pre-populate its fields
    const mockEvent = {
        id: result.id, // Use TMDb id temporarily
        title: result.title || result.name,
        posterUrl: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : 'https://placehold.co/200x300.png',
        dateTime: new Date().toISOString(),
        episode: isShow ? 'S01E01' : undefined,
        aiHint: isShow ? 'series' : 'movie',
        dayOffset: 0,
    };
    
    setSelectedEvent(mockEvent);
    onClose(); // Close this modal
    setIsModalOpen(true); // Open the other modal
  };

  const handleTrack = () => {
    addWatchingItem(result, 'watching');
    onClose();
  };

  const handleWatchlist = () => {
    addWatchingItem(result, 'watchlist');
    onClose();
  };
  
  const year = result.release_date?.substring(0, 4) || result.first_air_date?.substring(0, 4) || 'N/A';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex-row gap-4 items-start">
          <div className="relative w-24 h-36 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : 'https://placehold.co/200x300.png'}
              alt={`Poster for ${result.title || result.name}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="text-left">
            <DialogTitle className="font-headline text-2xl">{result.title || result.name}</DialogTitle>
            <DialogDescription>{year} &middot; {result.media_type === 'tv' ? 'TV Show' : 'Movie'}</DialogDescription>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-32 pr-4">
            <p className="text-sm text-muted-foreground">{result.overview}</p>
        </ScrollArea>
        <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button onClick={handleSchedule}>Schedule It</Button>
          <Button onClick={handleTrack} variant="secondary">Track It</Button>
          <Button onClick={handleWatchlist} variant="outline">Add to Watchlist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
