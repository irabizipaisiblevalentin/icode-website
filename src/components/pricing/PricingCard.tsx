import { motion } from "framer-motion";
import { Landmark, Smartphone, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { TiltCard } from "../animations/TiltCard";
import { usePrefersReducedMotion } from "../../lib/hooks";

const INCLUDED = [
  "3-week free trial for new installations",
  "Continued access after the trial",
  "Works on Windows, macOS, and Linux",
  "Access passcode issued by your administrator",
] as const;

interface PricingCardProps {
  compact?: boolean;
}

export function PricingCard({ compact = false }: PricingCardProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <TiltCard intensity={7} className="group/tilt">
      <div className="relative overflow-hidden rounded-3xl border border-accent-500/25 glass-strong p-8 sm:p-10">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(55% 100% at 50% 0%, rgba(61,216,186,0.25), transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative flex items-center justify-between">
          <span className="font-mono text-[13px] font-semibold tracking-[0.3em] text-fg">
            ICODE
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-accent-400">
            <Sparkles className="size-3" aria-hidden />
            3-WEEK TRIAL
          </span>
        </div>

        <div className="relative mt-8 flex items-end gap-2">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-5xl font-bold tracking-tight text-fg"
          >
            {1000} <span className="text-2xl text-accent-400">RWF</span>
          </motion.span>
        </div>

        <ul className="relative mt-8 flex flex-col gap-3">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-dim">
              <Check className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <div className="relative mt-8 flex flex-col gap-2.5">
          <p className="flex items-center gap-2 text-xs text-faint">
            <Smartphone className="size-4 text-accent-400/80" aria-hidden />
            Pay with Mobile Money (MoMo)
          </p>
          <p className="flex items-center gap-2 text-xs text-faint">
            <Landmark className="size-4 text-accent-400/80" aria-hidden />
            Pay with Bank of Kigali
          </p>
        </div>

        <div className="relative mt-8">
          <Link
            to="/installation"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-500 font-semibold text-black shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_14px_40px_-10px_rgba(61,216,186,.6)] transition-all hover:-translate-y-0.5 hover:bg-accent-400 active:scale-[0.98]"
          >
            Get ICODE
          </Link>
        </div>

        {!compact && (
          <p className="relative mt-5 text-center text-xs leading-relaxed text-faint">
            To continue using ICODE after your trial, follow the payment instructions
            and obtain an access passcode from the administrator.
          </p>
        )}
      </div>
    </TiltCard>
  );
}