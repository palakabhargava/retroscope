import type { Movie } from '@/data/movies';
export function VintageTicket({ movie, watchedOn, mood, rating }: { movie: Movie; watchedOn: string; mood: string; rating: number }) {
  return (
    <div className="relative flex overflow-hidden rounded-md border border-border bg-card">
      <div className="absolute -left-2 top-1/2 grid -translate-y-1/2 gap-2">
        {Array.from({length: 6}).map((_, i) => <span key={i} className="block h-2 w-2 rounded-full bg-background"/>)}
      </div>
      <div className="absolute -right-2 top-1/2 grid -translate-y-1/2 gap-2">
        {Array.from({length: 6}).map((_, i) => <span key={i} className="block h-2 w-2 rounded-full bg-background"/>)}
      </div>
      <div className="w-32 shrink-0" style={{ backgroundImage: movie.poster, backgroundSize: 'cover' }} />
      <div className="flex-1 border-l border-dashed border-border p-4">
        <p className="font-retro text-[10px] uppercase tracking-widest text-primary">— RetroScope Admit One —</p>
        <h3 className="font-display text-lg font-bold leading-tight">{movie.title}</h3>
        <div className="mt-3 grid grid-cols-3 gap-2 font-retro text-[10px] uppercase tracking-widest text-muted-foreground">
          <div><span className="block text-foreground">{watchedOn}</span>Date</div>
          <div><span className="block text-foreground">{mood}</span>Mood</div>
          <div><span className="block text-primary">★ {rating}</span>You rated</div>
        </div>
      </div>
    </div>
  );
}
