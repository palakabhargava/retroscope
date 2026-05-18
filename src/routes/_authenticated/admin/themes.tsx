import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/admin/themes')({ component: T });

const THEMES = [
  { id: 'classic', label: 'Classic Marquee', swatch: ['#FF8C42','#BC4749','#1B1B1B'] },
  { id: 'noir',    label: 'Midnight Noir',   swatch: ['#3A3A3A','#A62C2C','#0d0d0d'] },
  { id: 'sepia',   label: 'Sepia Reel',      swatch: ['#D4A373','#E76F51','#332722'] },
  { id: 'spring',  label: 'Spring Premiere', swatch: ['#7FB069','#FFB067','#2A2A2A'] },
];

function T() {
  const [active, setActive] = useState('classic');
  return (
    <div className="p-8">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Dynamic theme center —</p>
      <h1 className="font-display text-4xl font-black">Atmosphere control</h1>
      <p className="mt-1 text-muted-foreground">Switch the projector's color temperature. Affects ambient lighting across the platform.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {THEMES.map(t => (
          <button key={t.id} onClick={() => { setActive(t.id); toast.success(`Theme switched to ${t.label}`); }}
            className={`rounded-md border p-5 text-left transition ${active === t.id ? 'border-primary projector-glow' : 'border-border hover:border-primary/60'} bg-card`}>
            <div className="flex gap-2">
              {t.swatch.map(c => <span key={c} className="h-10 w-10 rounded-sm" style={{ background: c }}/>)}
            </div>
            <p className="mt-3 font-display text-lg font-bold">{t.label}</p>
            <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{active === t.id ? 'Active' : 'Activate'}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
