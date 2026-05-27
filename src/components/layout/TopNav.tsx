import { Link, useRouterState } from '@tanstack/react-router';
import { Search, User, LogOut, Crown } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function TopNav() {
  const { isAuthenticated, user, logout, trialDaysLeft, isPremium } = useAuth();
  const path = useRouterState({ select: s => s.location.pathname });
  const links: Array<[string, string]> = [
    ['/', 'Home'],
    ['/search', 'Browse'],
    ['/web-series', 'Series'],
    ['/documentaries', 'Docs'],
    ['/short-films', 'Shorts'],
    ['/trending', 'Trending'],
    ['/top-rated', 'Top Rated'],
    ['/upcoming', 'Upcoming'],
    ['/subscription', 'Plans'],
  ];
  const authedLinks: Array<[string, string]> = isAuthenticated ? [
    ['/watchlist', 'Shelf'],
    ['/history', 'Tickets'],
    ['/dna', 'DNA'],
  ] : [];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 pt-safe">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-primary font-display text-lg font-black text-primary-foreground">R</span>
          <span className="font-display text-xl font-black tracking-tight">RetroScope</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {[...links, ...authedLinks].map(([to, label]) => (
            <Link key={to} to={to}
              className={`rounded-sm px-3 py-1.5 font-retro text-xs uppercase tracking-widest transition
                ${path === to ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/search" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground"><Search size={16}/></Link>
          <Link to="/mature" className="hidden md:inline rounded-sm border border-red-900/40 bg-red-950/15 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-950/25 hover:border-red-700/50 transition">
            18+
          </Link>
          {isAuthenticated && trialDaysLeft > 0 && !isPremium && (
            <span className="hidden md:inline rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-primary">
              Trial · {trialDaysLeft}d
            </span>
          )}
          {isPremium && (
            <span className="hidden md:inline-flex items-center gap-1 rounded-sm border border-hover-glow/40 bg-hover-glow/10 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-hover-glow">
              <Crown size={10}/> Gold
            </span>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-full bg-card text-foreground hover:bg-secondary">
                <User size={16}/>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="hidden md:inline rounded-sm border border-vintage-red/50 px-2 py-1 font-retro text-[10px] uppercase tracking-widest text-vintage-red">Admin</Link>
              )}
              <button onClick={logout} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground"><LogOut size={16}/></button>
            </>
          ) : (
            <Link to="/login" className="rounded-sm bg-primary px-3 py-1.5 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
