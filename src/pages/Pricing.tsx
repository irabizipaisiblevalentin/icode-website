import { CreditCard, KeyRound, PlayCircle } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "../components/animations/Reveal";
import { PricingCard } from "../components/pricing/PricingCard";
import { useDocumentTitle } from "../lib/route";

const STEPS = [
  {
    icon: CreditCard,
    title: "Complete your payment",
    body: "Pay the continued-access price (1000 RWF) using Mobile Money (MoMo) or Bank of Kigali, following your administrator's instructions.",
  },
  {
    icon: KeyRound,
    title: "Receive your passcode",
    body: "Your administrator verifies the payment and issues an access passcode. Payment verification is an administrator process — not an automated website step.",
  },
  {
    icon: PlayCircle,
    title: "Enter it in ICODE",
    body: "When ICODE shows the access page after your trial, enter the passcode to continue using ICODE on that PC.",
  },
];

export function Pricing() {
  useDocumentTitle("Pricing — ICODE");

  return (
    <>
      <header className="relative pt-[8rem] sm:pt-[10rem]">
        <div className="shell text-center">
          <Reveal variant="fade">
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" aria-hidden />
              Pricing & access
            </span>
          </Reveal>
          <Reveal variant="rise" delay={0.05}>
            <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-gradient">
              A free trial, then continued access
            </h1>
          </Reveal>
          <Reveal variant="rise" delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-dim sm:text-base">
              Every new installation gets a 3-week free trial. Continued access costs
              1000 RWF — pay simply, and an administrator passcode unlocks ICODE.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="shell mt-12 sm:mt-16">
        <div className="mx-auto max-w-md">
          <Reveal variant="scale">
            <PricingCard />
          </Reveal>
        </div>
      </section>

      <section className="shell pb-28 pt-16 sm:pt-20">
        <Reveal variant="rise">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-fg">
            How continued access works
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-3" amount={0.3}>
          {STEPS.map((step) => (
            <StaggerItem key={step.title}>
              <div className="glass flex h-full flex-col gap-4 rounded-2xl p-6 transition-colors hover:border-accent-500/30">
                <span className="grid size-11 place-items-center rounded-xl border border-accent-500/25 bg-accent-500/10 text-accent-400">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-[16px] font-semibold tracking-tight text-fg">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-dim">{step.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal variant="fade" className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-faint">
          The ICODE website provides this information only. It does not process
          payments, verify payment status, or store passcodes.
        </Reveal>
      </section>
    </>
  );
}