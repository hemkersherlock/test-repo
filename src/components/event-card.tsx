
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import type { CineItem } from '@/lib/types';

interface EventCardProps {
  event: CineItem;
  onClick?: () => void;
  layout?: 'vertical' | 'horizontal';
}

export default function EventCard({ event, onClick, layout = 'horizontal' }: EventCardProps) {
  const [formattedDateTime, setFormattedDateTime] = useState({ date: '', time: '' });

  useEffect(() => {
    if (event.scheduleDate) {
      const eventDate = new Date(event.scheduleDate);
      setFormattedDateTime({
        date: format(eventDate, 'MMM d'),
        time: eventDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      });
    }
  }, [event.scheduleDate]);

  const isMovie = event.type === 'movie';
  
  const progressText = !isMovie && event.progress ? `S${String(event.progress.season).padStart(2, '0')}E${String(event.progress.episode).padStart(2, '0')}` : '';

  const cardProps = {
    className: "bg-card border-border/50 p-0 transition-transform hover:scale-[1.02] hover:shadow-lg flex flex-col h-full overflow-hidden",
    ...(onClick && { onClick, role: 'button', tabIndex: 0 }),
  };

  if (layout === 'horizontal') {
    return (
       <div 
        className="flex items-center gap-4 p-2 rounded-lg hover:bg-card/80 transition-colors w-full cursor-pointer"
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className="relative w-12 h-16 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={event.posterUrl}
            alt={`Poster for ${event.title}`}
            fill
            className="object-cover"
            sizes="48px"
            data-ai-hint={event.type}
          />
        </div>
        <div className="flex flex-col flex-grow gap-1 min-w-0">
            <h3 className="font-semibold leading-tight text-foreground truncate">{event.title}</h3>
            {!isMovie && <p className="text-xs text-muted-foreground pt-0.5 truncate">{progressText}</p>}
            <div className="flex items-center text-xs text-primary font-semibold gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{formattedDateTime.time}</span>
            </div>
        </div>
      </div>
    );
  }

  // Vertical card layout (used on Home page)
  return (
    <Card {...cardProps}>
      <div className="relative w-full aspect-[2/3] flex-shrink-0">
        <Image
          src={event.posterUrl}
          alt={`Poster for ${event.title}`}
          fill
          className="object-cover"
          sizes="160px"
          data-ai-hint={event.type}
        />
      </div>
      <div className="flex flex-col flex-grow p-2">
        <h3 className="font-headline text-sm leading-tight font-semibold truncate">{event.title}</h3>
        {!isMovie && <p className="text-xs text-muted-foreground pt-0.5 truncate">{progressText}</p>}
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
