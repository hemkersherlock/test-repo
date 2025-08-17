
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
import { searchTMDb, TMDbResult } from "@/lib/tmdb";
import { debounce } from "lodash";
import Image from "next/image";
import { useCine } from "@/context/cine-context";
import type { CineItem } from "@/lib/types";

export default function AddShowModal() {
  const { 
    updateItem,
    modalOpen,
    setModalOpen,
    selectedItem,
    setSelectedItem,
  } = useCine();

  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [type, setType] = useState<'movie' | 'show'>('movie');
  const [season, setSeason] = useState('1');
  const [episode, setEpisode] = useState('1');
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  const [searchResults, setSearchResults] = useState<TMDbResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const isEditMode = !!selectedItem;

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
    // Prevent search when selecting an item that already has a title
    if (searchQuery !== title) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, title, debouncedSearch]);


  const resetForm = () => {
    setTitle('');
    setSearchQuery('');
    setType('movie');
    setSeason('1');
    setEpisode('1');
    setDate(undefined);
    setTime('');
    setNotes('');
    setPosterUrl('');
    setSearchResults([]);
  };

  useEffect(() => {
    if (modalOpen && selectedItem) {
      const eventDate = selectedItem.scheduleDate ? new Date(selectedItem.scheduleDate) : new Date();
      
      setTitle(selectedItem.title || '');
      setSearchQuery(selectedItem.title || '');
      setPosterUrl(selectedItem.posterUrl || 'https://placehold.co/200x300.png');
      setType(selectedItem.type);
      
      if (selectedItem.type === 'show' && selectedItem.progress) {
        setSeason(String(selectedItem.progress.season));
        setEpisode(String(selectedItem.progress.episode));
      } else {
          setSeason('1');
          setEpisode('1');
      }

      setDate(eventDate);
      setTime(formatDate(eventDate, 'HH:mm'));
      setNotes(selectedItem.notes || '');
    } else {
      resetForm();
    }
  }, [selectedItem, modalOpen]);

  const handleSelectResult = (result: TMDbResult) => {
    const isShow = result.media_type === 'tv';
    const resultTitle = isShow ? result.name : result.title;
    setTitle(resultTitle);
    setSearchQuery(resultTitle);
    setPosterUrl(result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}`: 'https://placehold.co/200x300.png');
    setType(isShow ? 'show' : 'movie');
    setSearchResults([]);
  };

  const handleSubmit = () => {
    if (!title || !date || !time || !selectedItem) {
      // Basic validation
      alert("Please fill in all required fields.");
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours, minutes);

    const itemData: Partial<CineItem> = {
      title,
      posterUrl: posterUrl || 'https://placehold.co/200x300.png',
      scheduleDate: combinedDateTime.toISOString(),
      notes,
      type,
      status: 'scheduled',
      ...(type === 'show' && { progress: { season: parseInt(season), episode: parseInt(episode) } }),
    };

    updateItem(selectedItem.id, itemData);
    handleClose();
  };
  
  const handleClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
    resetForm();
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {isEditMode ? "Update Schedule" : "Add to Schedule"}
          </DialogTitle>
          <DialogDescription>
             Schedule a movie or show to watch.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5 relative">
            <Label htmlFor="title">Search by name</Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="title" placeholder={'e.g., Blade Runner 2049'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoComplete="off" className="pl-10" />
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
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isEditMode ? "Save Changes" : "Add to Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
