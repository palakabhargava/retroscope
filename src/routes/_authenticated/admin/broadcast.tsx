import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/broadcast')({ component: Broadcast });

function Broadcast() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, body })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Broadcast failed');
      }
      
      const data = await res.json();
      toast.success(`Broadcast delivered to ${data.delivered} member${data.delivered === 1 ? '' : 's'}`);
      setTitle(''); setBody('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Broadcast failed');
    } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Projection PA system —</p>
      <h1 className="font-display text-4xl font-black flex items-center gap-3"><Megaphone size={28} className="text-primary"/> Broadcast</h1>
      <p className="mt-2 text-sm text-muted-foreground">Drop a note into every member's lobby. One row per user is inserted into the notifications table.</p>
      <form onSubmit={send} className="mt-6 space-y-4 rounded-md border border-border bg-card p-6">
        <div>
          <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Title</label>
          <input required maxLength={120} value={title} onChange={e => setTitle(e.target.value)}
            className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"/>
        </div>
        <div>
          <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Body</label>
          <textarea required maxLength={2000} rows={5} value={body} onChange={e => setBody(e.target.value)}
            className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"/>
        </div>
        <button disabled={busy} className="w-full rounded-sm bg-primary py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow disabled:opacity-60">{busy ? 'Sending…' : 'Send to all members'}</button>
      </form>
    </div>
  );
}