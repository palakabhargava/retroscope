import { createFileRoute } from '@tanstack/react-router';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/lib/auth';
import { LockOverlay } from '@/components/premium/LockOverlay';

export const Route = createFileRoute('/_authenticated/dna')({ component: DNA });

const data = [
  { axis: 'Plot Twist', value: 92 },
  { axis: 'Comfort', value: 64 },
  { axis: 'Classic', value: 71 },
  { axis: 'Thriller', value: 88 },
  { axis: 'Emotional', value: 76 },
  { axis: 'Indie', value: 58 },
];

function DNA() {
  const { user, isPremium } = useAuth();
  return (
    <div className="relative mx-auto max-w-5xl px-4 py-10">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Movie Taste DNA —</p>
      <h1 className="font-display text-4xl font-black">Your cinematic personality</h1>

      <div className="relative mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-md border border-border bg-card p-6">
          <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Profile</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-primary text-glow">{user?.dnaType}</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer>
              <RadarChart data={data}>
                <PolarGrid stroke="oklch(0.32 0.005 60)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: 'oklch(0.80 0.02 80)', fontSize: 11 }} />
                <Radar dataKey="value" stroke="oklch(0.74 0.16 50)" fill="oklch(0.74 0.16 50)" fillOpacity={0.45}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Most-watched mood', value: 'Night Vibes' },
            { label: 'Favorite decade', value: '1980s' },
            { label: 'Avg. session', value: '1h 47m' },
            { label: 'Replay rate', value: '23%' },
          ].map(s => (
            <div key={s.label} className="rounded-md border border-border bg-card p-4">
              <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
        {!isPremium && <LockOverlay feature="Movie Taste DNA"/>}
      </div>
    </div>
  );
}
