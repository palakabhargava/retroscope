import { createFileRoute } from '@tanstack/react-router';
import { Check, Crown, Sparkles, Shield, Gift, Zap } from 'lucide-react';
import { PLANS } from '@/data/user';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { SEOHelper } from '@/components/layout/SEOHelper';

export const Route = createFileRoute('/subscription')({
  component: SubPage,
  head: () => ({
    meta: [
      { title: "Subscription Tiers & Ticket Plans — RetroScope" },
      { name: "description", content: "Choose your seat in the RetroScope cinematic universe. Highly tailored glassmorphic pricing models for cinephiles and directors." },
    ],
  }),
});

const PLAN_STYLES: Record<string, {
  cardClass: string;
  glowColor: string;
  badgeClass: string;
  badgeText: string;
  priceClass: string;
  buttonClass: string;
  titleClass: string;
  icon: any;
}> = {
  'free-reel': {
    cardClass: 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/60 shadow-[0_4px_30px_rgba(255,255,255,0.01)] backdrop-blur-md',
    glowColor: 'rgba(255, 255, 255, 0.02)',
    badgeClass: 'bg-zinc-800 border-zinc-700 text-zinc-400',
    badgeText: 'Standard Pass',
    priceClass: 'text-zinc-300',
    buttonClass: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]',
    titleClass: 'text-zinc-300',
    icon: Gift,
  },
  'cinevault': {
    cardClass: 'bg-amber-950/10 border-amber-900/40 hover:border-amber-600/60 shadow-[0_4px_30px_rgba(245,158,11,0.03)] shadow-[0_0_20px_rgba(245,158,11,0.05)] backdrop-blur-md',
    glowColor: 'rgba(245, 158, 11, 0.1)',
    badgeClass: 'bg-amber-950/60 border-amber-700/40 text-amber-400',
    badgeText: 'Most Popular',
    priceClass: 'text-amber-400 font-bold',
    buttonClass: 'bg-amber-600 text-slate-950 hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    titleClass: 'text-amber-400',
    icon: Sparkles,
  },
  'retroscope-gold': {
    cardClass: 'bg-yellow-950/15 border-yellow-700/30 hover:border-yellow-500/70 shadow-[0_4px_30px_rgba(234,179,8,0.05)] shadow-[0_0_30px_rgba(234,179,8,0.12)] backdrop-blur-md relative overflow-hidden',
    glowColor: 'rgba(234, 179, 8, 0.2)',
    badgeClass: 'bg-yellow-950/80 border-yellow-500/50 text-yellow-400 animate-pulse',
    badgeText: 'Luxury Gold',
    priceClass: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 font-black',
    buttonClass: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 hover:from-yellow-400 hover:to-amber-500 hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]',
    titleClass: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 font-bold',
    icon: Zap,
  },
  'directors-cut': {
    cardClass: 'bg-red-950/10 border-red-900/50 hover:border-red-600/80 shadow-[0_4px_30px_rgba(220,38,38,0.08)] shadow-[0_0_40px_rgba(220,38,38,0.2)] backdrop-blur-lg relative overflow-hidden',
    glowColor: 'rgba(220, 38, 38, 0.35)',
    badgeClass: 'bg-red-950 border-red-700 text-red-400 font-bold',
    badgeText: "Elite Selection",
    priceClass: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-500 font-black',
    buttonClass: 'bg-gradient-to-r from-red-800 via-red-900 to-red-950 text-white border border-red-600/30 hover:from-red-700 hover:to-red-800 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]',
    titleClass: 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600 font-bold',
    icon: Shield,
  }
};

function SubPage() {
  const { user, setPlan, trialDaysLeft } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 relative">
      <SEOHelper 
        title="Subscription Tiers & Seat Selection — RetroScope"
        description="Switch between luxury Free Reel, Cinevault, RetroScope Gold, and Director's Cut plans."
        canonicalPath="/subscription"
      />

      {/* Decorative Aura background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      <div className="text-center relative z-10">
        <p className="font-retro text-[10px] uppercase tracking-[0.4em] text-primary mb-2">— Choose your seat —</p>
        <h1 className="font-display text-5xl font-black text-white text-glow leading-none">Subscription tiers</h1>
        <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto">
          No payment gateway in this sandbox. Simply pick a seat tier, dim the theatre lamps, and start streaming instantly.
        </p>
        {user && trialDaysLeft > 0 && (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-retro text-[9px] uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" /> Trial Active · {trialDaysLeft} days left
          </p>
        )}
      </div>

      {/* Plan Grid */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
        {PLANS.map(p => {
          const active = user?.plan === p.id;
          const style = PLAN_STYLES[p.id] || PLAN_STYLES['free-reel'];
          const Icon = style.icon;

          return (
            <div 
              key={p.id} 
              className={`flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.03] ${style.cardClass}`}
            >
              {/* Luxury Ambient Glow Element */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none filter blur-[40px] opacity-40" 
                style={{ backgroundColor: style.glowColor }}
              />

              <div className="flex justify-between items-start mb-3">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-retro text-[8px] uppercase tracking-widest ${style.badgeClass}`}>
                  <Icon size={8} /> {style.badgeText}
                </span>
              </div>

              <h3 className={`font-display text-2xl tracking-tight leading-tight ${style.titleClass}`}>{p.name}</h3>
              <p className="font-retro text-[8px] uppercase tracking-wider text-zinc-400 mt-1">{p.tagline}</p>
              
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`font-display text-4xl leading-none ${style.priceClass}`}>{p.price}</span>
                {p.price !== '$0' && <span className="text-[10px] text-zinc-500 font-retro">/ MO</span>}
              </div>

              {/* Perks List */}
              <ul className="mt-6 flex-1 space-y-3 text-xs border-t border-white/5 pt-4 text-zinc-300">
                {p.perks.map(perk => (
                  <li key={perk} className="flex items-center gap-2 font-medium">
                    <Check size={13} className="text-emerald-500 shrink-0" /> 
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              {/* Switch Tier Button */}
              <button 
                onClick={() => { setPlan(p.id); toast.success(`Switched to ${p.name}`); }}
                disabled={!user}
                className={`mt-6 w-full rounded-lg py-3 font-retro text-[10px] uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer ${style.buttonClass}`}
              >
                {!user ? (
                  'Sign in to switch'
                ) : active ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold"><Crown size={10} /> Active Tier</span>
                ) : (
                  <span className="inline-flex items-center gap-1">Choose Plan</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-16 rounded-2xl border border-white/5 bg-[#0e0e0e]/80 p-6 backdrop-blur-md relative z-10">
        <h2 className="font-display text-2xl font-black text-white">Feature comparison</h2>
        <p className="text-xs text-zinc-400 mt-1">Detailed comparison across seat models and dashboard access limits.</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left font-retro text-[9px] uppercase tracking-wider text-zinc-400">
                <th className="py-3">Feature</th>
                {PLANS.map(p => <th key={p.id} className="py-3 px-3">{p.name}</th>)}
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
                <tr key={label as string} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 text-zinc-300 font-semibold">{label as string}</td>
                  {(vals as boolean[]).map((v, i) => (
                    <td key={i} className="py-3.5 px-3">
                      {v ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
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
