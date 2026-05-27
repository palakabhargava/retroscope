import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { ProjectorBeam } from '@/components/cinematic/ProjectorBeam';
import { DustParticles } from '@/components/cinematic/DustParticles';

export const Route = createFileRoute('/guidelines')({
  component: GuidelinesPage,
});

function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-hidden relative">
      <SEOHelper
        title="Community Guidelines — RetroScope"
        description="How to participate respectfully in RetroScope reviews, ratings, and community spaces."
        ogType="website"
        canonicalPath="/guidelines"
      />

      <DustParticles count={18} />

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
              — House Rules —
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.05 }}
              className="mt-3 font-display text-4xl sm:text-5xl font-black leading-[0.98] text-foreground text-glow"
            >
              Community Guidelines
            </motion.h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Keep the projection room safe, respectful, and useful for everyone.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">1) Be respectful</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            No harassment, hate, threats, or targeted abuse. Critique content, not people.
          </p>
        </section>

        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">2) Reviews should be helpful</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
            <li>Explain what you felt and why (mood, pacing, themes).</li>
            <li>Avoid spoilers; if needed, label them clearly.</li>
            <li>No spam, promotion, or repetitive copy/paste.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-border/50 bg-card/60 backdrop-blur p-6">
          <h2 className="font-display text-xl font-black">3) Mature vault behavior</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The 18+ vault is restricted. Do not attempt to share restricted material outside appropriate contexts.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/mature" className="rounded-sm bg-primary px-4 py-2 font-retro text-[10px] uppercase tracking-widest text-primary-foreground hover:bg-hover-glow transition">
              Mature Vault
            </Link>
            <Link to="/terms" className="rounded-sm border border-border px-4 py-2 font-retro text-[10px] uppercase tracking-widest hover:border-primary transition">
              Terms
            </Link>
            <Link to="/privacy" className="rounded-sm border border-border px-4 py-2 font-retro text-[10px] uppercase tracking-widest hover:border-primary transition">
              Privacy
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

