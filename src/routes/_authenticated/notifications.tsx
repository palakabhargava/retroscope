import { createFileRoute } from '@tanstack/react-router';
import { Bell, Megaphone, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/_authenticated/notifications')({ component: Notifs });

interface N { id: string; title: string; body: string; read: boolean; created_at: string }

function Notifs() {
  const { authUser } = useAuth();
  const [items, setItems] = useState<N[]>([]);

  async function load() {
    if (!authUser) return;
    const { data } = await supabase.from('notifications').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false });
    setItems((data as N[]) ?? []);
  }
  useEffect(() => { void load(); }, [authUser]);

  async function markRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    void load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Lobby announcements —</p>
      <h1 className="font-display text-4xl font-black">Notifications</h1>
      <div className="mt-6 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No notifications yet. Broadcasts from the projection room will appear here.</p>}
        {items.map(n => (
          <div key={n.id} className={`flex items-start gap-4 rounded-md border border-border bg-card p-4 ${n.read ? 'opacity-60' : ''}`}>
            <span className="mt-1 text-primary"><Megaphone size={18}/></span>
            <div className="flex-1">
              <p className="font-display text-base font-bold">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.body}</p>
              <p className="mt-1 font-retro text-[10px] uppercase tracking-widest text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
            </div>
            {!n.read && (
              <button onClick={() => markRead(n.id)} className="text-muted-foreground hover:text-primary" title="Mark as read"><Check size={16}/></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
