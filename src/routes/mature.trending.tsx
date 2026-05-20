import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { Link, useNavigate } from '@tanstack/react-router';
import { Flame, Eye, ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/mature/trending')({
  component: MatureTrendingPage,
});

function MatureTrendingPage() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verified = localStorage.getItem('retroscope_age_verified') === 'true';
    if (!verified) {
      navigate({ to: '/mature' });
    } else {
      setIsVerified(true);
    }
  }, [navigate]);

  const { data: contents = [], isLoading } = useContents({ type: 'mature' });

  // Trending noir / crime
  const trendingMature = contents.slice(0, 15);

  if (!isVerified) {
    return <div className="min-h-screen bg-[#050505]" />; // Loading/Redirecting
  }

  return (
    <div className="min-h-screen bg-[#050505] text-foreground pb-20 pt-10">
      <SEOHelper 
        title="Trending Crime & Thrillers — RetroScope Mature"
        description="Stream the most discussed and highly rated mature action thrillers, neo-noir sagas, and series."
        canonicalPath="/mature/trending"
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/mature" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-retro text-xs uppercase tracking-widest transition">
            <ArrowLeft size={14} /> Back to Vault
          </Link>
        </div>

        {/* Title Deck */}
        <div className="border-b border-red-900/20 pb-6 mb-10 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/50 border border-red-800/40 px-2.5 py-0.5 font-retro text-[9px] uppercase tracking-wider text-red-500 mb-2">
              <Flame size={10} className="animate-pulse" /> Live Telemetry
            </span>
            <h1 className="font-display text-4xl font-black text-white text-glow-red">Trending Crime Sagas</h1>
            <p className="text-sm text-zinc-400 mt-1">Gritty and intense blockbusters dominating the active feeds.</p>
          </div>
          <Eye className="h-8 w-8 text-red-500 animate-pulse" />
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded bg-zinc-900 animate-pulse border border-red-950/20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {trendingMature.map(m => (
              <PosterCard key={m.id} movie={m} size="md" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
