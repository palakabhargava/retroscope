import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Calendar, Play, Sparkles } from 'lucide-react';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';
import { CinematicHeroBackdrop } from '@/components/cinematic/CinematicHeroBackdrop';

export const Route = createFileRoute('/upcoming')({
  component: UpcomingPage,
});

function UpcomingPage() {
  const { data: contents = [], isLoading } = useContents();

  const upcoming = contents
    .filter((c) => c.releaseStatus === 'upcoming' || (c.releaseDate ? new Date(c.releaseDate).getTime() > Date.now() : false))
    .sort((a, b) => {
      const da = a.releaseDate ? new Date(a.releaseDate).getTime() : Number.POSITIVE_INFINITY;
      const db = b.releaseDate ? new Date(b.releaseDate).getTime() : Number.POSITIVE_INFINITY;
      return da - db;
    });

  const featured = upcoming[0];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-hidden relative">
      <SEOHelper
        title="Upcoming Drops — RetroScope"
        description="Trailers, teasers, and scheduled upcoming releases across Movies, Anime, and Series."
        ogType="website"
        canonicalPath="/upcoming"
      />

      <DustParticles count={30} />

      {featured ? (
        <section className="relative h-[62vh] sm:h-[70vh] min-h-[420px] sm:min-h-[500px] w-full overflow-hidden vignette border-b border-border/40">
          <CinematicHeroBackdrop item={featured} />
          <ProjectorBeam />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
            <div className="max-w-2xl bg-black/40 p-6 rounded-md backdrop-blur-md border border-border/30">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 font-retro text-[9px] uppercase tracking-wider text-primary mb-3">
                <Calendar size={10} /> UPCOMING DROP
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-black leading-[0.95] text-foreground text-glow">
                {featured.title}
              </h1>
              <p className="mt-3 text-xs uppercase font-retro tracking-widest text-primary/95">
                Release: {featured.releaseDate || 'TBA'} • {featured.type.replace('_', ' ')} • {featured.year}
              </p>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{featured.tagline}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {featured.type === 'anime' ? (
                  <Link
                    to="/anime/$animeId"
                    params={{ animeId: featured.id }}
                    className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow transition"
                  >
                    <Play size={14} /> View Details
                  </Link>
                ) : (
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: featured.id }}
                    className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow transition"
                  >
                    <Play size={14} /> View Details
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[20vh]" />
      )}

      <div className="mx-auto max-w-7xl px-6 mt-12">
        <div className="border-b border-border/40 pb-4 mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-3">
          <div>
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Schedule Board —</p>
            <h2 className="font-display text-3xl font-black mt-1">Upcoming Releases</h2>
            <p className="text-sm text-muted-foreground mt-1">Teasers and trailers for future drops.</p>
          </div>
          <Sparkles className="h-7 w-7 text-primary animate-pulse" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded bg-zinc-900 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
            <p className="font-retro uppercase tracking-widest text-primary">No Upcoming Drops Yet</p>
            <p className="text-sm mt-2">Seed upcoming releases in the local dataset or via Supabase admin tools.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {upcoming.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(0.6, idx * 0.03) }}
                className="relative"
              >
                <div className="absolute left-2 top-2 z-20 rounded-sm bg-black/70 px-2 py-1 font-retro text-[9px] uppercase tracking-widest text-primary border border-white/5 backdrop-blur">
                  {m.releaseDate || 'TBA'}
                </div>
                <PosterCard movie={m} size="md" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

