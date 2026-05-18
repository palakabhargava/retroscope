import { createFileRoute } from '@tanstack/react-router';
import { MOVIES } from '@/data/movies';
import { PosterCard } from '@/components/movie/PosterCard';

export const Route = createFileRoute('/_authenticated/watchlist')({ component: Watchlist });

function Watchlist() {
  const shelves = [
    { name: 'Rainy Sundays', items: MOVIES.slice(0, 6) },
    { name: 'Late Reels', items: MOVIES.slice(8, 14) },
    { name: 'To Rewatch', items: MOVIES.slice(15, 21) },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Your VHS shelves —</p>
      <h1 className="font-display text-4xl font-black">The Movie Shelf</h1>

      <div className="mt-8 space-y-12">
        {shelves.map(shelf => (
          <div key={shelf.name}>
            <h2 className="font-display text-xl font-bold">{shelf.name}</h2>
            <div className="relative mt-4 rounded-md border border-border p-5"
              style={{ background: 'linear-gradient(180deg, oklch(0.22 0.01 50), oklch(0.18 0.005 60))' }}>
              <div className="flex flex-wrap gap-4">
                {shelf.items.map(m => <PosterCard key={m.id} movie={m} size="sm"/>)}
              </div>
              <div className="mt-4 h-3 rounded-sm bg-gradient-to-b from-[oklch(0.32_0.04_45)] to-[oklch(0.22_0.02_45)] shadow-[0_4px_12px_rgba(0,0,0,0.6)]"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
