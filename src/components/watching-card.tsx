
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { WatchingItem } from '@/lib/watching';
import { Progress } from './ui/progress';
import { CheckCircle, ListPlus } from 'lucide-react';

interface WatchingCardProps {
  item: WatchingItem;
  onClick?: () => void;
}

export default function WatchingCard({ item }: WatchingCardProps) {

  const renderStatus = () => {
    switch (item.status) {
      case 'watching':
        return (
          <div className="w-full">
            <p className="text-xs text-muted-foreground font-medium mb-1">{item.progressText}</p>
            <Progress value={item.progress} className="h-2" />
          </div>
        );
      case 'seen':
        return (
          <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>Watched Completely</span>
          </div>
        );
      case 'watchlist':
         return (
          <div className="flex items-center gap-2 text-sm text-accent font-medium">
            <ListPlus className="w-4 h-4" />
            <span>On your watchlist</span>
          </div>
        );
      default:
        return null;
    }
  }


  return (
    <Card className="bg-card border-border/50 p-4 flex gap-4 items-center relative overflow-hidden h-32 rounded-lg">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={item.posterUrl}
          alt={`Background for ${item.title}`}
          fill
          className="object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-card/50"></div>
      </div>
      
      {/* Card Content */}
      <div className="relative z-10 flex gap-4 items-center w-full">
        <div className="relative w-20 h-24 flex-shrink-0 rounded-md overflow-hidden shadow-lg">
          <Image
            src={item.posterUrl}
            alt={`Poster for ${item.title}`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex flex-col flex-grow gap-2">
            <h3 className="font-headline text-lg leading-tight font-semibold text-foreground">{item.title}</h3>
            <div className="mt-1">
              {renderStatus()}
            </div>
        </div>
      </div>
    </Card>
  );
}
