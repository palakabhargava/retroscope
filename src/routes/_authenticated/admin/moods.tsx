import { createFileRoute } from '@tanstack/react-router';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MOODS } from '@/data/movies';

export const Route = createFileRoute('/_authenticated/admin/moods')({ component: AdminMoods });

function AdminMoods() {
  const data = MOODS.map((m, i) => ({ name: m.label, watches: 80 + ((i * 37) % 200) }));
  return (
    <div className="p-8">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Mood engine —</p>
      <h1 className="font-display text-4xl font-black">Mood analytics</h1>
      <div className="mt-6 rounded-md border border-border bg-card p-5">
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.005 60)"/>
              <XAxis dataKey="name" stroke="oklch(0.80 0.02 80)" fontSize={11}/>
              <YAxis stroke="oklch(0.80 0.02 80)" fontSize={11}/>
              <Tooltip contentStyle={{ background: 'oklch(0.20 0.005 60)', border: '1px solid oklch(0.32 0.005 60)' }}/>
              <Bar dataKey="watches" fill="oklch(0.78 0.13 65)"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
