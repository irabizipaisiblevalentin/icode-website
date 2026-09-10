import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Copy, Cpu, TerminalSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Magnetic } from "../animations/Magnetic";
import { Counter } from "../animations/Counter";
import { AnimatedTerminal, type ScriptLine } from "../terminal/AnimatedTerminal";
import { usePrefersReducedMotion } from "../../lib/hooks";

const HERO_LINES: ScriptLine[] = [
  { type: "typed", text: "npm install -g @vln.codes__/icode" },
  { type: "output", text: "Installing ICODE..." },
  { type: "progress", label: "icode@latest" },
  { type: "output", text: "ICODE installed successfully.", accent: true },
  { type: "blank" },
  { type: "typed", text: "icode" },
  { type: "output", text: "Welcome to ICODE. What are you building today?", accent: true },
];

const FLOATERS = [
  { label: "$ icode", x: -6, y: 30, delay: 0 },
  { label: "refactor(app) →", x: -14, y: -26, delay: 1.2 },
  { label: "✔ build passed", x: 8, y: -34, delay: 2.1 },
] as const;

const SPECS = [
  { value: 1, suffix: "", label: "install command" },
  { value: 3, suffix: "", label: "platforms" },
  { value: 21, suffix: "", label: "day free trial" },
] as const;

export function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative overflow-hidden pt-[7.5rem] sm:pt-[9.5rem]">
      <div className="shell">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <span className="eyebrow mb-6 flex items-center gap-2.5 rounded-full border border-edge bg-white/[0.03] px-4 py-1.5">
            <span className="size-1.5 rounded-full bg-accent-400 animate-pulse-soft" aria-hidden />
            AI coding agent · Terminal first
          </span>

          <h1 className="font-mono text-[clamp(4rem,14vw,9rem)] leading-none font-bold tracking-[-0.06em]">
            <span className="text-gradient">ICODE</span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-[clamp(1.35rem,3.4vw,2rem)] font-semibold tracking-[-0.02em] text-balance"
          >
            Your AI coding agent.
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-xl text-[15px] leading-relaxed text-dim sm:text-lg"
          >
            Build, debug, refactor, and ship software directly from your terminal
            with ICODE.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Magnetic>
              <Link
                to="/installation"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-accent-500 px-7 text-[15px] font-semibold text-black shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_14px_40px_-10px_rgba(61,216,186,.6)] transition-all hover:-translate-y-0.5 hover:bg-accent-400 active:scale-[0.98]"
              >
                Install ICODE
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Magnetic>
            <a
              href="#product"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-edge bg-white/[0.03] px-6 text-[15px] font-medium text-fg transition-all hover:border-white/20 hover:bg-white/[0.07]"
            >
              See how it works
            </a>
          </motion.div>

          <motion.dl
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-14 grid w-full max-w-lg grid-cols-3 gap-4 border-y border-edge/70 py-5"
          >
            {SPECS.map((spec) => (
              <div key={spec.label} className="flex flex-col items-center gap-1">
                <dt className="sr-only">{spec.label}</dt>
                <dd className="font-mono text-xl font-semibold text-fg sm:text-2xl">
                  <Counter to={spec.value} suffix={spec.suffix} />
                </dd>
                <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                  {spec.label}
                </div>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      <HeroScene />

      <div className="relative z-10 mt-10 flex justify-center">
        <a
          href="#product"
          aria-label="Scroll to explore"
          className="flex flex-col items-center gap-1 text-faint transition-colors hover:text-accent-400"
        >
          <ChevronDown className="size-4 animate-bounce" aria-hidden />
          <span className="font-mono text-[10px] tracking-[0.3em]">EXPLORE</span>
        </a>
      </div>
    </section>
  );
}

function HeroScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative mx-auto mt-14 max-w-5xl px-4 perspective-[1600px] sm:mt-16">
      <div
        className="pointer-events-none absolute inset-x-8 top-10 h-40 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, rgba(61,216,186,0.28), transparent 70%)",
        }}
        aria-hidden
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 60, rotateX: 18 }}
        animate={reduced ? undefined : { opacity: 1, y: 0, rotateX: 12 }}
        transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <AnimatedTerminal
          title="bash — icode"
          lines={HERO_LINES}
          glow
          className="animate-float"
          bodyClassName="px-5 py-5 sm:px-7 sm:py-6"
        />

        {!reduced &&
          FLOATERS.map((f) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + f.delay * 0.4, duration: 0.5 }}
              className="absolute hidden md:block"
              style={{ left: `${f.x}%`, top: `${f.y}px` }}
            >
              <motion.div
                animate={reduced ? undefined : { y: [0, -8, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: f.delay,
                }}
                className="glass-strong flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs text-dim soft-shadow"
              >
                {f.label.startsWith("$") ? (
                  <TerminalSquare className="size-3.5 shrink-0 text-accent-400" aria-hidden />
                ) : f.label.startsWith("✔") ? (
                  <Cpu className="size-3.5 shrink-0 text-accent-400" aria-hidden />
                ) : (
                  <Copy className="size-3.5 shrink-0 text-faint" aria-hidden />
                )}
                {f.label}
              </motion.div>
            </motion.div>
          ))}
      </motion.div>

      <div className="mx-auto mt-[-3px] h-40 w-[120%] max-w-[900px] -translate-x-[8%] overflow-hidden [transform:rotateX(58deg)] [transform-style:preserve-3d] [perspective-origin:center_top]" aria-hidden>
        <div className="h-full w-full grid-lines mask-fade-b opacity-40" />
      </div>
    </div>
  );
}