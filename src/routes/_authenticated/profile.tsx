import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth';
import { MOODS } from '@/data/movies';
import { Crown } from 'lucide-react';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';

export const Route = createFileRoute('/_authenticated/profile')({ component: Profile });

function Profile() {
  const { user, trialDaysLeft, isPremium } = useAuth();
  if (!user) return null;
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border" style={{ background: 'linear-gradient(160deg, oklch(0.30 0.06 50), oklch(0.18 0.005 60))' }}>
        <ProjectorBeam />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-14 md:flex-row">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-primary font-display text-5xl font-black text-primary-foreground projector-glow">
            {user.username[0]?.toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Member of the Cinema Society —</p>
            <h1 className="mt-1 font-display text-4xl font-black">{user.username}</h1>
            <p className="text-muted-foreground">{user.bio}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-primary">DNA · {user.dnaType}</span>
              {isPremium ? (
                <span className="inline-flex items-center gap-1 rounded-sm border border-hover-glow/50 bg-hover-glow/10 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-hover-glow"><Crown size={10}/> {user.plan.replace('-', ' ')}</span>
              ) : trialDaysLeft > 0 ? (
                <span className="rounded-sm border border-primary/50 bg-primary/10 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-primary">Trial · {trialDaysLeft}d left</span>
              ) : (
                <span className="rounded-sm border border-border px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Free Reel</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-3">
        {[
          { label: 'Reels watched', value: user.watchStats.watched },
          { label: 'Hours in the booth', value: user.watchStats.hours },
          { label: 'Reviews written', value: user.watchStats.reviews },
        ].map(s => (
          <div key={s.label} className="rounded-md border border-border bg-card p-5">
            <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-4xl font-black text-primary">{s.value}</p>
          </div>
        ))}

        <div className="rounded-md border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-display text-xl font-bold">Mood history</h2>
          <div className="mt-4 space-y-2">
            {user.moodHistory.map(h => {
              const m = MOODS.find(x => x.id === h.mood);
              const max = Math.max(...user.moodHistory.map(x => x.count));
              return (
                <div key={h.mood} className="flex items-center gap-3">
                  <span className="w-32 font-retro text-xs uppercase tracking-widest text-muted-foreground">{m?.emoji} {m?.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-sm bg-background">
                    <div className="h-full bg-primary" style={{ width: `${(h.count/max)*100}%` }}/>
                  </div>
                  <span className="w-8 text-right font-retro text-xs text-foreground">{h.count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-5">
          <h2 className="font-display text-xl font-bold">Achievements</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {user.achievements.map(a => (
              <div key={a.id} className="rounded-sm border border-border bg-background p-3 text-center">
                <div className="text-2xl">{a.icon}</div>
                <p className="mt-1 font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
