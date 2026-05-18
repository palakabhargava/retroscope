export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-2xl font-black tracking-tight">RetroScope</span>
          <p className="font-retro text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            A demo cinematic OTT — no movies actually play.
          </p>
        </div>
      </div>
    </footer>
  );
}
