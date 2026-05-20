import { createFileRoute } from '@tanstack/react-router';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { Link } from '@tanstack/react-router';
import { Tv, Smile, ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/kids/cartoons')({
  component: KidsCartoonsPage,
});

function KidsCartoonsPage() {
  const { data: contents = [], isLoading } = useContents({ type: 'kids' });

  // Filter cartoons (items 8 to 14 in content array)
  const kidsCartoons = contents.slice(8, 14);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-10 overflow-hidden relative rounded-t-3xl">
      <SEOHelper 
        title="Playful Cartoons & Shows — RetroScope Kids"
        description="Stream the most laughter-filled animated cartoons and safe television shows for kids on RetroScope."
        canonicalPath="/kids/cartoons"
      />

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/12 w-12 h-12 rounded-full bg-[#F59E0B]/10 filter blur-sm animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/3 right-1/10 w-10 h-10 rounded-full bg-[#38BDF8]/10 filter blur-sm animate-bounce" style={{ animationDuration: '8s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6">
          <Link to="/kids" className="inline-flex items-center gap-2 text-[#F59E0B] hover:text-[#FBBF24] font-retro text-xs uppercase tracking-widest transition">
            <ArrowLeft size={14} /> Back to Playground
          </Link>
        </div>

        {/* Title Deck */}
        <div className="border-b-2 border-dashed border-[#F59E0B]/20 pb-6 mb-10 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 px-2.5 py-0.5 font-retro text-[9px] uppercase tracking-wider text-[#F59E0B] mb-2">
              <Smile size={10} className="animate-pulse" /> Cartoon Room
            </span>
            <h1 className="font-display text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">The Cartoons Shelf</h1>
            <p className="text-sm text-zinc-300 mt-1">Non-stop laughter and playful cartoon series to brighten up your day.</p>
          </div>
          <Tv className="h-10 w-10 text-[#F59E0B] animate-pulse" />
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
            {kidsCartoons.map(m => (
              <div key={m.id} className="hover:scale-105 transition-transform duration-300 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.3)] border border-[#F59E0B]/10">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
