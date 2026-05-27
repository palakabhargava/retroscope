import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';
import { Link } from '@tanstack/react-router';
import { Play, Tv, Sparkles } from 'lucide-react';
import { CinematicHeroBackdrop } from '@/components/cinematic/CinematicHeroBackdrop';

export const Route = createFileRoute('/web-series')({
  component: WebSeriesPage,
  head: () => ({
    meta: [
      { title: "Epic Web Series — RetroScope" },
      { name: "description", content: "Binge premium multi-season web series with deep characters and high stakes on RetroScope. Classic projection room feel." },
    ],
  }),
});

import { SpotlightSkeleton } from '@/components/layout/PageSkeletons';
import { SEOHelper } from '@/components/layout/SEOHelper';

function WebSeriesPage() {
  const { data: contents = [], isLoading } = useContents();

  const series = contents.filter(c => c.type === 'web_series');
  const featured = series[0];

  if (isLoading) {
    return <SpotlightSkeleton />;
  }

  const seriesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Acclaimed Web Series on RetroScope",
    "description": "Binge premium multi-season web series with deep characters and high stakes on RetroScope.",
    "numberOfItems": series.length,
    "itemListElement": series.slice(0, 10).map((m, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": m.title,
      "url": typeof window !== 'undefined' ? `${window.location.origin}/movies/${m.id}` : `https://retroscope.app/movies/${m.id}`
    }))
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHelper 
        title="Premium Cinematic Web Series — RetroScope"
        description="Binge premium multi-season web series with deep characters and high stakes on RetroScope. Classic projection room feel, high-fidelity metadata."
        ogType="website"
        canonicalPath="/web-series"
        schema={seriesSchema}
      />

      {/* Featured Spotlight Section */}
      {featured ? (
        <section className="relative h-[65vh] min-h-[480px] w-full overflow-hidden vignette">
          <CinematicHeroBackdrop item={featured} />
          <ProjectorBeam />
          <DustParticles count={35} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
            <div className="max-w-2xl bg-black/40 p-6 rounded-md backdrop-blur-md border border-border/30">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 font-retro text-[9px] uppercase tracking-wider text-primary mb-3">
                <Tv size={10}/> NOW TELEVISING
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-black leading-[1.05] text-foreground text-glow">
                {featured.title}
              </h1>
              <p className="mt-3 text-xs uppercase font-retro tracking-widest text-primary/95">
                Directed by {featured.director} • Average Episode: {featured.runtime} mins • {featured.year}
              </p>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                {featured.synopsis}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link to="/movies/$movieId" params={{ movieId: featured.id }}
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow transition">
                  <Play size={12}/> Tune In
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
        <div className="border-b border-border/40 pb-4 mb-8 flex justify-between items-end">
          <div>
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Episodic Drama —</p>
            <h2 className="font-display text-3xl font-black mt-1">Acclaimed Series</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gripping story arcs, detailed character journeys, and premium cliffhangers.
            </p>
          </div>
          <span className="font-retro text-[10px] uppercase text-muted-foreground tracking-widest bg-card border border-border/60 px-3 py-1.5 rounded-full">
            {series.length} Seasons Available
          </span>
        </div>

        {series.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
            <p className="font-retro uppercase tracking-widest text-primary">No Series Archived Yet</p>
            <p className="text-sm mt-2">Tune in later for fresh network releases.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                <Sparkles size={16} /> Binge-Worthy Reels
              </h3>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {series.map(m => (
                  <PosterCard key={m.id} movie={m} size="md" />
                ))}
              </div>
            </div>

            {/* Custom Series Promo Row */}
            <div className="rounded-md border border-border/80 bg-gradient-to-r from-card to-background p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 max-w-xl">
                <span className="font-retro text-[9px] uppercase tracking-widest text-primary font-bold">RetroScope Original Premium Badge</span>
                <h4 className="font-display text-2xl font-black text-glow">Unlock Premium Episodes</h4>
                <p className="text-sm text-muted-foreground">
                  Our episodic programming contains locked VIP screening tickets. Gain unlimited access to premium episodes, timed heatmaps, and review posting privileges.
                </p>
              </div>
              <Link to="/subscription" className="rounded-sm bg-primary px-6 py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow transition">
                Purchase Gold Ticket
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
