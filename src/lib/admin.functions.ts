import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

// Broadcast a notification to every user. Admin-only.
export const broadcastNotification = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      title: z.string().min(1).max(120),
      body: z.string().min(1).max(2000),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context;
    const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', userId);
    if (!roles?.some((r) => r.role === 'admin')) {
      throw new Error('Forbidden: admin only');
    }
    const { data: users, error } = await supabaseAdmin.from('profiles').select('id');
    if (error) throw error;
    const rows = (users ?? []).map((u: { id: string }) => ({
      user_id: u.id, title: data.title, body: data.body,
    }));
    if (rows.length === 0) return { delivered: 0 };
    const { error: insErr } = await supabaseAdmin.from('notifications').insert(rows);
    if (insErr) throw insErr;
    return { delivered: rows.length };
  });

// Seed the demo admin: admin@retroscope.app / Admin1234!
export const seedDemoAdmin = createServerFn({ method: 'POST' }).handler(async () => {
  const email = 'admin@retroscope.app';
  const password = 'Admin1234!';
  // Try to find existing user
  const { data: list } = await supabaseAdmin.auth.admin.listUsers();
  let userId = list?.users.find((u) => u.email === email)?.id;
  if (!userId) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { username: 'projection_admin' },
    });
    if (error) throw error;
    userId = data.user?.id;
  }
  if (!userId) throw new Error('Could not resolve admin user id');
  // Grant admin role (idempotent — unique constraint protects)
  const { data: existing } = await supabaseAdmin
    .from('user_roles').select('id').eq('user_id', userId).eq('role', 'admin').maybeSingle();
  if (!existing) {
    await supabaseAdmin.from('user_roles').insert({ user_id: userId, role: 'admin' });
  }
  return { email, password, userId };
});

// Aggregate analytics for the admin dashboard.
export const adminAnalytics = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context;
    const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', userId);
    if (!roles?.some((r) => r.role === 'admin')) throw new Error('Forbidden');
    const [{ count: members }, { count: openComplaints }, { count: totalPlays }, { data: history }] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('complaints').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabaseAdmin.from('watch_history').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('watch_history').select('movie_id, progress_pct').limit(1000),
    ]);
    const counts = new Map<string, number>();
    (history ?? []).forEach((h: { movie_id: string }) => counts.set(h.movie_id, (counts.get(h.movie_id) ?? 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([movie_id, plays]) => ({ movie_id, plays }));
    return { members: members ?? 0, openComplaints: openComplaints ?? 0, totalPlays: totalPlays ?? 0, top };
  });