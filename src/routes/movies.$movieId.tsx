import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import { Heart, Bookmark, Play, Clock, Star } from 'lucide-react';
import { findMovie, MOVIES, type Movie } from '@/data/movies';
import { FakePlayerModal } from '@/components/movie/FakePlayerModal';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { ambientForAtmosphere } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/movies/$movieId')({
  component: MovieDetail,
  loader: ({ params }) => {
    const movie = findMovie(params.movieId);
    if (!movie) throw notFound();
    return { movie };
  },
  head: ({ loaderData, params }) => {
    const m = loaderData?.movie;
    const title = m ? `${m.title} (${m.year}) — RetroScope` : "Film — RetroScope";
    const desc = m?.synopsis ?? "A cinematic film on RetroScope.";
    return {
      meta: [
        { title },
        { name: "description", content: desc.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: desc.slice(0, 200) },
        { property: "og:type", content: "video.movie" },
        { property: "og:url", content: `/movies/${params.movieId}` },
      ],
      links: [{ rel: "canonical", href: `/movies/${params.movieId}` }],
      scripts: m ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Movie",
          name: m.title,
          datePublished: String(m.year),
          director: { "@type": "Person", name: m.director },
          actor: m.cast.map(n => ({ "@type": "Person", name: n })),
          aggregateRating: { "@type": "AggregateRating", ratingValue: m.rating, ratingCount: 100 },
          description: m.synopsis,
        }),
      }] : undefined,
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center"><p className="font-retro uppercase tracking-widest text-muted-foreground">Reel missing</p></div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">{error.message}</div>,
});

function MovieDetail() {
  const { movie } = Route.useLoaderData() as { movie: Movie };
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const [list, setList] = useState(false);
  const related = MOVIES.filter(m => m.id !== movie.id && m.atmosphere === movie.atmosphere).slice(0, 6);

  return (
    <div>
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden bg-cover bg-center vignette" style={{ backgroundImage: movie.banner }}>
        <ProjectorBeam />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/10" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end gap-8 px-6 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className={`hidden md:block h-72 w-48 shrink-0 overflow-hidden rounded-md border border-border bg-cover bg-center ${ambientForAtmosphere(movie.atmosphere)}`}
            style={{ backgroundImage: movie.poster }} />
          <div className="max-w-2xl">
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— {movie.atmosphere} · {movie.year} —</p>
            <h1 className="mt-2 font-display text-5xl font-black text-glow">{movie.title}</h1>
            <p className="mt-3 italic text-muted-foreground">"{movie.tagline}"</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 font-retro text-xs uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1 text-primary"><Star size={12}/> {movie.rating}</span>
              <span className="flex items-center gap-1"><Clock size={12}/> {movie.runtime}m</span>
              <span>{movie.genres.join(' · ')}</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow">
                <Play size={14}/> Play
              </button>
              <button onClick={() => setFav(f => !f)}
                className={`grid h-11 w-11 place-items-center rounded-sm border ${fav ? 'border-vintage-red text-vintage-red' : 'border-border text-foreground hover:border-primary'}`}>
                <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
              </button>
              <button onClick={() => setList(l => !l)}
                className={`grid h-11 w-11 place-items-center rounded-sm border ${list ? 'border-primary text-primary' : 'border-border text-foreground hover:border-primary'}`}>
                <Bookmark size={16} fill={list ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="font-display text-2xl font-bold">Synopsis</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{movie.synopsis}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold">Cast</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {movie.cast.map(c => (
                <div key={c} className="rounded-sm border border-border bg-card px-3 py-2">
                  <p className="text-sm">{c}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 font-retro text-xs uppercase tracking-widest text-muted-foreground">Directed by {movie.director}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold">Scene reactions</h2>
            <div className="mt-4 space-y-2">
              {movie.reactions?.map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-sm border border-border bg-card px-3 py-2">
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="font-retro text-xs uppercase tracking-widest text-muted-foreground w-16">{Math.floor(r.time*movie.runtime/100)}m</span>
                  <span className="text-sm">{r.label}</span>
                </div>
              ))}
              <Link to="/heatmap/$movieId" params={{ movieId: movie.id }} className="mt-2 inline-block font-retro text-xs uppercase tracking-widest text-primary hover:text-hover-glow">
                Open full Scene Heatmap →
              </Link>
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <div className="glass rounded-md p-5">
            <h3 className="font-display text-lg font-bold">Mood tags</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {movie.moods.map(m => (
                <span key={m} className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-primary">{m.replace('-',' ')}</span>
              ))}
            </div>
          </div>
          <div className="glass rounded-md p-5">
            <h3 className="font-display text-lg font-bold">Reviews</h3>
            <div className="mt-3 space-y-3">
              {[
                { who: 'cine_owl', stars: 5, text: 'A perfect rainy-night reel. The pacing is hypnotic.' },
                { who: 'reel_diaries', stars: 4, text: 'The third act earns every frame.' },
              ].map((r, i) => (
                <div key={i} className="border-b border-border pb-3 last:border-0">
                  <p className="font-retro text-[10px] uppercase tracking-widest text-primary">@{r.who} · {'★'.repeat(r.stars)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="font-display text-2xl font-bold">If you liked this</h2>
        <div className="mt-4 -mx-4 overflow-x-auto px-4">
          <div className="flex gap-5">
            {related.map(m => <div key={m.id} className="shrink-0"><PosterCard movie={m}/></div>)}
          </div>
        </div>
      </section>

      <FakePlayerModal movie={movie} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
