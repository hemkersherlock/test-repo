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
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format as formatDate, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Event } from "@/lib/events";

interface AddShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: Event | null;
}

export default function AddShowModal({ isOpen, onClose, eventToEdit }: AddShowModalProps) {
  const [title, setTitle] = useState('');
  const [episode, setEpisode] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const isEditMode = !!eventToEdit;

  useEffect(() => {
    if (isEditMode) {
      const eventDate = new Date(eventToEdit.dateTime);
      setTitle(eventToEdit.title);
      setEpisode(eventToEdit.episode || '');
      setDate(eventDate);
      setTime(formatDate(eventDate, 'HH:mm'));
      setNotes(eventToEdit.notes || '');
    } else {
      // Reset form for "add" mode
      setTitle('');
      setEpisode('');
      setDate(new Date());
      setTime(formatDate(new Date(), 'HH:mm'));
      setNotes('');
    }
  }, [eventToEdit, isEditMode, isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {isEditMode ? "Edit Movie/Show" : "Add Movie/Show"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for your scheduled event." : "Schedule a new movie or show to watch."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="title">Movie/Show name</Label>
            <Input id="title" placeholder="e.g., Blade Runner 2049" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="episode">Season/Episode (optional)</Label>
            <Input id="episode" placeholder="e.g., S01E01" value={episode} onChange={(e) => setEpisode(e.target.value)} />
          </div>
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
            {isEditMode ? "Save Changes" : "Add Show"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
