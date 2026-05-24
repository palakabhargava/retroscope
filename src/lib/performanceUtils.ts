import React, { Suspense, ComponentType, ReactNode } from 'react';
import { motion } from 'framer-motion';

// Skeleton loaders for different component types
export const Skeleton = {
  Poster: () => (
    <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 animate-pulse rounded-md" />
  ),
  
  Banner: () => (
    <div className="w-full h-64 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 animate-pulse rounded-md" />
  ),
  
  Card: () => (
    <div className="p-4 space-y-3">
      <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2" />
    </div>
  ),
  
  Row: () => (
    <div className="space-y-4">
      <div className="h-6 bg-zinc-800 rounded animate-pulse w-1/4" />
      <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-32 h-48 flex-shrink-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse rounded-md" />
        ))}
      </div>
    </div>
  ),
  
  Text: ({ lines = 3 }: { lines?: number }) => (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-3 bg-zinc-800 rounded animate-pulse w-full" />
      ))}
    </div>
  ),
  
  Hero: () => (
    <div className="w-full h-[60vh] bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 animate-pulse" />
  ),
};

// Suspense wrapper with loading state
interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({ 
  children, 
  fallback = <Skeleton.Row /> 
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Lazy load image with skeleton
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  skeleton?: boolean;
}

export const LazyImage = React.memo(React.forwardRef<HTMLImageElement, LazyImageProps>(
  ({ src, alt, skeleton = true, className = '', ...props }, ref) => {
    const [loaded, setLoaded] = React.useState(false);
    
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {!loaded && skeleton && <Skeleton.Banner />}
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      </div>
    );
  }
));

LazyImage.displayName = 'LazyImage';

// Animated route transition wrapper
interface AnimatedPageProps {
  children: ReactNode;
  direction?: 'in' | 'out';
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ 
  children, 
  direction = 'in' 
}) => (
  <motion.div
    initial={{ opacity: 0, y: direction === 'in' ? 20 : -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: direction === 'out' ? 20 : -20 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// Memoized list renderer for performance
interface MemoListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
  virtualized?: boolean;
}

export const MemoList = React.memo(function MemoList<T>({
  items,
  renderItem,
  keyExtractor,
  className = 'flex gap-4',
  virtualized = false,
}: MemoListProps<T>) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <React.Fragment key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
});

// Dynamic import with loading fallback
export async function dynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: T
): Promise<T> {
  try {
    const module = await importFn();
    return module.default;
  } catch (error) {
    console.error('Dynamic import failed:', error);
    if (fallback) return fallback;
    throw error;
  }
}

// Route prefetching utility
const prefetchQueue = new Set<string>();
const prefetchLimit = 3;

export function prefetchRoute(path: string): void {
  if (typeof window === 'undefined' || prefetchQueue.size >= prefetchLimit) return;
  
  if (!prefetchQueue.has(path)) {
    prefetchQueue.add(path);
    
    // Prefetch using requestIdleCallback for low priority
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        document.head.appendChild(link);
      });
    } else {
      // Fallback to setTimeout
      setTimeout(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        document.head.appendChild(link);
      }, 2000);
    }
  }
}

// Batch state updates for performance
export function batchStateUpdates(updates: Array<() => void>): void {
  if ('unstable_batchedUpdates' in React) {
    (React as any).unstable_batchedUpdates(() => {
      updates.forEach(update => update());
    });
  } else {
    updates.forEach(update => update());
  }
}

// Debounce hook for expensive operations
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Throttle hook for scroll/resize listeners
export function useThrottle<T>(value: T, delay: number = 100): T {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRanRef = React.useRef(Date.now());
  
  React.useEffect(() => {
    const now = Date.now();
    
    if (now >= (lastRanRef.current + delay)) {
      lastRanRef.current = now;
      setThrottledValue(value);
    } else {
      const handler = setTimeout(() => {
        lastRanRef.current = Date.now();
        setThrottledValue(value);
      }, delay - (now - lastRanRef.current));
      
      return () => clearTimeout(handler);
    }
  }, [value, delay]);
  
  return throttledValue;
}
