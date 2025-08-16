
import Image from 'next/image';
import { Film, Tv, CirclePlay } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { WatchingItem } from '@/lib/watching';

interface WatchingCardProps {
  item: WatchingItem;
  onClick?: () => void;
}

export default function WatchingCard({ item, onClick }: WatchingCardProps) {
  const isMovie = item.type === 'movie';

  return (
    <Card className="bg-card border-border/50 p-4 flex gap-4 items-start relative overflow-hidden">
      <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-black/60 to-transparent z-0"></div>
       <Image
          src={item.posterUrl}
          alt={`Poster for ${item.title}`}
          fill
          className="object-cover object-top z-[-1]"
        />
      <div className="relative w-24 h-36 flex-shrink-0 rounded-md overflow-hidden shadow-lg">
        <Image
          src={item.posterUrl}
          alt={`Poster for ${item.title}`}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex flex-col flex-grow pt-2 z-10">
          <h3 className="font-headline text-lg leading-tight font-semibold text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.7)]">{item.title}</h3>
          <p className="text-sm text-primary-foreground/90 pt-1 font-medium [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]">{item.progress}</p>
        <div className="mt-4 flex items-center gap-2">
            <Button size="sm" className="bg-primary/90 text-primary-foreground hover:bg-primary/100 backdrop-blur-sm">
                <CirclePlay />
                <span>Continue</span>
            </Button>
            <Button size="sm" variant="outline" className="bg-background/50 border-border/50 backdrop-blur-sm">
                Update
            </Button>
        </div>
      </div>
    </Card>
  );
}
