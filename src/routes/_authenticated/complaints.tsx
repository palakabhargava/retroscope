import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/_authenticated/complaints')({ component: Complaints });

const CATS = ['Playback issue','UI issue','Account issue','Bug report','Feature request'];

interface Row { id: string; subject: string; body: string; status: string; admin_reply: string | null; created_at: string }

function Complaints() {
  const { authUser } = useAuth();
  const [cat, setCat] = useState(CATS[0]);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!authUser) return;
    const { data } = await supabase.from('complaints').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false });
    setItems((data as Row[]) ?? []);
  }
  useEffect(() => { void load(); }, [authUser]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!authUser) return;
    setBusy(true);
    const { error } = await supabase.from('complaints').insert({ user_id: authUser.id, subject: cat, body: text });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Complaint sent to the projection room');
    setText(''); setFile(null);
    void load();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Box office desk —</p>
      <h1 className="font-display text-4xl font-black">File a complaint</h1>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-md border border-border bg-card p-6">
        <div>
          <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Category</label>
          <select value={cat} onChange={e => setCat(e.target.value)}
            className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2">
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Describe the issue</label>
          <textarea required value={text} onChange={e => setText(e.target.value)} rows={5}
            className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"/>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-dashed border-border bg-background px-3 py-3 text-muted-foreground hover:border-primary hover:text-foreground">
          <Upload size={16}/> {file ? file.name : 'Attach a screenshot (optional)'}
          <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)}/>
        </label>
        <button disabled={busy} className="w-full rounded-sm bg-primary py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow disabled:opacity-60">{busy ? 'Sending…' : 'Submit'}</button>
      </form>

      <h2 className="mt-10 font-display text-2xl font-bold">Your tickets</h2>
      <div className="mt-4 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No complaints yet.</p>}
        {items.map(i => (
          <div key={i.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{i.subject} · {new Date(i.created_at).toLocaleDateString()}</p>
              <span className={`font-retro text-[10px] uppercase tracking-widest ${i.status === 'open' ? 'text-vintage-red' : 'text-success'}`}>{i.status}</span>
            </div>
            <p className="mt-2 text-sm">{i.body}</p>
            {i.admin_reply && (
              <div className="mt-3 rounded-sm border-l-2 border-primary bg-background/40 p-3">
                <p className="font-retro text-[10px] uppercase tracking-widest text-primary">— Projection desk replied</p>
                <p className="mt-1 text-sm">{i.admin_reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
