import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';

export const Route = createFileRoute('/login')({
  component: Login,
  head: () => ({
    meta: [
      { title: "Sign in — RetroScope" },
      { name: "description", content: "Sign in to RetroScope to access your watchlist, Movie Taste DNA, and mood-based picks." },
      { property: "og:title", content: "Sign in — RetroScope" },
      { property: "og:description", content: "Return to the projection booth and pick up where you left off." },
      { property: "og:url", content: "/login" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
});

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try { await login(email, password); nav({ to: '/' }); }
    catch (ex: any) { setErr(ex?.message || 'Could not sign in. The projector is jammed.'); }
    finally { setBusy(false); }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <ProjectorBeam />
      <DustParticles count={50}/>
      <div className="relative grid min-h-screen place-items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-primary font-display text-xl font-black text-primary-foreground">R</span>
              <span className="font-display text-2xl font-black">RetroScope</span>
            </Link>
            <p className="mt-3 font-retro text-xs uppercase tracking-[0.4em] text-primary">— Welcome back to the booth —</p>
          </div>
          <form onSubmit={submit} className="mt-8 space-y-4 glass rounded-md p-6">
            <div>
              <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
                className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"/>
            </div>
            <div>
              <label className="font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={6}
                className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"/>
            </div>
            {err && <p className="text-sm text-vintage-red">{err}</p>}
            <button disabled={busy} type="submit"
              className="w-full rounded-sm bg-primary py-3 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow disabled:opacity-60">
              {busy ? 'Threading the reel…' : 'Sign in'}
            </button>
            <div className="flex items-center justify-between font-retro text-[10px] uppercase tracking-widest text-muted-foreground pt-2">
              <Link to="/forgot-password" className="hover:text-primary">Forgot password</Link>
              <Link to="/signup" className="hover:text-primary">Create account →</Link>
            </div>
            
            {/* Quick Demo Access */}
            <div className="mt-6 border-t border-border/60 pt-4 text-center">
              <p className="font-retro text-[10px] uppercase tracking-[0.2em] text-primary mb-3">— Recruiter Quick Access —</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await login('admin@retroscope.app', 'admin123');
                      nav({ to: '/' });
                    } catch (_) {}
                    finally { setBusy(false); }
                  }}
                  className="rounded-sm border border-amber-500/40 bg-amber-950/20 px-3 py-2 text-left font-retro text-[9px] uppercase tracking-widest text-amber-400 hover:bg-amber-500/20 transition-all hover:border-amber-500"
                >
                  👑 Demo Admin
                  <span className="block text-[7px] text-amber-500/60 lowercase mt-0.5 tracking-normal">operations console</span>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await login('guest@retroscope.app', 'guest123');
                      nav({ to: '/' });
                    } catch (_) {}
                    finally { setBusy(false); }
                  }}
                  className="rounded-sm border border-sky-500/40 bg-sky-950/20 px-3 py-2 text-left font-retro text-[9px] uppercase tracking-widest text-sky-400 hover:bg-sky-500/20 transition-all hover:border-sky-500"
                >
                  🍿 Demo User
                  <span className="block text-[7px] text-sky-500/60 lowercase mt-0.5 tracking-normal">cinematic catalog</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
