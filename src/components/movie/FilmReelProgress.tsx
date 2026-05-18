export function FilmReelProgress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative h-6 w-full">
      <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded-sm bg-black/60 film-strip">
        <div className="h-full bg-gradient-to-r from-primary via-hover-glow to-primary transition-all"
             style={{ width: `${v}%`, boxShadow: '0 0 24px oklch(0.74 0.16 50 / 0.6)' }} />
      </div>
    </div>
  );
}
