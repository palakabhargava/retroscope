import { createFileRoute } from '@tanstack/react-router';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

// One-time idempotent demo admin seeder. Hit once with curl after deploy.
// Email: admin@retroscope.app   Password: Admin1234!
export const Route = createFileRoute('/api/public/seed-admin')({
  server: {
    handlers: {
      GET: async () => {
        const email = 'admin@retroscope.app';
        const password = 'Admin1234!';
        const { data: list } = await supabaseAdmin.auth.admin.listUsers();
        let userId = list?.users.find(u => u.email === email)?.id;
        if (!userId) {
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email, password, email_confirm: true,
            user_metadata: { username: 'projection_admin' },
          });
          if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
          userId = data.user?.id;
        }
        if (!userId) return Response.json({ ok: false, error: 'no user id' }, { status: 500 });
        const { data: existing } = await supabaseAdmin
          .from('user_roles').select('id').eq('user_id', userId).eq('role', 'admin').maybeSingle();
        if (!existing) {
          await supabaseAdmin.from('user_roles').insert({ user_id: userId, role: 'admin' });
        }
        return Response.json({ ok: true, email, password, userId });
      },
    },
  },
});