import { motion } from "framer-motion";
import { CircleDot, Info, ShieldCheck } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../animations/Reveal";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { TRIAL_DURATION } from "../../lib/data";

export function TrialAccess() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="trial" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow="The trial model"
              title="Start with a free three-week trial"
              description={
                <>
                  New ICODE installations begin with a{" "}
                  <span className="font-semibold text-accent-400">{TRIAL_DURATION}</span>.
                  When it ends, ICODE shows an access page that asks for a passcode.
                </>
              }
            />

            <div className="space-y-4">
              <div className="glass flex items-start gap-4 rounded-xl p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-accent-500/30 bg-accent-500/10 text-accent-400">
                  <ShieldCheck className="size-4.5" aria-hidden />
                </span>
                <p className="text-sm leading-relaxed text-dim">
                  The passcode is issued by your administrator after the required
                  payment process. Frontend pages never contain or reveal passcodes.
                </p>
              </div>
              <div className="glass flex items-start gap-4 rounded-xl p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-accent-500/30 bg-accent-500/10 text-accent-400">
                  <Info className="size-4.5" aria-hidden />
                </span>
                <p className="text-sm leading-relaxed text-dim">
                  If ICODE was already started on this PC before, your trial already
                  granted its access there. This is an honest trial on the actual
                  machine ICODE runs on.
                </p>
              </div>
            </div>
          </div>

          <Reveal variant="scale">
            <div className="relative">
              <div
                className="absolute inset-0 -z-10 rounded-3xl opacity-70 blur-3xl"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 30%, rgba(61,216,186,0.16), transparent 70%)",
                }}
                aria-hidden
              />
              <div className="glass-strong soft-shadow rounded-2xl p-7 sm:p-9">
                <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-faint">
                  <CircleDot className="size-3.5 text-accent-400" aria-hidden />
                  ICODE — ACCESS
                </p>

                <h3 className="mt-5 text-xl font-semibold tracking-tight text-fg">
                  Your ICODE trial has ended.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dim">
                  Enter your access passcode to continue.
                </p>

                <div
                  className="mt-7 flex gap-3"
                  aria-label="Demo passcode input"
                  aria-hidden
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                      whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      className="relative grid size-11 place-items-center rounded-lg border border-edge-strong bg-white/[0.03]"
                    >
                      <span
                        className="size-2.5 rounded-full bg-accent-400/90"
                        style={{ animation: `pulse-soft 1.6s ease-in-out ${i * 0.08}s infinite` }}
                      />
                    </motion.span>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-xl bg-white/[0.06] px-7 text-sm font-semibold text-faint"
                  >
                    Continue
                  </button>
                  <p className="text-xs leading-relaxed text-faint">
                    Need a passcode? Contact your ICODE administrator.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}