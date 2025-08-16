
import Image from 'next/image';
import type { WatchingItem } from '@/lib/watching';
import { Film, Tv, CheckCircle, ListPlus } from 'lucide-react';
import { Progress } from './ui/progress';

interface WatchingCardProps {
  item: WatchingItem;
  onClick?: () => void;
}

export default function WatchingCard({ item }: WatchingCardProps) {

  const renderStatusDetails = () => {
    switch(item.status) {
      case 'watching':
        return (
          <div className='w-full'>
            <p className="text-xs text-muted-foreground font-medium mb-1">{item.progressText}</p>
            <Progress value={item.progress} className="h-1" />
          </div>
        );
      case 'seen':
        return (
           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Watched</span>
            </div>
        );
      case 'watchlist':
        return (
           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ListPlus className="w-3 h-3 text-accent" />
              <span>On Watchlist</span>
            </div>
        );
    }
  }

  return (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-card transition-colors">
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
       <div className="flex-shrink-0">
          {/* Placeholder for a future action icon e.g., bookmark */}
      </div>
    </div>
  );
}
