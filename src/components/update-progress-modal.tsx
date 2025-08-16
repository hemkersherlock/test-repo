
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useWatching } from '@/context/watching-context';
import { useEvents } from '@/context/events-context';
import type { WatchingItem } from '@/lib/watching';

export default function UpdateProgressModal() {
  const { 
    isUpdateModalOpen, 
    setIsUpdateModalOpen, 
    selectedWatchingItem, 
    setSelectedWatchingItem,
    updateWatchingItem
  } = useWatching();
  const { setSelectedEvent, setIsModalOpen } = useEvents();

  const [status, setStatus] = useState<WatchingItem['status']>('watchlist');
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (selectedWatchingItem) {
      setStatus(selectedWatchingItem.status);
      setProgress(selectedWatchingItem.progress);

      if (selectedWatchingItem.type === 'show' && selectedWatchingItem.progressText) {
        const match = selectedWatchingItem.progressText.match(/S(\d+)E(\d+)/);
        if (match) {
          setSeason(match[1]);
          setEpisode(match[2]);
        }
      } else {
        setSeason('');
        setEpisode('');
      }
    }
  }, [selectedWatchingItem]);

  const handleClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedWatchingItem(null);
  };

  const handleSave = () => {
    if (!selectedWatchingItem) return;

    let newProgress = progress;
    let newProgressText = selectedWatchingItem.progressText;

    if (selectedWatchingItem.type === 'show') {
      newProgressText = `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`;
      // A simple heuristic for progress percentage
      newProgress = (parseInt(season, 10) - 1) * 20 + parseInt(episode, 10) * 2;
    } else {
      newProgress = status === 'seen' ? 100 : 0;
    }

    // if moving to 'seen' from something else
    if (status === 'seen' && selectedWatchingItem.status !== 'seen') {
        newProgress = 100;
    }
    
    // When moving to 'watching' from 'seen', reset progress if it was 100
    if (status === 'watching' && selectedWatchingItem.status === 'seen') {
        newProgress = 0;
    }


    const updatedItem: WatchingItem = {
      ...selectedWatchingItem,
      status,
      progress: Math.min(100, newProgress), // cap progress at 100
      progressText: newProgressText,
    };
    
    updateWatchingItem(updatedItem);
    handleClose();
  };

  const handleSchedule = () => {
    if (!selectedWatchingItem) return;

    const mockEvent = {
        id: selectedWatchingItem.id,
        title: selectedWatchingItem.title,
        posterUrl: selectedWatchingItem.posterUrl,
        dateTime: new Date().toISOString(),
        episode: selectedWatchingItem.type === 'show' ? 'S01E01' : undefined,
        aiHint: selectedWatchingItem.type === 'show' ? 'series' : 'movie',
        dayOffset: 0,
    };
    
    setSelectedEvent(mockEvent);
    handleClose();
    setIsModalOpen(true); // Open the AddShowModal
  };

  if (!selectedWatchingItem) return null;

  return (
    <Dialog open={isUpdateModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex-row gap-4 items-start">
          <div className="relative w-24 h-36 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={selectedWatchingItem.posterUrl}
              alt={`Poster for ${selectedWatchingItem.title}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="text-left">
            <DialogTitle className="font-headline text-2xl">{selectedWatchingItem.title}</DialogTitle>
            <DialogDescription>{selectedWatchingItem.type === 'tv' ? 'TV Show' : 'Movie'}</DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={status === 'watching' ? 'default' : 'outline'} onClick={() => setStatus('watching')}>Watching</Button>
              <Button variant={status === 'seen' ? 'default' : 'outline'} onClick={() => setStatus('seen')}>Seen</Button>
            </div>
          </div>

          {selectedWatchingItem.type === 'show' && status === 'watching' && (
            <div className="grid grid-cols-2 gap-4">
               <div className="grid w-full gap-1.5">
                <Label htmlFor="season">Season</Label>
                <Input id="season" type="number" placeholder="e.g., 1" value={season} onChange={(e) => setSeason(e.target.value)} />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="episode">Episode</Label>
                <Input id="episode" type="number" placeholder="e.g., 1" value={episode} onChange={(e) => setEpisode(e.target.value)} />
              </div>
            </div>
          )}

          {selectedWatchingItem.type === 'movie' && status === 'watching' && (
             <div className="grid w-full gap-1.5">
                <Label>Watched?</Label>
                <Button variant='outline' onClick={() => setStatus('seen')}>Mark as Watched</Button>
            </div>
          )}

        </div>
        
        <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
           {status === 'watching' ? (
            <>
              <Button onClick={handleSave}>Save Progress</Button>
              <Button onClick={handleSchedule} variant="secondary">Schedule It</Button>
            </>
          ) : (
             <Button onClick={handleSave}>Update Status</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
