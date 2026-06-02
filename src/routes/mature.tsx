import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { Link, useNavigate } from '@tanstack/react-router';
import type { Movie } from '@/data/movies';
import { Play, Flame, ShieldAlert, KeyRound, Eye, Skull, ArrowRight, RefreshCw, TrendingDown, Award, Sparkles } from 'lucide-react';
import { CinematicHeroBackdrop } from '@/components/cinematic/CinematicHeroBackdrop';

export const Route = createFileRoute('/mature')({
  component: MaturePageLayout,
  head: () => ({
    meta: [
      { title: "Mature 18+ Cinematic Universe — RetroScope" },
      { name: "description", content: "Enter the dark, neo-noir, and crime thrillers vault of RetroScope. High impact storytelling for mature audiences under a premium age gate." },
    ],
  }),
});

function MaturePageLayout() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [panInput, setPanInput] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  // Check local storage for existing age gate verification
  useEffect(() => {
    const verified = localStorage.getItem('retroscope_age_verified') === 'true';
    if (verified) {
      setIsVerified(true);
    }
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validate format: 5 letters, 4 digits, 1 letter (simulated PAN Card format)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    
    if (!panInput) {
      setErrorMessage('Please enter a mock PAN card number.');
      return;
    }
    
    if (!panRegex.test(panInput)) {
      setErrorMessage('Format error! Must be 10 characters (e.g., ABCDE1234F).');
      return;
    }

    setIsChecking(true);
    
    // Simulate premium cryptographic age check latency
    setTimeout(() => {
      setIsChecking(false);
      localStorage.setItem('retroscope_age_verified', 'true');
      setIsVerified(true);
    }, 1200);
  };

  const handleBypass = () => {
    localStorage.setItem('retroscope_age_verified', 'true');
    setIsVerified(true);
  };

  const handleDecline = () => {
    navigate({ to: '/' });
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden px-4">
        <SEOHelper 
          title="18+ Verification Gate — RetroScope"
          description="Access restricted to audiences aged 18 and older. Please verify your age to enter."
          canonicalPath="/mature"
        />

        {/* Smoky Ambient Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(153,27,27,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-900/10 rounded-full filter blur-[120px] mix-blend-screen pointer-events-none" />
        
        {/* Verification Card */}
        <div className="relative w-full max-w-md bg-[#111111]/90 border border-red-900/30 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(220,38,38,0.15)] z-10 transition-all duration-300">
          
          {/* Animated Crimson Beacons */}
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-red-950/50 border-2 border-red-600/40 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <Skull className="h-8 w-8 text-red-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-red-500/20 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          <h2 className="text-center font-display text-2xl font-black uppercase tracking-wider text-red-500 text-glow-red">
            Restricted Content
          </h2>
          <p className="text-center text-xs text-zinc-400 font-retro tracking-widest uppercase mt-1">
            Audience Age 18+ Only
          </p>

          <p className="text-center text-zinc-300 text-sm mt-4 leading-relaxed font-sans font-medium">
            This universe contains mature themes, dark thrillers, psychological thrillers, and Seinen anime. Please confirm your age to proceed.
          </p>

          {/* Verification Form */}
          <form onSubmit={handleVerify} className="mt-8 space-y-4">
            <div>
              <label className="block text-[10px] font-retro uppercase tracking-widest text-zinc-400 mb-1.5 flex justify-between">
                <span>Enter Mock PAN Number</span>
                <span className="text-red-500 font-sans font-bold">18+ REQUIRED</span>
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  maxLength={10}
                  value={panInput}
                  onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                  disabled={isChecking}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full bg-[#1A1A1A] border border-zinc-800 focus:border-red-600/50 text-white rounded-lg py-3 px-4 font-mono text-sm tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-red-600/40 transition disabled:opacity-50"
                />
                <KeyRound className="absolute right-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
              
              {errorMessage && (
                <p className="text-red-500 font-sans text-xs mt-2 flex items-center gap-1">
                  <ShieldAlert size={12} /> {errorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-800 text-white hover:bg-red-700 py-3.5 px-4 font-retro text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(220,38,38,0.25)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] duration-200 disabled:opacity-50"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Verifying Age Status...
                </>
              ) : (
                <>
                  Verify & Unlock Vault <ArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-zinc-900 flex justify-between items-center text-[10px] font-retro tracking-widest uppercase">
            <button
              onClick={handleDecline}
              className="text-zinc-500 hover:text-zinc-300 transition"
            >
              Cancel Access
            </button>
            <button
              onClick={handleBypass}
              className="text-red-500/80 hover:text-red-400 font-bold transition border border-red-900/30 rounded-full px-3 py-1 bg-red-950/20 hover:bg-red-950/40"
            >
              ⚡ Quick Bypass
            </button>
          </div>

          <div className="mt-4 text-[9px] text-zinc-500 text-center font-sans">
            Recruiter Guide: Type <b>ABCDE1234F</b> or click Quick Bypass to access.
          </div>
        </div>
      </div>
    );
  }

  // Once verified, render the full Mature page
  return <MaturePageContent />;
}

function MaturePageContent() {
  const { data: contents = [], isLoading } = useContents({ type: 'mature' });
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);

  useEffect(() => {
    // Load continue watching from localStorage
    const watched = localStorage.getItem('retroscope_continue_watching_mature');
    if (watched) {
      try {
        const watchedIds = JSON.parse(watched) as string[];
        setContinueWatching(contents.filter(c => watchedIds.includes(c.id)).slice(0, 5));
      } catch (e) {
        console.warn('Failed to load continue watching', e);
      }
    }
  }, [contents]);

  // Filter content subgroups with better curation
  const featured = contents.find(c => c.title.includes("Tumbbad") || c.title.includes("Mirzapur") || c.title.includes("Sacred")) || contents[0];
  const trending = contents.slice(0, 8);
  const noirThrillers = contents.filter(c => c.genres.includes("Noir") || c.genres.includes("Neo-Noir") || c.genres.includes("Crime")).slice(0, 10);
  const psychologicalDrama = contents.filter(c => c.genres.includes("Psychological") || c.genres.includes("Mystery") || c.genres.includes("Thriller")).slice(0, 10);
  const newReleases = contents.filter(c => c.year >= 2023).slice(0, 10);
  const darkSeinen = contents.filter(c => c.genres.includes("Seinen") || c.genres.includes("Action")).slice(0, 10);

  return (
    <div className="min-h-screen bg-[#050505] text-foreground pb-20 overflow-hidden relative">
      <SEOHelper 
        title="Mature 18+ Cinematic Vault — RetroScope"
        description="Stream dark neo-noir crime sagas, psychological thrillers, and Seinen masterpieces in crimson-glow premium styling."
        canonicalPath="/mature"
      />

      {/* Deep smoky animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-red-950/10 rounded-full filter blur-[150px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-orange-950/5 rounded-full filter blur-[120px] mix-blend-screen pointer-events-none" />
      </div>

      {/* Featured Spotlight Section */}
      {featured ? (
        <section 
          className="relative h-[62vh] sm:h-[70vh] min-h-[420px] sm:min-h-[500px] w-full overflow-hidden vignette border-b border-red-900/20 shadow-[0_10px_35px_rgba(220,38,38,0.08)]"
        >
          <CinematicHeroBackdrop item={featured} />
          <ProjectorBeam />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
          
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-16 z-10">
            <div className="max-w-2xl bg-black/70 p-6 rounded-lg border border-red-900/30 backdrop-blur-md shadow-[0_0_50px_rgba(220,38,38,0.15)]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/50 border border-red-800/40 px-3 py-1 font-retro text-[9px] uppercase tracking-widest text-red-500 mb-3 animate-pulse">
                <Flame size={10} /> VAULT DEEP SPOTLIGHT
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-black leading-[0.95] text-white text-glow-red">
                {featured.title}
              </h1>
              <p className="mt-4 text-xs uppercase font-retro tracking-widest text-[#FF7A00]">
                {featured.genres.join(' • ')} • {featured.year} • {featured.runtime} mins • {featured.ageRating}
              </p>
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed font-sans">
                {featured.synopsis}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Link to="/movies/$movieId" params={{ movieId: featured.id }}
                  className="inline-flex items-center gap-2 rounded-sm bg-red-800 px-6 py-3 font-retro text-xs uppercase tracking-widest text-white hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition duration-300">
                  <Play size={12}/> Access Stream
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[20vh]" />
      )}

      {/* Sub Navigation */}
      <div className="bg-[#111111]/90 border-y border-red-900/10 backdrop-blur sticky top-[57px] md:top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
            <h2 className="font-retro text-sm uppercase tracking-widest text-white font-black">Restricted Vault</h2>
          </div>
          
          <div className="flex items-center gap-6 font-retro text-xs uppercase tracking-wider">
            <Link to="/mature/trending" className="flex items-center gap-1.5 text-zinc-400 hover:text-red-500 transition">
              <Eye size={14} /> Trending Crime
            </Link>
            <Link to="/mature/noir" className="flex items-center gap-1.5 text-zinc-400 hover:text-red-500 transition">
              <Skull size={14} /> Neo-Noir Thrills
            </Link>
            <Link to="/mature/anime" className="flex items-center gap-1.5 text-zinc-400 hover:text-red-500 transition">
              <Flame size={14} /> Seinen Vault
            </Link>
            <Link to="/mature/psychological" className="flex items-center gap-1.5 text-zinc-400 hover:text-red-500 transition">
              <ShieldAlert size={14} /> Psychological
            </Link>
          </div>
        </div>
      </div>

      {/* Content Shelves - Mobile Optimized */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-8 sm:mt-12 space-y-12 sm:space-y-16 pb-8">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-end border-b border-red-900/20 pb-2">
              <h2 className="font-display text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
                <Flame size={16} className="sm:h-6 sm:w-6" /> Continue Vault Watch
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
              {continueWatching.map(m => (
                <div key={m.id}>
                  <PosterCard movie={m} size="sm" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Content */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-end border-b border-red-900/20 pb-2">
            <div>
              <h2 className="font-display text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
                <TrendingDown size={16} className="sm:h-6 sm:w-6" /> Trending in Vault
              </h2>
              <p className="text-[10px] sm:text-xs text-[#FFB366] font-retro tracking-widest uppercase mt-0.5">What others are watching now</p>
            </div>
            <Link to="/mature/trending" className="text-[10px] sm:text-xs font-retro text-red-400 hover:text-red-300 transition">More</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
            {trending.slice(0, 10).map(m => (
              <div key={m.id}>
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-end border-b border-red-900/20 pb-2">
            <div>
              <h2 className="font-display text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
                <Award size={16} className="sm:h-6 sm:w-6" /> Top Rated Dark Cinema
              </h2>
              <p className="text-[10px] sm:text-xs text-[#FFB366] font-retro tracking-widest uppercase mt-0.5">Critically acclaimed masterpieces</p>
            </div>
            <Link to="/mature/top-rated" className="text-[10px] sm:text-xs font-retro text-red-400 hover:text-red-300 transition">More</Link>
          </div>
          <div className="flex gap-2 sm:gap-4 lg:gap-6 overflow-x-auto pb-3 sm:pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-red-900/30 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible">
            {contents.sort((a, b) => b.rating - a.rating).slice(0, 10).map(m => (
              <div key={m.id} className="snap-start shrink-0 md:snap-align-none md:shrink">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>

        {/* New Releases */}
        {newReleases.length > 0 && (
          <section className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-end border-b border-red-900/20 pb-2">
              <div>
                <h2 className="font-display text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
                  <Sparkles size={16} className="sm:h-6 sm:w-6" /> New Vaults Unlocked
                </h2>
                <p className="text-[10px] sm:text-xs text-[#FFB366] font-retro tracking-widest uppercase mt-0.5">Latest mature releases</p>
              </div>
              <Link to="/mature/new-releases" className="text-[10px] sm:text-xs font-retro text-red-400 hover:text-red-300 transition">More</Link>
            </div>
            <div className="flex gap-2 sm:gap-4 lg:gap-6 overflow-x-auto pb-3 sm:pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-red-900/30 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible">
              {newReleases.map(m => (
                <div key={m.id} className="snap-start shrink-0 md:snap-align-none md:shrink">
                  <PosterCard movie={m} size="md" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Crime Thrillers */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-end border-b border-red-900/20 pb-2">
            <div>
              <h2 className="font-display text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 sm:gap-2">🚬 Crime & Noir</h2>
              <p className="text-[10px] sm:text-xs text-[#FFB366] font-retro tracking-widest uppercase mt-0.5">Dark alleys, heavy rain, and hardboiled detectives</p>
            </div>
            <Link to="/mature/noir" className="text-[10px] sm:text-xs font-retro text-red-400 hover:text-red-300 transition">View All</Link>
          </div>
          <div className="flex gap-2 sm:gap-4 lg:gap-6 overflow-x-auto pb-3 sm:pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-red-900/30 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible">
            {noirThrillers.map(m => (
              <div key={m.id} className="snap-start shrink-0 md:snap-align-none md:shrink">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>

        {/* Psychological Thrillers */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-end border-b border-red-900/20 pb-2">
            <div>
              <h2 className="font-display text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 sm:gap-2">🧠 Mind-Bending Psychological</h2>
              <p className="text-[10px] sm:text-xs text-[#FFB366] font-retro tracking-widest uppercase mt-0.5">Deceptive memories, intense plot twists, and pure dread</p>
            </div>
            <Link to="/mature/psychological" className="text-[10px] sm:text-xs font-retro text-red-400 hover:text-red-300 transition">View All</Link>
          </div>
          <div className="flex gap-2 sm:gap-4 lg:gap-6 overflow-x-auto pb-3 sm:pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-red-900/30 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible">
            {psychologicalDrama.map(m => (
              <div key={m.id} className="snap-start shrink-0 md:snap-align-none md:shrink">
                <PosterCard movie={m} size="md" />
              </div>
            ))}  
          </div>
        </section>

        {/* Seinen Shelf */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-red-900/10 pb-2">
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight text-white flex items-center gap-2">👹 Dark Seinen Chronicles</h2>
              <p className="text-xs text-purple-500 font-retro tracking-widest uppercase">Violent, gritty anime thrillers and deep philosophical battles</p>
            </div>
            <Link to="/mature/anime" className="text-xs font-retro text-red-500 hover:underline">View All</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x">
            {darkSeinen.map(m => (
              <div key={m.id} className="snap-start shrink-0">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
