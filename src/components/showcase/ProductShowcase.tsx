import { motion } from "framer-motion";
import { Braces, Code2, GitBranch } from "lucide-react";
import { AnimatedTerminal, type ScriptLine } from "../terminal/AnimatedTerminal";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../animations/Reveal";
import { usePrefersReducedMotion } from "../../lib/hooks";

const DEMO_LINES: ScriptLine[] = [
  { type: "typed", text: "icode" },
  { type: "output", text: "ICODE — session started", accent: true },
  { type: "blank" },
  { type: "output", text: "What are you building today?" },
  { type: "typed", prompt: ">", text: "Build a React application", speed: 22 },
  { type: "blank" },
  { type: "output", text: "Scaffolding a new React application in ./app…" },
  { type: "output", text: "✓ Project scaffolded — component structure ready.", accent: true },
  { type: "output", text: "Describe your first screen and I'll start building." },
];

const CAPABILITIES = [
  { icon: Code2, label: "Write code with you" },
  { icon: Braces, label: "Refactor across files" },
  { icon: GitBranch, label: "Work inside your repo" },
];

export function ProductShowcase() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="product" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Product"
          title="Your terminal. Supercharged."
          description="ICODE turns the terminal you already use into an interactive development partner — start a session, describe what you are building, and work together from first edit to shipped feature."
        />
        <p className="mx-auto -mt-8 mb-12 max-w-xl text-center text-xs text-faint">
          Interactive demonstration of the ICODE session UI.
        </p>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal variant="rise" className="order-2 lg:order-1">
            <ul className="flex flex-col gap-4">
              {CAPABILITIES.map((cap, i) => (
                <motion.li
                  key={cap.label}
                  initial={reduced ? false : { opacity: 0, x: -20 }}
                  whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.08 + 0.2, duration: 0.5 }}
                  className="glass flex items-center gap-4 rounded-xl p-4"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-accent-500/30 bg-accent-500/10 text-accent-400">
                    <cap.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-fg">{cap.label}</p>
                    <p className="text-sm text-faint">
                      No new workflow to learn — stay where your code lives.
                    </p>
                  </div>
                </motion.li>
              ))}
              <li className="mt-2 font-mono text-xs text-faint">
                # Your session, your repo, your terminal.
              </li>
            </ul>
          </Reveal>

          <Reveal variant="scale" className="order-1 lg:order-2">
            <AnimatedTerminal
              title="icode — ./app"
              lines={DEMO_LINES}
              glow
              bodyClassName="px-5 py-5 sm:px-7 sm:py-6"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}