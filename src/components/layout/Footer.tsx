import { Link } from '@tanstack/react-router';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-3">
          <span className="font-display text-2xl font-black tracking-tight">RetroScope</span>
          <p className="font-retro text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            A demo cinematic OTT — no movies actually play.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-retro text-[10px] uppercase tracking-widest text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground hover:underline transition">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground hover:underline transition">Privacy</Link>
            <Link to="/guidelines" className="hover:text-foreground hover:underline transition">Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
