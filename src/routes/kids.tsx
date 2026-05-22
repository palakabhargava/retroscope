import { createFileRoute } from '@tanstack/react-router';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { Link } from '@tanstack/react-router';
import { Play, Sparkles, Smile, Compass, Film, Tv } from 'lucide-react';
import { SEOHelper } from '@/components/layout/SEOHelper';

export const Route = createFileRoute('/kids')({
  component: KidsPage,
  head: () => ({
    meta: [
      { title: "Kids & Family Universe — RetroScope" },
      { name: "description", content: "Enter a magical cinematic playground on RetroScope! Find cartoons, kids-safe anime, and family adventures with large playful cards and rounded bubbles." },
    ],
  }),
});

function KidsPage() {
  const { data: contents = [], isLoading } = useContents({ type: 'kids' });

  // Separate subgroups
  const featured = contents[0];
  const animatedMovies = contents.slice(0, 8);
  const cartoons = contents.slice(8, 14);
  const kidsAnime = contents.slice(14, 20);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-hidden relative rounded-t-3xl">
      <SEOHelper 
        title="Kids & Family Cinematic Playground — RetroScope"
        description="Stream family movies, animated cartoons, and kids anime inside a magical, highly playful glowing layout."
        canonicalPath="/kids"
      />

      {/* Playful Floating Bubbles (Instead of dust particles) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/12 w-12 h-12 rounded-full bg-[#38BDF8]/10 filter blur-sm animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 right-1/6 w-16 h-16 rounded-full bg-[#F59E0B]/10 filter blur-sm animate-bounce" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-8 h-8 rounded-full bg-[#A5F3FC]/15 filter blur-xs animate-bounce" style={{ animationDuration: '5s' }} />
      </div>

      {/* Featured Kids Banner */}
      {featured ? (
        <section 
          className="relative h-[65vh] min-h-[480px] w-full overflow-hidden vignette border-b-4 border-[#38BDF8]/20 shadow-[0_8px_30px_rgba(56,189,248,0.15)]"
          style={{ backgroundImage: `url(${featured.banner})` }}
        >
          <ProjectorBeam />
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-[#38BDF8]/15 filter blur-[100px] pointer-events-none" />
          
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-14 z-10">
            <div className="max-w-xl bg-black/60 p-6 rounded-2xl border-2 border-[#38BDF8]/20 backdrop-blur-md shadow-2xl">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#38BDF8]/25 border border-[#38BDF8]/40 px-3 py-1 font-retro text-[9px] uppercase tracking-wider text-[#A5F3FC] mb-3 animate-pulse">
                <Smile size={10} /> MAGICAL SPOTLIGHT
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-black leading-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                {featured.title}
              </h1>
              <p className="mt-2 text-xs uppercase font-retro tracking-widest text-[#F59E0B]">
                Studio: {featured.studio} • {featured.year} • {featured.runtime} mins
              </p>
              <p className="mt-3 text-sm text-zinc-200 leading-relaxed font-sans font-medium">
                {featured.synopsis}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Link to="/movies/$movieId" params={{ movieId: featured.id }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#38BDF8] px-6 py-3 font-retro text-xs uppercase tracking-widest text-slate-950 hover:bg-[#A5F3FC] shadow-[0_4px_15px_rgba(56,189,248,0.4)] transition-all hover:scale-105 duration-200">
                  <Play size={12}/> Start Playroom
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[20vh]" />
      )}

      {/* Playful simplified kids navigation bar */}
      <div className="bg-[#1E293B]/70 border-b-2 border-dashed border-[#38BDF8]/20 backdrop-blur sticky top-[57px] z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#38BDF8] animate-ping" />
            <h2 className="font-display text-lg uppercase tracking-wider text-white font-black">Kids Playground</h2>
          </div>
          
          <div className="flex items-center gap-6 font-retro text-xs uppercase tracking-wider">
            <Link to="/kids/movies" className="flex items-center gap-1.5 text-zinc-300 hover:text-[#38BDF8] bg-zinc-800/40 px-3 py-1.5 rounded-full border border-zinc-700/50 transition">
              <Film size={14} /> Family Films
            </Link>
            <Link to="/kids/cartoons" className="flex items-center gap-1.5 text-zinc-300 hover:text-[#F59E0B] bg-zinc-800/40 px-3 py-1.5 rounded-full border border-zinc-700/50 transition">
              <Tv size={14} /> Cartoons Shelf
            </Link>
            <Link to="/kids/anime" className="flex items-center gap-1.5 text-zinc-300 hover:text-[#A5F3FC] bg-zinc-800/40 px-3 py-1.5 rounded-full border border-zinc-700/50 transition">
              <Sparkles size={14} /> Kid Anime
            </Link>
          </div>
        </div>
      </div>

      {/* Playful dynamic categories grids */}
      <div className="mx-auto max-w-7xl px-6 mt-12 space-y-16">
        {/* Animated Movies */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b-2 border-dashed border-[#38BDF8]/10 pb-2">
            <div>
              <h2 className="font-display text-2xl font-black text-white flex items-center gap-2">🎈 Family Fun Blockbusters</h2>
              <p className="text-xs text-[#38BDF8] font-retro tracking-widest uppercase">Spectacular adventures and lovely characters</p>
            </div>
            <Link to="/kids/movies" className="text-xs font-retro text-[#38BDF8] hover:underline">See All</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x">
            {animatedMovies.map(m => (
              <div key={m.id} className="snap-start shrink-0 hover:scale-105 transition-transform duration-300 rounded-2xl overflow-hidden">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>

        {/* Cartoons Shelf */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b-2 border-dashed border-[#F59E0B]/10 pb-2">
            <div>
              <h2 className="font-display text-2xl font-black text-white flex items-center gap-2">🧸 The Cartoons Shelf</h2>
              <p className="text-xs text-[#F59E0B] font-retro tracking-widest uppercase">Non-stop laughter and playful cartoon characters</p>
            </div>
            <Link to="/kids/cartoons" className="text-xs font-retro text-[#F59E0B] hover:underline">See All</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x">
            {cartoons.map(m => (
              <div key={m.id} className="snap-start shrink-0 hover:scale-105 transition-transform duration-300">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>

        {/* Kids Anime */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b-2 border-dashed border-[#A5F3FC]/10 pb-2">
            <div>
              <h2 className="font-display text-2xl font-black text-white flex items-center gap-2">🦄 Magic Kids Anime</h2>
              <p className="text-xs text-[#A5F3FC] font-retro tracking-widest uppercase">Safe, spectacular, and magical anime worlds</p>
            </div>
            <Link to="/kids/anime" className="text-xs font-retro text-[#38BDF8] hover:underline">See All</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x">
            {kidsAnime.map(m => (
              <div key={m.id} className="snap-start shrink-0 hover:scale-105 transition-transform duration-300">
                <PosterCard movie={m} size="md" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
