import { createFileRoute } from '@tanstack/react-router';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { Award, Star } from 'lucide-react';

export const Route = createFileRoute('/anime/top-rated')({
  component: AnimeTopRatedPage,
});

function AnimeTopRatedPage() {
  const { data: contents = [], isLoading } = useContents({ type: 'anime' });

  // Sort by rating high to low
  const topRated = [...contents].sort((a, b) => b.rating - a.rating).slice(0, 20);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-10">
      <SEOHelper 
        title="Top Rated Anime Masterpieces — RetroScope"
        description="Explore the highest-rated and critically-acclaimed anime masterpieces of all time on RetroScope."
        canonicalPath="/anime/top-rated"
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Title Deck */}
        <div className="border-b border-primary/10 pb-6 mb-10 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/40 px-2.5 py-0.5 font-retro text-[9px] uppercase tracking-wider text-[#FF66C4] mb-2">
              <Award size={10} className="animate-spin" style={{ animationDuration: '6s' }} /> HALL OF FAME
            </span>
            <h1 className="font-display text-4xl font-black text-white text-glow-pink">Anime Masterpieces</h1>
            <p className="text-sm text-zinc-400 mt-1">Highly acclaimed productions with the highest viewer reviews and ratings.</p>
          </div>
          <Star className="h-8 w-8 text-[#FF4D8D] fill-[#FF4D8D]" />
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded bg-zinc-900 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {topRated.map(m => (
              <PosterCard key={m.id} movie={m} size="md" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
