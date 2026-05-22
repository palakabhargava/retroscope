import React from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import type { Movie } from '@/data/movies';
import { ambientForAtmosphere } from '@/lib/utils';
import { CinematicImage } from '@/components/ui/CinematicImage';

export const PosterCard = React.memo(function PosterCard({ movie, size = 'md' }: { movie: Movie; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
  sm: 'w-24 h-36 sm:w-28 sm:h-40',
  md: 'w-28 h-40 sm:w-36 sm:h-52 md:w-44 md:h-64',
  lg: 'w-36 h-52 sm:w-44 sm:h-64 md:w-56 md:h-80',
  };

  return (
    <Link to="/movies/$movieId" params={{ movieId: movie.id }} className="group block">
      <motion.div
        whileHover={{
  y: -8,
  scale: 1.03,
  rotateX: 2,
}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`${sizes[size]} relative overflow-hidden rounded-md border border-border bg-card shadow-lg ${ambientForAtmosphere(movie.atmosphere)}`}
      >
        <CinematicImage
          src={movie.poster}
          alt={movie.title}
          fallbackTitle={movie.title}
          atmosphere={movie.atmosphere}
          aspectRatio="poster"
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Card Details */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-10 pointer-events-none">
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

