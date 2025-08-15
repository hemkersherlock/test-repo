import Image from 'next/image';
import { Film, Tv } from 'lucide-react';
import type { Event } from './calendar-view';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EventCard({ event }: { event: Event }) {
  const isMovie = !event.episode;
  const eventDate = new Date(event.dateTime);

  return (
    <Card className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-stretch">
        <div className="relative w-28 flex-shrink-0">
          <Image
            src={event.posterUrl}
            alt={`Poster for ${event.title}`}
            fill
            className="object-cover"
            sizes="112px"
            data-ai-hint={event.aiHint}
          />
        </div>
        <div className="flex flex-col flex-grow p-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-headline text-lg leading-tight font-semibold">{event.title}</h3>
              {!isMovie && <p className="text-sm text-muted-foreground pt-1">{event.episode}</p>}
            </div>
            <Badge variant="secondary" className="whitespace-nowrap">
              {isMovie ? <Film className="mr-1.5 h-4 w-4" /> : <Tv className="mr-1.5 h-4 w-4" />}
              {isMovie ? 'Movie' : 'Show'}
            </Badge>
          </div>
          <div className="mt-auto pt-2">
            <p className="text-sm font-bold text-primary">
              {eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
            {event.notes && (
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-dashed">
                {event.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
