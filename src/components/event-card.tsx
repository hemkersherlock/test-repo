import Image from 'next/image';
import { Film, Tv, Clock } from 'lucide-react';
import type { Event } from './calendar-view';
import { Card } from '@/components/ui/card';

export default function EventCard({ event }: { event: Event }) {
  const isMovie = !event.episode;
  const eventDate = new Date(event.dateTime);

  return (
    <Card className="bg-card border-border/50 p-4 transition-transform hover:scale-[1.02] hover:shadow-lg flex gap-4 items-start">
      <div className="relative w-20 h-28 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={event.posterUrl}
          alt={`Poster for ${event.title}`}
          fill
          className="object-cover"
          sizes="80px"
          data-ai-hint={event.aiHint}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-headline text-lg leading-tight font-semibold">{event.title}</h3>
            {!isMovie && <p className="text-sm text-muted-foreground pt-1">{event.episode}</p>}
          </div>
          <div className="flex-shrink-0 text-muted-foreground">
            {isMovie ? <Film className="h-5 w-5" /> : <Tv className="h-5 w-5" />}
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-dashed border-border/50">
           <p className="text-sm font-semibold text-primary flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
          {event.notes && (
            <p className="text-xs text-muted-foreground mt-2">
              {event.notes}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
