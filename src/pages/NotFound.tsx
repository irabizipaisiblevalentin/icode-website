import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../lib/route";
import { usePrefersReducedMotion } from "../lib/hooks";

export function NotFound() {
  useDocumentTitle("404 — ICODE");
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 grid-lines mask-fade-y"
        aria-hidden
      />
      <div className="shell relative py-24 text-center">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[clamp(5rem,16vw,9rem)] leading-none font-bold tracking-[-0.05em] text-gradient"
        >
          404
        </motion.p>
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-4 text-lg font-medium text-fg"
        >
          This route doesn't exist.
        </motion.p>
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-dim"
        >
          The page you're looking for was not found — maybe it was refactored.
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <Link
            to="/"
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-accent-500 px-7 font-semibold text-black shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_14px_40px_-10px_rgba(61,216,186,.6)] transition-all hover:-translate-y-0.5 hover:bg-accent-400"
          >
            Return to ICODE
          </Link>
        </motion.div>
      </div>
    </section>
  );
}