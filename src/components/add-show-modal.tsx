
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import type { Event } from "@/lib/events";
import { searchTMDb, TMDbResult } from "@/lib/tmdb";
import { debounce } from "lodash";
import Image from "next/image";

interface AddShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: Event | Partial<Event> | null;
}

type EventType = "movie" | "show";

export default function AddShowModal({ isOpen, onClose, eventToEdit }: AddShowModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('movie');
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  const [searchResults, setSearchResults] = useState<TMDbResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const isEditMode = !!(eventToEdit && 'id' in eventToEdit);

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

  useEffect(() => {
    debouncedSearch(title);
  }, [title, debouncedSearch]);


  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        const eventDate = ('dateTime' in eventToEdit && eventToEdit.dateTime) ? new Date(eventToEdit.dateTime) : new Date();
        const isShow = ('episode' in eventToEdit && !!eventToEdit.episode) || eventToEdit.aiHint?.includes('series');
        
        setTitle(eventToEdit.title || '');
        setPosterUrl(eventToEdit.posterUrl || 'https://placehold.co/200x300.png');
        setType(isShow ? 'show' : 'movie');
        
        if (isShow && 'episode' in eventToEdit && eventToEdit.episode) {
            const match = eventToEdit.episode.match(/S(\d+)E(\d+)/);
            if (match) {
                setSeason(match[1]);
                setEpisode(match[2]);
            }
        } else {
            setSeason('');
            setEpisode('');
        }

        setDate(eventDate);
        setTime(formatDate(eventDate, 'HH:mm'));
        setNotes(eventToEdit.notes || '');
      } else {
        // Reset form for "add" mode
        setTitle('');
        setType('movie');
        setSeason('');
        setEpisode('');
        setDate(new Date());
        setTime(formatDate(new Date(), 'HH:mm'));
        setNotes('');
        setPosterUrl('');
      }
      setSearchResults([]);
    }
  }, [eventToEdit, isOpen]);

  const handleSelectResult = (result: TMDbResult) => {
    const isShow = result.media_type === 'tv';
    setTitle(isShow ? result.name : result.title);
    setPosterUrl(result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}`: 'https://placehold.co/200x300.png');
    setType(isShow ? 'show' : 'movie');
    setSearchResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {isEditMode ? "Edit Schedule" : "Add to Schedule"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for your scheduled event." : "Schedule a new movie or show to watch."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5 relative">
            <Label htmlFor="title">Search by name</Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="title" placeholder={'e.g., Blade Runner 2049'} value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full z-50 bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map(result => (
                  <div key={result.id} className="flex items-center p-2 hover:bg-accent cursor-pointer" onClick={() => handleSelectResult(result)}>
                    <div className="relative w-10 h-14 mr-3 flex-shrink-0">
                      <Image src={result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : 'https://placehold.co/200x300.png'} alt="poster" fill className="rounded-sm object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{result.title || result.name}</p>
                      <p className="text-xs text-muted-foreground">{result.media_type === 'tv' ? 'TV Show' : 'Movie'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
             {isSearching && <p className="text-sm text-muted-foreground pt-1">Searching...</p>}
          </div>

          <div className="grid w-full gap-1.5">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={type === 'movie' ? 'default' : 'outline'} onClick={() => setType('movie')}>Movie</Button>
              <Button variant={type === 'show' ? 'default' : 'outline'} onClick={() => setType('show')}>Show</Button>
            </div>
          </div>

          {type === 'show' && (
            <div className="grid grid-cols-2 gap-4">
               <div className="grid w-full gap-1.5">
                <Label htmlFor="season">Season number</Label>
                <Input id="season" type="number" placeholder="e.g., 1" value={season} onChange={(e) => setSeason(e.target.value)} />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="episode">Episode number</Label>
                <Input id="episode" type="number" placeholder="e.g., 1" value={episode} onChange={(e) => setEpisode(e.target.value)} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea placeholder="Type your notes here." id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isEditMode ? "Save Changes" : "Add to Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
