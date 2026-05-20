import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Pause, Play, Volume2, Tv, Sliders, Settings, 
  Subtitles, VolumeX, Maximize2, Loader2, Activity, Sparkles, 
  Film, FastForward, RotateCcw
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
  const [settingsOpen, setSettingsOpen] = useState(false);
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

  // Inactivity Auto-fade State
  const [showControls, setShowControls] = useState(true);
  const inactivityTimeoutRef = useRef<number | null>(null);

  const playerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const addReaction = useAddReaction();
  const logPlay = useLogPlayEvent();

  const resetInactivityTimeout = () => {
    setShowControls(true);
    if (inactivityTimeoutRef.current) {
      window.clearTimeout(inactivityTimeoutRef.current);
    }
    if (playing && !settingsOpen) {
      inactivityTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (playing && !settingsOpen) {
      resetInactivityTimeout();
    } else {
      setShowControls(true);
      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current);
      }
    }
    return () => {
      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [playing, settingsOpen]);

  useEffect(() => {
    if (!open) { 
      setProgress(0); 
      setPlaying(true); 
      setIntervalOn(false); 
      setBuffering(false);
      setSettingsOpen(false);
      return; 
    }
    
    // Log initial play event in analytics
    if (movie) {
      logPlay.mutate({ contentId: movie.id, userId: user?.id || undefined, progress: 0 });
    }

    const t = setInterval(() => {
      setProgress(p => {
        if (buffering) return p;
        const speedMultiplier = speed;
        const np = Math.min(100, p + (playing ? 0.6 * speedMultiplier : 0));
        if (np > 48 && np < 49 && !interval) { setIntervalOn(true); setPlaying(false); }
        return np;
      });
    }, 300);
    return () => clearInterval(t);
  }, [open, playing, interval, movie, buffering, speed]);

  const handleQualityChange = (newQual: string) => {
    setQuality(newQual);
    setBuffering(true);
    toast.info(`Switching stream to ${newQual}. Negotiating adaptive bitrate...`, { id: 'quality-toast' });
    
    setTimeout(() => {
      setBuffering(false);
      toast.success(`Connected to premium server at ${newQual}!`, { id: 'quality-toast' });
    }, 1200);
  };

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
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4 overflow-y-auto"
        >
          <motion.div 
            ref={playerRef}
            initial={{ scale: 0.94, y: 16 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.94 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onMouseMove={resetInactivityTimeout}
            onPointerMove={resetInactivityTimeout}
            onClick={resetInactivityTimeout}
            className={`relative w-full max-w-5xl overflow-hidden rounded-lg border border-border/80 bg-black shadow-2xl projector-glow my-8 aspect-video select-none
              ${(!showControls && playing) ? 'cursor-none' : 'cursor-default'}`}
          >
            {/* Simulated Video Frame Background/Video */}
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden bg-cover bg-center transition-all duration-300" 
              style={{ 
                filter: getVideoFilterString(),
                backgroundImage: `url(${movie.banner})` 
              }}
            >
              {movie.trailerId && !buffering && (
                <iframe
                  className="absolute inset-0 h-full w-full pointer-events-none scale-105"
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

              {/* Live Overlay Subtitle Simulation */}
              {subLanguage !== 'Off' && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center w-full px-12">
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
              )}
            </div>

            {/* Cinematic project dark vignette masks */}
            <div className={`absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-20 transition-opacity duration-300
              ${showControls || !playing ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-20 transition-opacity duration-300
              ${showControls || !playing ? 'opacity-100' : 'opacity-0'}`} />

            {/* UNIFIED HUD OVERLAY CONTAINER */}
            <div 
              className={`absolute inset-0 z-30 flex flex-col justify-between p-4 transition-opacity duration-300
                ${showControls || !playing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
              
              {/* TOP ROW: Title info and close button */}
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start gap-3 bg-black/60 backdrop-blur-md rounded-md border border-white/10 p-2.5 max-w-sm md:max-w-md">
                  <div>
                    <p className="font-retro text-[8px] tracking-[0.3em] text-primary/95 font-bold uppercase">— NOW SHOWING —</p>
                    <h2 className="font-display text-sm md:text-base font-black text-foreground text-glow leading-tight">{movie.title}</h2>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] text-muted-foreground">{movie.year}</span>
                      <span className="text-[9px] text-muted-foreground">•</span>
                      <span className="text-[9px] text-muted-foreground">{movie.runtime}m</span>
                      <span className="text-[9px] text-muted-foreground">•</span>
                      <span className="rounded-sm border border-vintage-red/50 bg-vintage-red/10 px-1 py-0.2 font-retro text-[7px] uppercase tracking-widest text-vintage-red">
                        Premium
                      </span>
                      <span className="rounded-sm border border-amber-500/40 bg-amber-500/10 px-1 py-0.2 font-retro text-[7px] uppercase tracking-widest text-amber-400">
                        {quality}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={onClose} 
                  className="rounded-full bg-black/60 backdrop-blur-md p-2 text-foreground/90 hover:text-primary transition hover:bg-black border border-white/10 cursor-pointer"
                  title="Close Screen"
                >
                  <X size={18} />
                </button>
              </div>

              {/* BOTTOM COLUMN: Scrubber, Reactions, and Controls */}
              <div className="w-full flex flex-col gap-2">
                
                {/* reactions tray + filter details */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md px-3 py-1">
                    <span className="font-retro text-[8px] uppercase tracking-widest text-muted-foreground mr-1">React:</span>
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
                        className="text-base transition hover:scale-130 active:scale-95 duration-150 px-1 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Active filters display badge */}
                  {(vhs || hdrSimulation || cinematicFilter !== 'none') && (
                    <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[8px] text-amber-400 font-retro tracking-widest uppercase">
                      <Sparkles size={10} /> Active Filters: {[
                        vhs ? 'VHS' : null,
                        hdrSimulation ? 'HDR' : null,
                        cinematicFilter !== 'none' ? cinematicFilter : null
                      ].filter(Boolean).join(' + ')}
                    </div>
                  )}
                </div>

                {/* Progress Timeline Scrubber */}
                <div className="w-full relative">
                  <FilmReelProgress value={progress} />
                </div>

                {/* Control Action Buttons Row */}
                <div className="flex items-center justify-between gap-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-md p-2">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPlaying(p => !p)} 
                      className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-hover-glow cursor-pointer active:scale-95"
                      title={playing ? 'Pause' : 'Play'}
                    >
                      {playing ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    
                    <button 
                      onClick={() => setProgress(p => Math.max(0, p - 5))}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                      title="Rewind 10 seconds"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button 
                      onClick={() => setProgress(p => Math.min(100, p + 5))}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                      title="Skip 10 seconds"
                    >
                      <FastForward size={14} />
                    </button>
                    
                    {/* Volume Scrubber HUD */}
                    <div className="flex items-center gap-2 ml-1">
                      <button 
                        onClick={() => setMuted(!muted)} 
                        className="text-muted-foreground hover:text-foreground transition cursor-pointer"
                      >
                        {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
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
                        className="w-12 sm:w-16 md:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="font-retro text-[8px] text-muted-foreground/80 w-6">{muted ? 'Muted' : `${volume}%`}</span>
                    </div>

                    <span className="font-retro text-[9px] text-muted-foreground border-l border-white/10 pl-3 hidden sm:inline-block">
                      {Math.floor((progress * movie.runtime) / 100)}m / {movie.runtime}m
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setVhs(v => !v)}
                      className={`flex items-center gap-1 rounded-sm border px-2 py-1 font-retro text-[8px] uppercase tracking-widest transition cursor-pointer
                        ${vhs ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-muted-foreground hover:text-foreground'}`}
                    >
                      <Tv size={10}/> VHS
                    </button>
                    
                    <button 
                      onClick={() => setSettingsOpen(s => !s)}
                      className={`p-1.5 transition rounded-sm cursor-pointer
                        ${settingsOpen ? 'text-primary bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                      title="OTT System Controls"
                    >
                      <Settings size={15} className={settingsOpen ? 'animate-spin' : ''} />
                    </button>

                    <button 
                      onClick={toggleFullscreen}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer hover:bg-white/5 rounded-sm"
                      title="Simulate Fullscreen"
                    >
                      <Maximize2 size={15} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* SLIDING GLASSMORPHIC CONSOLE DRAWER PANEL (Netflix Style) */}
            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="absolute right-0 top-0 bottom-0 w-80 max-w-full z-50 bg-black/75 backdrop-blur-md border-l border-white/10 p-4 overflow-y-auto flex flex-col pointer-events-auto"
                >
                  {/* Settings Panel Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <h3 className="font-display text-xs font-black text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                      <Settings className="h-3.5 w-3.5 text-primary" /> OTT HUD Customizer
                    </h3>
                    <button 
                      onClick={() => setSettingsOpen(false)}
                      className="text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Tab Selector Buttons */}
                  <div className="flex justify-between gap-1 mb-4 border-b border-white/10 pb-2">
                    {([
                      { id: 'playback', label: 'Play', icon: Film },
                      { id: 'audio', label: 'Audio', icon: Volume2 },
                      { id: 'subtitles', label: 'CC', icon: Subtitles },
                      { id: 'video', label: 'Video', icon: Sliders },
                      { id: 'stats', label: 'Stats', icon: Activity }
                    ] as const).map(tab => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 flex flex-col items-center py-1.5 rounded-sm transition cursor-pointer text-center relative
                            ${active ? 'text-primary font-bold bg-white/5' : 'text-muted-foreground hover:text-foreground'}`}
                          title={tab.id}
                        >
                          <Icon size={14} />
                          <span className="text-[7px] uppercase tracking-wider mt-1">{tab.label}</span>
                          {active && (
                            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 inset-x-1.5 h-0.5 bg-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Content for active tab */}
                  <div className="flex-1 overflow-y-auto pr-1 text-left">
                    
                    {activeTab === 'playback' && (
                      <div className="space-y-4">
                        <h4 className="font-display text-xs font-black text-foreground flex items-center gap-1">
                          <Film className="h-3.5 w-3.5 text-primary" /> Speed Control Room
                        </h4>
                        
                        <div className="space-y-1.5">
                          <label className="block font-retro text-[8px] uppercase tracking-widest text-muted-foreground">Playback Speed ({speed}x)</label>
                          <div className="grid grid-cols-5 gap-1">
                            {[0.5, 1.0, 1.25, 1.5, 2.0].map(s => (
                              <button
                                key={s}
                                onClick={() => setSpeed(s)}
                                className={`py-1 rounded-sm font-retro text-[8px] border transition cursor-pointer text-center
                                  ${speed === s ? 'bg-primary/20 border-primary text-primary font-bold' : 'border-white/10 text-muted-foreground hover:text-white'}`}
                              >
                                {s === 1.0 ? 'Normal' : `${s}x`}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-white/5 pt-3">
                          <label className="block font-retro text-[8px] uppercase tracking-widest text-muted-foreground">Dynamic OTT Simulation</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={autoplayNext} 
                                onChange={e => {
                                  setAutoplayNext(e.target.checked);
                                  toast.info(`Simulated: Auto-play next episode ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                                }}
                                className="accent-primary h-3.5 w-3.5" 
                              />
                              <span>Autoplay Next Episode</span>
                            </label>
                            <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={skipIntro} 
                                onChange={e => {
                                  setSkipIntro(e.target.checked);
                                  if (e.target.checked) toast.success("Skip Intro Activated — Skipping credits automatically");
                                }}
                                className="accent-primary h-3.5 w-3.5" 
                              />
                              <span>Auto Skip Intro Credits</span>
                            </label>
                            <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={skipRecap} 
                                onChange={e => {
                                  setSkipRecap(e.target.checked);
                                  if (e.target.checked) toast.success("Skip Season Recap Activated");
                                }}
                                className="accent-primary h-3.5 w-3.5" 
                              />
                              <span>Auto Skip Previous Recap</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'audio' && (
                      <div className="space-y-4">
                        <h4 className="font-display text-xs font-black text-foreground flex items-center gap-1">
                          <Volume2 className="h-3.5 w-3.5 text-primary" /> Audio Equalizers
                        </h4>

                        <div className="space-y-2.5">
                          <div>
                            <label className="block font-retro text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Equalizer Preset</label>
                            <select 
                              value={audioPreset} 
                              onChange={e => {
                                setAudioPreset(e.target.value);
                                toast.info(`Equalizer profile set to: ${e.target.value}`);
                              }}
                              className="w-full bg-black/60 text-xs border border-white/10 px-2 py-1.5 rounded-sm focus:outline-none focus:border-primary text-foreground"
                            >
                              <option>Classic Cinema</option>
                              <option>Dolby Atmos Enhanced</option>
                              <option>Action Blast Booster</option>
                              <option>Vocal Clear & Mids</option>
                              <option>Night Quiet Mode</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={bassBoost} 
                                onChange={e => {
                                  setBassBoost(e.target.checked);
                                  toast.success(`Subwoofer Bass Boost ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
                                }}
                                className="accent-primary h-3.5 w-3.5" 
                              />
                              <span>Subwoofer Bass Boost</span>
                            </label>
                            <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={surroundSound} 
                                onChange={e => {
                                  setSurroundSound(e.target.checked);
                                  toast.success(`Virtual Surround Simulation ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
                                }}
                                className="accent-primary h-3.5 w-3.5" 
                              />
                              <span>Spatial Surround Engine</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-1.5 border-t border-white/5 pt-3">
                          <p className="font-retro text-[8px] uppercase tracking-widest text-muted-foreground">Digital Decibel Monitor</p>
                          <div className="h-10 flex items-end gap-1 bg-black/40 border border-white/10 rounded p-1.5 overflow-hidden">
                            {[0.2, 0.5, 0.8, 0.4, 0.9, 0.3, 0.7, 0.8, 0.5, 0.9, 0.2, 0.6, 0.4, 0.7].map((h, i) => (
                              <motion.div 
                                key={i}
                                animate={{ height: playing ? [`${h * 100}%`, `${(1 - h) * 100}%`, `${h * 100}%`] : `${h * 40}%` }}
                                transition={{ repeat: Infinity, duration: 0.8 + (i % 3) * 0.2, ease: 'easeInOut' }}
                                className="flex-1 bg-primary rounded-t-sm"
                                style={{ minHeight: '3px' }}
                              />
                            ))}
                          </div>
                          <p className="text-[7px] text-muted-foreground/80">Active stream track: Dolby Digital Plus Atmos</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'subtitles' && (
                      <div className="space-y-3.5">
                        <h4 className="font-display text-xs font-black text-foreground flex items-center gap-1">
                          <Subtitles className="h-3.5 w-3.5 text-primary" /> CC Customizer
                        </h4>

                        <div className="space-y-2">
                          <div>
                            <label className="block font-retro text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Language</label>
                            <select value={subLanguage} onChange={e => setSubLanguage(e.target.value)}
                              className="w-full bg-black/60 text-xs border border-white/10 px-2 py-1 rounded-sm text-foreground">
                              <option>English</option>
                              <option>Hindi (हिंदी)</option>
                              <option>Spanish (Español)</option>
                              <option>French (Français)</option>
                              <option>Off</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-retro text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Font Size</label>
                            <select value={subSize} onChange={e => setSubSize(e.target.value)}
                              className="w-full bg-black/60 text-xs border border-white/10 px-2 py-1 rounded-sm text-foreground">
                              <option>Small</option>
                              <option>Medium</option>
                              <option>Large</option>
                              <option>Extra Large</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-retro text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Font Color</label>
                            <select value={subColor} onChange={e => setSubColor(e.target.value)}
                              className="w-full bg-black/60 text-xs border border-white/10 px-2 py-1 rounded-sm text-foreground">
                              <option>Yellow</option>
                              <option>White</option>
                              <option>Cyan Glow</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-retro text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Sync Latency Offset</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="range" 
                                min="-2.0" 
                                max="2.0" 
                                step="0.5" 
                                value={subLatency} 
                                onChange={e => setSubLatency(parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/20 accent-primary cursor-pointer appearance-none rounded-lg"
                              />
                              <span className="font-retro text-[9px] text-primary whitespace-nowrap">{subLatency >= 0 ? `+${subLatency.toFixed(1)}s` : `${subLatency.toFixed(1)}s`}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'video' && (
                      <div className="space-y-4">
                        <h4 className="font-display text-xs font-black text-foreground flex items-center gap-1">
                          <Sliders className="h-3.5 w-3.5 text-primary" /> Visuals & Filters
                        </h4>

                        <div className="space-y-2">
                          <div>
                            <label className="block font-retro text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Stream Resolution</label>
                            <select 
                              value={quality} 
                              onChange={e => handleQualityChange(e.target.value)}
                              className="w-full bg-black/60 text-xs border border-white/10 px-2 py-1.5 rounded-sm text-foreground"
                            >
                              <option>Auto (Adaptive 4K UHD)</option>
                              <option>2160p (4K UHD Master)</option>
                              <option>1080p CineMaster</option>
                              <option>720p Reel Classic</option>
                              <option>480p VHS Dystopia</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-retro text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Cinematic Atmosphere</label>
                            <select 
                              value={cinematicFilter} 
                              onChange={e => setCinematicFilter(e.target.value as any)}
                              className="w-full bg-black/60 text-xs border border-white/10 px-2 py-1.5 rounded-sm text-foreground"
                            >
                              <option value="none">None (True Screen)</option>
                              <option value="sepia">1920s Vintage Sepia</option>
                              <option value="techno">Neon Techno (Cyberpunk Glow)</option>
                              <option value="noir">Classic Noir (High Contrast B&W)</option>
                              <option value="warm">35mm Analog Warmth</option>
                            </select>
                          </div>

                          <div className="pt-1.5">
                            <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">
                              <input 
                                type="checkbox" 
                                checked={hdrSimulation} 
                                onChange={toggleHdrSimulation}
                                className="accent-primary h-3.5 w-3.5" 
                              />
                              <span className="flex items-center gap-1 font-bold text-amber-400">HDR Color Simulation <Sparkles size={10} /></span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-white/5 pt-3">
                          <div>
                            <div className="flex justify-between">
                              <label className="font-retro text-[8px] uppercase tracking-widest text-muted-foreground">Brightness ({brightness}%)</label>
                            </div>
                            <input type="range" min="70" max="130" value={brightness} onChange={e => setBrightness(Number(e.target.value))}
                              className="w-full h-1 bg-white/20 accent-primary cursor-pointer appearance-none rounded-lg mt-1"/>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <label className="font-retro text-[8px] uppercase tracking-widest text-muted-foreground">Contrast ({contrast}%)</label>
                            </div>
                            <input type="range" min="70" max="130" value={contrast} onChange={e => setContrast(Number(e.target.value))}
                              className="w-full h-1 bg-white/20 accent-primary cursor-pointer appearance-none rounded-lg mt-1"/>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'stats' && (
                      <div className="space-y-3">
                        <h4 className="font-display text-xs font-black text-foreground flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5 text-primary" /> Stats for Nerds
                        </h4>

                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px] text-muted-foreground">
                          <div className="bg-black/50 border border-white/5 rounded p-2">
                            <p className="text-primary font-bold">Bitrate</p>
                            <p className="mt-0.5 text-foreground font-black">18.42 Mbps</p>
                            <p className="text-[7px]">Codec: AV1</p>
                          </div>
                          <div className="bg-black/50 border border-white/5 rounded p-2">
                            <p className="text-primary font-bold">Resolution</p>
                            <p className="mt-0.5 text-foreground font-black">
                              {quality.includes('4K') ? '3840 x 2160' : quality.includes('1080p') ? '1920 x 1080' : '1280 x 720'}
                            </p>
                            <p className="text-[7px]">FPS: 60.0</p>
                          </div>
                          <div className="bg-black/50 border border-white/5 rounded p-2">
                            <p className="text-primary font-bold">Buffer Health</p>
                            <p className="mt-0.5 text-emerald-400 font-black">48.2s</p>
                            <p className="text-[7px]">server-cdn-02</p>
                          </div>
                          <div className="bg-black/50 border border-white/5 rounded p-2">
                            <p className="text-primary font-bold">Latency</p>
                            <p className="mt-0.5 text-foreground font-black">14ms</p>
                            <p className="text-[7px]">Jitter: 1ms</p>
                          </div>
                        </div>
                        <p className="text-[8px] text-muted-foreground/60 leading-relaxed">
                          * Simulated real-time streaming measurements based on adaptive CDN multiplexing.
                        </p>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
