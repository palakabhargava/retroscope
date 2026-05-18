import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';

export const Route = createFileRoute('/reset-password')({ component: ResetPassword });

function ResetPassword() {
  const nav = useNavigate();
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      setOk(true);
      setTimeout(() => nav({ to: '/' }), 1200);
    } catch (ex: any) {
      setErr(ex?.message || 'Could not update password.');
    } finally { setBusy(false); }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <ProjectorBeam />
      <div className="relative grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="font-display text-2xl font-black">RetroScope</Link>
          <p className="mt-3 font-retro text-xs uppercase tracking-[0.4em] text-primary">— Set a new password —</p>
          {ok ? (
            <div className="mt-8 glass rounded-md p-6">
              <p>Password updated. Threading you back to the lobby…</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-3 glass rounded-md p-6 text-left">
              <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">New password</label>
              <input required type="password" minLength={6} value={pw} onChange={e => setPw(e.target.value)}
                className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"/>
              {err && <p className="text-sm text-vintage-red">{err}</p>}
              <button disabled={busy} className="w-full rounded-sm bg-primary py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow disabled:opacity-60">
                {busy ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
