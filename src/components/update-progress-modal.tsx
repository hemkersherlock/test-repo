
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
import { useCine } from '@/context/cine-context';
import type { CineItem, Status } from '@/lib/types';

export default function UpdateProgressModal() {
  const { 
    updateModalOpen,
    setUpdateModalOpen,
    selectedItem,
    setSelectedItem,
    updateItem,
    setModalOpen,
  } = useCine();

  const [status, setStatus] = useState<Status>('watchlist');
  const [season, setSeason] = useState('1');
  const [episode, setEpisode] = useState('1');

  useEffect(() => {
    if (selectedItem) {
      setStatus(selectedItem.status);
      if (selectedItem.type === 'show' && selectedItem.progress) {
        setSeason(String(selectedItem.progress.season));
        setEpisode(String(selectedItem.progress.episode));
      } else {
        setSeason('1');
        setEpisode('1');
      }
    }
  }, [selectedItem]);

  const handleClose = () => {
    setUpdateModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    if (!selectedItem) return;

    let updatedData: Partial<CineItem> = { status };
    
    if (status === 'completed' && selectedItem.status !== 'completed') {
      if (selectedItem.type === 'show' && selectedItem.progress) {
        updatedData.progress = { ...selectedItem.progress, current: 100 };
      } else {
         updatedData.progress = { season: 0, episode: 0, current: 100 };
      }
    }

    if (status === 'watching' && selectedItem.status === 'completed') {
       if (selectedItem.type === 'show' && selectedItem.progress) {
        updatedData.progress = { ...selectedItem.progress, current: 0 };
      } else {
         updatedData.progress = { season: 0, episode: 0, current: 0 };
      }
    }
    
    if (selectedItem.type === 'show') {
      // A simple heuristic for progress percentage
      const newProgress = (parseInt(season, 10) - 1) * 10 + parseInt(episode, 10) * 5;
      updatedData.progress = {
        season: parseInt(season),
        episode: parseInt(episode),
        current: Math.min(100, newProgress), // cap progress
      };
    }
    
    updateItem(selectedItem.id, updatedData);
    handleClose();
  };

  const handleSchedule = () => {
    if (!selectedItem) return;
    // The AddShowModal will be opened with the selected item pre-filled
    setSelectedItem(selectedItem);
    handleClose(); // Close this modal
    setModalOpen(true); // Open the AddShowModal
  };

  if (!selectedItem) return null;

  return (
    <Dialog open={updateModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex-row gap-4 items-start">
          <div className="relative w-24 h-36 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={selectedItem.posterUrl}
              alt={`Poster for ${selectedItem.title}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="text-left">
            <DialogTitle className="font-headline text-2xl">{selectedItem.title}</DialogTitle>
            <DialogDescription>{selectedItem.type === 'show' ? 'TV Show' : 'Movie'}</DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label>Status</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant={status === 'watchlist' ? 'default' : 'outline'} onClick={() => setStatus('watchlist')}>Watchlist</Button>
              <Button variant={status === 'watching' ? 'default' : 'outline'} onClick={() => setStatus('watching')}>Watching</Button>
              <Button variant={status === 'completed' ? 'default' : 'outline'} onClick={() => setStatus('completed')}>Completed</Button>
            </div>
          </div>

          {selectedItem.type === 'show' && status === 'watching' && (
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
        </div>
        
        <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button onClick={handleSave}>Update</Button>
          <Button onClick={handleSchedule} variant="secondary">Schedule It</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
