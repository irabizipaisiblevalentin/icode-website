import { useState } from "react";
import { Terminal, FileCode2, Rocket, MousePointerClick, Check, ExternalLink, CircleHelp } from "lucide-react";
import { OSSelector } from "../components/installation/OSSelector";
import { InstallCommand } from "../components/installation/InstallCommand";
import { AnimatedTerminal, type ScriptLine } from "../components/terminal/AnimatedTerminal";
import { Reveal, Stagger, StaggerItem } from "../components/animations/Reveal";
import { useDocumentTitle } from "../lib/route";
import { OS_DETAILS, type OsId } from "../lib/data";
import { cn } from "../lib/cn";

const FULL_SCRIPT: ScriptLine[] = [
  { type: "output", text: "node --version", accent: true },
  { type: "output", text: "v20.18.0" },
  { type: "blank" },
  { type: "typed", text: "npm install -g @vln.codes__/icode" },
  { type: "output", text: "Adding icode to your global packages…" },
  { type: "progress", label: "icode@latest" },
  { type: "output", text: "ICODE installed successfully.", accent: true },
  { type: "blank" },
  { type: "typed", text: "icode" },
  { type: "output", text: "Welcome to ICODE. What are you building today?", accent: true },
];

const STEPS = [
  {
    icon: FileCode2,
    title: "Install Node.js",
    body: "ICODE runs on Node.js. Download it from the official website, install it, and reopen your terminal so the new PATH takes effect.",
    meta: "nodejs.org",
  },
  {
    icon: Terminal,
    title: "Install ICODE globally",
    body: (
      <>
        Run <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12.5px] text-accent-400">npm install -g @vln.codes__/icode</code>.{" "}
        This installs ICODE once and makes it available anywhere on your computer.
      </>
    ),
    meta: "npm",
  },
  {
    icon: Rocket,
    title: "Launch ICODE",
    body: "Type icode and press Enter. ICODE opens its interactive terminal session.",
    meta: "$ icode",
  },
  {
    icon: MousePointerClick,
    title: "Start building",
    body: "Describe what you are working on. Your first session starts now.",
    meta: "build",
  },
];

const FAQS = [
  {
    q: "I get “npm is not recognized” (Windows) or “command not found”.",
    a: "Node.js was likely installed but your terminal session is still using the old PATH. Close the terminal and open a new one, or restart your computer. Verify with: npm --version",
  },
  {
    q: "Do I need to install anything else?",
    a: "No. Node.js is the only prerequisite. ICODE has no daemons, installers, or background services.",
  },
  {
    q: "The command works, but I see a trial notice.",
    a: "New installations start with a 3-week trial. It is measured on the PC where ICODE runs, so reinstalling does not reset it.",
  },
];

export function Installation() {
  useDocumentTitle("Installation — ICODE");
  const [os, setOs] = useState<OsId>("linux");

  return (
    <>
      <header className="relative pt-[8rem] sm:pt-[10rem]">
        <div className="shell text-center">
          <Reveal variant="fade">
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" aria-hidden />
              Installation
            </span>
          </Reveal>
          <Reveal variant="rise" delay={0.05}>
            <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-gradient">
              Get ICODE running in minutes
            </h1>
          </Reveal>
          <Reveal variant="rise" delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-dim sm:text-base">
              One prerequisite, one command, one launch. Here is the complete,
              step-by-step walkthrough.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="shell mt-14 grid items-start gap-12 sm:mt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <Stagger className="flex flex-col gap-3" amount={0.3}>
            {STEPS.map((step, i) => (
              <StaggerItem key={i}>
                <div className="glass rounded-2xl p-5 transition-colors duration-300 hover:border-accent-500/30">
                  <div className="flex items-start gap-4">
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full border font-mono text-xs font-semibold transition-colors",
                        i === 0
                          ? "border-accent-500/60 bg-accent-500/15 text-accent-300"
                          : "border-edge-strong bg-white/[0.04] text-fg",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-[16px] font-semibold tracking-tight text-fg">
                          {step.title}
                        </h2>
                        <span className="rounded-full border border-edge bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-faint">
                          {step.meta}
                        </span>
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-dim">
                        {step.body}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal variant="rise" className="mt-6">
            <a
              href="https://nodejs.org/en/download"
              target="_blank"
              rel="noopener noreferrer"
              className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-accent-500/30"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent-500/30 bg-accent-500/10 text-accent-400">
                <FileCode2 className="size-5" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-medium text-fg">
                  Get the latest Node.js
                </p>
                <p className="text-sm text-faint">
                  Official download — includes npm, which ICODE is installed with.
                </p>
              </div>
              <ExternalLink className="size-4 shrink-0 text-faint" aria-hidden />
            </a>
          </Reveal>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal variant="scale">
            <div className="glass rounded-2xl p-5 sm:p-7">
              <p className="eyebrow mb-4">Select your platform</p>
              <OSSelector onChange={setOs} />
              <div className="mt-6">
                <InstallCommand />
              </div>

              <div className="mt-5 rounded-xl border border-edge bg-white/[0.02] p-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                  Verify the installation
                </p>
                {OS_DETAILS[os].verifying.map((cmd) => (
                  <p key={cmd} className="font-mono text-[13px] text-dim">
                    <span className="text-accent-400">$</span> {cmd}
                  </p>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed text-dim">
                <Check className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
                <p>
                  The install command is the same on{" "}
                  <span className="font-semibold text-fg">Windows</span>,{" "}
                  <span className="font-semibold text-fg">macOS</span>, and{" "}
                  <span className="font-semibold text-fg">Linux</span>. Only your
                  terminal differs ({OS_DETAILS[os].shell}).
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal variant="scale" className="mt-8">
            <AnimatedTerminal
              title="bash — installation"
              lines={FULL_SCRIPT}
              glow
              bodyClassName="px-5 py-5 sm:px-7 sm:py-6"
            />
          </Reveal>
        </div>
      </div>

      <section className="shell mt-24 pb-24 sm:pb-32">
        <Reveal variant="rise">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-fg">
            <CircleHelp className="size-6 text-accent-400" aria-hidden />
            Troubleshooting
          </h2>
        </Reveal>
        <div className="mt-8 flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} variant="rise" delay={i * 0.06}>
              <details className="group glass rounded-xl transition-colors hover:border-accent-500/30">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-fg [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="shrink-0 font-mono text-accent-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t border-edge px-5 py-4 text-sm leading-relaxed text-dim">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}