import { createFileRoute, notFound } from '@tanstack/react-router';
import { findMovie, type Movie } from '@/data/movies';
import { useAuth } from '@/lib/auth';
import { LockOverlay } from '@/components/premium/LockOverlay';

export const Route = createFileRoute('/_authenticated/heatmap/$movieId')({
  component: Heatmap,
  loader: ({ params }) => {
    const movie = findMovie(params.movieId);
    if (!movie) throw notFound();
    return { movie };
  },
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">Reel missing</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">{error.message}</div>,
});

function Heatmap() {
  const { movie } = Route.useLoaderData() as { movie: Movie };
  const { isPremium } = useAuth();
  // Generate fake intensity data
  const segments = Array.from({ length: 40 }, (_, i) => {
    const t = i / 40;
    const intensity = 0.3 + Math.abs(Math.sin(t * Math.PI * 3 + movie.id.length)) * 0.7;
    return { i, intensity };
  });
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-10">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Scene Heatmap —</p>
      <h1 className="font-display text-3xl font-black">{movie.title}</h1>
      <p className="text-muted-foreground">A timeline of replays, gasps and pauses across the audience.</p>
      <div className="relative mt-8 rounded-md border border-border bg-card p-6">
        <div className="film-strip relative h-24 overflow-hidden rounded-sm">
          <div className="absolute inset-x-0 top-1/2 flex h-12 -translate-y-1/2 items-end gap-[2px] px-3">
            {segments.map(s => (
              <div key={s.i} className="flex-1 rounded-sm"
                style={{
                  height: `${s.intensity * 100}%`,
                  background: `oklch(0.74 0.16 ${30 + s.intensity * 40} / ${0.4 + s.intensity * 0.6})`,
                  boxShadow: s.intensity > 0.8 ? '0 0 12px oklch(0.74 0.16 50 / 0.8)' : 'none',
                }} />
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { label: 'Most replayed', value: '68m – 71m', sub: 'The mirror scene' },
            { label: 'Emotional peak', value: '42m', sub: 'Audience reactions: 😭 312' },
            { label: 'Drop-off zone', value: '23m', sub: 'Slow burn, beware' },
          ].map(c => (
            <div key={c.label} className="rounded-sm border border-border bg-background p-4">
              <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</p>
              <p className="mt-1 font-display text-xl font-bold text-primary">{c.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
            </div>
          ))}
        </div>
        {!isPremium && <LockOverlay feature="Scene Heatmap"/>}
      </div>
    </div>
  );
}
