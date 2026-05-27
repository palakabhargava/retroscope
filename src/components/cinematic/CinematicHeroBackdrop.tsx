import React from 'react';
import type { Movie } from '@/data/movies';
import { CinematicImage } from '@/components/ui/CinematicImage';

export function CinematicHeroBackdrop({
  item,
  className = '',
}: {
  item: Pick<Movie, 'banner' | 'title' | 'atmosphere' | 'type'>;
  className?: string;
}) {
  const imageType =
    item.type === 'anime'
      ? 'anime'
      : item.type === 'kids'
        ? 'kids'
        : item.type === 'mature'
          ? 'mature'
          : 'banner';

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      <CinematicImage
        src={item.banner}
        alt={item.title}
        fallbackTitle={item.title}
        atmosphere={item.atmosphere}
        aspectRatio="banner"
        imageType={imageType}
        className="absolute inset-0"
      />
    </div>
  );
}

