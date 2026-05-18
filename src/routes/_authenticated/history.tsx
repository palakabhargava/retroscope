import { createFileRoute } from '@tanstack/react-router';
import { MOVIES, MOODS } from '@/data/movies';
import { VintageTicket } from '@/components/movie/VintageTicket';

export const Route = createFileRoute('/_authenticated/history')({ component: History });

function History() {
  const tickets = MOVIES.slice(0, 8).map((m, i) => ({
    movie: m,
    watchedOn: new Date(Date.now() - i * 3 * 86400000).toLocaleDateString(),
    mood: MOODS[i % MOODS.length].label,
    rating: 3 + ((i * 7) % 3),
  }));
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Ticket stubs —</p>
      <h1 className="font-display text-4xl font-black">Watch History</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {tickets.map((t, i) => <VintageTicket key={i} {...t} />)}
      </div>
    </div>
  );
}
