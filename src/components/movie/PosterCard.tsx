import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import type { Movie } from '@/data/movies';
import { ambientForAtmosphere } from '@/lib/utils';
import { Film } from 'lucide-react';

export const PosterCard = React.memo(function PosterCard({ movie, size = 'md' }: { movie: Movie; size?: 'sm' | 'md' | 'lg' }) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: 'w-32 h-48',
    md: 'w-44 h-64',
    lg: 'w-56 h-80',
  };

  // Helper to extract clean image URL from CSS expression url('https://...')
  const getImageUrl = (cssUrl: string) => {
    if (!cssUrl) return '';
    const match = cssUrl.match(/url\(['"]?([^'"]+)['"]?\)/);
    return match ? match[1] : '';
  };

  const imgUrl = getImageUrl(movie.poster);
  const isGradient = !imgUrl && movie.poster.includes('gradient');

  return (
    <Link to="/movies/$movieId" params={{ movieId: movie.id }} className="group block">
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`${sizes[size]} relative overflow-hidden rounded-md border border-border bg-card shadow-lg ${ambientForAtmosphere(movie.atmosphere)}`}
      >
        {/* Shimmer/Skeleton background during load */}
        {imgUrl && !loaded && !hasError && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-card via-border to-card flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent opacity-60" />
          </div>
        )}

        {/* Dynamic Widescreen/Poster Image with native lazy loading */}
        {imgUrl && !hasError ? (
          <img
            src={imgUrl}
            alt={movie.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setHasError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
            style={{ opacity: loaded ? 1 : 0 }}
          />
        ) : null}

        {/* Fallback Graphic (Gradient Background or Missing URL Failover) */}
        {(hasError || isGradient) && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-card via-black/85 to-black"
            style={{ backgroundImage: !imgUrl ? movie.poster : undefined }}
          >
            <Film className="h-8 w-8 text-primary/40 mb-2 animate-pulse" />
            <span className="font-retro text-[8px] uppercase tracking-widest text-primary/80">REEL SCREENPLAY</span>
            <p className="mt-1 font-display text-xs font-black leading-tight text-foreground/90 line-clamp-2 px-1">{movie.title}</p>
          </div>
        )}

        {/* Glassmorphic Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
        
        {/* Card Details */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-10">
          <p className="font-retro text-[9px] uppercase tracking-widest text-primary">{movie.year}</p>
          <h3 className="font-display text-sm font-bold leading-tight text-foreground truncate">{movie.title}</h3>
          <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">{movie.genres.join(' · ')}</p>
        </div>

        {/* Ticket Rating Badge */}
        <div className="absolute right-2 top-2 rounded-sm bg-black/60 px-1.5 py-0.5 font-retro text-[9px] text-primary backdrop-blur border border-white/5 shadow-md z-10">
          ★ {movie.rating.toFixed(1)}
        </div>
      </motion.div>
    </Link>
  );
});
