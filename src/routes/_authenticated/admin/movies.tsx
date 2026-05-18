import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { MOVIES } from '@/data/movies';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/admin/movies')({ component: AdminMovies });

function AdminMovies() {
  const [list] = useState(MOVIES);
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Catalogue —</p>
          <h1 className="font-display text-4xl font-black">Movies</h1>
        </div>
        <button onClick={() => toast.info('Open Add Movie modal (demo)')} className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow">
          <Plus size={14}/> Add reel
        </button>
      </div>
      <div className="mt-6 overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-retro text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Atmosphere</th>
              <th className="px-4 py-3">Runtime</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map(m => (
              <tr key={m.id} className="border-b border-border/60 hover:bg-background/40">
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.year}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.atmosphere}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.runtime}m</td>
                <td className="px-4 py-3 text-primary">★ {m.rating}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toast.info('Edit (demo)')} className="mr-2 text-muted-foreground hover:text-primary"><Pencil size={14}/></button>
                  <button onClick={() => toast.error('Delete (demo)')} className="text-muted-foreground hover:text-vintage-red"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
