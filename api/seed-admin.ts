import { supabaseAdmin } from '../src/integrations/supabase/client.server';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = 'admin@retroscope.app';
  const password = 'Admin1234!';
  
  try {
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
    
    const { data: existing } = await supabaseAdmin
      .from('user_roles').select('id').eq('user_id', userId).eq('role', 'admin').maybeSingle();
      
    if (!existing) {
      await supabaseAdmin.from('user_roles').insert({ user_id: userId, role: 'admin' });
    }
    
    return res.status(200).json({ email, password, userId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
