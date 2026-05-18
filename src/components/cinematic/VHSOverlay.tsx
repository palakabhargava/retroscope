import { useEffect, useState } from 'react';
export function VHSOverlay({ active }: { active: boolean }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div className="absolute inset-0 scanlines opacity-60 crt-flicker" />
      <div className="absolute inset-0 film-grain opacity-100" />
      <div className="absolute left-4 top-4 font-retro text-sm text-[oklch(0.95_0.10_80)] tracking-widest drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]">
        ▶ PLAY · {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </div>
      <div className="absolute right-4 bottom-4 font-retro text-xs text-[oklch(0.95_0.10_80)] tracking-widest">
        SP · CH 03
      </div>
    </div>
  );
}
