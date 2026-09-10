import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, KeyRound, MessageSquareText, Terminal } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "../components/animations/Reveal";
import { useDocumentTitle } from "../lib/route";

const HELP = [
  {
    icon: KeyRound,
    title: "Access & passcodes",
    body: "When your trial ends, ICODE asks for a passcode. Passcodes are issued by your ICODE administrator after the payment process.",
    to: "/documentation#passcode",
    cta: "See the passcode guide",
  },
  {
    icon: CreditCard,
    title: "Payments",
    body: "Continued access costs 1000 RWF. Payment is handled through Mobile Money (MoMo) or Bank of Kigali under your administrator's instructions.",
    to: "/pricing",
    cta: "View pricing & payment",
  },
  {
    icon: Terminal,
    title: "Installation help",
    body: "npm not recognized, command not found, or a version question? The troubleshooting guide covers the common issues.",
    to: "/documentation#troubleshooting",
    cta: "Open troubleshooting",
  },
];

export function Contact() {
  useDocumentTitle("Contact — ICODE");

  return (
    <>
      <header className="relative pt-[8rem] sm:pt-[10rem]">
        <div className="shell text-center">
          <Reveal variant="fade">
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" aria-hidden />
              Contact & support
            </span>
          </Reveal>
          <Reveal variant="rise" delay={0.05}>
            <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-gradient">
              Get help, fast
            </h1>
          </Reveal>
          <Reveal variant="rise" delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-dim sm:text-base">
              Most questions are answered in the documentation. For access issues and
              payments, your ICODE administrator is the person to reach.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="shell mt-12 pb-28 sm:mt-16 sm:pb-32">
        <Stagger className="grid gap-5 md:grid-cols-3" amount={0.3}>
          {HELP.map((item) => (
            <StaggerItem key={item.title}>
              <Link
                to={item.to}
                className="group flex h-full flex-col gap-4 glass rounded-2xl p-6 transition-all hover:border-accent-500/30"
              >
                <span className="grid size-11 place-items-center rounded-xl border border-accent-500/25 bg-accent-500/10 text-accent-400 transition-transform group-hover:scale-110">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <h2 className="text-[16px] font-semibold tracking-tight text-fg">
                  {item.title}
                </h2>
                <p className="flex-1 text-sm leading-relaxed text-dim">{item.body}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-400 transition-colors group-hover:text-accent-300">
                  {item.cta}
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal variant="rise" className="mt-8">
          <div className="glass mx-auto flex max-w-3xl items-start gap-4 rounded-2xl p-6 sm:items-center sm:p-7">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-edge-strong bg-white/[0.04] text-fg">
              <MessageSquareText className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-fg">
                Managed by your administrator
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-dim">
                Trial extensions, passcodes, and payment confirmation are handled by the
                ICODE administrator responsible for your organization or account. The
                ICODE website is English-only and does not store passcodes.
              </p>
              <p className="mt-3 font-mono text-xs text-faint">
                ICODE is created by Irabizi Paisible Valentin.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}