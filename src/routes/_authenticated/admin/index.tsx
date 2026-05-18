import { createFileRoute } from '@tanstack/react-router';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp, Users, Film, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { adminAnalytics } from '@/lib/admin.functions';
import { MOVIES } from '@/data/movies';

export const Route = createFileRoute('/_authenticated/admin/')({ component: AdminHome });

const watchData = [
  { day: 'Mon', hours: 240 }, { day: 'Tue', hours: 280 }, { day: 'Wed', hours: 310 },
  { day: 'Thu', hours: 290 }, { day: 'Fri', hours: 410 }, { day: 'Sat', hours: 520 }, { day: 'Sun', hours: 480 },
];

const titleOf = (id: string) => MOVIES.find(m => m.id === id)?.title ?? id;

function AdminHome() {
  const fetchAnalytics = useServerFn(adminAnalytics);
  const [data, setData] = useState<{ members: number; openComplaints: number; totalPlays: number; top: { movie_id: string; plays: number }[] } | null>(null);

  useEffect(() => {
    fetchAnalytics().then(setData).catch(() => setData({ members: 0, openComplaints: 0, totalPlays: 0, top: [] }));
  }, [fetchAnalytics]);

  const stats = [
    { label: 'Members', value: data ? String(data.members) : '—', icon: Users },
    { label: 'Reels in catalogue', value: String(MOVIES.length), icon: Film },
    { label: 'Open complaints', value: data ? String(data.openComplaints) : '—', icon: MessageSquare },
    { label: 'Total plays', value: data ? String(data.totalPlays) : '—', icon: TrendingUp },
  ];
  const topData = (data?.top ?? []).map(t => ({ title: titleOf(t.movie_id).slice(0, 14), plays: t.plays }));
  return (
    <div className="p-8">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Projection room —</p>
      <h1 className="font-display text-4xl font-black">Analytics overview</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-md border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <s.icon size={16} className="text-primary"/>
            </div>
            <p className="mt-2 font-display text-3xl font-black text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-5">
          <h2 className="font-display text-xl font-bold">Watch hours · last 7 days <span className="ml-2 font-retro text-[10px] uppercase tracking-widest text-muted-foreground">demo trend</span></h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <LineChart data={watchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.005 60)"/>
                <XAxis dataKey="day" stroke="oklch(0.80 0.02 80)" fontSize={11}/>
                <YAxis stroke="oklch(0.80 0.02 80)" fontSize={11}/>
                <Tooltip contentStyle={{ background: 'oklch(0.20 0.005 60)', border: '1px solid oklch(0.32 0.005 60)' }}/>
                <Line dataKey="hours" stroke="oklch(0.65 0.16 35)" strokeWidth={2.5} dot={{ fill: 'oklch(0.65 0.16 35)' }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-5">
          <h2 className="font-display text-xl font-bold">Top reels · live</h2>
          <div className="mt-4 h-72">
            {topData.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">No watch_history rows yet — play a trailer to seed data.</div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={topData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.005 60)"/>
                  <XAxis dataKey="title" stroke="oklch(0.80 0.02 80)" fontSize={10}/>
                  <YAxis stroke="oklch(0.80 0.02 80)" fontSize={11}/>
                  <Tooltip contentStyle={{ background: 'oklch(0.20 0.005 60)', border: '1px solid oklch(0.32 0.005 60)' }}/>
                  <Bar dataKey="plays" fill="oklch(0.75 0.10 75)"/>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
