import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { Link, useNavigate } from '@tanstack/react-router';
import { Skull, Compass, ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/mature/noir')({
  component: MatureNoirPage,
});

function MatureNoirPage() {
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

  // Filter Neo-Noir/Crime thrillers
  const noirThrillers = contents.filter(c => c.genres.includes("Noir") || c.genres.includes("Neo-Noir") || c.genres.includes("Thriller"));

  if (!isVerified) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-foreground pb-20 pt-10">
      <SEOHelper 
        title="Neo-Noir & Suspense Vault — RetroScope Mature"
        description="Stream classic hardboiled detective stories, crime thrillers, and stylish noir cinema."
        canonicalPath="/mature/noir"
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
              <Skull size={10} className="animate-pulse" /> Noir Lounge
            </span>
            <h1 className="font-display text-4xl font-black text-white text-glow-red">Neo-Noir & Suspense</h1>
            <p className="text-sm text-zinc-400 mt-1">High contrast frames, shadows, and mysterious hardboiled detective suspense.</p>
          </div>
          <Compass className="h-8 w-8 text-red-500 animate-pulse" />
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded bg-zinc-900 animate-pulse border border-red-950/20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {noirThrillers.map(m => (
              <PosterCard key={m.id} movie={m} size="md" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
