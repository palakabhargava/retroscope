import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, useRouterState } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { FilmGrain } from "@/components/cinematic/FilmGrain";
import { Toaster } from "@/components/ui/sonner";
import { AtmosphereProvider } from "@/hooks/useAtmosphere";

function NotFoundComponent() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="text-center">
        <h1 className="font-display text-7xl font-black text-primary text-glow">404</h1>
        <p className="mt-2 font-retro text-xs uppercase tracking-widest text-muted-foreground">Reel not found in the projection booth</p>
        <Link to="/" className="mt-6 inline-block rounded-sm bg-primary px-4 py-2 font-retro text-xs uppercase tracking-widest text-primary-foreground">Back to lobby</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-bold">The reel jammed</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-sm bg-primary px-4 py-2 font-retro text-xs uppercase tracking-widest text-primary-foreground">
          Rewind
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AtmosphereProvider>
          <Layout />
        </AtmosphereProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}



function Layout() {
  const path = useRouterState({ select: s => s.location.pathname });
  const isAdmin = path.startsWith('/admin');
  const isAuthPage = ['/login','/signup','/forgot-password','/reset-password'].includes(path);
  return (
    <div className={isAdmin ? 'admin min-h-screen bg-background text-foreground' : 'min-h-screen bg-background text-foreground'}>
      <FilmGrain />
      {!isAdmin && !isAuthPage && <TopNav />}
      <main className={isAuthPage ? '' : 'pb-20 md:pb-10'}>
        <Outlet />
      </main>
      {!isAdmin && !isAuthPage && <Footer />}
      {!isAdmin && !isAuthPage && <MobileNav />}
      <Toaster />
    </div>
  );
}
