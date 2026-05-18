import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { MOVIES, MOODS, type Mood } from '@/data/movies';
import { PosterCard } from '@/components/movie/PosterCard';
import { Search as SearchIcon } from 'lucide-react';

export const Route = createFileRoute('/search')({
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search films by mood & runtime — RetroScope" },
      { name: "description", content: "Find your next film by mood, genre, runtime, and atmosphere. Curated cinematic discovery." },
      { property: "og:title", content: "Search films — RetroScope" },
      { property: "og:description", content: "Mood-first movie search: rainy nights, late reels, comfort watches and more." },
      { property: "og:url", content: "/search" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
});

const ALL_GENRES = Array.from(new Set(MOVIES.flatMap(m => m.genres)));

function SearchPage() {
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [maxRuntime, setMaxRuntime] = useState(180);

  const results = useMemo(() => MOVIES.filter(m => {
    if (q && !m.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (genre && !m.genres.includes(genre)) return false;
    if (mood && !m.moods.includes(mood)) return false;
    if (m.runtime > maxRuntime) return false;
    return true;
  }), [q, genre, mood, maxRuntime]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Catalogue search —</p>
      <h1 className="font-display text-4xl font-black">Browse the reels</h1>

      <div className="mt-6 flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3">
        <SearchIcon size={18} className="text-muted-foreground"/>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title…"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"/>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 rounded-md border border-border bg-card p-5">
          <div>
            <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground">Genre</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => setGenre(null)} className={`rounded-sm border px-2 py-1 text-xs ${!genre ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>All</button>
              {ALL_GENRES.map(g => (
                <button key={g} onClick={() => setGenre(g)} className={`rounded-sm border px-2 py-1 text-xs ${genre === g ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>{g}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground">Mood</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => setMood(null)} className={`rounded-sm border px-2 py-1 text-xs ${!mood ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>All</button>
              {MOODS.map(m => (
                <button key={m.id} onClick={() => setMood(m.id)} className={`rounded-sm border px-2 py-1 text-xs ${mood === m.id ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>{m.emoji} {m.label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground">Max runtime: {maxRuntime}m</p>
            <input type="range" min={60} max={180} step={5} value={maxRuntime} onChange={e => setMaxRuntime(+e.target.value)} className="mt-2 w-full accent-[oklch(0.74_0.16_50)]"/>
          </div>
        </aside>
        <div>
          <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground">{results.length} reels found</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map(m => <PosterCard key={m.id} movie={m}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}
