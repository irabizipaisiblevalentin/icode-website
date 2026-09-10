import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../../lib/hooks";

export function Loader() {
  const reduced = usePrefersReducedMotion();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setGone(true), 1000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = gone ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [gone]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center bg-base"
      initial={{ opacity: 1 }}
      animate={gone ? { opacity: 0, visibility: "hidden" } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          className="font-mono text-2xl font-medium tracking-[0.42em] text-fg"
          initial={{ opacity: 0, letterSpacing: "0.62em" }}
          animate={{ opacity: 1, letterSpacing: "0.42em" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          ICODE
          <span className="ml-1 inline-block h-[1em] w-[0.08em] translate-y-[0.12em] bg-accent-400 animate-blink" />
        </motion.div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.3em] text-faint">
            INITIALIZING
          </span>
          <span className="relative h-px w-28 overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-y-0 left-0 bg-accent-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.95, ease: "easeInOut" }}
            />
          </span>
        </div>
      </div>
    </motion.div>
  );
}