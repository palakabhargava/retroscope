import type { Movie } from '@/data/movies';
import { PosterCard } from './PosterCard';

export function MovieRow({ title, subtitle, movies }: { title: string; subtitle?: string; movies: Movie[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          {subtitle && <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory flex-nowrap scroll-smooth">
        <div className="flex gap-5">
          {movies.map(m => (
            <div key={m.id} className="shrink-0 snap-start snap-always">
              <PosterCard movie={m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
