import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/admin/complaints')({ component: C });

interface Item { id: string; user_id: string; subject: string; body: string; status: string; admin_reply: string | null; created_at: string }

function C() {
  const [items, setItems] = useState<Item[]>([]);
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  async function load() {
    const { data, error } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    if (error) { toast.error(error.message); return; }
    setItems((data as Item[]) ?? []);
  }
  useEffect(() => { void load(); }, []);

  async function resolve(id: string) {
    const reply = replyDraft[id] || null;
    const { error } = await supabase.from('complaints').update({ status: 'resolved', admin_reply: reply }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Marked resolved');
    void load();
  }
  return (
    <div className="p-8">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Box office desk —</p>
      <h1 className="font-display text-4xl font-black">Complaint inbox</h1>
      <div className="mt-6 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">Inbox is empty.</p>}
        {items.map(i => (
          <div key={i.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{i.subject} · {i.user_id.slice(0,8)}</p>
              <span className={`font-retro text-[10px] uppercase tracking-widest ${i.status === 'open' ? 'text-vintage-red' : 'text-success'}`}>{i.status}</span>
            </div>
            <p className="mt-2 text-sm">{i.body}</p>
            {i.admin_reply && <p className="mt-2 text-xs text-muted-foreground italic">Reply: {i.admin_reply}</p>}
            {i.status === 'open' && (
              <div className="mt-3 space-y-2">
                <input
                  value={replyDraft[i.id] || ''}
                  onChange={e => setReplyDraft(d => ({ ...d, [i.id]: e.target.value }))}
                  placeholder="Reply (optional)…"
                  className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button onClick={() => resolve(i.id)} className="rounded-sm bg-primary px-3 py-1.5 font-retro text-[10px] uppercase tracking-widest text-primary-foreground hover:bg-hover-glow">Resolve {replyDraft[i.id] ? '& reply' : ''}</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
