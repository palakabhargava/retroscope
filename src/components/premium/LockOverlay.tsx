import { Crown, Lock } from 'lucide-react';
import { Link } from '@tanstack/react-router';
export function LockOverlay({ feature }: { feature: string }) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center rounded-lg bg-background/85 backdrop-blur-md">
      <div className="text-center max-w-sm px-6">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <Lock size={22}/>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold">{feature}</h3>
        <p className="mt-1 text-sm text-muted-foreground">A RetroScope Gold feature. Upgrade to unlock the full cinematic experience.</p>
        <Link to="/subscription" className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow">
          <Crown size={14}/> Upgrade
        </Link>
      </div>
    </div>
  );
}
