
"use client";

import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import WatchingCard from "@/components/watching-card";
import type { WatchingItem } from "@/lib/watching";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWatching } from '@/context/watching-context';

type Status = 'watchlist' | 'watching' | 'seen';

const TabButton = ({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "pb-2 text-sm font-medium capitalize transition-colors relative",
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    )}
  >
    {label} ({count})
    {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
  </button>
);


export default function WatchingPage() {
  const [activeTab, setActiveTab] = useState<Status>('watching');
  const { watchingItems } = useWatching();

  const watchingFiltered = watchingItems.filter(item => item.status === 'watching');
  const seenFiltered = watchingItems.filter(item => item.status === 'seen');
  const watchlistFiltered = watchingItems.filter(item => item.status === 'watchlist');

  const tabs: { id: Status; label: string; items: WatchingItem[] }[] = [
    { id: 'watching', label: 'Watching', items: watchingFiltered },
    { id: 'seen', label: 'Seen', items: seenFiltered },
    { id: 'watchlist', label: 'Watchlist', items: watchlistFiltered },
  ];
  
  const activeItems = tabs.find(tab => tab.id === activeTab)?.items || [];

  return (
    <div className="flex justify-center min-h-full">
      <div className="w-full max-w-lg">
        <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col gap-4">
          <h1 className="text-3xl font-headline font-bold text-center">My Lists</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter your lists..." className="pl-10" />
          </div>
        </header>
        
        <nav className="flex justify-around items-center h-12 border-b border-border px-4 sticky top-[136px] bg-background/80 backdrop-blur-sm z-10">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              label={tab.label}
              count={tab.items.length}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>

        <ScrollArea className="h-[calc(100vh-136px-48px-64px)]">
           <div className="space-y-1 p-4 pb-24">
              {activeItems.map((item) => (
                  <WatchingCard key={item.id} item={item} />
              ))}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}
