import { createFileRoute } from '@tanstack/react-router';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { Link } from '@tanstack/react-router';
import { Film, Smile, ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/kids/movies')({
  component: KidsMoviesPage,
});

function KidsMoviesPage() {
  const { data: contents = [], isLoading } = useContents({ type: 'kids' });

  // Filter kids movies (first 8 items as movie-like features)
  const kidsMovies = contents.slice(0, 8);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-10 overflow-hidden relative rounded-t-3xl">
      <SEOHelper 
        title="Family Movies & Fun Adventures — RetroScope Kids"
        description="Explore the best family-safe movies, fantasy tales, and magical animation blockbusters on RetroScope."
        canonicalPath="/kids/movies"
      />

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/10 w-10 h-10 rounded-full bg-[#38BDF8]/10 filter blur-sm animate-bounce" style={{ animationDuration: '7s' }} />
        <div className="absolute top-2/3 right-1/8 w-14 h-14 rounded-full bg-[#F59E0B]/10 filter blur-sm animate-bounce" style={{ animationDuration: '9s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6">
          <Link to="/kids" className="inline-flex items-center gap-2 text-[#38BDF8] hover:text-[#A5F3FC] font-retro text-xs uppercase tracking-widest transition">
            <ArrowLeft size={14} /> Back to Playground
          </Link>
        </div>

        {/* Title Deck */}
        <div className="border-b-2 border-dashed border-[#38BDF8]/20 pb-6 mb-10 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 px-2.5 py-0.5 font-retro text-[9px] uppercase tracking-wider text-[#38BDF8] mb-2">
              <Smile size={10} className="animate-pulse" /> Cinema Room
            </span>
            <h1 className="font-display text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">Family Fun Blockbusters</h1>
            <p className="text-sm text-zinc-300 mt-1">Popcorn ready! Enjoy these lovely movies and full-length animated tales.</p>
          </div>
          <Film className="h-10 w-10 text-[#38BDF8] animate-pulse" />
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-72 rounded-2xl bg-zinc-900 animate-pulse border-2 border-dashed border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {kidsMovies.map(m => (
              <div key={m.id} className="hover:scale-105 transition-transform duration-300 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(56,189,248,0.15)] hover:shadow-[0_8px_30px_rgba(56,189,248,0.3)] border border-[#38BDF8]/10">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
