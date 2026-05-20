import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Pause, Play, SkipForward, Volume2, Tv, Sliders, Settings, 
  Subtitles, VolumeX, Maximize2, Loader2, Activity, Sparkles, 
  Film, FastForward, RotateCcw, Monitor
} from 'lucide-react';
import type { Movie } from '@/data/movies';
import { FilmReelProgress } from './FilmReelProgress';
import { ProjectorBeam } from '../cinematic/ProjectorBeam';
import { DustParticles } from '../cinematic/DustParticles';
import { VHSOverlay } from '../cinematic/VHSOverlay';
import { IntervalBanner } from '../cinematic/IntervalBanner';
import { useAuth } from '@/lib/auth';
import { useAddReaction, useLogPlayEvent } from '@/hooks/queries';
import { toast } from 'sonner';

type PlayerTab = 'playback' | 'audio' | 'subtitles' | 'video' | 'stats';

export function FakePlayerModal({ movie, open, onClose }: { movie: Movie | null; open: boolean; onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [vhs, setVhs] = useState(false);
  const [interval, setIntervalOn] = useState(false);
  
  // Advanced OTT State Variables
  const [buffering, setBuffering] = useState(false);
  const [activeTab, setActiveTab] = useState<PlayerTab>('playback');
  const [speed, setSpeed] = useState(1.0);
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [skipIntro, setSkipIntro] = useState(false);
  const [skipRecap, setSkipRecap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Audio State
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [bassBoost, setBassBoost] = useState(false);
  const [surroundSound, setSurroundSound] = useState(true);
  const [audioPreset, setAudioPreset] = useState('Classic Cinema');
  
  // Subtitles State
  const [subLanguage, setSubLanguage] = useState('English');
  const [subSize, setSubSize] = useState('Medium');
  const [subColor, setSubColor] = useState('Yellow');
  const [subLatency, setSubLatency] = useState(0.0);
  
  // Video State
  const [quality, setQuality] = useState('1080p CineMaster');
  const [hdrSimulation, setHdrSimulation] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [cinematicFilter, setCinematicFilter] = useState<'none' | 'sepia' | 'techno' | 'noir' | 'warm'>('none');

  const playerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const addReaction = useAddReaction();
  const logPlay = useLogPlayEvent();

  useEffect(() => {
    if (!open) { 
      setProgress(0); 
      setPlaying(true); 
      setIntervalOn(false); 
      setBuffering(false);
      return; 
    }
    
    // Log initial play event in analytics
    if (movie) {
      logPlay.mutate({ contentId: movie.id, userId: user?.id || undefined, progress: 0 });
    }

    const t = setInterval(() => {
      setProgress(p => {
        // When buffering, no progress is made
        if (buffering) return p;
        const speedMultiplier = speed;
        const np = Math.min(100, p + (playing ? 0.6 * speedMultiplier : 0));
        if (np > 48 && np < 49 && !interval) { setIntervalOn(true); setPlaying(false); }
        return np;
      });
    }, 300);
    return () => clearInterval(t);
  }, [open, playing, interval, movie, buffering, speed]);

  // Handler to simulate quality changes with buffering loading states
  const handleQualityChange = (newQual: string) => {
    setQuality(newQual);
    setBuffering(true);
    toast.info(`Switching stream to ${newQual}. Negotiating adaptive bitrate...`, { id: 'quality-toast' });
    
    setTimeout(() => {
      setBuffering(false);
      toast.success(`Connected to premium server at ${newQual}!`, { id: 'quality-toast' });
    }, 1200);
  };

  // Toggle HDR Simulation with quick buffer
  const toggleHdrSimulation = () => {
    setHdrSimulation(prev => {
      const next = !prev;
      setBuffering(true);
      setTimeout(() => {
        setBuffering(false);
        toast.success(`HDR Simulation ${next ? 'Activated (Wide Color Gamut Glow)' : 'Deactivated'}`, { id: 'hdr-toast' });
      }, 500);
      return next;
    });
  };

  // Dynamic filter combination for ultimate visual feedback
  const getVideoFilterString = () => {
    let base = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (vhs) base += ` saturate(0.85) contrast(1.15)`;
    if (hdrSimulation) base += ` saturate(1.3) contrast(1.1) brightness(105%)`;
    
    switch (cinematicFilter) {
      case 'sepia': base += ' sepia(0.65) hue-rotate(-5deg)'; break;
      case 'techno': base += ' saturate(1.6) hue-rotate(185deg) contrast(1.2)'; break;
      case 'noir': base += ' grayscale(1) contrast(1.4) brightness(95%)'; break;
      case 'warm': base += ' sepia(0.25) saturate(1.2) contrast(1.05)'; break;
    }
    return base;
  };

  // Fullscreen simulation
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <AnimatePresence>
      {open && movie && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4 overflow-y-auto">
          <motion.div 
            ref={playerRef}
            initial={{ scale: 0.94, y: 16 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.94 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full max-w-5xl overflow-hidden rounded-lg border border-border/80 bg-black shadow-2xl projector-glow my-8"
          >
            {/* Close Button */}
            <button onClick={onClose} className="absolute right-4 top-4 z-50 rounded-full bg-black/75 p-2 text-foreground/90 hover:text-primary transition hover:bg-black border border-border/40">
              <X size={18} />
            </button>

            {/* Simulated Video Frame */}
            <div 
              className="relative aspect-video w-full overflow-hidden bg-cover bg-center transition-all duration-300" 
              style={{ 
                filter: getVideoFilterString(),
                backgroundImage: movie.banner 
              }}
            >
              {movie.trailerId && !buffering && (
                <iframe
                  className="absolute inset-0 h-full w-full pointer-events-none"
                  src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&rel=0&modestbranding=1&playsinline=1&volume=${volume}`}
                  title={`${movie.title} trailer`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
              
              <div className="absolute inset-0 bg-black/45" />
              <ProjectorBeam />
              <DustParticles count={35} />
              <VHSOverlay active={vhs} />
              
              {/* Interval Intermission Banner */}
              <IntervalBanner open={interval} onDone={() => { setIntervalOn(false); setPlaying(true); }} />

              {/* Buffering/Loading Simulation State */}
              <AnimatePresence>
                {buffering && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                  >
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 font-retro text-[10px] uppercase tracking-[0.3em] text-primary">Buffering Stream Reel...</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Adapting stream bitrate for {quality}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HDR Simulation Glowing Aura */}
              {hdrSimulation && (
                <div className="absolute inset-0 z-10 pointer-events-none border-[3px] border-amber-500/20 shadow-[inset_0_0_80px_rgba(245,158,11,0.15)]" />
              )}

              {/* Screen Title & RESTRICTED Banner Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center max-w-xl mx-auto px-6 pointer-events-none select-none">
                <p className="font-retro text-[9px] tracking-[0.4em] text-primary/95">— NOW SHOWING IN OTT MULTIPLEX —</p>
                <h2 className="mt-2 font-display text-4xl font-black text-foreground text-glow text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{movie.title}</h2>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  <span className="rounded-sm border border-vintage-red/50 bg-black/75 px-3 py-0.5 font-retro text-[9px] uppercase tracking-widest text-vintage-red">
                    Demo Mode · Stream Restricted
                  </span>
                  <span className="rounded-sm border border-amber-500/40 bg-black/75 px-3 py-0.5 font-retro text-[9px] uppercase tracking-widest text-amber-400">
                    {quality}
                  </span>
                </div>
                <p className="mt-4 text-[11px] text-muted-foreground/90 max-w-sm drop-shadow-md">
                  Simulating production-grade player system. Content restricted to cinematic promo reels and premium control tweaks.
                </p>
              </div>

              {/* Live Overlay Subtitle Simulation */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center w-full px-12">
                <span 
                  className="px-3 py-1 bg-black/80 rounded border border-border/20 text-shadow inline-block font-sans shadow-md"
                  style={{
                    fontSize: subSize === 'Small' ? '12px' : subSize === 'Medium' ? '15px' : subSize === 'Large' ? '19px' : '24px',
                    color: subColor === 'Yellow' ? '#f59e0b' : subColor === 'White' ? '#ffffff' : '#06b6d4',
                  }}
                >
                  [{subLanguage}] Simulated subtitle feed at {subLatency.toFixed(1)}s synchronization offset.
                </span>
              </div>
            </div>

            {/* Player Progress Bar */}
            <div className="bg-card px-6 pt-4 border-t border-border/40">
              <FilmReelProgress value={progress} />
            </div>

            {/* Player Primary Control Panel */}
            <div className="bg-card px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border/20">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPlaying(p => !p)} 
                  className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-hover-glow cursor-pointer active:scale-95"
                  title={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                
                {/* 10s Rewind / Skip buttons */}
                <button 
                  onClick={() => setProgress(p => Math.max(0, p - 5))}
                  className="p-2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Rewind 10 seconds"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setProgress(p => Math.min(100, p + 5))}
                  className="p-2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Skip 10 seconds"
                >
                  <FastForward size={16} />
                </button>
                
                {/* Volume slider HUD */}
                <div className="flex items-center gap-2 ml-2">
                  <button 
                    onClick={() => setMuted(!muted)} 
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={muted ? 0 : volume}
                    onChange={e => {
                      setVolume(Number(e.target.value));
                      if (muted) setMuted(false);
                    }}
                    className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="font-retro text-[9px] text-muted-foreground/80 w-6">{muted ? 'Muted' : `${volume}%`}</span>
                </div>

                <span className="font-retro text-xs text-muted-foreground border-l border-border/40 pl-4">
                  {Math.floor((progress * movie.runtime) / 100)}m / {movie.runtime}m
                </span>
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
                    className="text-lg transition hover:scale-130 active:scale-95 duration-150 px-1 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Toggle Overlays */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setVhs(v => !v)}
                  className={`flex items-center gap-2 rounded-sm border px-3 py-1.5 font-retro text-[10px] uppercase tracking-widest transition cursor-pointer
                    ${vhs ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:text-foreground'}`}
                >
                  <Tv size={13}/> VHS Mode
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Simulate Fullscreen"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>

            {/* Recruiter grade Premium OTT Dashboard Console */}
            <div className="bg-background/95 border-t border-border/60 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Advanced Operations Tab Options */}
                <div className="flex flex-col gap-1 w-full md:w-44 border-r border-border/40 pr-3">
                  <p className="font-retro text-[8px] uppercase tracking-widest text-primary mb-2 pl-2">OTT Console Rooms</p>
                  {(['playback', 'audio', 'subtitles', 'video', 'stats'] as PlayerTab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-left font-retro text-[10px] uppercase tracking-widest px-3 py-2 rounded-sm transition cursor-pointer flex items-center justify-between
                        ${activeTab === tab 
                          ? 'bg-primary text-primary-foreground font-black shadow-lg shadow-primary/10' 
                          : 'text-muted-foreground hover:bg-card hover:text-foreground'}`}
                    >
                      <span>{tab}</span>
                      {tab === 'video' && hdrSimulation && <Sparkles size={10} className="text-amber-400" />}
                    </button>
                  ))}
                </div>

                {/* Tab Customizers Render */}
                <div className="flex-1 min-h-[160px]">
                  {activeTab === 'playback' && (
                    <div className="space-y-4">
                      <h4 className="font-display text-sm font-black text-foreground flex items-center gap-2">
                        <Film className="h-4 w-4 text-primary" /> Playback Controls & Speed Engine
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                          <label className="block font-retro text-[9px] uppercase tracking-widest text-muted-foreground">Playback Speed ({speed}x)</label>
                          <div className="flex gap-2">
                            {[0.5, 1.0, 1.25, 1.5, 2.0].map(s => (
                              <button
                                key={s}
                                onClick={() => setSpeed(s)}
                                className={`flex-1 py-1 rounded-sm font-retro text-[9px] border transition cursor-pointer
                                  ${speed === s ? 'bg-primary/25 border-primary text-primary font-bold' : 'border-border text-muted-foreground hover:text-foreground'}`}
                              >
                                {s === 1.0 ? 'Normal' : `${s}x`}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block font-retro text-[9px] uppercase tracking-widest text-muted-foreground">OTT Simulation Toggles</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={autoplayNext} 
                                onChange={e => {
                                  setAutoplayNext(e.target.checked);
                                  toast.info(`Simulated: Auto-play next episode ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                                }}
                                className="accent-primary" 
                              />
                              <span>Autoplay Next Episode</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={skipIntro} 
                                onChange={e => {
                                  setSkipIntro(e.target.checked);
                                  if (e.target.checked) toast.success("Skip Intro Activated — Skipping credits automatically");
                                }}
                                className="accent-primary" 
                              />
                              <span>Auto Skip Intro Credits</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={skipRecap} 
                                onChange={e => {
                                  setSkipRecap(e.target.checked);
                                  if (e.target.checked) toast.success("Skip Season Recap Activated");
                                }}
                                className="accent-primary" 
                              />
                              <span>Auto Skip Previous Recap</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'audio' && (
                    <div className="space-y-4">
                      <h4 className="font-display text-sm font-black text-foreground flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-primary" /> Audio presets & spatial simulation
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-3">
                          <div>
                            <label className="block font-retro text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Equalizer Preset</label>
                            <select 
                              value={audioPreset} 
                              onChange={e => {
                                setAudioPreset(e.target.value);
                                toast.info(`Equalizer profile set to: ${e.target.value}`);
                              }}
                              className="w-full bg-card text-xs border border-border px-3 py-1.5 rounded-sm focus:outline-none focus:border-primary"
                            >
                              <option>Classic Cinema</option>
                              <option>Dolby Atmos Enhanced</option>
                              <option>Action Blast Booster</option>
                              <option>Vocal Clear & Mids</option>
                              <option>Night Quiet Mode</option>
                            </select>
                          </div>
                          <div className="flex gap-4 pt-1">
                            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={bassBoost} 
                                onChange={e => {
                                  setBassBoost(e.target.checked);
                                  toast.success(`Subwoofer Bass Boost ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
                                }}
                                className="accent-primary" 
                              />
                              <span>Bass Boost</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={surroundSound} 
                                onChange={e => {
                                  setSurroundSound(e.target.checked);
                                  toast.success(`Virtual Surround Simulation ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
                                }}
                                className="accent-primary" 
                              />
                              <span>Spatial Surround (Simulated)</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="font-retro text-[9px] uppercase tracking-widest text-muted-foreground">Digital Decibel Monitor</p>
                          <div className="h-10 flex items-end gap-1 bg-black/40 border border-border/20 rounded p-2 overflow-hidden">
                            {[0.2, 0.5, 0.8, 0.4, 0.9, 0.3, 0.7, 0.8, 0.5, 0.9, 0.2, 0.6, 0.4, 0.7].map((h, i) => (
                              <motion.div 
                                key={i}
                                animate={{ height: playing ? [`${h * 100}%`, `${(1 - h) * 100}%`, `${h * 100}%`] : `${h * 40}%` }}
                                transition={{ repeat: Infinity, duration: 0.8 + (i % 3) * 0.2, ease: 'easeInOut' }}
                                className="flex-1 bg-primary rounded-t-sm"
                                style={{ minHeight: '4px' }}
                              />
                            ))}
                          </div>
                          <p className="text-[9px] text-muted-foreground">Simulated dynamic audio range: Dolby 7.1 Master Audio track</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'subtitles' && (
                    <div className="space-y-4">
                      <h4 className="font-display text-sm font-black text-foreground flex items-center gap-2">
                        <Subtitles className="h-4 w-4 text-primary" /> Closed Captions & Synchronization
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div>
                          <label className="block font-retro text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Language</label>
                          <select value={subLanguage} onChange={e => setSubLanguage(e.target.value)}
                            className="w-full bg-card text-xs border border-border px-2 py-1 rounded-sm">
                            <option>English</option>
                            <option>Hindi (हिंदी)</option>
                            <option>Spanish (Español)</option>
                            <option>French (Français)</option>
                            <option>Off</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-retro text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Font Size</label>
                          <select value={subSize} onChange={e => setSubSize(e.target.value)}
                            className="w-full bg-card text-xs border border-border px-2 py-1 rounded-sm">
                            <option>Small</option>
                            <option>Medium</option>
                            <option>Large</option>
                            <option>Extra Large</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-retro text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Font Color</label>
                          <select value={subColor} onChange={e => setSubColor(e.target.value)}
                            className="w-full bg-card text-xs border border-border px-2 py-1 rounded-sm">
                            <option>Yellow</option>
                            <option>White</option>
                            <option>Cyan Glow</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-retro text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Latency Offset</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="range" 
                              min="-2.0" 
                              max="2.0" 
                              step="0.5" 
                              value={subLatency} 
                              onChange={e => setSubLatency(parseFloat(e.target.value))}
                              className="w-full h-1 bg-muted accent-primary cursor-pointer appearance-none rounded-lg"
                            />
                            <span className="font-retro text-[10px] text-primary whitespace-nowrap">{subLatency >= 0 ? `+${subLatency.toFixed(1)}s` : `${subLatency.toFixed(1)}s`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'video' && (
                    <div className="space-y-4">
                      <h4 className="font-display text-sm font-black text-foreground flex items-center gap-2">
                        <Sliders className="h-4 w-4 text-primary" /> Visuals, simulation & cinema filters
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="space-y-2">
                          <label className="block font-retro text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Adaptive Quality</label>
                          <select 
                            value={quality} 
                            onChange={e => handleQualityChange(e.target.value)}
                            className="w-full bg-card text-xs border border-border px-3 py-1.5 rounded-sm"
                          >
                            <option>Auto (Adaptive 4K UHD)</option>
                            <option>2160p (4K UHD Master)</option>
                            <option>1080p CineMaster</option>
                            <option>720p Reel Classic</option>
                            <option>480p VHS Dystopia</option>
                          </select>
                          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground pt-1">
                            <input 
                              type="checkbox" 
                              checked={hdrSimulation} 
                              onChange={toggleHdrSimulation}
                              className="accent-primary" 
                            />
                            <span className="flex items-center gap-1 font-bold text-amber-500">HDR Simulation <Sparkles size={11} /></span>
                          </label>
                        </div>

                        <div className="space-y-2">
                          <label className="block font-retro text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Cinematic Theme Filter</label>
                          <select 
                            value={cinematicFilter} 
                            onChange={e => setCinematicFilter(e.target.value as any)}
                            className="w-full bg-card text-xs border border-border px-3 py-1.5 rounded-sm"
                          >
                            <option value="none">None (True Screen)</option>
                            <option value="sepia">1920s Vintage Sepia</option>
                            <option value="techno">Neon Techno (Cyberpunk Glow)</option>
                            <option value="noir">Classic Noir (High Contrast B&W)</option>
                            <option value="warm">35mm Analog Warmth</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between">
                              <label className="font-retro text-[9px] uppercase tracking-widest text-muted-foreground">Brightness ({brightness}%)</label>
                            </div>
                            <input type="range" min="70" max="130" value={brightness} onChange={e => setBrightness(Number(e.target.value))}
                              className="w-full h-1 bg-muted accent-primary cursor-pointer appearance-none rounded-lg mt-1"/>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <label className="font-retro text-[9px] uppercase tracking-widest text-muted-foreground">Contrast ({contrast}%)</label>
                            </div>
                            <input type="range" min="70" max="130" value={contrast} onChange={e => setContrast(Number(e.target.value))}
                              className="w-full h-1 bg-muted accent-primary cursor-pointer appearance-none rounded-lg mt-1"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'stats' && (
                    <div className="space-y-3">
                      <h4 className="font-display text-sm font-black text-foreground flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" /> Stats for Nerds (OTT Engine HUD)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 font-mono text-[10px] text-muted-foreground">
                        <div className="bg-black/40 border border-border/20 rounded p-2.5">
                          <p className="text-primary font-bold">Bitrate / Codec</p>
                          <p className="mt-1 text-foreground font-black text-xs">18.42 Mbps</p>
                          <p className="text-[9px]">AV1 High Main 10</p>
                        </div>
                        <div className="bg-black/40 border border-border/20 rounded p-2.5">
                          <p className="text-primary font-bold">Video Resolution</p>
                          <p className="mt-1 text-foreground font-black text-xs">{quality.includes('4K') ? '3840 x 2160' : quality.includes('1080p') ? '1920 x 1080' : '1280 x 720'}</p>
                          <p className="text-[9px]">60.00 fps (Simulated)</p>
                        </div>
                        <div className="bg-black/40 border border-border/20 rounded p-2.5">
                          <p className="text-primary font-bold">Buffer Health</p>
                          <p className="mt-1 text-emerald-400 font-black text-xs">48.2 seconds</p>
                          <p className="text-[9px]">Server: retroscope-cdn-02</p>
                        </div>
                        <div className="bg-black/40 border border-border/20 rounded p-2.5">
                          <p className="text-primary font-bold">Diagnostics</p>
                          <p className="mt-1 text-foreground font-bold">Dropped Frames: 0</p>
                          <p className="text-[9px]">Latency: 14ms (Jitter: 1ms)</p>
                        </div>
                      </div>
                      <p className="text-[9px] text-muted-foreground/80 mt-2">
                        * Technical parameters represent live simulated measurements of the RetroScope player engine executing client-side optimization code.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
