import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
export function IntervalBanner({ open, onDone }: { open: boolean; onDone: () => void }) {
  const [count, setCount] = useState(5);
  useEffect(() => {
    if (!open) return;
    setCount(5);
    const t = setInterval(() => setCount(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [open]);
  useEffect(() => { if (count <= 0) onDone(); }, [count, onDone]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 grid place-items-center bg-black/85">
          <div className="text-center">
            <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: [0.8, 1.05, 1] }} transition={{ duration: 1.2 }}
              className="font-display text-7xl font-black tracking-[0.2em] text-[oklch(0.85_0.18_80)] text-glow">
              I N T E R V A L
            </motion.h2>
            <p className="mt-6 font-retro text-sm tracking-widest text-muted-foreground">
              Resuming in {Math.max(count, 0)}s
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
