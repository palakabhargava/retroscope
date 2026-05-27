import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Heart, Bookmark, Play, Clock, Star, Trash2, Send, Sparkles, Volume2, Globe, Tv } from 'lucide-react';
import { FakePlayerModal } from '@/components/movie/FakePlayerModal';
import { PosterCard } from '@/components/movie/PosterCard';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useContentItem, useUserRating, useSaveRating, useSaveReview, useDeleteReview, useContents } from '@/hooks/queries';
import { toast } from 'sonner';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { MovieDetailSkeleton } from '@/components/layout/PageSkeletons';
import { CinematicHeroBackdrop } from '@/components/cinematic/CinematicHeroBackdrop';

export const Route = createFileRoute('/anime/$animeId')({
  component: AnimeDetail,
  head: () => ({
    title: "View Anime — RetroScope",
  })
});

function AnimeDetail() {
  const { animeId } = Route.useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const [list, setList] = useState(false);
  
  // Review box state
  const [reviewBody, setReviewBody] = useState('');
  const [postingReview, setPostingReview] = useState(false);

  // Custom dual audio state (simulated)
  const [isSub, setIsSub] = useState(true);

  // Queries
  const { data: itemData, isLoading, error } = useContentItem(animeId);
  const { data: userRating } = useUserRating(animeId, user?.id);
  const { data: allContents } = useContents({ type: 'anime' });

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
          <p className="font-retro uppercase tracking-widest text-primary animate-pulse">Anime Node Missing or Damaged</p>
          <Link to="/anime" className="mt-4 inline-block font-retro text-xs uppercase tracking-widest text-[#FF4D8D] hover:underline">Return to Anime Hub</Link>
        </div>
      </div>
    );
  }

  const { movie, averageRating, ratingCount, reviews } = itemData;

  const animeSchema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
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
    }))
  };

  // Related anime
  const related = (allContents || [])
    .filter(m => m.id !== movie.id)
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

  // Simulated episode list based on metadata
  const episodesCount = movie.episodes || 12;
  const seasonsCount = movie.seasons || 1;

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <SEOHelper 
        title={`${movie.title} Anime Series — Stream on RetroScope`}
        description={movie.synopsis}
        ogType="video.tv_show"
        ogImage={movie.poster}
        canonicalPath={`/anime/${movie.id}`}
        schema={animeSchema}
      />

      {/* Hero Banner Section */}
      <section 
        className="relative h-[65vh] min-h-[480px] w-full overflow-hidden vignette border-b border-primary/20 shadow-[0_10px_30px_rgba(255,77,141,0.08)]"
      >
        <CinematicHeroBackdrop item={movie} />
        <ProjectorBeam />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
        <div className="absolute top-1/4 left-1/3 w-[25rem] h-[25rem] rounded-full bg-[#7C3AED]/15 filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#FF4D8D]/10 filter blur-[90px] pointer-events-none" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12 z-10">
          <div className="flex flex-col md:flex-row gap-6 items-end w-full">
            {/* Holographic Poster */}
            <div className="hidden md:block w-48 h-72 rounded-md overflow-hidden border border-primary/30 shadow-[0_0_25px_rgba(255,77,141,0.15)] flex-shrink-0 relative group">
              <img src={movie.poster.replace(/^url\(['"]?|['"]?\)$/g, '')} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            </div>

            <div className="flex-1 bg-black/60 p-6 rounded-lg backdrop-blur-md border border-primary/20 shadow-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 font-retro text-[9px] uppercase tracking-wider text-[#FF4D8D] mb-3 animate-pulse">
                <Sparkles size={10} className="text-[#FF66C4]" /> ANIME MULTIVERSE
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-black leading-none text-foreground text-glow text-glow-pink">
                {movie.title}
              </h1>
              <p className="mt-3 text-xs uppercase font-retro tracking-widest text-[#22D3EE]">
                Studio: {movie.studio || "MAPPA"} • {seasonsCount} Season • {episodesCount} Episodes • {movie.year}
              </p>

              {/* Tagline */}
              {movie.tagline && (
                <p className="mt-2 text-xs italic text-[#FF66C4]/80 font-sans tracking-wide">
                  "{movie.tagline}"
                </p>
              )}

              <p className="mt-3 text-sm text-zinc-300 line-clamp-3 font-sans">
                {movie.synopsis}
              </p>

              {/* Holographic Interactive Chips & Audio Selector */}
              <div className="mt-5 flex flex-wrap gap-2.5 items-center">
                <div className="flex rounded-sm border border-primary/30 p-0.5 bg-black/50">
                  <button 
                    onClick={() => { setIsSub(true); toast.success("Switched to Japanese Subtitles"); }}
                    className={`px-3 py-1 rounded-sm font-retro text-[9px] uppercase tracking-wider transition ${isSub ? 'bg-[#FF4D8D] text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    SUB (JPN)
                  </button>
                  <button 
                    onClick={() => { setIsSub(false); toast.success("Switched to English Dubbing"); }}
                    className={`px-3 py-1 rounded-sm font-retro text-[9px] uppercase tracking-wider transition ${!isSub ? 'bg-[#7C3AED] text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    DUB (ENG)
                  </button>
                </div>

                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-[#22D3EE]/15 border border-[#22D3EE]/20 font-retro text-[9px] text-[#22D3EE] uppercase tracking-wider flex items-center gap-1">
                    <Volume2 size={10} /> DUAL-AUDIO
                  </span>
                  <span className="px-2 py-1 rounded bg-purple-500/15 border border-purple-500/20 font-retro text-[9px] text-purple-300 uppercase tracking-wider flex items-center gap-1">
                    <Globe size={10} /> MULTI-SUB
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button 
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 rounded-sm bg-[#FF4D8D] px-6 py-3 font-retro text-xs uppercase tracking-widest text-white hover:bg-[#FF66C4] projector-glow hover:shadow-[0_0_20px_rgba(255,77,141,0.4)] transition duration-300"
                >
                  <Play size={12}/> Open Trailer
                </button>
                
                <button onClick={() => { setFav(!fav); toast.success(fav ? 'Removed from favorites' : 'Added to favorites'); }}
                  className={`inline-flex items-center justify-center h-11 w-11 rounded-sm border ${fav ? 'border-[#FF4D8D] text-[#FF4D8D] bg-[#FF4D8D]/5' : 'border-zinc-700 text-zinc-400'} hover:border-[#FF4D8D] hover:text-[#FF4D8D] transition duration-300`}>
                  <Heart size={16} fill={fav ? '#FF4D8D' : 'none'} />
                </button>
                
                <button onClick={() => { setList(!list); toast.success(list ? 'Removed from Watchlist' : 'Added to Watchlist'); }}
                  className={`inline-flex items-center justify-center h-11 w-11 rounded-sm border ${list ? 'border-[#22D3EE] text-[#22D3EE] bg-[#22D3EE]/5' : 'border-zinc-700 text-zinc-400'} hover:border-[#22D3EE] hover:text-[#22D3EE] transition duration-300`}>
                  <Bookmark size={16} fill={list ? '#22D3EE' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-12">
          {/* Episode Directory */}
          <section className="bg-[#111827]/60 border border-primary/10 rounded-lg p-6 backdrop-blur-md">
            <h3 className="font-display text-xl font-black mb-4 flex items-center gap-2 text-white text-glow-pink">
              <Tv size={18} className="text-[#FF4D8D]" /> Episode Directory (Season 1)
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {Array.from({ length: episodesCount }).map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setOpen(true)}
                  className="flex items-center justify-between p-3 rounded bg-zinc-900/60 border border-zinc-800/40 hover:border-[#FF4D8D]/40 hover:bg-[#1F1625] transition duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-retro text-xs text-[#22D3EE] w-6">E{idx + 1}</span>
                    <div>
                      <p className="font-display text-sm font-bold text-white group-hover:text-[#FF4D8D] transition">
                        Clash of Stars: Part {idx + 1}
                      </p>
                      <p className="text-[10px] text-zinc-400">Duration: 24 mins • Sub & Dub Ready</p>
                    </div>
                  </div>
                  <Play size={12} className="text-zinc-500 group-hover:text-[#FF4D8D] group-hover:scale-125 transition" />
                </div>
              ))}
            </div>
          </section>

          {/* Interactive review section */}
          <section className="bg-zinc-950/40 border border-zinc-800/40 rounded-lg p-6">
            <h3 className="font-display text-xl font-bold text-white mb-6">User Reviews & Critical Reports</h3>
            
            {/* Post review */}
            <form onSubmit={handlePostReview} className="mb-8">
              <textarea 
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="Submit your critical report or feedback for this anime node..."
                rows={3}
                className="w-full bg-[#111827] border border-zinc-800 rounded-sm p-3 text-sm focus:outline-none focus:border-[#FF4D8D] text-white"
              />
              <div className="mt-3 flex justify-end">
                <button 
                  type="submit"
                  disabled={postingReview}
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 font-retro text-[10px] uppercase tracking-widest text-primary-foreground hover:bg-hover-glow transition"
                >
                  <Send size={10} /> {postingReview ? 'Transmitting...' : 'Post Report'}
                </button>
              </div>
            </form>

            {/* List of reviews */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No reports submitted yet. Be the first to analyze this node.</p>
              ) : (
                reviews.map((r: any) => (
                  <div key={r.id} className="p-4 rounded bg-[#111827]/40 border border-zinc-800/30 flex gap-3 relative">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-retro text-[10px] uppercase text-[#22D3EE]">{r.profiles?.email?.split('@')[0] || 'Anonymous guest'}</p>
                        <p className="text-[9px] text-zinc-500">{new Date(r.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className="mt-2 text-sm text-zinc-300 font-sans leading-relaxed">{r.body}</p>
                    </div>
                    {user && user.id === r.user_id && (
                      <button 
                        onClick={() => handleDeleteReview(r.id)}
                        className="text-zinc-600 hover:text-[#FF4D8D] self-start transition duration-200"
                        title="Delete report"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right 1 Column */}
        <div className="space-y-8">
          {/* Ticket Rating & Stats */}
          <section className="bg-[#111827]/60 border border-primary/10 rounded-lg p-6 backdrop-blur-md text-center">
            <span className="font-retro text-[10px] tracking-widest text-[#FF4D8D] uppercase">multiverse rating</span>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <Star className="h-6 w-6 text-[#FF4D8D] fill-[#FF4D8D]" />
              <span className="font-display text-4xl font-black text-white">{averageRating ? averageRating.toFixed(1) : '7.5'}</span>
              <span className="text-zinc-500 self-end mb-1 text-xs">/10</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Based on {ratingCount || 1} telemetry evaluations</p>

            {/* Rate stars */}
            <div className="mt-6 border-t border-zinc-800/60 pt-6">
              <p className="font-retro text-[9px] text-zinc-400 uppercase tracking-widest mb-3">Evaluate Node</p>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = userRating ? userRating >= star * 2 : false;
                  return (
                    <button 
                      key={star} 
                      onClick={() => handleRate(star * 2)}
                      className="hover:scale-125 transition duration-200"
                    >
                      <Star 
                        className={`h-6 w-6 ${active ? 'text-[#FF4D8D] fill-[#FF4D8D]' : 'text-zinc-700'}`} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Related Anime */}
          <section className="space-y-4">
            <h4 className="font-display font-bold text-white border-b border-primary/10 pb-2">
              🪐 Related Universes
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {related.map(m => (
                <div key={m.id} className="scale-95 origin-top">
                  <PosterCard movie={m} size="sm" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Simulated OTT Player Modal */}
      {open && (
        <FakePlayerModal
          movie={movie}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
