import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Magnetic } from "../animations/Magnetic";
import { Reveal } from "../animations/Reveal";
import { BackdropGlow } from "../background/BackdropGlow";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <BackdropGlow />
      <div className="shell relative z-10 flex flex-col items-center text-center">
        <Reveal variant="rise">
          <h2 className="max-w-3xl text-[clamp(2.2rem,6vw,4.2rem)] leading-[1.03] font-semibold tracking-[-0.035em] text-balance text-gradient">
            Ready to code differently?
          </h2>
        </Reveal>
        <Reveal variant="rise" delay={0.1}>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-dim sm:text-lg">
            Install ICODE and bring an AI coding agent into your terminal.
          </p>
        </Reveal>
        <Reveal variant="rise" delay={0.18}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Magnetic>
              <Link
                to="/installation"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-accent-500 px-8 text-[15px] font-semibold text-black shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_14px_44px_-10px_rgba(61,216,186,.6)] transition-all hover:-translate-y-0.5 hover:bg-accent-400 active:scale-[0.98]"
              >
                Install ICODE
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Magnetic>
            <Link
              to="/documentation"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-edge bg-white/[0.03] px-7 text-[15px] font-medium text-fg transition-all hover:border-white/20 hover:bg-white/[0.07]"
            >
              View documentation
            </Link>
          </div>
        </Reveal>
        <Reveal variant="fade" delay={0.25}>
          <p className="mt-10 font-mono text-xs text-faint">
            $ npm install -g @vln.codes__/icode
            <motion.span
              className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-accent-400/70 animate-blink"
              aria-hidden
            />
          </p>
        </Reveal>
      </div>
    </section>
  );
}