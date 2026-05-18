import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import type { Movie } from '@/data/movies';
import { ambientForAtmosphere } from '@/lib/utils';

export function PosterCard({ movie, size = 'md' }: { movie: Movie; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-32 h-48',
    md: 'w-44 h-64',
    lg: 'w-56 h-80',
  };
  return (
    <Link to="/movies/$movieId" params={{ movieId: movie.id }} className="group block">
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`${sizes[size]} relative overflow-hidden rounded-md border border-border bg-cover bg-center ${ambientForAtmosphere(movie.atmosphere)}`}
        style={{ backgroundImage: movie.poster }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="font-retro text-[10px] uppercase tracking-widest text-primary">{movie.year}</p>
          <h3 className="font-display text-base font-bold leading-tight text-foreground">{movie.title}</h3>
          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{movie.genres.join(' · ')}</p>
        </div>
        <div className="absolute right-2 top-2 rounded-sm bg-black/60 px-1.5 py-0.5 font-retro text-[10px] text-primary backdrop-blur">
          ★ {movie.rating}
        </div>
      </motion.div>
    </Link>
  );
}
