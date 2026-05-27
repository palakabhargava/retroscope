import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useTrendingContent } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';
import { Link } from '@tanstack/react-router';
import { Play, TrendingUp, Sparkles } from 'lucide-react';
import { CinematicHeroBackdrop } from '@/components/cinematic/CinematicHeroBackdrop';

export const Route = createFileRoute('/trending')({
  component: TrendingPage,
  head: () => ({
    meta: [
      { title: "Trending Reels — RetroScope" },
      { name: "description", content: "See what other projection room visitors are screening. Dynamic live playback analytics." },
    ],
  }),
});

import { SpotlightSkeleton } from '@/components/layout/PageSkeletons';
import { SEOHelper } from '@/components/layout/SEOHelper';

function TrendingPage() {
  const { data: trending = [], isLoading } = useTrendingContent();

  const featured = trending[0];

  if (isLoading) {
    return <SpotlightSkeleton />;
  }

  const trendingSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Trending Broadcasts on RetroScope",
    "description": "Reels with active playback logs, real-time reviews, and high-frequency timed reactions on RetroScope.",
    "numberOfItems": trending.length,
    "itemListElement": trending.slice(0, 10).map((m, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": m.title,
      "url": typeof window !== 'undefined' ? `${window.location.origin}/movies/${m.id}` : `https://retroscope.app/movies/${m.id}`
    }))
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHelper 
        title="Trending Reels & Hot Broadcasts — RetroScope"
        description="See what other projection room visitors are screening on RetroScope. Dynamic live playback analytics, trending movies, and popular vintage content."
        ogType="website"
        canonicalPath="/trending"
        schema={trendingSchema}
      />

      {/* Featured Banner Section */}
      {featured ? (
        <section className="relative h-[65vh] min-h-[480px] w-full overflow-hidden vignette">
          <CinematicHeroBackdrop item={featured} />
          <ProjectorBeam />
          <DustParticles count={35} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
            <div className="max-w-2xl bg-black/40 p-6 rounded-md backdrop-blur-md border border-border/30">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 font-retro text-[9px] uppercase tracking-wider text-primary mb-3">
                <TrendingUp size={10}/> #1 POPULAR TODAY
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-black leading-[1.05] text-foreground text-glow">
                {featured.title}
              </h1>
              <p className="mt-3 text-xs uppercase font-retro tracking-widest text-primary/95">
                Directed by {featured.director} • {featured.runtime} mins • {featured.year}
              </p>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                {featured.synopsis}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link to="/movies/$movieId" params={{ movieId: featured.id }}
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow transition">
                  <Play size={12}/> Stream Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[20vh]" />
      )}

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-6 mt-12">
        <div className="border-b border-border/40 pb-4 mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-3">
          <div>
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Audience Favorites —</p>
            <h2 className="font-display text-3xl font-black mt-1">Trending Broadcasts</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Reels with active playback logs, real-time reviews, and high-frequency timed reactions.
            </p>
          </div>
        </div>

        {trending.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
            <p className="font-retro uppercase tracking-widest text-primary">No Active Streams Logged</p>
            <p className="text-sm mt-2">Start screening reels to build up live trending metrics!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top 5 Row with giant ranking numbers */}
            <div>
              <h3 className="font-display text-xl font-bold mb-8 flex items-center gap-2 text-primary">
                <Sparkles size={16} /> Top 5 Spotlight
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trending.slice(0, 6).map((m, idx) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative flex items-center gap-4 bg-card/65 backdrop-blur-sm border border-border/50 rounded-md p-4 group hover:border-primary/50 hover:bg-card transition"
                  >
                    {/* Large Background Rank Number */}
                    <span className="absolute right-4 bottom-2 text-8xl font-black select-none pointer-events-none text-foreground/5 font-display group-hover:text-primary/5 transition">
                      #{idx + 1}
                    </span>
                    <div className="shrink-0 scale-95 group-hover:scale-100 transition duration-300">
                      <PosterCard movie={m} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <span className="font-retro text-[9px] uppercase tracking-widest text-primary font-bold">Rank #{idx + 1}</span>
                      <h4 className="font-display text-base font-bold text-foreground truncate mt-1">{m.title}</h4>
                      <p className="font-retro text-[10px] text-muted-foreground mt-0.5">{m.year} • {m.type.replace('_', ' ')}</p>
                      <p className="text-[11px] text-muted-foreground/80 line-clamp-2 mt-2">{m.tagline}</p>
                      <div className="mt-3">
                        <Link to="/movies/$movieId" params={{ movieId: m.id }} className="font-retro text-[10px] uppercase text-primary tracking-widest hover:underline hover:text-hover-glow">Screen Reel →</Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Remaining Grid */}
            {trending.length > 6 && (
              <div>
                <h3 className="font-display text-xl font-bold mb-4 border-b border-border/40 pb-2">
                  Other Hot Releases
                </h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {trending.slice(6).map(m => (
                    <PosterCard key={m.id} movie={m} size="md" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
