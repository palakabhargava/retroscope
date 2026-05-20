import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';
import { Link } from '@tanstack/react-router';
import { Play, Flame, Hourglass } from 'lucide-react';

export const Route = createFileRoute('/short-films')({
  component: ShortFilmsPage,
  head: () => ({
    meta: [
      { title: "Short Films & Videos — RetroScope" },
      { name: "description", content: "Short, high-intensity cinematic masterpieces. Perfect for quick sessions on RetroScope." },
    ],
  }),
});

function ShortFilmsPage() {
  const { data: contents = [], isLoading } = useContents();

  // Combine short films and short videos
  const shorts = contents.filter(c => c.type === 'short_film' || c.type === 'short_video');
  const featured = shorts[0];

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

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Featured Spotlight Section */}
      {featured ? (
        <section className="relative h-[65vh] min-h-[480px] w-full overflow-hidden vignette" style={{ backgroundImage: featured.banner }}>
          <ProjectorBeam />
          <DustParticles count={35} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
            <div className="max-w-2xl bg-black/40 p-6 rounded-md backdrop-blur-md border border-border/30">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 font-retro text-[9px] uppercase tracking-wider text-primary mb-3">
                ★ INDIE SHORTS SPOTLIGHT
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
                  <Play size={12}/> Watch Short
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
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Short Form Reels —</p>
            <h2 className="font-display text-3xl font-black mt-1">Brief Masterpieces</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Perfect for quick viewings. Intense storytelling packed into fewer than 30 minutes.
            </p>
          </div>
          <span className="font-retro text-[10px] uppercase text-muted-foreground tracking-widest bg-card border border-border/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
            <Hourglass size={12} className="text-primary"/> Quick Session Available
          </span>
        </div>

        {shorts.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
            <p className="font-retro uppercase tracking-widest text-primary">No Shorts Archived Yet</p>
            <p className="text-sm mt-2">Come back soon for indie film festival submission screenings.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                <Flame size={16} /> Short Film Collection
              </h3>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {shorts.map(m => (
                  <PosterCard key={m.id} movie={m} size="md" />
                ))}
              </div>
            </div>

            {/* Behind the scenes specific block */}
            {shorts.some(s => s.type === 'short_video') && (
              <div className="space-y-4">
                <h3 className="font-display text-lg font-bold border-b border-border/40 pb-2 text-glow">
                  🎬 Backstage & Extras
                </h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {shorts.filter(s => s.type === 'short_video').map(m => (
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
