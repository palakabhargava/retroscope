import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';

export const Route = createFileRoute('/signup')({
  component: Signup,
  head: () => ({
    meta: [
      { title: "Create your RetroScope ticket" },
      { name: "description", content: "Reserve your seat at RetroScope. 15-day Gold trial, mood discovery, scene heatmaps." },
      { property: "og:title", content: "Create your RetroScope ticket" },
      { property: "og:description", content: "Join the cinematic discovery experience — free 15-day trial." },
      { property: "og:url", content: "/signup" },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
});

function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [u, setU] = useState(''); const [e, setE] = useState(''); const [p, setP] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setBusy(true); setErr('');
    try {
      await signup(u, e, p);
      setOk(true);
      setTimeout(() => nav({ to: '/' }), 1200);
    } catch (ex: any) {
      setErr(ex?.message || 'Could not create your account.');
    } finally { setBusy(false); }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <ProjectorBeam />
      <div className="relative grid min-h-screen place-items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Link to="/" className="font-display text-2xl font-black">RetroScope</Link>
            <p className="mt-3 font-retro text-xs uppercase tracking-[0.4em] text-primary">— Reserve your seat —</p>
          </div>
          {ok ? (
            <div className="mt-8 glass rounded-md p-6 text-center">
              <p className="font-display text-lg">Ticket printed.</p>
              <p className="mt-2 text-sm text-muted-foreground">Threading you into the lobby…</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-4 glass rounded-md p-6">
              <div>
                <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Username</label>
                <input required type="text" value={u} onChange={ev => setU(ev.target.value)}
                  className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"/>
              </div>
              <div>
                <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
                <input required type="email" value={e} onChange={ev => setE(ev.target.value)}
                  className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"/>
              </div>
              <div>
                <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
                <input required type="password" minLength={6} value={p} onChange={ev => setP(ev.target.value)}
                  className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"/>
              </div>
              {err && <p className="text-sm text-vintage-red">{err}</p>}
              <button disabled={busy} type="submit" className="w-full rounded-sm bg-primary py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow disabled:opacity-60">
                {busy ? 'Printing your ticket…' : 'Create account'}
              </button>
              <p className="text-center font-retro text-[10px] uppercase tracking-widest text-muted-foreground">
                Already a member? <Link to="/login" className="text-primary">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
