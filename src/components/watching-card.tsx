
import Image from 'next/image';
import type { WatchingItem } from '@/lib/watching';
import { Film, Tv, CheckCircle, ListPlus, PlayCircle } from 'lucide-react';
import { Progress } from './ui/progress';
import { Card } from './ui/card';

interface WatchingCardProps {
  item: WatchingItem;
  onClick?: () => void;
}

export default function WatchingCard({ item, onClick }: WatchingCardProps) {
  const cardProps = {
    className: "bg-card border-border/50 p-0 transition-transform hover:scale-[1.02] hover:shadow-lg flex flex-col h-full overflow-hidden",
    ...(onClick && { onClick, role: 'button', tabIndex: 0 }),
  };

  const renderStatusDetails = () => {
    switch(item.status) {
      case 'watching':
        return (
          <div className='w-full'>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium mb-1 truncate">{item.progressText}</p>
              <p className="text-xs text-muted-foreground font-medium mb-1">{item.progress}%</p>
            </div>
            <Progress value={item.progress} className="h-1" />
          </div>
        );
      case 'seen':
        return (
           <div className="flex items-center gap-1.5 text-xs text-green-400">
              <CheckCircle className="w-3 h-3" />
              <span>Watched</span>
            </div>
        );
      case 'watchlist':
        return (
           <div className="flex items-center gap-1.5 text-xs text-accent">
              <ListPlus className="w-3 h-3" />
              <span>On Watchlist</span>
            </div>
        );
    }
  }

  const isHorizontal = item.status !== 'watching';

  if (isHorizontal) {
    // Horizontal layout for Seen/Watchlist
    return (
      <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-card transition-colors w-full">
        <div className="relative w-12 h-16 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={item.posterUrl}
            alt={`Poster for ${item.title}`}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="flex flex-col flex-grow gap-1">
            <h3 className="font-semibold leading-tight text-foreground">{item.title}</h3>
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
              {renderStatusDetails()}
            </div>
        </div>
      </div>
    );
  }

  // Vertical card layout for "Continue Watching"
  return (
    <Card {...cardProps}>
      <div className="relative w-full aspect-[2/3] flex-shrink-0">
        <Image
          src={item.posterUrl}
          alt={`Poster for ${item.title}`}
          fill
          className="object-cover"
          sizes="144px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <PlayCircle className="absolute bottom-2 right-2 h-6 w-6 text-white/80" />
      </div>
      <div className="flex flex-col flex-grow p-2">
        <h3 className="font-headline text-sm leading-tight font-semibold truncate">{item.title}</h3>
        <div className="mt-1 w-full">
          {renderStatusDetails()}
        </div>
      </div>
    </Card>
  );
}
