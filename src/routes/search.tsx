import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { MOODS, type Mood, type ContentType } from '@/data/movies';
import { PosterCard } from '@/components/movie/PosterCard';
import { Search as SearchIcon, Film, Clock, Eye } from 'lucide-react';
import { useContents } from '@/hooks/queries';

export const Route = createFileRoute('/search')({
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search films by mood & type — RetroScope" },
      { name: "description", content: "Find your next film by mood, genre, content type, and runtime on RetroScope." },
    ],
  }),
});

const CONTENT_TYPE_TABS: { id: ContentType | 'all'; label: string }[] = [
  { id: 'all', label: 'All reels' },
  { id: 'movie', label: 'Movies' },
  { id: 'web_series', label: 'Web Series' },
  { id: 'short_film', label: 'Short Films' },
  { id: 'documentary', label: 'Documentaries' },
  { id: 'mockumentary', label: 'Mockumentaries' },
  { id: 'short_video', label: 'Short Videos' },
];

const DURATION_BUCKETS = [
  { id: 'all', label: 'All durations', min: 0, max: 9999 },
  { id: 'short', label: 'Short (< 30m)', min: 0, max: 30 },
  { id: 'medium', label: 'Quick (30m - 75m)', min: 31, max: 75 },
  { id: 'long', label: 'Full (75m - 130m)', min: 76, max: 130 },
  { id: 'epic', label: 'Epic (> 130m)', min: 131, max: 9999 },
];

function SearchPage() {
  const [q, setQ] = useState('');
  const [activeType, setActiveType] = useState<ContentType | 'all'>('all');
  const [activeDuration, setActiveDuration] = useState('all');
  const [genre, setGenre] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  // Load all content from database dynamically
  const { data: contents = [], isLoading } = useContents();

  // Compute all available genres dynamically from loaded database rows
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    contents.forEach(c => c.genres?.forEach(g => set.add(g)));
    return Array.from(set);
  }, [contents]);

  // Compute matching duration bounds
  const activeDurationBounds = useMemo(() => {
    const bucket = DURATION_BUCKETS.find(d => d.id === activeDuration);
    return bucket ? { min: bucket.min, max: bucket.max } : { min: 0, max: 9999 };
  }, [activeDuration]);

  // Search & Filter algorithm
  const results = useMemo(() => {
    return contents.filter(m => {
      if (q && !m.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (activeType !== 'all' && m.type !== activeType) return false;
      if (genre && !m.genres.includes(genre)) return false;
      if (mood && !m.moods.includes(mood)) return false;
      if (m.runtime < activeDurationBounds.min || m.runtime > activeDurationBounds.max) return false;
      return true;
    });
  }, [q, activeType, genre, mood, activeDurationBounds, contents]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Catalogue search —</p>
      <h1 className="font-display text-4xl font-black">Browse the catalogue</h1>
      <p className="mt-1 text-sm text-muted-foreground">Select content type, mood vibes, or ticket runtimes dynamically from the database.</p>

      {/* Main Search Input */}
      <div className="mt-6 flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 shadow-md focus-within:border-primary transition">
        <SearchIcon size={18} className="text-muted-foreground"/>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title, keyword, director…"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"/>
      </div>

      {/* Content Type Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border/60 pb-3">
        {CONTENT_TYPE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveType(tab.id); setGenre(null); }}
            className={`rounded-sm px-3 py-1.5 font-retro text-[10px] uppercase tracking-widest transition
              ${activeType === tab.id
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'border border-border/80 text-muted-foreground hover:border-primary/60 hover:text-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left Filters Panel */}
        <aside className="space-y-6 rounded-md border border-border bg-card p-5 h-fit shadow-md">
          {/* Genre Filter */}
          <div>
            <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
              <Film size={12} className="text-primary"/>
              <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground font-bold">Genre</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              <button onClick={() => setGenre(null)} className={`rounded-sm border px-2 py-1 text-[10px] transition font-retro uppercase tracking-wider ${!genre ? 'border-primary text-primary bg-primary/5' : 'border-border/60 text-muted-foreground hover:text-foreground'}`}>All</button>
              {allGenres.map(g => (
                <button key={g} onClick={() => setGenre(g)} className={`rounded-sm border px-2 py-1 text-[10px] transition font-retro uppercase tracking-wider ${genre === g ? 'border-primary text-primary bg-primary/5' : 'border-border/60 text-muted-foreground hover:text-foreground'}`}>{g}</button>
              ))}
            </div>
          </div>

          {/* Mood Filter */}
          <div>
            <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
              <Eye size={12} className="text-primary"/>
              <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground font-bold">Mood Vibes</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1">
              <button onClick={() => setMood(null)} className={`rounded-sm border px-2 py-1 text-[10px] transition font-retro uppercase tracking-wider ${!mood ? 'border-primary text-primary bg-primary/5' : 'border-border/60 text-muted-foreground hover:text-foreground'}`}>All</button>
              {MOODS.map(m => (
                <button key={m.id} onClick={() => setMood(m.id)} className={`rounded-sm border px-2 py-1 text-[10px] transition font-retro uppercase tracking-wider ${mood === m.id ? 'border-primary text-primary bg-primary/5' : 'border-border/60 text-muted-foreground hover:text-foreground'}`}>{m.emoji} {m.label}</button>
              ))}
            </div>
          </div>

          {/* Duration Bucket Filter */}
          <div>
            <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
              <Clock size={12} className="text-primary"/>
              <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground font-bold">Runtime duration</p>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              {DURATION_BUCKETS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setActiveDuration(b.id)}
                  className={`text-left rounded-sm border px-3 py-2 text-xs transition flex items-center justify-between
                    ${activeDuration === b.id
                      ? 'border-primary text-primary bg-primary/5 font-bold'
                      : 'border-border/60 text-muted-foreground hover:text-foreground'}`}
                >
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Results Grid */}
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground">{results.length} dynamic reels loaded</p>
            {(genre || mood || activeType !== 'all' || activeDuration !== 'all' || q) && (
              <button onClick={() => { setQ(''); setActiveType('all'); setActiveDuration('all'); setGenre(null); setMood(null); }}
                className="font-retro text-[10px] uppercase text-primary tracking-widest hover:underline hover:text-hover-glow">Clear Filters</button>
            )}
          </div>

          {isLoading ? (
            <div className="grid h-[50vh] place-items-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"/>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-12 text-center text-muted-foreground">
              <p className="font-retro uppercase tracking-widest">No reels match your filters</p>
              <p className="text-sm mt-2">Adjust your options or clear the search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {results.map(m => <PosterCard key={m.id} movie={m}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
