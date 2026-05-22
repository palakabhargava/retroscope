import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, RefreshCw, ImageOff } from 'lucide-react';

interface CinematicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  atmosphere?: string;
  aspectRatio?: 'poster' | 'banner' | 'square';
  className?: string;
}

const PALETTES: Record<string, { from: string; via: string; to: string; border: string }> = {
  anime: { from: '#0F1026', via: '#1E1035', to: '#0B0D19', border: 'rgba(255, 77, 141, 0.4)' },
  kids: { from: '#0F172A', via: '#1E293B', to: '#030712', border: 'rgba(56, 189, 248, 0.4)' },
  mature: { from: '#050505', via: '#1F0505', to: '#000000', border: 'rgba(153, 27, 27, 0.5)' },
  classic: { from: '#1A1A1A', via: '#2A2A2A', to: '#111111', border: 'rgba(255, 140, 66, 0.3)' },
  salaar: { from: '#060B08', via: '#111613', to: '#020202', border: 'rgba(138, 21, 21, 0.5)' },
  interstellar: { from: '#02020A', via: '#0D0E1C', to: '#010103', border: 'rgba(96, 165, 250, 0.5)' },
  cyberpunk: { from: '#0D0214', via: '#1A0B2E', to: '#020005', border: 'rgba(255, 0, 127, 0.5)' },
  romance: { from: '#1F0C14', via: '#3D1525', to: '#0D0207', border: 'rgba(244, 114, 182, 0.5)' },
  horror: { from: '#050000', via: '#140505', to: '#000000', border: 'rgba(153, 27, 27, 0.6)' },
};

export const CinematicImage: React.FC<CinematicImageProps> = ({
  src,
  alt,
  fallbackTitle,
  atmosphere = 'classic',
  aspectRatio = 'poster',
  className = '',
  ...props
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'retrying' | 'failed'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [blurLoaded, setBlurLoaded] = useState(false);
  const retryTimerRef = useRef<number | null>(null);

  const cleanSrc = src ? src.replace(/^url\(['"]?|['"]?\)$/g, '') : '';
  const isGradient = !cleanSrc || cleanSrc.includes('gradient');

  useEffect(() => {
    if (isGradient) {
      setStatus('failed');
      return;
    }
    
    if (cleanSrc) {
      setStatus('loading');
      setRetryCount(0);
      setBlurLoaded(false);
    } else {
      setStatus('failed');
    }

    return () => {
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
      }
    };
  }, [cleanSrc, isGradient]);

  const triggerRetry = () => {
    if (retryCount < 2) {
      setStatus('retrying');
      setRetryCount((prev) => prev + 1);
      
      const delay = (retryCount + 1) * 1200; // Exponential backup
      retryTimerRef.current = window.setTimeout(() => {
        // Trigger reload by modifying image src query param or re-triggering element
        setStatus('loading');
      }, delay);
    } else {
      setStatus('failed');
    }
  };

  const palette = PALETTES[atmosphere] || PALETTES.classic;

  return (
    <div 
      className={`relative w-full h-full min-h-[180px] overflow-hidden bg-zinc-950 select-none group/img ${className}`}
      style={{
        boxShadow: status === 'failed' ? `inset 0 0 20px rgba(0,0,0,0.8), 0 0 10px ${palette.border}` : undefined,
      }}
    >
      {/* SHIMMER LOADER */}
      <AnimatePresence>
        {(status === 'loading' || status === 'retrying') && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950"
          >
            {/* Shimmer skeleton */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            
            {/* Loading text/icon */}
            <div className="relative flex flex-col items-center gap-2">
              <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
                {status === 'retrying' ? (
                  <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <div className="h-5 w-5 animate-pulse rounded-full border-2 border-primary border-t-transparent" />
                )}
              </div>
              {status === 'retrying' && (
                <span className="font-retro text-[8px] tracking-widest text-primary uppercase animate-pulse">
                  RECONNECTING ({retryCount}/2)...
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BLUR-UP LOW-RES PLACEHOLDER */}
      {cleanSrc && status !== 'failed' && (
        <div 
          className={`absolute inset-0 z-10 transition-opacity duration-700 bg-cover bg-center filter blur-md ${
            blurLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundImage: `url(${cleanSrc})` }}
        />
      )}
      
      {/* ACTUAL IMAGE */}
      {cleanSrc && status !== 'failed' && (
        <img
  src={cleanSrc || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop"}
  alt={alt}
  loading="lazy"
  decoding="async"
style={{
  willChange: 'transform',
  transform: 'translateZ(0)',
}}
  onLoad={() => {
    setStatus('loaded');
    setBlurLoaded(true);
  }}
  onError={(e) => {
  const target = e.currentTarget;

  if (!target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true';

    target.src =
      atmosphere === 'anime'
        ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop';
  } else {
    setStatus('failed');
  }

  setBlurLoaded(true);
  
}}
  className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out group-hover/img:scale-110 group-hover/img:rotate-[0.5deg] ${
    status === 'loaded'
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-105'
  }`}
  {...props}
/>
      )}

      {/* PREMIUM HIGH-FIDELITY CINEMATIC FALLBACK ARTWORK */}
      {status === 'failed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b"
          style={{
            backgroundImage: `radial-gradient(circle at top, ${palette.via} 0%, ${palette.from} 60%, ${palette.to} 100%)`
          }}
        >
          {/* Neon atmospheric glow layer */}
          <div className="absolute inset-0 bg-black/40 mix-blend-overlay" />
          <div 
            className="absolute top-1/4 h-24 w-24 rounded-full filter blur-xl opacity-30 animate-pulse" 
            style={{ backgroundColor: palette.border }}
          />

          <div className="relative z-10 flex flex-col items-center max-w-full px-2">
            <div className="p-3 rounded-full bg-black/60 border border-white/5 shadow-xl mb-3 group-hover/img:scale-110 transition-transform duration-500">
              <Film 
                className="h-7 w-7 text-primary/80 filter drop-shadow-[0_0_8px_var(--primary)] animate-pulse" 
                style={{ color: palette.border }}
              />
            </div>
            
            <span className="font-retro text-[8px] uppercase tracking-widest text-white/50 mb-1">
              {atmosphere.toUpperCase()} MULTIVERSE
            </span>

            <h4 className="font-display font-black leading-tight text-white line-clamp-3 text-sm px-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
              {fallbackTitle || alt}
            </h4>

            {aspectRatio === 'poster' && (
              <p className="mt-2 text-[9px] font-retro text-primary/80 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/5">
                projection reel
              </p>
            )}
          </div>

          {/* Retro Film Scanlines */}
          <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-[0.03]" />
        </motion.div>
      )}

      {/* Subtle overlay gradient to darken card base */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10 opacity-90 transition-opacity duration-700 group-hover/img:opacity-100" />
    </div>
  );
};
