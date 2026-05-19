import { supabaseAdmin } from '../../src/integrations/supabase/client.server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: user, error: authErr } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !user?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = user.user.id;
  const { data: roles } = await supabaseAdmin.from('user_roles').select('role').eq('user_id', userId);
  if (!roles?.some((r) => r.role === 'admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { title, body } = req.body || {};
  if (!title || !body) {
    return res.status(400).json({ error: 'Missing title or body' });
  }

  const { data: users, error } = await supabaseAdmin.from('profiles').select('id');
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const rows = (users ?? []).map((u: { id: string }) => ({
    user_id: u.id, title, body,
  }));

  if (rows.length === 0) {
    return res.status(200).json({ delivered: 0 });
  }

  const { error: insErr } = await supabaseAdmin.from('notifications').insert(rows);
  if (insErr) {
    return res.status(500).json({ error: insErr.message });
  }

  return res.status(200).json({ delivered: rows.length });
}
