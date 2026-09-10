import { motion } from "framer-motion";
import { BadgeCheck, GraduationCap, Sparkles, Shield, Code2, MessageSquareText } from "lucide-react";
import { Reveal } from "../animations/Reveal";
import { TiltCard } from "../animations/TiltCard";
import { usePrefersReducedMotion } from "../../lib/hooks";

const ROLES = [
  { icon: Sparkles, label: "Young Innovator" },
  { icon: Code2, label: "AI Engineer" },
  { icon: Shield, label: "Cybersecurity Specialist" },
  { icon: GraduationCap, label: "Software Engineer" },
  { icon: MessageSquareText, label: "Prompt Engineer" },
] as const;

export function CreatorSection() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="creator" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal variant="scale" className="relative">
          <div
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 40%, rgba(61,216,186,0.14), transparent 70%)",
            }}
            aria-hidden
          />
          <TiltCard intensity={6} className="group/tilt">
            <figure className="relative overflow-hidden rounded-3xl border border-edge bg-panel soft-shadow">
              <img
                src="/owner.jpg"
                alt="Irabizi Paisible Valentin — creator of ICODE"
                width={1200}
                height={1800}
                loading="lazy"
                decoding="async"
                className="aspect-[2/3] w-full object-cover transition-transform duration-700 group-hover/tilt:scale-[1.02]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                aria-hidden
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5">
                <span className="grid size-9 place-items-center rounded-full border border-accent-500/50 bg-black/40 text-accent-400 backdrop-blur">
                  <BadgeCheck className="size-4.5" aria-hidden />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-white">
                    Irabizi Paisible Valentin
                  </p>
                  <p className="font-mono text-[11px] tracking-wider text-white/70">
                    CREATOR OF ICODE
                  </p>
                </div>
              </figcaption>
            </figure>
          </TiltCard>
        </Reveal>

        <div>
          <Reveal variant="fade">
            <span className="eyebrow flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" aria-hidden />
              The creator
            </span>
          </Reveal>

          <Reveal variant="rise" delay={0.05}>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-balance">
              Designed and built by{" "}
              <span className="text-gradient-accent">Irabizi Paisible Valentin</span>.
            </h2>
          </Reveal>

          <Reveal variant="rise" delay={0.12}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-dim sm:text-base">
              A young innovator and engineer behind ICODE. Irabizi works across AI,
              cybersecurity, and software engineering — and turns that experience into
              an intelligent coding agent that lives in your terminal.
            </p>
          </Reveal>

          <Reveal variant="rise" delay={0.18}>
            <ul className="mt-8 flex flex-wrap items-center gap-2.5" aria-label="Expertise">
              {ROLES.map((role, i) => (
                <motion.li
                  key={role.label}
                  initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                  whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.4 }}
                  className="flex items-center gap-2 rounded-full border border-accent-500/25 bg-accent-500/[0.07] px-3.5 py-1.5 text-[13px] font-medium text-dim transition-colors hover:border-accent-500/50 hover:text-accent-300"
                >
                  <role.icon className="size-3.5 text-accent-400/80" aria-hidden />
                  {role.label}
                </motion.li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="rise" delay={0.24}>
            <blockquote className="mt-9 border-l-2 border-accent-500/50 pl-5">
              <p className="font-mono text-sm leading-relaxed text-faint">
                Build, debug, refactor, ship — from the terminal. ICODE is built around
                one idea: intelligent development starts where the developer already is.
              </p>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}