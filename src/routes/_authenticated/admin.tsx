import { createFileRoute, Outlet, Navigate, Link, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth';
import { LayoutDashboard, Film, Heart, Activity, Palette, CalendarRange, MessageSquare, Megaphone, LogOut } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin')({ component: AdminLayout });

function AdminLayout() {
  const { hasRole, logout, user, loading } = useAuth();
  const path = useRouterState({ select: s => s.location.pathname });
  if (loading) return <div className="grid min-h-screen place-items-center font-retro text-xs uppercase tracking-widest text-muted-foreground">Loading projection booth…</div>;
  if (!hasRole('admin')) return <Navigate to="/" replace />;

  const items: Array<[string, string, typeof LayoutDashboard]> = [
    ['/admin', 'Overview', LayoutDashboard],
    ['/admin/movies', 'Movies', Film],
    ['/admin/moods', 'Moods', Heart],
    ['/admin/heatmap', 'Heatmap', Activity],
    ['/admin/themes', 'Themes', Palette],
    ['/admin/scheduler', 'Schedule', CalendarRange],
    ['/admin/complaints', 'Complaints', MessageSquare],
    ['/admin/broadcast', 'Broadcast', Megaphone],
  ];

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="border-r border-border bg-sidebar text-sidebar-foreground">
        <div className="px-5 py-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-sm bg-primary font-display text-base font-black text-primary-foreground">R</span>
            <span className="font-display text-lg font-black">Projection Room</span>
          </Link>
          <p className="mt-1 font-retro text-[10px] uppercase tracking-widest text-muted-foreground">Admin · {user?.username}</p>
        </div>
        <nav className="space-y-1 px-3">
          {items.map(([to, label, Icon]) => {
            const active = path === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 rounded-sm px-3 py-2 font-retro text-xs uppercase tracking-widest transition
                  ${active ? 'bg-sidebar-accent text-primary' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'}`}>
                <Icon size={14}/> {label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 px-3">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 font-retro text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <LogOut size={14}/> Sign out
          </button>
        </div>
      </aside>
      <div className="overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
