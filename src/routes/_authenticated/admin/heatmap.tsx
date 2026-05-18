import { createFileRoute } from '@tanstack/react-router';
import { MOVIES } from '@/data/movies';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/heatmap')({ component: H });

function H() {
  return (
    <div className="p-8">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Scene heatmap control —</p>
      <h1 className="font-display text-4xl font-black">Audience reactions</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {MOVIES.slice(0,8).map(m => (
          <Link key={m.id} to="/heatmap/$movieId" params={{ movieId: m.id }}
            className="flex items-center justify-between rounded-md border border-border bg-card p-4 hover:border-primary">
            <div>
              <p className="font-display text-base font-bold">{m.title}</p>
              <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Replays · {120 + m.year % 80}  ·  Reactions · {800 + m.year % 200}</p>
            </div>
            <span className="font-retro text-xs uppercase tracking-widest text-primary">Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
