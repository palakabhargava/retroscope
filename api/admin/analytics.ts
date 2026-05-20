import { supabaseAdmin } from '../../src/integrations/supabase/client.server';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

  try {
    const [
      { count: members },
      { count: openComplaints },
      { count: totalPlays },
      { count: contentCount },
      { data: history }
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('complaints').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabaseAdmin.from('analytics').select('id', { count: 'exact', head: true }).eq('event_type', 'play'),
      supabaseAdmin.from('content').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('analytics').select('content_id').eq('event_type', 'play').limit(2000),
    ]);

    const counts = new Map<string, number>();
    (history ?? []).forEach((h: { content_id: string }) => {
      counts.set(h.content_id, (counts.get(h.content_id) ?? 0) + 1);
    });

    const topSorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    
    // Fetch content titles for top played items in parallel
    const top = await Promise.all(
      topSorted.map(async ([contentId, plays]) => {
        const { data } = await supabaseAdmin
          .from('content')
          .select('title')
          .eq('id', contentId)
          .maybeSingle();
        return {
          movie_id: contentId,
          title: data?.title || contentId,
          plays,
        };
      })
    );

    return res.status(200).json({
      members: members ?? 0,
      openComplaints: openComplaints ?? 0,
      totalPlays: totalPlays ?? 0,
      contentCount: contentCount ?? 0,
      top
    });
  } catch (err) {
    console.error('[Admin Analytics Error]', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
