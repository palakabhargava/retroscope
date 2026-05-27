import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-hidden relative">
      <SEOHelper
        title="Privacy Policy — RetroScope"
        description="How RetroScope handles authentication, analytics events, and user-generated content."
        ogType="website"
        canonicalPath="/privacy"
      />

      <DustParticles count={20} />

      <section className="relative h-[45vh] min-h-[360px] w-full overflow-hidden vignette border-b border-border/40">
        <ProjectorBeam />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
          <div className="max-w-2xl bg-black/40 p-6 rounded-md backdrop-blur-md border border-border/30">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-retro text-xs uppercase tracking-[0.4em] text-primary"
            >
              — Policy Reel —
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.05 }}
              className="mt-3 font-display text-4xl sm:text-5xl font-black leading-[0.98] text-foreground text-glow"
            >
              Privacy Policy
            </motion.h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Transparent handling of session, ratings, reviews, and analytics in the projection room.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">1) Data collected</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
            <li>Authentication identifiers (via Supabase Auth) for sign-in and account management.</li>
            <li>Ratings, reviews, and reactions you submit (content interactions).</li>
            <li>Anonymous analytics events (e.g., “play” events) for trending/top-rated reels.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">2) Storage & retention</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Data is stored in Supabase tables as configured by the project. For demo mode and local fallback mode, content
            may be generated client-side when the database is empty or unavailable.
          </p>
        </section>

        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">3) Your controls</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            You can sign out at any time. Reviews can be removed by the author, and admin tools can moderate content.
          </p>
        </section>

        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">4) Community & safety</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Please follow community guidelines when writing reviews and interacting with content.
          </p>
          <div className="mt-4">
            <Link to="/guidelines" className="font-retro text-[10px] uppercase tracking-widest text-primary hover:underline">
              Community guidelines →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

