import { createFileRoute } from '@tanstack/react-router';
import { Check, Crown } from 'lucide-react';
import { PLANS } from '@/data/user';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export const Route = createFileRoute('/subscription')({ component: Sub });

function Sub() {
  const { user, setPlan, trialDaysLeft } = useAuth();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <p className="font-retro text-xs uppercase tracking-[0.4em] text-primary">— Choose your seat —</p>
        <h1 className="font-display text-5xl font-black">Subscription tiers</h1>
        <p className="mt-2 text-muted-foreground">No payment gateway in this demo. Just pick a tier and we'll dim the lights.</p>
        {user && trialDaysLeft > 0 && (
          <p className="mt-3 inline-block rounded-sm border border-primary/40 bg-primary/10 px-3 py-1 font-retro text-xs uppercase tracking-widest text-primary">
            Trial active · {trialDaysLeft} days left
          </p>
        )}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map(p => {
          const active = user?.plan === p.id;
          return (
            <div key={p.id} className={`relative flex flex-col rounded-md border p-6 ${p.highlight ? 'border-primary projector-glow' : 'border-border'} bg-card`}>
              {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-primary px-2 py-0.5 font-retro text-[10px] uppercase tracking-widest text-primary-foreground">Most popular</span>}
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{p.tagline}</p>
              <p className="mt-4 font-display text-4xl font-black text-primary">{p.price}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {p.perks.map(perk => (
                  <li key={perk} className="flex items-start gap-2"><Check size={14} className="mt-1 text-success"/> {perk}</li>
                ))}
              </ul>
              <button onClick={() => { setPlan(p.id); toast.success(`Switched to ${p.name}`); }}
                disabled={!user}
                className={`mt-6 w-full rounded-sm py-2.5 font-retro text-xs uppercase tracking-widest
                  ${active ? 'border border-primary text-primary' : 'bg-primary text-primary-foreground hover:bg-hover-glow'} disabled:opacity-50`}>
                {!user ? 'Sign in to switch' : active ? 'Current plan' : <span className="inline-flex items-center gap-1">{p.id !== 'free-reel' && <Crown size={12}/>} Choose</span>}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-14 rounded-md border border-border bg-card p-6">
        <h2 className="font-display text-2xl font-bold">Feature comparison</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-retro text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="py-2">Feature</th>
                {PLANS.map(p => <th key={p.id} className="py-2 px-3">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['Standard catalogue', [true, true, true, true]],
                ['Vintage tickets history', [false, true, true, true]],
                ['Movie Taste DNA', [false, false, true, true]],
                ['Scene Heatmap', [false, false, true, true]],
                ['Dynamic UI Adaptation', [false, false, true, true]],
                ['Director commentary', [false, false, false, true]],
              ].map(([label, vals]) => (
                <tr key={label as string} className="border-b border-border/60">
                  <td className="py-2.5">{label as string}</td>
                  {(vals as boolean[]).map((v, i) => (
                    <td key={i} className="py-2.5 px-3">{v ? <Check size={14} className="text-success"/> : <span className="text-muted-foreground">—</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
