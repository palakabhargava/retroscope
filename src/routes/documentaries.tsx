import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';
import { Link } from '@tanstack/react-router';
import { Play, Info, Flame, Eye } from 'lucide-react';

export const Route = createFileRoute('/documentaries')({
  component: DocumentariesPage,
  head: () => ({
    meta: [
      { title: "Documentaries & Mockumentaries — RetroScope" },
      { name: "description", content: "Explore gripping real-world chronicles and satirical mockumentaries on RetroScope. Experience the vintage aesthetic." },
    ],
  }),
});

import { SpotlightSkeleton } from '@/components/layout/PageSkeletons';
import { SEOHelper } from '@/components/layout/SEOHelper';

function DocumentariesPage() {
  const { data: contents = [], isLoading } = useContents();

  const docs = contents.filter(c => c.type === 'documentary' || c.type === 'mockumentary');
  const featured = docs[0];

  if (isLoading) {
    return <SpotlightSkeleton />;
  }

  const docsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Documentaries & Mockumentaries on RetroScope",
    "description": "Explore gripping real-world chronicles and satirical mockumentaries on RetroScope.",
    "numberOfItems": docs.length,
    "itemListElement": docs.slice(0, 10).map((m, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": m.title,
      "url": typeof window !== 'undefined' ? `${window.location.origin}/movies/${m.id}` : `https://retroscope.app/movies/${m.id}`
    }))
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHelper 
        title="Documentaries & Satirical Mockumentaries — RetroScope"
        description="Explore gripping real-world chronicles and satirical mockumentaries on RetroScope. Experience real stories, biography features, and mock sitcoms."
        ogType="website"
        canonicalPath="/documentaries"
        schema={docsSchema}
      />

      {/* Featured Banner Section */}
      {featured ? (
        <section className="relative h-[65vh] min-h-[480px] w-full overflow-hidden vignette" style={{ backgroundImage: `url(${featured.banner })`}}>
          <ProjectorBeam />
          <DustParticles count={35} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
            <div className="max-w-2xl bg-black/40 p-6 rounded-md backdrop-blur-md border border-border/30">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 font-retro text-[9px] uppercase tracking-wider text-primary mb-3">
                ★ FEATURED CHRONICLE
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
                  <Play size={12}/> Open the Reel
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
        <div className="border-b border-border/40 pb-4 mb-8">
          <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Archive Section —</p>
          <h2 className="font-display text-3xl font-black mt-1">Real Stories & Satire</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Curated selection of real-world documentaries and sharp mockumentary programs.
          </p>
        </div>

        {docs.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
            <p className="font-retro uppercase tracking-widest text-primary">No Chronicles Archived Yet</p>
            <p className="text-sm mt-2">Check back later or check our main movie index.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured row */}
            <div>
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                <Eye size={16} /> The Full Catalogue
              </h3>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {docs.map(m => (
                  <PosterCard key={m.id} movie={m} size="md" />
                ))}
              </div>
            </div>

            {/* Subgroups */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Nature / Real Life */}
              <div className="rounded-md border border-border/60 bg-card p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                <h4 className="font-display text-lg font-bold border-b border-border/40 pb-2 text-glow">
                  🎥 Direct Realism
                </h4>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Unedited realities and profound biological histories.</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {docs.filter(d => d.type === 'documentary').map(m => (
                    <div key={m.id} className="shrink-0 scale-90 origin-top-left">
                      <PosterCard movie={m} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Satire & Mockumentaries */}
              <div className="rounded-md border border-border/60 bg-card p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                <h4 className="font-display text-lg font-bold border-b border-border/40 pb-2 text-glow">
                  🎭 Satirical Gaze
                </h4>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Witty, sharp mock-reality sitcoms and films.</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {docs.filter(d => d.type === 'mockumentary').map(m => (
                    <div key={m.id} className="shrink-0 scale-90 origin-top-left">
                      <PosterCard movie={m} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
