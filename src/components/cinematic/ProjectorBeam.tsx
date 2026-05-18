export function ProjectorBeam({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-40 left-1/2 h-[140%] w-[120%] -translate-x-1/2 opacity-40"
        style={{ background: 'radial-gradient(ellipse at top, oklch(0.85 0.18 80 / 0.35), transparent 60%)' }} />
      <div className="absolute -top-20 left-1/2 h-[120%] w-[60%] -translate-x-1/2 opacity-30"
        style={{ background: 'conic-gradient(from 270deg at 50% 0%, transparent 80%, oklch(0.95 0.12 90 / 0.55) 90%, transparent 100%)' }} />
    </div>
  );
}
