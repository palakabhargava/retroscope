import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MOODS, TIME_BUCKETS, type Mood } from '@/data/movies';
import { MovieRow } from '@/components/movie/MovieRow';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';
import { Link } from '@tanstack/react-router';
import { Play } from 'lucide-react';
import { useContents } from '@/hooks/queries';

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: "RetroScope — Cinematic Movie Discovery by Mood" },
      { name: "description", content: "Discover films through mood, time of night, and atmosphere. A vintage cinema OTT with Movie Taste DNA and scene heatmaps." },
      { property: "og:title", content: "RetroScope — Cinematic Movie Discovery" },
      { property: "og:description", content: "Mood-first movie discovery. Rainy reels, late-night thrillers, comfort classics." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Home() {
  const [mood, setMood] = useState<Mood>('night-vibes');
  const { data: contents = [], isLoading } = useContents();

  if (isLoading) {
    return (
      <div className="grid h-[80vh] place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Dimming lights, rolling reel...</p>
        </div>
      </div>
    );
  }

  // Choose a featured item. Prefer the 3rd movie, fallback to the 1st or a placeholder
  const featured = contents[2] || contents[0];

  const getContentsByMood = (m: Mood) => contents.filter(x => x.moods.includes(m));
  const getContentsByRuntime = (max: number) => contents.filter(x => x.runtime <= max);

  return (
    <div>
      {/* Hero */}
      {featured ? (
        <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden vignette" style={{ backgroundImage: featured.banner }}>
          <ProjectorBeam />
          <DustParticles count={50} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-16">
            <div className="max-w-2xl bg-black/40 p-6 rounded-md backdrop-blur-md border border-border/30">
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
                className="font-retro text-xs uppercase tracking-[0.4em] text-primary">— Now Showing at RetroScope —</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.1 }}
                className="mt-3 font-display text-6xl font-black leading-[0.95] text-foreground text-glow">
                {featured.title}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}
                className="mt-4 max-w-xl text-base text-muted-foreground">{featured.tagline}</motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
                className="mt-6 flex items-center gap-3">
                <Link to="/movies/$movieId" params={{ movieId: featured.id }}
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow transition">
                  <Play size={14}/> Open the curtain
                </Link>
                <Link to="/search" className="rounded-sm border border-border bg-background/40 px-5 py-3 font-retro text-xs uppercase tracking-widest text-foreground backdrop-blur hover:border-primary transition">
                  Browse the catalogue
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[20vh]" />
      )}

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16">
        {/* Mood selector */}
        <section className="space-y-6">
          <div>
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Mood reel —</p>
            <h2 className="font-display text-3xl font-bold">What does tonight feel like?</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {MOODS.map(m => (
              <button key={m.id} onClick={() => setMood(m.id)}
                className={`relative aspect-[3/4] overflow-hidden rounded-md border p-3 text-left transition
                  ${mood === m.id ? 'border-primary projector-glow' : 'border-border hover:border-primary/60'}`}
                style={{ background: `linear-gradient(160deg, ${m.tint}, oklch(0.18 0.005 60))` }}>
                <span className="text-2xl">{m.emoji}</span>
                <div className="absolute inset-x-3 bottom-3">
                  <p className="font-display text-sm font-bold leading-tight text-foreground">{m.label}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="-mx-4 overflow-x-auto px-4">
            <div className="flex gap-5">
              {getContentsByMood(mood).slice(0, 10).map(m => <div key={m.id} className="shrink-0"><PosterCard movie={m}/></div>)}
            </div>
          </div>
        </section>

        {/* Time buckets */}
        <section className="space-y-6">
          <div>
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— How much time? —</p>
            <h2 className="font-display text-3xl font-bold">Pick your reel by the clock</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {TIME_BUCKETS.map(b => (
              <div key={b.id} className="rounded-md border border-border bg-card p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-bold">{b.label}</h3>
                  <span className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{b.sub}</span>
                </div>
                <div className="mt-4 -mx-2 overflow-x-auto px-2">
                  <div className="flex gap-3">
                    {getContentsByRuntime(b.max).slice(0, 8).map(m => <div key={m.id} className="shrink-0"><PosterCard movie={m} size="sm"/></div>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Curated Dynamic Rows */}
        <MovieRow title="From the Vault" subtitle="— Curated by the projectionist —" movies={contents.slice(0, 12)} />
        <MovieRow title="Late Night Programme" subtitle="— After midnight only —" movies={getContentsByMood('night-vibes')} />
        <MovieRow title="Rainy Window Companions" subtitle="— Pour a coffee —" movies={getContentsByMood('rainy-mood')} />
      </div>
    </div>
  );
}
