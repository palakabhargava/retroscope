import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';
import { Link } from '@tanstack/react-router';
import { Play, Sparkles, TrendingUp, Award, Layers } from 'lucide-react';
import { SEOHelper } from '@/components/layout/SEOHelper';

export const Route = createFileRoute('/anime')({
  component: AnimePage,
  head: () => ({
    meta: [
      { title: "Anime Multiverse — RetroScope" },
      { name: "description", content: "Enter the RetroScope Anime Universe. Stream premium Shonen, Seinen, and Cyberpunk blockbusters with dual-audio support and neon visual identity." },
    ],
  }),
});

function AnimePage() {
  const { data: contents = [], isLoading } = useContents({ type: 'anime' });

  // Separate curated groups
  const featured = contents.find(c => c.title.includes("Cyberpunk")) || contents[0];
  const shonen = contents.filter(c => c.genres.includes("Shonen"));
  const seinen = contents.filter(c => c.genres.includes("Seinen"));
  const cyberpunk = contents.filter(c => c.genres.includes("Cyberpunk"));
  const sliceOfLife = contents.filter(c => c.genres.includes("Slice of Life") || c.genres.includes("Romance"));

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-hidden relative">
      <SEOHelper 
        title="Anime Multiverse Portal — RetroScope"
        description="Stream Shonen, Seinen, Fantasy and Dystopian Cyberpunk anime with holographic cards and neon visual styling."
        ogType="website"
        canonicalPath="/anime"
      />

      {/* Floating Energy Particles (custom for Anime Universe) */}
      <DustParticles count={50} />

      {/* Holographic Glowing Header Banner */}
      {featured ? (
        <section 
          className="relative h-[70vh] min-h-[500px] w-full overflow-hidden vignette border-b border-primary/20 shadow-[0_10px_30px_rgba(255,77,141,0.1)]"
          style={{ backgroundImage: `url(${featured.banner })`}}
        >
          <ProjectorBeam />
          
          {/* Energy aura glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          <div className="absolute top-1/3 left-1/4 w-[30rem] h-[30rem] rounded-full bg-[#7C3AED]/20 filter blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-[25rem] h-[25rem] rounded-full bg-[#FF4D8D]/15 filter blur-[100px] mix-blend-screen pointer-events-none" />

          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-16 z-10">
            <div className="max-w-2xl bg-black/60 p-6 rounded-lg border border-primary/30 backdrop-blur-md shadow-[0_0_40px_rgba(255,77,141,0.15)]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/40 px-3 py-1 font-retro text-[9px] uppercase tracking-widest text-[#FF4D8D] mb-3 animate-pulse">
                <Sparkles size={10} className="text-[#FF66C4]" /> HOLOGRAPHIC SPOTLIGHT
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-black leading-[0.95] text-foreground text-glow text-glow-pink">
                {featured.title}
              </h1>
              <p className="mt-4 text-xs uppercase font-retro tracking-widest text-[#22D3EE]">
                Studio: {featured.studio} • {featured.seasons} Seasons ({featured.episodes} Episodes) • {featured.year}
              </p>
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed font-sans">
                {featured.synopsis}
              </p>
              
              {/* Dub/Sub Tags */}
              <div className="mt-4 flex gap-2">
                <span className="px-2 py-0.5 rounded bg-[#FF4D8D]/15 border border-[#FF4D8D]/30 font-retro text-[9px] text-[#FF4D8D] uppercase tracking-wider">
                  Dual Audio
                </span>
                <span className="px-2 py-0.5 rounded bg-[#22D3EE]/15 border border-[#22D3EE]/30 font-retro text-[9px] text-[#22D3EE] uppercase tracking-wider">
                  Sub + Dub
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Link to="/anime/$animeId" params={{ animeId: featured.id }}
                  className="inline-flex items-center gap-2 rounded-sm bg-[#FF4D8D] px-6 py-3 font-retro text-xs uppercase tracking-widest text-white hover:bg-[#FF66C4] projector-glow hover:shadow-[0_0_25px_rgba(255,77,141,0.5)] transition duration-300">
                  <Play size={12}/> Unleash Energy
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[20vh]" />
      )}

      {/* Sub navigation bar */}
      <div className="bg-[#111827]/80 border-y border-primary/10 backdrop-blur sticky top-[57px] z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FF4D8D] animate-ping" />
            <h2 className="font-retro text-sm uppercase tracking-widest text-foreground font-black">Anime Hub</h2>
          </div>
          
          <div className="flex items-center gap-6 font-retro text-xs uppercase tracking-wider">
            <Link to="/anime/trending" className="flex items-center gap-1.5 text-zinc-400 hover:text-[#FF4D8D] transition">
              <TrendingUp size={14} /> Trending Neon
            </Link>
            <Link to="/anime/top-rated" className="flex items-center gap-1.5 text-zinc-400 hover:text-[#FF4D8D] transition">
              <Award size={14} /> Masterpieces
            </Link>
            <Link to="/anime/genres" className="flex items-center gap-1.5 text-zinc-400 hover:text-[#FF4D8D] transition">
              <Layers size={14} /> Genre Nodes
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-6 mt-12 space-y-16">
        {/* Shonen Shelf */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-primary/10 pb-2">
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight text-white glow-header">⚡ Shonen Energy Pulse</h2>
              <p className="text-xs text-[#22D3EE] font-retro tracking-widest uppercase">High energy fights and unforgettable bonds</p>
            </div>
            <Link to="/anime/genres" className="text-xs font-retro text-[#FF4D8D] hover:underline">View All</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-primary/20">
            {shonen.map(m => (
              <div key={m.id} className="snap-start shrink-0">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>

        {/* Seinen Shelf */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-primary/10 pb-2">
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight text-white">💀 Seinen Dark Chronicles</h2>
              <p className="text-xs text-purple-400 font-retro tracking-widest uppercase">Deep philosophical storylines and mature action</p>
            </div>
            <Link to="/anime/genres" className="text-xs font-retro text-[#FF4D8D] hover:underline">View All</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x">
            {seinen.map(m => (
              <div key={m.id} className="snap-start shrink-0">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>

        {/* Cyberpunk Dystopia */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-primary/10 pb-2">
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight text-white">🛸 Cyberpunk Tech Noir</h2>
              <p className="text-xs text-[#FF66C4] font-retro tracking-widest uppercase">Neo-Tokyo neon lattices and futuristic wireframes</p>
            </div>
            <Link to="/anime/genres" className="text-xs font-retro text-[#FF4D8D] hover:underline">View All</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x">
            {cyberpunk.map(m => (
              <div key={m.id} className="snap-start shrink-0">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>

        {/* Slice of Life / Romance */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-primary/10 pb-2">
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight text-white">🌸 Sunset Resonance</h2>
              <p className="text-xs text-[#FF4D8D] font-retro tracking-widest uppercase">Wistful romance, high school diaries, and warm dreams</p>
            </div>
            <Link to="/anime/genres" className="text-xs font-retro text-[#FF4D8D] hover:underline">View All</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x">
            {sliceOfLife.map(m => (
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
