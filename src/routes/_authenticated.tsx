import { createFileRoute, Outlet, Navigate, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/_authenticated')({ component: Guard });

function Guard() {
  const { isAuthenticated, loading } = useAuth();
  const path = useRouterState({ select: s => s.location.pathname });
  if (loading) return <div className="grid min-h-screen place-items-center font-retro text-xs uppercase tracking-widest text-muted-foreground">Threading the reel…</div>;
  if (!isAuthenticated) return <Navigate to="/login" search={{ redirect: path }} replace />;
  return <Outlet />;
}
