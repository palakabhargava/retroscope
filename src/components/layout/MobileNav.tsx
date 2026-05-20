import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Search, Film, Ticket, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden glass border-t border-white/10 rounded-t-lg shadow-2xl pb-safe">
      <div className="flex justify-around py-2.5">
        {items.map(({ to, icon: Icon, label }) => {
          const active = path === to;
          return (
            <motion.div 
              key={to}
              whileTap={{ scale: 0.90 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Link 
                to={to}
                className={`flex flex-col items-center gap-1.5 px-3 py-1 font-retro text-[9px] uppercase tracking-wider relative transition duration-150
                  ${active ? 'text-primary text-glow font-bold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Icon size={19} className={active ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
                <span>{label}</span>
                {active && (
                  <motion.div 
                    layoutId="activeMobileIndicator" 
                    className="absolute -top-2.5 inset-x-4 h-0.5 bg-primary" 
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
