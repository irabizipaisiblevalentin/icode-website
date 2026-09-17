import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileCode2, MousePointerClick, Rocket, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "../ui/SectionHeading";
import { OSSelector } from "../installation/OSSelector";
import { InstallCommand } from "../installation/InstallCommand";
import { Reveal, Stagger, StaggerItem } from "../animations/Reveal";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { LAUNCH_COMMAND } from "../../lib/data";
import { cn } from "../../lib/cn";

const STEPS = [
  {
    icon: FileCode2,
    title: "Install Node.js",
    body: "Node.js ships with npm — the package manager ICODE is installed through.",
  },
  {
    icon: Terminal,
    title: "Install ICODE",
    body: "Run one global command. No daemons, no background services.",
  },
  {
    icon: Rocket,
    title: "Launch ICODE",
    body: "Run icode in any terminal to open your interactive session.",
  },
  {
    icon: MousePointerClick,
    title: "Start building",
    body: "Describe what you are building and work with ICODE from there.",
  },
];

export function InstallSection() {
  const reduced = usePrefersReducedMotion();
  const [, setOs] = useState<"windows" | "macos" | "linux">("linux");

  return (
    <section id="install" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Installation"
          title="Get ICODE running in minutes"
          description="One prerequisite, one command, and you are inside your first ICODE session."
        />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Stagger className="flex flex-col gap-3" amount={0.4}>
              {STEPS.map((step, i) => (
                <StaggerItem key={step.title}>
                  <div className="group relative flex items-start gap-5 rounded-2xl border border-edge bg-panel/70 p-5 transition-colors duration-300 hover:border-accent-500/30">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "grid size-9 place-items-center rounded-full border font-mono text-xs font-semibold transition-all",
                          i === 0
                            ? "border-accent-500/60 bg-accent-500/15 text-accent-300"
                            : "border-edge-strong bg-white/[0.04] text-fg",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span className="mt-2 h-8 w-px bg-edge" aria-hidden />
                      )}
                    </div>
                    <div className="pb-1">
                      <h3 className="text-[16px] font-semibold tracking-tight text-fg">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-dim">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="lg:sticky lg:top-24">
            <Reveal variant="rise">
              <div className="glass rounded-2xl p-5 sm:p-7">
                <OSSelector onChange={setOs} />

                <div className="mt-6">
                  <p className="mb-2 flex items-center gap-2 font-mono text-xs text-faint">
                    <Terminal className="size-3.5" aria-hidden />
                    Run this in your terminal
                  </p>
                  <InstallCommand />
                </div>

                <div className="mt-4 rounded-xl border border-edge bg-white/[0.02] p-4">
                  <p className="flex items-start gap-2.5 text-sm leading-relaxed text-dim">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-accent-400"
                      aria-hidden
                    />
                    <span>
                      <strong className="font-semibold text-fg">Node.js required.</strong>{" "}
                      Install Node.js first and make sure <code className="font-mono text-accent-400">npm</code>{" "}
                      is available in your PATH before running the command above.
                    </span>
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-edge-strong bg-[#0b0b10]/90 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-mono text-[13px]">
                      <span className="text-accent-400">$</span>
                      <span className="text-dim">{LAUNCH_COMMAND}</span>
                    </div>
                    <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-accent-400">
                      RUN NOW
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-faint">
                    Launching ICODE opens your interactive coding session in the terminal.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          <Link
            to="/installation#download"
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300"
          >
            Download the desktop app
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            to="/installation"
            className="group inline-flex items-center gap-2 text-sm font-medium text-dim transition-colors hover:text-fg"
          >
            View full installation guide
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}