
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import WatchingCard from "@/components/watching-card";
import type { WatchingItem } from "@/lib/watching";

const dummyWatchingData: WatchingItem[] = [
  {
    id: 1,
    title: "House of the Dragon",
    progress: "S02E01",
    posterUrl: "https://image.tmdb.org/t/p/w500/zDb5dFwB4ea3aKVxQk1B2kzbCjE.jpg",
    type: "show",
  },
  {
    id: 2,
    title: "The Boys",
    progress: "S04E04",
    posterUrl: "https://image.tmdb.org/t/p/w500/2zmTngn1tJycAZB2aB6bI7EBQ5J.jpg",
    type: "show",
  },
  {
    id: 3,
    title: "Poor Things",
    progress: "Watched 45%",
    posterUrl: "https://image.tmdb.org/t/p/w500/kCGlIMrg8PzGpqefndqvLGww6I5.jpg",
    type: "movie",
  },
  {
    id: 4,
    title: "Arcane",
    progress: "S01E07",
    posterUrl: "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    type: "show",
  },
];


export default function WatchingPage() {
  return (
    <div className="flex justify-center min-h-full">
      <div className="w-full max-w-lg">
        <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <h1 className="text-3xl font-headline font-bold text-center">Currently Watching</h1>
          <p className="text-center text-muted-foreground">Your tracked shows and movies</p>
        </header>
        <ScrollArea className="h-[calc(100vh-150px)] px-4">
           <div className="space-y-4 pb-24">
            {dummyWatchingData.map((item) => (
              <WatchingCard key={item.id} item={item} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
