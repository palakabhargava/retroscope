import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Search, Film, Calendar, Clapperboard, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrientation } from '@/hooks/useMobileOptimization';

export function MobileNav() {
  const path = useRouterState({ select: s => s.location.pathname });
  const orientation = useOrientation();
  
  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Browse' },
    { to: '/classics', icon: Clapperboard, label: 'Classics' },
    { to: '/anime', icon: Calendar, label: 'Anime' },
    { to: '/mature', icon: Calendar, label: '18+' },
    { to: '/watchlist', icon: Film, label: 'Shelf' },
    { to: '/profile', icon: User, label: 'Me' },
  ] as const;
  
  // Hide nav in landscape mode on mobile
  if (orientation === 'landscape') {
    return null;
  }
  
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border/50 rounded-t-xl shadow-2xl bg-background/80 backdrop-blur-xl safe-bottom pb-safe">
      <div className="flex justify-around h-[76px] sm:h-20">
        {items.map(({ to, icon: Icon, label }) => {
          const active = path === to || (to !== '/' && path.startsWith(to));
          return (
            <motion.div 
              key={to}
              className="flex-1 flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Link 
                to={to}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 sm:px-4 w-full h-full font-retro text-[9px] sm:text-[10px] uppercase tracking-wider relative transition duration-150 touch-target
                  ${active 
                    ? 'text-primary text-glow font-bold' 
                    : 'text-muted-foreground hover:text-foreground active:text-primary'
                  }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} className={`${active ? 'stroke-[2px]' : 'stroke-[1.5px]'}`} />
                <span className="line-clamp-1">{label}</span>
                {active && (
                  <motion.div 
                    layoutId="activeMobileIndicator" 
                    className="absolute -bottom-0.5 inset-x-2 h-0.5 bg-gradient-to-r from-primary via-primary to-transparent rounded-full" 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.3 }}
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
