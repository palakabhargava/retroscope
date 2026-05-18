import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Search, Film, Ticket, User } from 'lucide-react';

export function MobileNav() {
  const path = useRouterState({ select: s => s.location.pathname });
  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Browse' },
    { to: '/watchlist', icon: Film, label: 'Shelf' },
    { to: '/history', icon: Ticket, label: 'Tickets' },
    { to: '/profile', icon: User, label: 'Me' },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="flex justify-around py-2">
        {items.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to}
            className={`flex flex-col items-center gap-1 px-3 py-1 font-retro text-[10px] uppercase tracking-wider
              ${path === to ? 'text-primary' : 'text-muted-foreground'}`}>
            <Icon size={18}/>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
