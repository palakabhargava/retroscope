import { useEffect, useRef } from 'react';
export function DustParticles({ count = 30 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const dots: HTMLDivElement[] = [];
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      const size = 1 + Math.random() * 2;
      d.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:9999px;background:oklch(0.95 0.10 80 / 0.5);left:${Math.random()*100}%;top:${Math.random()*100}%;filter:blur(0.4px);opacity:0;transition:opacity 1.5s, transform 12s linear;`;
      el.appendChild(d); dots.push(d);
      setTimeout(() => {
        d.style.opacity = String(0.2 + Math.random()*0.5);
        d.style.transform = `translate(${(Math.random()-0.5)*120}px, ${-100 - Math.random()*200}px)`;
      }, Math.random() * 1500);
    }
    return () => dots.forEach(d => d.remove());
  }, [count]);
  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" />;
}
