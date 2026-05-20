import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pause, Play, SkipForward, Volume2, Tv } from 'lucide-react';
import type { Movie } from '@/data/movies';
import { FilmReelProgress } from './FilmReelProgress';
import { ProjectorBeam } from '../cinematic/ProjectorBeam';
import { DustParticles } from '../cinematic/DustParticles';
import { VHSOverlay } from '../cinematic/VHSOverlay';
import { IntervalBanner } from '../cinematic/IntervalBanner';
import { useAuth } from '@/lib/auth';
import { useAddReaction, useLogPlayEvent } from '@/hooks/queries';
import { toast } from 'sonner';

export function FakePlayerModal({ movie, open, onClose }: { movie: Movie | null; open: boolean; onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [vhs, setVhs] = useState(false);
  const [interval, setIntervalOn] = useState(false);

  const { user } = useAuth();
  const addReaction = useAddReaction();
  const logPlay = useLogPlayEvent();

  useEffect(() => {
    if (!open) { setProgress(0); setPlaying(true); setIntervalOn(false); return; }
    
    // Log initial play event in analytics
    if (movie) {
      logPlay.mutate({ contentId: movie.id, userId: user?.id || undefined, progress: 0 });
    }

    const t = setInterval(() => {
      setProgress(p => {
        const np = Math.min(100, p + (playing ? 0.6 : 0));
        if (np > 48 && np < 49 && !interval) { setIntervalOn(true); setPlaying(false); }
        return np;
      });
    }, 300);
    return () => clearInterval(t);
  }, [open, playing, interval, movie]);

  return (
    <AnimatePresence>
      {open && movie && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4">
          <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card vignette projector-glow">
            <button onClick={onClose} className="absolute right-3 top-3 z-50 rounded-full bg-black/60 p-2 text-foreground hover:bg-black/80">
              <X size={18} />
            </button>
            <div className="relative aspect-video w-full overflow-hidden bg-cover bg-center" style={{ backgroundImage: movie.banner }}>
              {movie.trailerId && (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1`}
                  title={`${movie.title} trailer`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
              <div className="absolute inset-0 bg-black/55" />
              <ProjectorBeam />
              <DustParticles count={40} />
              <VHSOverlay active={vhs} />
              <IntervalBanner open={interval} onDone={() => { setIntervalOn(false); setPlaying(true); }} />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center max-w-md px-6">
                  <p className="font-retro text-xs tracking-[0.4em] text-primary">— NOW SHOWING —</p>
                  <h2 className="mt-2 font-display text-4xl font-black text-foreground text-glow">{movie.title}</h2>
                  <p className="mt-4 inline-block rounded-sm border border-vintage-red/60 bg-black/60 px-3 py-1 font-retro text-[11px] uppercase tracking-widest text-vintage-red">
                    Demo Version · Playback Restricted
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    This is a recruiter demo. Movies don't actually play — only the cinematic experience does.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 bg-card p-5">
              <FilmReelProgress value={progress} />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setPlaying(p => !p)} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-hover-glow">
                    {playing ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button className="text-muted-foreground hover:text-foreground"><SkipForward size={18}/></button>
                  <button className="text-muted-foreground hover:text-foreground"><Volume2 size={18}/></button>
                  <span className="font-retro text-xs text-muted-foreground">{Math.floor(progress * movie.runtime / 100)}m / {movie.runtime}m</span>
                </div>
                
                {/* Timed Emoji Reactions Bar */}
                <div className="flex items-center gap-2 rounded-md border border-border/80 bg-background/50 px-3 py-1">
                  <span className="font-retro text-[9px] uppercase tracking-widest text-muted-foreground mr-1">React:</span>
                  {['😮', '😭', '🔥', '🤯'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={async () => {
                        if (!user?.id) {
                          toast.error('Sign in to leave a timed reaction!');
                          return;
                        }
                        try {
                          const currentSecs = Math.floor((progress * movie.runtime * 60) / 100);
                          await addReaction.mutateAsync({
                            contentId: movie.id,
                            userId: user.id,
                            emoji,
                            timestamp: currentSecs
                          });
                          toast.success(`Reaction ${emoji} logged at ${Math.floor(currentSecs / 60)}m!`);
                        } catch (err: any) {
                          toast.error(err.message || 'Failed to log reaction');
                        }
                      }}
                      className="text-lg transition hover:scale-130 active:scale-95 duration-150 px-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button onClick={() => setVhs(v => !v)}
                  className={`flex items-center gap-2 rounded-sm border px-3 py-1.5 font-retro text-xs uppercase tracking-widest transition
                    ${vhs ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                  <Tv size={14}/> VHS Mode
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
