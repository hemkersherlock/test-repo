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
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Event } from "@/lib/events";

interface AddShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: Event | null;
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

  const isEditMode = !!eventToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && eventToEdit) {
        const eventDate = new Date(eventToEdit.dateTime);
        const isShow = !!eventToEdit.episode;
        
        setTitle(eventToEdit.title);
        setType(isShow ? 'show' : 'movie');
        
        if (isShow && eventToEdit.episode) {
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
      }
    }
  }, [eventToEdit, isEditMode, isOpen]);


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
          <div className="grid w-full gap-1.5">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={type === 'movie' ? 'default' : 'outline'} onClick={() => setType('movie')}>Movie</Button>
              <Button variant={type === 'show' ? 'default' : 'outline'} onClick={() => setType('show')}>Show</Button>
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="title">{type === 'movie' ? 'Movie' : 'Show'} name</Label>
            <Input id="title" placeholder={type === 'movie' ? 'e.g., Blade Runner 2049' : 'e.g., Stranger Things'} value={title} onChange={(e) => setTitle(e.target.value)} />
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
