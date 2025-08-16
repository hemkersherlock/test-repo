
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import type { WatchingItem } from '@/lib/watching';
import { mockWatchingData } from '@/lib/watching';
import type { TMDbResult } from '@/lib/tmdb';

interface WatchingContextType {
  watchingItems: WatchingItem[];
  addWatchingItem: (item: TMDbResult, status: 'watching' | 'watchlist') => void;
  updateWatchingItem: (item: WatchingItem) => void;
  deleteWatchingItem: (id: number) => void;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedWatchingItem: WatchingItem | null;
  setSelectedWatchingItem: Dispatch<SetStateAction<WatchingItem | null>>;
}

const WatchingContext = createContext<WatchingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'cineScheduleWatchingItems';

export function WatchingProvider({ children }: { children: ReactNode }) {
  const [watchingItems, setWatchingItems] = useState<WatchingItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedWatchingItem, setSelectedWatchingItem] = useState<WatchingItem | null>(null);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedItems) {
        setWatchingItems(JSON.parse(storedItems));
      } else {
        setWatchingItems(mockWatchingData);
      }
    } catch (error) {
        console.error("Failed to access localStorage or process watching items:", error);
        setWatchingItems(mockWatchingData);
    } finally {
        setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchingItems));
        } catch(error) {
            console.error("Failed to save watching items to localStorage:", error);
        }
    }
  }, [watchingItems, isInitialized]);


  const addWatchingItem = (item: TMDbResult, status: 'watching' | 'watchlist') => {
    const isShow = item.media_type === 'tv';
    const newItem: WatchingItem = {
        id: item.id,
        title: item.title || item.name,
        progress: 0,
        posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/200x300.png',
        type: isShow ? 'show' : 'movie',
        status: status,
        progressText: isShow ? 'S01E01' : undefined,
    };

    // Prevent duplicates
    if (watchingItems.some(i => i.id === newItem.id)) {
        console.log("Item already exists in a list.");
        // Optionally, you could update the status if it already exists
        return;
    }

    setWatchingItems(prevItems => [...prevItems, newItem]);
  };

  const updateWatchingItem = (updatedItem: WatchingItem) => {
    setWatchingItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const deleteWatchingItem = (id: number) => {
    setWatchingItems(prevItems => prevItems.filter(item => item.id !== id));
    // Also close modal if the deleted item was selected
    if (selectedWatchingItem?.id === id) {
      setIsUpdateModalOpen(false);
      setSelectedWatchingItem(null);
    }
  };

  const contextValue = {
    watchingItems,
    addWatchingItem,
    updateWatchingItem,
    deleteWatchingItem,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    selectedWatchingItem,
    setSelectedWatchingItem,
  };

  return (
    <WatchingContext.Provider value={contextValue}>
      {children}
    </WatchingContext.Provider>
  );
}

export function useWatching() {
  const context = useContext(WatchingContext);
  if (context === undefined) {
    throw new Error('useWatching must be used within an WatchingProvider');
  }
  return context;
}
