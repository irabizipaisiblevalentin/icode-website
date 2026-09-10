import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { HOW_IT_WORKS } from "../../lib/data";
import { SectionHeading } from "../ui/SectionHeading";
import { Stagger, StaggerItem } from "../animations/Reveal";
import { usePrefersReducedMotion } from "../../lib/hooks";

export function HowItWorks() {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 78%", "end 55%"],
  });

  return (
    <section id="how-it-works" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="How it works"
          title="From install to shipped in four steps"
          description="No setup maze. ICODE is designed so you go from your first command to real work in minutes."
        />

        <div ref={trackRef} className="relative">
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-10 hidden h-1 w-[calc(100%-4rem)] lg:block"
            fill="none"
          >
            <line
              x1="0"
              y1="2"
              x2="100%"
              y2="2"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
            />
            {!reduced && (
              <motion.line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="rgba(61,216,186,0.8)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: scrollYProgress, opacity: 0.9 }}
              />
            )}
          </svg>

          <Stagger className="relative grid grid-cols-1 gap-5 lg:grid-cols-4" amount={0.3}>
            {HOW_IT_WORKS.map((step) => (
              <StaggerItem key={step.step}>
                <article className="group relative flex h-full flex-col gap-4 rounded-2xl border border-edge bg-panel/70 p-6 transition-colors duration-300 hover:border-accent-500/30">
                  <span className="grid size-11 place-items-center rounded-xl border border-edge-strong bg-white/[0.04] font-mono text-sm font-semibold text-fg transition-all duration-300 group-hover:border-accent-500/60 group-hover:text-accent-400 group-hover:shadow-[0_0_18px_-4px_rgba(61,216,186,0.7)]">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight text-fg">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-dim">{step.body}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}