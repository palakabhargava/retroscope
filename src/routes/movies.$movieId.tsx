import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Heart, Bookmark, Play, Clock, Star, Trash2, Send } from 'lucide-react';
import { FakePlayerModal } from '@/components/movie/FakePlayerModal';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { ambientForAtmosphere } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useContentItem, useUserRating, useSaveRating, useSaveReview, useDeleteReview, useContents } from '@/hooks/queries';
import { toast } from 'sonner';

export const Route = createFileRoute('/movies/$movieId')({
  component: MovieDetail,
  head: ({ params }) => {
    return {
      title: `View Reel — RetroScope`,
      meta: [
        { name: "description", content: "A cinematic experience on RetroScope." }
      ]
    };
  }
});

import { MovieDetailSkeleton } from '@/components/layout/PageSkeletons';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { CinematicHeroBackdrop } from '@/components/cinematic/CinematicHeroBackdrop';

function MovieDetail() {
  const { movieId } = Route.useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const [list, setList] = useState(false);
  
  // Review box state
  const [reviewBody, setReviewBody] = useState('');
  const [postingReview, setPostingReview] = useState(false);

  // Queries
  const { data: itemData, isLoading, error } = useContentItem(movieId);
  const { data: userRating } = useUserRating(movieId, user?.id);
  const { data: allMovies } = useContents();

  // Mutations
  const saveRating = useSaveRating();
  const saveReview = useSaveReview();
  const deleteReview = useDeleteReview();

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (error || !itemData) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <p className="font-retro uppercase tracking-widest text-vintage-red">Reel missing or damaged</p>
          <Link to="/" className="mt-4 inline-block font-retro text-xs uppercase tracking-widest text-primary hover:underline">Return to lobby</Link>
        </div>
      </div>
    );
  }

  const { movie, averageRating, ratingCount, reviews } = itemData;

  const movieSchema = {
    "@context": "https://schema.org",
    "@type": movie.type === 'web_series' ? 'TVSeries' : 'Movie',
    "name": movie.title,
    "description": movie.synopsis,
    "image": movie.poster,
    "dateCreated": movie.year,
    "director": {
      "@type": "Person",
      "name": movie.director
    },
    "actor": movie.cast.map(c => ({
      "@type": "Person",
      "name": c
    })),
    "aggregateRating": averageRating ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": ratingCount || 1
    } : undefined
  };


  // Filter related elements using allMovies
  const related = (allMovies || [])
    .filter(m => m.id !== movie.id && m.atmosphere === movie.atmosphere)
    .slice(0, 6);

  async function handleRate(stars: number) {
    if (!user) {
      toast.error('Punch your ticket! Please sign in to rate.');
      return;
    }
    try {
      await saveRating.mutateAsync({
        contentId: movie.id,
        userId: user.id,
        rating: stars
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to record rating');
    }
  }

  async function handlePostReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to write a review.');
      return;
    }
    if (!reviewBody.trim()) return;
    setPostingReview(true);
    try {
      await saveReview.mutateAsync({
        contentId: movie.id,
        userId: user.id,
        body: reviewBody
      });
      setReviewBody('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to post review');
    } finally {
      setPostingReview(false);
    }
  }

  async function handleDeleteReview(reviewId: string) {
    if (!confirm('Are you sure you want to burn this review?')) return;
    try {
      await deleteReview.mutateAsync({ reviewId, contentId: movie.id });
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete review');
    }
  }

  return (
    <div>
      <SEOHelper 
        title={`${movie.title} (${movie.year}) — Stream on RetroScope`}
        description={movie.synopsis}
        ogType={movie.type === 'web_series' ? 'video.tv_show' : 'video.movie'}
        ogImage={movie.poster}
        canonicalPath={`/movies/${movie.id}`}
        schema={movieSchema}
      />
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden bg-cover bg-center vignette">
        <CinematicHeroBackdrop item={movie} />
        <ProjectorBeam />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/10" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end gap-8 px-6 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className={`hidden md:block h-72 w-48 shrink-0 overflow-hidden rounded-md border border-border bg-cover bg-center ${ambientForAtmosphere(movie.atmosphere)}`}
            style={{ backgroundImage: `url(${movie.poster})` }} />
          <div className="max-w-2xl">
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— {movie.type.replace('_', ' ')} · {movie.atmosphere} · {movie.year} —</p>
            <h1 className="mt-2 font-display text-5xl font-black text-glow">{movie.title}</h1>
            <p className="mt-3 italic text-muted-foreground">"{movie.tagline}"</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 font-retro text-xs uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1 text-primary"><Star size={12}/> {averageRating ? averageRating.toFixed(1) : '7.5'} ({ratingCount} dynamic reviews)</span>
              <span className="flex items-center gap-1"><Clock size={12}/> {movie.runtime}m</span>
              <span>{movie.genres.join(' · ')}</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow">
                <Play size={14}/> Open the curtain
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
          
          {/* TIMED SCENE REACTIONS HEATMAP PREVIEW */}
          <section>
            <h2 className="font-display text-2xl font-bold">Scene reactions</h2>
            <div className="mt-4 space-y-2">
              {movie.reactions && movie.reactions.length > 0 ? (
                movie.reactions.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-sm border border-border bg-card px-3 py-2">
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="font-retro text-xs uppercase tracking-widest text-muted-foreground w-16">{Math.floor(r.time*movie.runtime/100)}m</span>
                    <span className="text-sm">{r.label}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No reactions logged yet. Launch player to punch timed reactions!</p>
              )}
              <Link to="/heatmap/$movieId" params={{ movieId: movie.id }} className="mt-2 inline-block font-retro text-xs uppercase tracking-widest text-primary hover:text-hover-glow">
                Open full Scene Heatmap →
              </Link>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {/* MOOD TAGS */}
          <div className="glass rounded-md p-5">
            <h3 className="font-display text-lg font-bold">Mood tags</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {movie.moods.map(m => (
                <span key={m} className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-primary">{m.replace('-',' ')}</span>
              ))}
            </div>
          </div>

          {/* DYNAMIC TICKET RATING PUNCHER */}
          <div className="glass rounded-md p-5">
            <h3 className="font-display text-lg font-bold">Punch your ticket</h3>
            <p className="mt-1 text-xs text-muted-foreground">Rate this reel on a scale of 1 to 5 stars.</p>
            <div className="mt-3 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className={`text-2xl transition hover:scale-125 duration-100 ${
                    (userRating || 0) >= star ? 'text-primary' : 'text-muted-foreground/40 hover:text-primary/70'
                  }`}
                >
                  ★
                </button>
              ))}
              {userRating && (
                <span className="ml-2 font-retro text-[10px] text-primary uppercase">Punched: {userRating}/5</span>
              )}
            </div>
          </div>

          {/* REVIEWS LIST & WRITER */}
          <div className="glass rounded-md p-5">
            <h3 className="font-display text-lg font-bold">Lobby reviews</h3>
            
            {/* Review Writer */}
            {user ? (
              <form onSubmit={handlePostReview} className="mt-3 flex gap-2 border-b border-border/60 pb-4">
                <input
                  required
                  placeholder="Add your review stub…"
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  className="flex-1 rounded-sm border border-border bg-background/50 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={postingReview}
                  className="grid h-8 w-8 place-items-center rounded-sm bg-primary text-primary-foreground hover:bg-hover-glow disabled:opacity-60"
                >
                  <Send size={12} />
                </button>
              </form>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground italic">Sign in to write a review.</p>
            )}

            {/* Dynamic Review List */}
            <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {reviews && reviews.length > 0 ? (
                reviews.map((r: any) => {
                  const author = r.profiles?.username || 'Reel Wanderer';
                  const isOwn = r.user_id === user?.id;

                  return (
                    <div key={r.id} className="border-b border-border/40 pb-3 last:border-0 relative group">
                      <div className="flex items-center justify-between">
                        <p className="font-retro text-[10px] uppercase tracking-widest text-primary">
                          @{author}
                        </p>
                        {isOwn && (
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            className="text-muted-foreground/60 hover:text-vintage-red transition opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {r.body}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground italic">No review stubs posted yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="font-display text-2xl font-bold">If you liked this</h2>
          <div className="mt-4 -mx-4 overflow-x-auto px-4">
            <div className="flex gap-5">
              {related.map(m => <div key={m.id} className="shrink-0"><PosterCard movie={m}/></div>)}
            </div>
          </div>
        </section>
      )}

      <FakePlayerModal movie={movie} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
