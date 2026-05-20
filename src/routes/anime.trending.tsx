import { createFileRoute } from '@tanstack/react-router';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { Sparkles, TrendingUp } from 'lucide-react';

export const Route = createFileRoute('/anime/trending')({
  component: AnimeTrendingPage,
});

function AnimeTrendingPage() {
  const { data: contents = [], isLoading } = useContents({ type: 'anime' });

  // Let's filter some highly popular ones for trending
  const trendingAnime = contents.slice(0, 15);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-10">
      <SEOHelper 
        title="Trending Anime Series — RetroScope"
        description="Stream the most popular and highly anticipated anime series trending this season on RetroScope."
        canonicalPath="/anime/trending"
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Title Deck */}
        <div className="border-b border-primary/10 pb-6 mb-10 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/40 px-2.5 py-0.5 font-retro text-[9px] uppercase tracking-wider text-[#FF4D8D] mb-2">
              <TrendingUp size={10} className="animate-bounce" /> Live Telemetry
            </span>
            <h1 className="font-display text-4xl font-black text-white text-glow-pink">Trending Neon</h1>
            <p className="text-sm text-zinc-400 mt-1">The most streamed and discussed anime titles across the multiverse.</p>
          </div>
          <Sparkles className="h-8 w-8 text-[#22D3EE] animate-pulse" />
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
            {trendingAnime.map(m => (
              <PosterCard key={m.id} movie={m} size="md" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
