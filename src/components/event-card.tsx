
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Film, Tv, Clock } from 'lucide-react';
import type { Event } from '@/lib/events';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const [formattedDateTime, setFormattedDateTime] = useState({ date: '', time: '' });

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    const eventDate = new Date(event.dateTime);
    setFormattedDateTime({
      date: format(eventDate, 'MMM d'),
      time: eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });
  }, [event.dateTime]);

  const isMovie = !event.episode;

  const cardProps = {
    className: "bg-card border-border/50 p-0 transition-transform hover:scale-[1.02] hover:shadow-lg flex flex-col h-full overflow-hidden",
    ...(onClick && { onClick, role: 'button', tabIndex: 0 }),
  };

  return (
    <Card {...cardProps}>
      <div className="relative w-full aspect-[2/3] flex-shrink-0">
        <Image
          src={event.posterUrl}
          alt={`Poster for ${event.title}`}
          fill
          className="object-cover"
          sizes="160px"
          data-ai-hint={event.aiHint}
        />
      </div>
      <div className="flex flex-col flex-grow p-2">
        <h3 className="font-headline text-sm leading-tight font-semibold truncate">{event.title}</h3>
        {!isMovie && <p className="text-xs text-muted-foreground pt-0.5 truncate">{event.episode}</p>}
        <div className="mt-1 pt-1 border-t border-dashed border-border/50">
          <p className="text-xs font-semibold text-primary flex items-center gap-1 h-5">
            <Clock className="h-3 w-3" />
            <span>{formattedDateTime.date}, {formattedDateTime.time}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
