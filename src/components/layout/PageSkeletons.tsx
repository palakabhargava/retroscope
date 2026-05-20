import { Skeleton } from '@/components/ui/skeleton';

// 1. Skeleton for Home page
export function HomeSkeleton() {
  return (
    <div className="w-full bg-background min-h-screen text-foreground pb-20 space-y-16">
      {/* Giant Hero Banner Shimmer */}
      <div className="relative h-[78vh] min-h-[520px] w-full bg-black/40 border-b border-border/40 overflow-hidden flex items-end px-6 pb-16">
        <div className="w-full max-w-2xl bg-black/25 p-6 rounded-md backdrop-blur-md border border-white/5 space-y-4">
          <Skeleton className="h-4 w-48 bg-white/10" />
          <Skeleton className="h-16 w-3/4 bg-white/10" />
          <Skeleton className="h-8 w-5/6 bg-white/10" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 w-36 bg-primary/20" />
            <Skeleton className="h-10 w-44 bg-white/10" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-16 px-4">
        {/* Mood Selector Row */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28 bg-white/5" />
            <Skeleton className="h-8 w-80 bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-md border border-border/40 bg-card/45 p-3 flex flex-col justify-between">
                <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                <Skeleton className="h-4 w-3/4 bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Poster Carousels (3 rows) */}
        {Array.from({ length: 3 }).map((_, rIdx) => (
          <div key={rIdx} className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-white/10" />
              <Skeleton className="h-3 w-36 bg-white/5" />
            </div>
            <div className="flex gap-5 overflow-hidden">
              {Array.from({ length: 7 }).map((_, cIdx) => (
                <div key={cIdx} className="shrink-0 space-y-3">
                  <Skeleton className="w-44 h-64 bg-card/65 border border-border/30 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Skeleton for Spotlight/Trending/TopRated rows list
export function SpotlightSkeleton() {
  return (
    <div className="w-full bg-background min-h-screen text-foreground pb-20 space-y-12">
      {/* Featured Banner Shimmer */}
      <div className="relative h-[65vh] min-h-[480px] w-full bg-black/40 border-b border-border/40 overflow-hidden flex items-end px-6 pb-12">
        <div className="w-full max-w-2xl bg-black/25 p-6 rounded-md backdrop-blur-md border border-white/5 space-y-4">
          <Skeleton className="h-4 w-40 bg-white/10" />
          <Skeleton className="h-14 w-2/3 bg-white/10" />
          <Skeleton className="h-10 w-full bg-white/10" />
          <Skeleton className="h-10 w-32 bg-primary/20 mt-2" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 mt-12 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32 bg-white/5" />
          <Skeleton className="h-8 w-72 bg-white/10" />
          <Skeleton className="h-4 w-96 bg-white/5" />
        </div>

        {/* 6 Spotlight items row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative flex items-center gap-4 bg-card/35 border border-border/30 rounded-md p-4">
              <Skeleton className="shrink-0 w-32 h-48 bg-white/5 rounded-md" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-3 w-16 bg-primary/20" />
                <Skeleton className="h-5 w-40 bg-white/10" />
                <Skeleton className="h-3 w-28 bg-white/5" />
                <Skeleton className="h-8 w-full bg-white/5" />
                <Skeleton className="h-3 w-20 bg-primary/10 pt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Skeleton for Content Detail Page
export function MovieDetailSkeleton() {
  return (
    <div className="w-full bg-background min-h-screen text-foreground space-y-12">
      {/* Banner Backdrop Shimmer */}
      <div className="relative h-[70vh] min-h-[460px] w-full bg-black/40 overflow-hidden flex items-end px-6 pb-12">
        <div className="relative mx-auto flex h-full max-w-7xl items-end gap-8 w-full">
          <Skeleton className="hidden md:block h-72 w-48 shrink-0 bg-white/10 rounded-md border border-white/5" />
          <div className="max-w-2xl w-full space-y-4">
            <Skeleton className="h-4 w-52 bg-white/10" />
            <Skeleton className="h-16 w-3/4 bg-white/15" />
            <Skeleton className="h-4 w-40 bg-white/10 italic" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-3 w-28 bg-primary/20" />
              <Skeleton className="h-3 w-20 bg-white/10" />
              <Skeleton className="h-3 w-32 bg-white/10" />
            </div>
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-11 w-36 bg-primary/20" />
              <Skeleton className="h-11 w-11 bg-white/10" />
              <Skeleton className="h-11 w-11 bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid structure */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32 bg-white/10" />
            <Skeleton className="h-20 w-full bg-white/5" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-24 bg-white/10" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 bg-white/5 rounded-sm" />
              ))}
            </div>
            <Skeleton className="h-3 w-40 bg-white/5 pt-1" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-36 bg-white/10" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-sm border border-border/30 bg-card/25 px-3 py-2">
                <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                <Skeleton className="h-3 w-12 bg-white/10" />
                <Skeleton className="h-4 w-60 bg-white/5" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-6">
          <div className="bg-card/25 border border-border/30 rounded-md p-5 space-y-3">
            <Skeleton className="h-5 w-24 bg-white/10" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 bg-primary/10" />
              <Skeleton className="h-6 w-24 bg-primary/10" />
            </div>
          </div>
          <div className="bg-card/25 border border-border/30 rounded-md p-5 space-y-3">
            <Skeleton className="h-5 w-36 bg-white/10" />
            <Skeleton className="h-3 w-48 bg-white/5" />
            <div className="flex gap-2 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 bg-white/10 rounded-sm" />
              ))}
            </div>
          </div>
          <div className="bg-card/25 border border-border/30 rounded-md p-5 space-y-4">
            <Skeleton className="h-5 w-32 bg-white/10" />
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-8 bg-white/5 rounded-sm" />
              <Skeleton className="h-8 w-8 bg-primary/20 rounded-sm" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border-b border-border/20 pb-3">
                  <Skeleton className="h-3 w-24 bg-primary/15" />
                  <Skeleton className="h-8 w-full bg-white/5 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
