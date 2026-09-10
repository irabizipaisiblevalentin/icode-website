import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { KeyRound, Rocket, Timer, Unlock } from "lucide-react";
import { TRIAL_FLOW } from "../../lib/data";
import { SectionHeading } from "../ui/SectionHeading";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { cn } from "../../lib/cn";

type NodeKind = "rocket" | "trial" | "use" | "end" | "pass" | "done";

const MILESTONES_LABEL: Record<string, NodeKind> = {
  Install: "rocket",
  "Run ICODE": "rocket",
  "3-Week Trial": "trial",
  "Use ICODE": "use",
  "Trial Ends": "end",
  "Enter Admin Passcode": "pass",
  "Continue Using ICODE": "done",
};

function NodeIcon({ kind }: { kind: NodeKind }) {
  switch (kind) {
    case "rocket":
      return <Rocket className="size-4" aria-hidden />;
    case "trial":
      return <Timer className="size-4" aria-hidden />;
    case "pass":
      return <KeyRound className="size-4" aria-hidden />;
    case "done":
      return <Unlock className="size-4" aria-hidden />;
    default:
      return null;
  }
}

export function TrialFlow() {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 72%", "end 60%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(TRIAL_FLOW.length - 1, Math.floor(v * TRIAL_FLOW.length));
    setActive(next);
  });

  return (
    <section id="journey" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Launch experience"
          title="From first install to continued access"
          description="A clear, honest journey. New users start with a free trial — and when it ends, one access passcode keeps them going."
        />

        <div ref={trackRef} className="relative mx-auto max-w-2xl">
          <div
            className="absolute bottom-4 left-1/2 top-2 w-px -translate-x-1/2 bg-white/[0.07]"
            aria-hidden
          />
          {!reduced && (
            <motion.div
              className="absolute bottom-4 left-1/2 top-2 w-px -translate-x-1/2 bg-gradient-to-b from-accent-500 to-accent-400"
              style={{ scaleY: scrollYProgress }}
              aria-hidden
            />
          )}

          <ol className="flex flex-col gap-3">
            {TRIAL_FLOW.map((node, i) => {
              const kind: NodeKind = MILESTONES_LABEL[node.label] ?? "use";
              const isActive = active >= i;
              const isEnd = node.label === "Trial Ends";
              const isFinal = node.label === "Continue Using ICODE";
              return (
                <motion.li
                  key={node.label}
                  initial={reduced ? false : { opacity: 0, y: 26 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-center gap-5 rounded-xl px-3 py-4 sm:px-6"
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500",
                      isEnd
                        ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                        : isFinal
                          ? "border-accent-500 bg-accent-500/15 text-accent-300 shadow-[0_0_24px_-6px_rgba(61,216,186,0.8)]"
                          : isActive
                            ? "border-accent-500/60 bg-accent-500/10 text-accent-300 shadow-[0_0_20px_-6px_rgba(61,216,186,0.6)]"
                            : "border-edge bg-panel text-faint",
                    )}
                  >
                    <NodeIcon kind={kind} />
                  </span>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-[15px] font-semibold tracking-tight transition-colors duration-500",
                        isActive || isFinal ? "text-fg" : "text-dim",
                      )}
                    >
                      {node.label}
                    </p>
                    <p className="truncate font-mono text-xs text-faint">
                      {node.caption}
                    </p>
                  </div>
                  {isFinal && (
                    <span className="ml-auto hidden rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-accent-400 sm:block">
                      UNLOCKED
                    </span>
                  )}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}