import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, RefreshCw } from 'lucide-react';
import { getImageFallback, GRADIENT_PALETTES, setCachedImageStatus } from '@/lib/imageOptimization';

interface CinematicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  atmosphere?: string;
  aspectRatio?: 'poster' | 'banner' | 'square';
  className?: string;
  imageType?: 'anime' | 'movie' | 'banner' | 'thumbnail' | 'classic' | 'kids' | 'mature';
}

// YouTube video ID to thumbnail fallback
function getYoutubeThumbnail(videoId: string, size: 'default' | 'medium' | 'high' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
  };
  return `https://i.ytimg.com/vi/${videoId}/${qualityMap[size]}.jpg`;
}

function extractYoutubeIdFromThumbUrl(url: string): string | null {
  // Matches:
  // - https://i.ytimg.com/vi/<id>/maxresdefault.jpg
  // - https://i.ytimg.com/vi/<id>/hqdefault.jpg
  // - https://img.youtube.com/vi/<id>/...
  const m = url.match(/(?:i\.ytimg\.com|img\.youtube\.com)\/vi\/([^/]+)\//i);
  return m?.[1] ?? null;
}

export const CinematicImage: React.FC<CinematicImageProps> = React.memo(function CinematicImage({
  src,
  alt,
  fallbackTitle,
  atmosphere = 'classic',
  aspectRatio = 'poster',
  className = '',
  imageType = 'movie',
  ...props
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'retrying' | 'failed'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [blurLoaded, setBlurLoaded] = useState(false);
  const [fallbackChain, setFallbackChain] = useState<string[]>([]);
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0);
  const retryTimerRef = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const cleanSrc = useMemo(() => {
    return src ? src.replace(/^url\(['"]?|['"]?\)$/g, '') : '';
  }, [src]);

  const isGradient = useMemo(() => {
    return !cleanSrc || cleanSrc.includes('gradient');
  }, [cleanSrc]);

  const palette = useMemo(() => {
    return GRADIENT_PALETTES[atmosphere.toLowerCase()] || GRADIENT_PALETTES.classic;
  }, [atmosphere]);

  // Generate fallback chain on mount
  useEffect(() => {
    const chain: string[] = [];
    if (cleanSrc) chain.push(cleanSrc);

    // YouTube maxres often 404s; add a quality ladder before generic fallbacks.
    const ytId = cleanSrc ? extractYoutubeIdFromThumbUrl(cleanSrc) : null;
    if (ytId) {
      chain.push(getYoutubeThumbnail(ytId, 'high'));
      chain.push(getYoutubeThumbnail(ytId, 'medium'));
      chain.push(getYoutubeThumbnail(ytId, 'default'));
    }

    chain.push(getImageFallback(imageType, 0));
    chain.push(getImageFallback(imageType, 1));

    const uniq = Array.from(new Set(chain.filter(Boolean)));
    const limited = uniq.slice(0, 6);
    setFallbackChain(limited);
  }, [cleanSrc, imageType]);

  useEffect(() => {
    if (isGradient) {
      setStatus('failed');
      return;
    }
    
    if (cleanSrc && fallbackChain.length > 0) {
      setStatus('loading');
      setRetryCount(0);
      setBlurLoaded(false);
      setCurrentFallbackIndex(0);
    } else {
      setStatus('failed');
    }

    return () => {
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
      }
    };
  }, [cleanSrc, isGradient, fallbackChain]);

  const triggerRetry = useCallback(() => {
    if (retryCount < fallbackChain.length - 1) {
      setStatus('retrying');
      setRetryCount((prev) => prev + 1);
      setCurrentFallbackIndex((prev) => prev + 1);
      
      const delay = (retryCount + 1) * 1000; // Exponential backoff
      retryTimerRef.current = window.setTimeout(() => {
        setStatus('loading');
      }, delay);
    } else {
      setStatus('failed');
    }
  }, [retryCount, fallbackChain.length]);

  const currentSrc = fallbackChain[currentFallbackIndex] || cleanSrc;

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
                  REEL {currentFallbackIndex + 1}/{fallbackChain.length}...
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BLUR-UP LOW-RES PLACEHOLDER */}
      {currentSrc && status !== 'failed' && (
        <div 
          className={`absolute inset-0 z-10 transition-opacity duration-700 bg-cover bg-center filter blur-lg ${
            blurLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ 
            backgroundImage: `url(${currentSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* ACTUAL IMAGE */}
      {currentSrc && status !== 'failed' && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            contain: 'layout style paint',
          }}
          onLoad={() => {
            setStatus('loaded');
            setBlurLoaded(true);
            setCachedImageStatus(currentSrc, true);
          }}
          onError={() => {
            if (currentFallbackIndex < fallbackChain.length - 1) {
              triggerRetry();
            } else {
              setStatus('failed');
            }
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
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
          style={{
            backgroundImage: palette.gradient,
          }}
        >
          {/* Neon atmospheric glow layer */}
          <div className="absolute inset-0 bg-black/40 mix-blend-overlay" />
          <div 
            className="absolute top-1/4 h-24 w-24 rounded-full filter blur-xl opacity-30 animate-pulse" 
            style={{ backgroundColor: palette.border, boxShadow: `0 0 30px ${palette.border}` }}
          />

          <div className="relative z-10 flex flex-col items-center max-w-full px-2">
            <div className="p-3 rounded-full bg-black/60 border border-white/10 shadow-xl mb-3 group-hover/img:scale-110 transition-transform duration-500">
              <Film 
                className="h-7 w-7 text-primary/80 filter drop-shadow-[0_0_8px_var(--primary)] animate-pulse" 
                style={{ color: palette.border }}
              />
            </div>
            
            <span className="font-retro text-[8px] uppercase tracking-widest text-white/60 mb-1">
              {atmosphere.toUpperCase()} MULTIVERSE
            </span>

            <h4 className="font-display font-black leading-tight text-white line-clamp-3 text-sm px-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
              {fallbackTitle || alt}
            </h4>

            {aspectRatio === 'poster' && (
              <p className="mt-2 text-[9px] font-retro text-white/70 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/10">
                PROJECTION REEL
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
});
