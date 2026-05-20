import { supabaseAdmin } from '../../src/integrations/supabase/client.server';

export default async function handler(req, res) {
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

  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const { status } = req.query || {};
        let query = supabaseAdmin
          .from('reviews')
          .select(`
            *,
            profiles:user_id (username, avatar_seed),
            content:content_id (title, type)
          `)
          .order('created_at', { ascending: false });

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return res.status(200).json(data);
      }

      case 'PUT': {
        const { id, status } = req.body || {};
        if (!id || !status) {
          return res.status(400).json({ error: 'Missing review ID or moderation status' });
        }
        if (!['approved', 'pending', 'rejected'].includes(status)) {
          return res.status(400).json({ error: 'Invalid moderation status' });
        }
        const { data, error } = await supabaseAdmin
          .from('reviews')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      case 'DELETE': {
        const { id } = req.query || {};
        const reviewId = id || req.body?.id;
        if (!reviewId) {
          return res.status(400).json({ error: 'Missing review ID' });
        }
        const { error } = await supabaseAdmin
          .from('reviews')
          .delete()
          .eq('id', reviewId);
        if (error) throw error;
        return res.status(200).json({ success: true, id: reviewId });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (err) {
    console.error('[Admin Reviews Moderation Error]', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
