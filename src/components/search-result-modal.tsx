
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
import { useCine } from "@/context/cine-context";
import { ScrollArea } from "./ui/scroll-area";
import type { CineItem } from "@/lib/types";

interface SearchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TMDbResult;
}

export default function SearchResultModal({ isOpen, onClose, result }: SearchResultModalProps) {
  const { addItem, setModalOpen, setSelectedItem } = useCine();

  const handleSchedule = () => {
    const newItem = createCineItem('scheduled');
    setSelectedItem(newItem);
    onClose(); 
    setModalOpen(true);
  };

  const handleTrack = () => {
    const newItem = createCineItem('watching');
    addItem(newItem);
    onClose();
  };

  const handleWatchlist = () => {
    const newItem = createCineItem('watchlist');
    addItem(newItem);
    onClose();
  };
  
  const createCineItem = (status: CineItem['status']): CineItem => {
    const isShow = result.media_type === 'tv';
    return {
      id: String(result.id),
      title: result.title || result.name,
      posterUrl: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : 'https://placehold.co/200x300.png',
      type: isShow ? 'show' : 'movie',
      status: status,
      ...(status === 'scheduled' && { scheduleDate: new Date().toISOString() }),
      ...(isShow && { progress: { season: 1, episode: 1, current: 0 } }),
    };
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
