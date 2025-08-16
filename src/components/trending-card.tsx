
"use client";

import Image from 'next/image';
import type { TMDbResult } from '@/lib/tmdb';
import { Card } from '@/components/ui/card';

interface TrendingCardProps {
  item: TMDbResult;
  onClick?: () => void;
}

export default function TrendingCard({ item, onClick }: TrendingCardProps) {
  const cardProps = {
    className: "bg-card border-border/50 p-0 transition-transform hover:scale-[1.02] hover:shadow-lg flex flex-col h-full overflow-hidden",
    ...(onClick && { onClick, role: 'button', tabIndex: 0 }),
  };

  const title = item.title || item.name;

  return (
    <Card {...cardProps}>
      <div className="relative w-full aspect-[2/3] flex-shrink-0">
        <Image
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={`Poster for ${title}`}
          fill
          className="object-cover"
          sizes="160px"
        />
      </div>
      <div className="flex flex-col flex-grow p-2">
        <h3 className="font-headline text-sm leading-tight font-semibold truncate" title={title}>
          {title}
        </h3>
        <p className="text-xs text-muted-foreground pt-0.5">
          {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
        </p>
      </div>
    </Card>
  );
}
