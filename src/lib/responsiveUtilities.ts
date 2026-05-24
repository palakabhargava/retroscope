// Tailwind breakpoints
export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const BREAKPOINT_PIXELS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Responsive grid classes for different sections
export const RESPONSIVE_GRID = {
  // Movie posters grid
  posters: 'grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
  
  // Shelf/carousel items
  shelf: 'flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide',
  
  // Feature grid (2-3 columns)
  features: 'grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  
  // Info cards
  cards: 'grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  
  // Metadata / stats
  stats: 'grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  
  // Full width
  full: 'w-full',
};

// Responsive padding utilities
export const RESPONSIVE_PADDING = {
  container: 'px-4 sm:px-6 md:px-8 lg:px-12',
  section: 'px-4 sm:px-6 md:px-8',
  card: 'p-3 sm:p-4 md:p-6',
  tight: 'p-2 sm:p-3',
};

// Responsive typography scales
export const RESPONSIVE_TEXT = {
  h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold',
  h3: 'text-lg sm:text-xl md:text-2xl font-bold',
  h4: 'text-base sm:text-lg md:text-xl font-semibold',
  body: 'text-sm sm:text-base md:text-base',
  small: 'text-xs sm:text-sm',
  tiny: 'text-[10px] sm:text-xs',
};

// Responsive height utilities
export const RESPONSIVE_SIZES = {
  heroSmall: 'h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]',
  heroLarge: 'h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]',
  headerHeight: 'h-16 sm:h-20 md:h-24',
  navHeight: 'h-20 sm:h-24',
};

// Mobile-first button sizing
export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm',
  md: 'px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base',
  lg: 'px-5 py-3 sm:px-6 sm:py-3 text-base sm:text-lg',
  touch: 'px-4 py-3 sm:px-5 sm:py-3 min-h-[44px] min-w-[44px]', // iOS/Android touch target
};

// Safe spacing for notch-aware layouts
export const SAFE_SPACING = {
  top: 'pt-safe sm:pt-0',
  bottom: 'pb-safe sm:pb-0',
  left: 'pl-safe sm:pl-0',
  right: 'pr-safe sm:pr-0',
};

// Z-index scale for layering
export const Z_INDEX = {
  hidden: -1,
  ground: 0,
  base: 1,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  tooltip: 50,
  notification: 60,
  debug: 100,
} as const;

// Common responsive classes combinations
export const RESPONSIVE_CLASSES = {
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8',
  heroContainer: 'relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden',
  cardContainer: 'p-3 sm:p-4 md:p-6 rounded-md border border-border',
  gridContainer: 'grid gap-3 sm:gap-4 md:gap-6 auto-rows-auto',
};
