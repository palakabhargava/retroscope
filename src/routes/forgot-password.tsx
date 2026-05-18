import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';

export const Route = createFileRoute('/forgot-password')({ component: Forgot });

function Forgot() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try { await resetPassword(email); setSent(true); }
    catch (ex: any) { setErr(ex?.message || 'Could not send reset link.'); }
    finally { setBusy(false); }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <ProjectorBeam />
      <div className="relative grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="font-display text-2xl font-black">RetroScope</Link>
          <p className="mt-3 font-retro text-xs uppercase tracking-[0.4em] text-primary">— Lost your ticket? —</p>
          {!sent ? (
            <form onSubmit={submit} className="mt-8 space-y-3 glass rounded-md p-6 text-left">
              <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"/>
              {err && <p className="text-sm text-vintage-red">{err}</p>}
              <button disabled={busy} className="w-full rounded-sm bg-primary py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow disabled:opacity-60">
                {busy ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          ) : (
            <div className="mt-8 glass rounded-md p-6">
              <p>If an account exists, a reset link has been threaded into your inbox.</p>
              <Link to="/login" className="mt-4 inline-block font-retro text-xs uppercase tracking-widest text-primary">← Back to sign in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
