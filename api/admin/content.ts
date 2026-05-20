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
        const { data, error } = await supabaseAdmin
          .from('content')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }

      case 'POST': {
        const payload = req.body;
        if (!payload.id || !payload.title || !payload.type || !payload.atmosphere || !payload.director || !payload.synopsis || !payload.tagline) {
          return res.status(400).json({ error: 'Missing required content fields' });
        }
        const { data, error } = await supabaseAdmin
          .from('content')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        return res.status(201).json(data);
      }

      case 'PUT': {
        const payload = req.body;
        if (!payload.id) {
          return res.status(400).json({ error: 'Missing content ID for update' });
        }
        const { id, ...updates } = payload;
        const { data, error } = await supabaseAdmin
          .from('content')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      case 'DELETE': {
        const { id } = req.query || {};
        const contentId = id || req.body?.id;
        if (!contentId) {
          return res.status(400).json({ error: 'Missing content ID for deletion' });
        }
        const { error } = await supabaseAdmin
          .from('content')
          .delete()
          .eq('id', contentId);
        if (error) throw error;
        return res.status(200).json({ success: true, id: contentId });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (err) {
    console.error('[Admin Content CRUD Error]', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
