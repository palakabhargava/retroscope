// Image Optimization & Fallback System
export const IMAGE_FALLBACKS = {
  // Anime posters with neon aesthetic
  anime: [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=400&h=600&auto=format&fit=crop',
  ],
  // Movie posters
  movie: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&h=600&auto=format&fit=crop',
  ],
  // Cinematic banners
  banner: [
    'https://images.unsplash.com/photo-1554224311-beee415c15e7?q=80&w=1200&h=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&h=400&auto=format&fit=crop',
  ],
  // Trailer thumbnails
  thumbnail: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=320&h=180&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=320&h=180&auto=format&fit=crop',
  ],
  // Classic/retro aesthetic
  classic: [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&h=600&auto=format&fit=crop',
  ],
  // Kids/colorful content
  kids: [
    'https://images.unsplash.com/photo-1488398046169-890aedd3215f?q=80&w=400&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515179683826-fb28ca59cefd?q=80&w=400&h=600&auto=format&fit=crop',
  ],
  // Mature/dark aesthetic
  mature: [
    'https://images.unsplash.com/photo-1470114716159-e389f8712fda?q=80&w=400&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&h=600&auto=format&fit=crop',
  ],
};

// Gradient placeholders by atmosphere
export const GRADIENT_PALETTES: Record<string, { gradient: string; border: string }> = {
  anime: {
    gradient: 'linear-gradient(135deg, #0F1026 0%, #1E1035 25%, #8B00FF 50%, #0B0D19 75%, #FF00AA 100%)',
    border: 'rgba(255, 0, 170, 0.6)',
  },
  kids: {
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 25%, #38BDFF 50%, #030712 75%, #FF6B9D 100%)',
    border: 'rgba(56, 189, 248, 0.6)',
  },
  mature: {
    gradient: 'linear-gradient(135deg, #050505 0%, #1F0505 25%, #8B1515 50%, #000000 75%, #CC1515 100%)',
    border: 'rgba(204, 21, 21, 0.6)',
  },
  classic: {
    gradient: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 25%, #FF8C42 50%, #111111 75%, #FFB700 100%)',
    border: 'rgba(255, 140, 66, 0.6)',
  },
  thriller: {
    gradient: 'linear-gradient(135deg, #1A0000 0%, #2A0000 25%, #CC0000 50%, #000000 75%, #FF4444 100%)',
    border: 'rgba(255, 68, 68, 0.6)',
  },
  romance: {
    gradient: 'linear-gradient(135deg, #1F0C14 0%, #3D1525 25%, #FF69B4 50%, #0D0207 75%, #FFB6D9 100%)',
    border: 'rgba(255, 182, 217, 0.6)',
  },
  scifi: {
    gradient: 'linear-gradient(135deg, #02020A 0%, #0D0E1C 25%, #00FFFF 50%, #010103 75%, #60A5FA 100%)',
    border: 'rgba(96, 165, 250, 0.6)',
  },
  horror: {
    gradient: 'linear-gradient(135deg, #1A0000 0%, #330000 25%, #990000 50%, #000000 75%, #CC0000 100%)',
    border: 'rgba(204, 0, 0, 0.6)',
  },
};

export function getImageFallback(type: 'anime' | 'movie' | 'banner' | 'thumbnail' | 'classic' | 'kids' | 'mature' = 'movie', index = 0): string {
  const fallbacks = IMAGE_FALLBACKS[type] || IMAGE_FALLBACKS.movie;
  return fallbacks[index % fallbacks.length];
}

export function getGradientPalette(atmosphere: string): { gradient: string; border: string } {
  return GRADIENT_PALETTES[atmosphere.toLowerCase()] || GRADIENT_PALETTES.classic;
}

export function optimizeImageUrl(url: string | undefined, width: number = 400, height: number = 600): string {
  if (!url || url.includes('gradient')) return '';
  
  // Handle Unsplash URLs
  if (url.includes('unsplash.com')) {
    return `${url}?q=80&w=${width}&h=${height}&auto=format&fit=crop`;
  }
  
  // Handle imgur URLs
  if (url.includes('imgur.com')) {
    return url.replace('.jpg', `.jpg?w=${width}&h=${height}`);
  }
  
  return url;
}

export function generateBlurDataUrl(color: string): string {
  // Generate a minimal blur placeholder SVG
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='150'%3E%3Crect fill='${color.replace('#', '%23')}' width='100' height='150'/%3E%3C/svg%3E`;
}

// Preload images in background
export function preloadImages(urls: string[]): void {
  if (typeof window === 'undefined') return;
  
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

// Image caching with localStorage
const CACHE_KEY = 'retroscope_image_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getCachedImageStatus(url: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const cached = cache[url];
    
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.loaded;
    }
  } catch {
    // Ignore cache errors
  }
  return false;
}

export function setCachedImageStatus(url: string, loaded: boolean): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[url] = { loaded, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache errors
  }
}

// Responsive image size by screen
export function getResponsiveImageSize(basePath: string, width: number): string {
  return basePath.includes('?') 
    ? `${basePath}&w=${width}`
    : `${basePath}?w=${width}`;
}
