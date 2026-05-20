import { createFileRoute } from '@tanstack/react-router';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { Link } from '@tanstack/react-router';
import { Sparkles, Smile, ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/kids/anime')({
  component: KidsAnimePage,
});

function KidsAnimePage() {
  const { data: contents = [], isLoading } = useContents({ type: 'kids' });

  // Filter kids anime (items 14 to 20 in content array)
  const kidsAnime = contents.slice(14, 20);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-10 overflow-hidden relative rounded-t-3xl">
      <SEOHelper 
        title="Safe & Magical Kids Anime — RetroScope Kids"
        description="Stream friendly fantasy anime, animal companions, and magical stories suitable for all kids on RetroScope."
        canonicalPath="/kids/anime"
      />

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/10 w-12 h-12 rounded-full bg-[#A5F3FC]/10 filter blur-sm animate-bounce" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-1/4 left-1/8 w-9 h-9 rounded-full bg-[#38BDF8]/10 filter blur-sm animate-bounce" style={{ animationDuration: '7s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6">
          <Link to="/kids" className="inline-flex items-center gap-2 text-[#A5F3FC] hover:text-white font-retro text-xs uppercase tracking-widest transition">
            <ArrowLeft size={14} /> Back to Playground
          </Link>
        </div>

        {/* Title Deck */}
        <div className="border-b-2 border-dashed border-[#A5F3FC]/20 pb-6 mb-10 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A5F3FC]/20 border border-[#A5F3FC]/40 px-2.5 py-0.5 font-retro text-[9px] uppercase tracking-wider text-[#A5F3FC] mb-2">
              <Smile size={10} className="animate-pulse" /> Magic Room
            </span>
            <h1 className="font-display text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">Magic Kids Anime</h1>
            <p className="text-sm text-zinc-300 mt-1">Stunning fantasy lands, warm animal helpers, and friendly, beautiful adventures.</p>
          </div>
          <Sparkles className="h-10 w-10 text-[#A5F3FC] animate-pulse" />
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-72 rounded-2xl bg-zinc-900 animate-pulse border-2 border-dashed border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {kidsAnime.map(m => (
              <div key={m.id} className="hover:scale-105 transition-transform duration-300 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(165,243,252,0.15)] hover:shadow-[0_8px_30px_rgba(165,243,252,0.3)] border border-[#A5F3FC]/10">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
