
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Film, Tv, Clock } from 'lucide-react';
import type { Event } from '@/lib/events';
import { Card } from '@/components/ui/card';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    const eventDate = new Date(event.dateTime);
    setFormattedTime(
      eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  }, [event.dateTime]);

  const isMovie = !event.episode;

  const cardProps = {
    className: "bg-card border-border/50 p-4 transition-transform hover:scale-[1.02] hover:shadow-lg flex gap-4 items-start",
    ...(onClick && { onClick, role: 'button', tabIndex: 0 }),
  };

  return (
    <Card {...cardProps}>
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
           <p className="text-sm font-semibold text-primary flex items-center gap-2 h-5">
            <Clock className="h-4 w-4" />
            {formattedTime}
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
