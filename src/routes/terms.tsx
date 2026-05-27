import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-hidden relative">
      <SEOHelper
        title="Terms & Conditions — RetroScope"
        description="RetroScope terms, demo-only disclaimer, and platform usage conditions."
        ogType="website"
        canonicalPath="/terms"
      />

      <DustParticles count={25} />

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
              — Legal Reel —
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.05 }}
              className="mt-3 font-display text-4xl sm:text-5xl font-black leading-[0.98] text-foreground text-glow"
            >
              Terms & Conditions
            </motion.h1>
            <p className="mt-3 text-sm text-muted-foreground">
              RetroScope is a cinematic OTT demo experience. These terms explain usage, safety, and content rules.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">1) Demo-only disclaimer</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            RetroScope is a production-grade UI/architecture demo. Most titles, posters, and trailers are presented for
            interface simulation and may be sourced from public web imagery.
          </p>
        </section>

        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">2) Account & access</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            You are responsible for maintaining account security. Admin and mature sections may require additional
            verification steps.
          </p>
        </section>

        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">3) Mature (18+) content</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Mature routes are restricted. If you proceed past the age gate, you confirm you are of legal age in your
            jurisdiction.
          </p>
          <div className="mt-4">
            <Link to="/mature" className="font-retro text-[10px] uppercase tracking-widest text-primary hover:underline">
              Enter 18+ Vault →
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">4) Acceptable use</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
            <li>No abuse, scraping, or attempts to bypass security controls.</li>
            <li>No uploading illegal content or impersonation.</li>
            <li>No harassment; follow community guidelines.</li>
          </ul>
          <div className="mt-4">
            <Link to="/guidelines" className="font-retro text-[10px] uppercase tracking-widest text-primary hover:underline">
              Read guidelines →
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">5) Contact</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            For questions, open an issue in the repository or contact the RetroScope maintainers.
          </p>
        </section>
      </div>
    </div>
  );
}

