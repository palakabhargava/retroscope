import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/scheduler')({ component: S });

const slots = [
  { date: 'Sat 7:00 PM', title: 'Retro Night · Noir Marathon', tag: 'Featured' },
  { date: 'Sun 9:00 PM', title: 'Rainy Sunday Comfort Reels', tag: 'Collection' },
  { date: 'Wed 8:00 PM', title: 'Sci-Fi Premiere: Quasar Boulevard', tag: 'Banner' },
];

function S() {
  return (
    <div className="p-8">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Programming desk —</p>
      <h1 className="font-display text-4xl font-black">Content scheduler</h1>
      <div className="mt-6 space-y-3">
        {slots.map((s, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border border-border bg-card p-4">
            <div>
              <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{s.date}</p>
              <p className="font-display text-lg font-bold">{s.title}</p>
            </div>
            <span className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-primary">{s.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
