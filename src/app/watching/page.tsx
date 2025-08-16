
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import WatchingCard from "@/components/watching-card";
import type { WatchingItem } from "@/lib/watching";

const dummyWatchingData: WatchingItem[] = [
  {
    id: 1,
    title: "House of the Dragon",
    progress: 85,
    posterUrl: "https://image.tmdb.org/t/p/w500/zDb5dFwB4ea3aKVxQk1B2kzbCjE.jpg",
    type: "show",
    progressText: "S02E01",
    status: "watching",
  },
  {
    id: 2,
    title: "The Boys",
    progress: 50,
    posterUrl: "https://image.tmdb.org/t/p/w500/2zmTngn1tJycAZB2aB6bI7EBQ5J.jpg",
    type: "show",
    progressText: "S04E04",
    status: "watching",
  },
  {
    id: 3,
    title: "Poor Things",
    progress: 100,
    posterUrl: "https://image.tmdb.org/t/p/w500/kCGlIMrg8PzGpqefndqvLGww6I5.jpg",
    type: "movie",
    progressText: "Watched",
    status: "seen",
  },
    {
    id: 5,
    title: "The Matrix",
    progress: 100,
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    type: "movie",
    progressText: "Watched",
    status: "seen",
  },
  {
    id: 4,
    title: "Arcane",
    progress: 0,
    posterUrl: "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    type: "show",
    progressText: "S01E01",
    status: "watchlist",
  },
   {
    id: 6,
    title: "Fallout",
    progress: 0,
    posterUrl: "https://image.tmdb.org/t/p/w500/gO9k7t9iQnFVjD2zh2nQo1i2a2M.jpg",
    type: "show",
    progressText: "S01E01",
    status: "watchlist",
  },
];

const Section = ({ title, items }: { title: string; items: WatchingItem[] }) => {
  if (items.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-headline font-bold mb-4 px-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <WatchingCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default function WatchingPage() {
  const watchingItems = dummyWatchingData.filter(item => item.status === 'watching');
  const seenItems = dummyWatchingData.filter(item => item.status === 'seen');
  const watchlistItems = dummyWatchingData.filter(item => item.status === 'watchlist');

  return (
    <div className="flex justify-center min-h-full">
      <div className="w-full max-w-lg">
        <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <h1 className="text-3xl font-headline font-bold text-center">My Lists</h1>
          <p className="text-center text-muted-foreground">Your tracked shows and movies</p>
        </header>
        <ScrollArea className="h-[calc(100vh-150px)] px-4">
           <div className="pb-24 pt-4">
              <Section title="Currently Watching" items={watchingItems} />
              <Section title="Already Seen" items={seenItems} />
              <Section title="My Watchlist" items={watchlistItems} />
           </div>
        </ScrollArea>
      </div>
    </div>
  );
}
