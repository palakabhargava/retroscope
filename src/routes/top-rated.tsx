import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useTopRatedContent } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';
import { Link } from '@tanstack/react-router';
import { Play, Award, Star } from 'lucide-react';

export const Route = createFileRoute('/top-rated')({
  component: TopRatedPage,
  head: () => ({
    meta: [
      { title: "Top-Rated Reels — RetroScope" },
      { name: "description", content: "Explore critically acclaimed vintage content. Punched by Gold Ticket ticket ratings." },
    ],
  }),
});

import { SpotlightSkeleton } from '@/components/layout/PageSkeletons';
import { SEOHelper } from '@/components/layout/SEOHelper';

function TopRatedPage() {
  const { data: topRated = [], isLoading } = useTopRatedContent();

  const featured = topRated[0];

  if (isLoading) {
    return <SpotlightSkeleton />;
  }

  const topRatedSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Top-Rated Masterpieces on RetroScope",
    "description": "Acclaimed vintage films, documentaries, and web-series ranked by ticket rating score.",
    "numberOfItems": topRated.length,
    "itemListElement": topRated.slice(0, 10).map((m, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": m.title,
      "url": typeof window !== 'undefined' ? `${window.location.origin}/movies/${m.id}` : `https://retroscope.app/movies/${m.id}`
    }))
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHelper 
        title="Top-Rated Masterpieces & Acclaimed Cinema — RetroScope"
        description="Explore critically acclaimed vintage movies, documentaries, and series ranked strictly by audience rating scores and ticket stubs on RetroScope."
        ogType="website"
        canonicalPath="/top-rated"
        schema={topRatedSchema}
      />

      {/* Featured Banner Section */}
      {featured ? (
        <section className="relative h-[65vh] min-h-[480px] w-full overflow-hidden vignette" style={{ backgroundImage: featured.banner }}>
          <ProjectorBeam />
          <DustParticles count={35} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
            <div className="max-w-2xl bg-black/40 p-6 rounded-md backdrop-blur-md border border-border/30">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 font-retro text-[9px] uppercase tracking-wider text-primary mb-3">
                <Award size={10}/> HIGHEST ACCLAIM: ★ {featured.rating}
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
                  <Play size={12}/> Stream Masterpiece
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
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— High-Fidelity Cinema —</p>
            <h2 className="font-display text-3xl font-black mt-1">Acclaimed Masterpieces</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Top-rated cinema, short features, and series ranked strictly by user review scores.
            </p>
          </div>
        </div>

        {topRated.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
            <p className="font-retro uppercase tracking-widest text-primary">No Rated Reels Found</p>
            <p className="text-sm mt-2">PUNCH your first gold ticket rating on any movie details page!</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                <Star size={16} /> Rated by the Guild
              </h3>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {topRated.map(m => (
                  <PosterCard key={m.id} movie={m} size="md" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
