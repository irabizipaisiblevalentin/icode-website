import { Terminal, Rocket, CreditCard, ShieldCheck, Info, HelpCircle } from "lucide-react";
import { Reveal } from "../components/animations/Reveal";
import { InstallCommand } from "../components/installation/InstallCommand";
import { useDocumentTitle } from "../lib/route";
import { INSTALL_COMMAND, LAUNCH_COMMAND } from "../lib/data";
import type { ReactNode } from "react";

type Section = {
  icon: typeof Terminal;
  id: string;
  title: string;
  body: ReactNode;
};

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[12.5px] text-accent-400">
      {children}
    </code>
  );
}

const SECTIONS: Section[] = [
  {
    icon: Terminal,
    id: "quick-start",
    title: "Quick start",
    body: (
      <>
        <p>
          ICODE runs from the terminal and is installed with a single global npm
          command. The only prerequisite is Node.js (which includes npm).
        </p>
        <ol className="mt-4 flex flex-col gap-2">
          <li>1. Install Node.js and reopen your terminal.</li>
          <li>2. Run the install command below.</li>
          <li>3. Launch ICODE with <Code>{LAUNCH_COMMAND}</Code>.</li>
        </ol>
        <div className="mt-4">
          <InstallCommand />
        </div>
        <p className="mt-4">
          Verify the installation at any time with{" "}
          <Code>icode --version</Code>.
        </p>
      </>
    ),
  },
  {
    icon: Rocket,
    id: "trial",
    title: "How the trial works",
    body: (
      <>
        <p>
          Every new ICODE installation starts with a <strong>3-week (21-day) trial</strong>.
          The trial is tracked on the PC where ICODE runs, not by a file ICODE can
          delete or a fresh install can erase.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          <li>
            • Reinstalling ICODE on the same PC keeps the same trial — it does not
            reset.
          </li>
          <li>
            • A different PC receives its own trial, so a genuine first-time install is
            always able to try ICODE.
          </li>
          <li>
            • When the trial ends, ICODE shows an access page inside the terminal.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: ShieldCheck,
    id: "passcode",
    title: "Access passcode",
    body: (
      <>
        <p>
          When your trial ends, ICODE asks for an <strong>access passcode</strong>.{" "}
          Passcodes are issued by the ICODE administrator after the required payment
          process — they are never embedded in the product or on this website.
        </p>
        <p className="mt-4">
          Enter the passcode when prompted and ICODE continues running. If you do not
          have one, contact your administrator.
        </p>
      </>
    ),
  },
  {
    icon: CreditCard,
    id: "payment",
    title: "Payment & continued access",
    body: (
      <>
        <p>
          After the free trial, continued access costs{" "}
          <strong>1000 RWF</strong>. Accepted payment methods:
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          <li>• Mobile Money (MoMo)</li>
          <li>• Bank of Kigali</li>
        </ul>
        <p className="mt-4">
          Payment verification and passcode issuance are handled by the administrator.
          The ICODE website does not process or verify payments.
        </p>
      </>
    ),
  },
  {
    icon: Info,
    id: "verification",
    title: "Verifying your installation",
    body: (
      <>
        <p>Run these commands in your terminal to confirm everything is ready:</p>
        <div className="mt-4 flex flex-col gap-1.5 rounded-xl border border-edge bg-[#0b0b10]/90 p-4 font-mono text-[13px]">
          <p className="text-dim">
            <span className="text-accent-400">$</span> node --version
          </p>
          <p className="text-faint">v20.18.0</p>
          <p className="text-dim">
            <span className="text-accent-400">$</span> npm --version
          </p>
          <p className="text-faint">10.8.2</p>
          <p className="text-dim">
            <span className="text-accent-400">$</span> icode --version
          </p>
          <p className="text-faint">1.1.2</p>
        </div>
        <p className="mt-4 font-mono text-[11px] text-faint">
          {INSTALL_COMMAND}
        </p>
      </>
    ),
  },
  {
    icon: HelpCircle,
    id: "troubleshooting",
    title: "Troubleshooting",
    body: (
      <>
        <p>
          <strong className="text-fg">npm is not recognized / command not found.</strong>{" "}
          Open a fresh terminal after installing Node.js so the new PATH is loaded, then
          check with <Code>npm --version</Code>.
        </p>
        <p className="mt-4">
          <strong className="text-fg">ICODE opens an access page on launch.</strong>{" "}
          The trial for this PC has ended. Enter your administrator-provided passcode or
          contact your administrator.
        </p>
        <p className="mt-4">
          <strong className="text-fg">ICODE uses English.</strong> The product interface
          is English-only by design.
        </p>
      </>
    ),
  },
];

export function Documentation() {
  useDocumentTitle("Documentation — ICODE");

  return (
    <>
      <header className="relative pt-[8rem] sm:pt-[10rem]">
        <div className="shell text-center">
          <Reveal variant="fade">
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" aria-hidden />
              Documentation
            </span>
          </Reveal>
          <Reveal variant="rise" delay={0.05}>
            <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-gradient">
              Install, use, and manage ICODE
            </h1>
          </Reveal>
          <Reveal variant="rise" delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-dim sm:text-base">
              Everything you need to install ICODE, understand the trial, and continue
              access after it ends.
            </p>
          </Reveal>
        </div>
      </header>

      <nav className="shell mt-12 sm:mt-16" aria-label="Document sections">
        <Reveal variant="rise">
          <div className="hidden justify-center gap-6 flex-wrap lg:flex">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-dim transition-colors hover:text-accent-400"
              >
                <s.icon className="size-3.5 text-accent-400/80" aria-hidden />
                {s.title}
              </a>
            ))}
          </div>
        </Reveal>
      </nav>

      <main className="shell my-14 flex max-w-3xl flex-col gap-10 sm:my-20">
        {SECTIONS.map((section, i) => (
          <Reveal key={section.id} variant="rise" delay={Math.min(i * 0.04, 0.2)}>
            <section id={section.id} className="scroll-mt-28 rounded-2xl border border-edge bg-panel/60 p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-fg">
                <span className="grid size-9 place-items-center rounded-lg border border-accent-500/30 bg-accent-500/10 text-accent-400">
                  <section.icon className="size-4.5" aria-hidden />
                </span>
                {section.title}
              </h2>
              <div className="mt-4 text-sm leading-relaxed text-dim sm:text-[15px]">
                {section.body}
              </div>
            </section>
          </Reveal>
        ))}
      </main>
    </>
  );
}