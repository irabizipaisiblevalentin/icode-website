import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Loader2,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Reveal, Stagger, StaggerItem } from "../components/animations/Reveal";
import { useCopyCommand } from "../lib/hooks";
import { useDocumentTitle } from "../lib/route";
import { cn } from "../lib/cn";
import {
  PAYMENT_FORM_URL,
  PRICE,
  PAYMENT_METHODS,
  daysUntil,
  formatDate,
  userApi,
} from "../lib/control";

const INPUT_CLS =
  "w-full rounded-xl border border-edge-strong bg-black/40 px-4 py-3 font-mono text-[15px] tracking-wide text-fg placeholder:text-faint outline-none transition-colors focus:border-accent-500/60";

const PRIMARY_BTN =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 text-sm font-semibold text-black transition-all hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50";

interface Result {
  kind: "success" | "error" | "info";
  message: string;
  hint?: string;
}

function Counter({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (reduced || from === to) {
      setDisplay(to);
      return;
    }
    const start = performance.now();
    const duration = 700;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);

  return <span className="tabular-nums">{display}</span>;
}

function PayMethod({
  name,
  code,
  owner,
  index,
}: {
  name: string;
  code: string;
  owner: string;
  index: number;
}) {
  const { copied, failed, copy } = useCopyCommand();
  return (
    <StaggerItem>
      <div className="group flex items-center justify-between gap-4 rounded-xl border border-edge bg-white/[0.03] p-4 transition-colors hover:border-accent-500/30">
        <div>
          <p className="text-sm font-semibold text-fg">{name}</p>
          <p className="mt-0.5 text-xs text-faint">{owner}</p>
        </div>
        <div className="flex items-center gap-2">
          <code className="rounded-lg border border-edge-strong bg-black/50 px-3 py-1.5 font-mono text-sm tracking-wide text-accent-400">
            {code}
          </code>
          <button
            type="button"
            onClick={() => void copy(code)}
            aria-label={`Copy ${name} number ${code}`}
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg border transition-all",
              copied
                ? "border-accent-500/60 text-accent-400"
                : failed
                  ? "border-red-500/60 text-red-400"
                  : "border-edge-strong bg-white/[0.04] text-dim hover:text-fg",
            )}
          >
            {copied ? (
              <Check className="size-4" aria-hidden />
            ) : failed ? (
              <span className="text-xs font-semibold">!</span>
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
          </button>
        </div>
        <span className="sr-only">{index + 1}</span>
      </div>
    </StaggerItem>
  );
}

export function Access() {
  useDocumentTitle("Activate ICODE — 3-week free trial");
  const [params] = useSearchParams();
  const reduced = useReducedMotion();

  const waitMachine = (params.get("machine") ?? "").trim();
  const trialStarted = params.get("trial_started") === "1";
  const trialExpires = params.get("expires") ?? "";
  const remainingDays = trialExpires ? daysUntil(trialExpires) : 0;

  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const submit = async () => {
    const c = code.trim().toUpperCase();
    if (!c) {
      setResult({ kind: "error", message: "Enter your passcode first." });
      return;
    }
    if (busy) return;
    setBusy(true);
    setResult(null);
    try {
      const platform = navigator.platform || "web";
      const arch = "web";
      const mid = waitMachine
        ? waitMachine
        : (localStorage.getItem("icode_machine_id") ?? crypto.randomUUID());
      const body = { code: c, machine_id: mid, platform, arch };
      const data = waitMachine ? await userApi.activate(body) : await userApi.validate(body);
      if (data.ok) {
        setResult({
          kind: "success",
          message: "Passcode verified successfully. Thank you!",
          hint: waitMachine
            ? "Return to the Terminal and run again: icode"
            : "You can now use ICODE.",
        });
      } else if (data.rate_limited) {
        setResult({ kind: "info", message: "Too many attempts. Try again in a moment." });
      } else if (data.reason === "blocked") {
        setResult({
          kind: "error",
          message: "Your access to ICODE with this passcode has been revoked.",
          hint: "Please contact the ICODE admin.",
        });
      } else if (data.reason === "expired") {
        setResult({
          kind: "info",
          message: "This passcode has expired.",
          hint: "Pay and fill in the Google Form to get a new one.",
        });
      } else {
        setResult({
          kind: "error",
          message: "Wrong passcode.",
          hint: "Check the passcode the admin gave you and try again.",
        });
      }
    } catch {
      setResult({ kind: "error", message: "Network error. Please try again later." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="relative pt-[8rem] sm:pt-[10rem]">
        <div className="shell text-center">
          <Reveal variant="fade">
            <span className="eyebrow inline-flex items-center gap-2">
              <Terminal className="size-3.5" aria-hidden />
              Activate ICODE
            </span>
          </Reveal>
          <Reveal variant="rise" delay={0.05}>
            <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-gradient">
              Unlock your <span className="text-gradient-accent">ICODE</span>
            </h1>
          </Reveal>
          <Reveal variant="rise" delay={0.12}>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-dim sm:text-base">
              Start with a free {PRICE.includes("1,000") ? "3-week" : ""} trial and enter your
              passcode to keep ICODE running after it ends.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="shell mt-12 pb-28 sm:mt-16 sm:pb-32">
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          {trialStarted && (
            <AnimatePresence>
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
                animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="glass relative overflow-hidden rounded-3xl border-accent-500/25 p-8 text-center sm:p-10"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-accent-500/20 blur-[90px]"
                />
                <span className="relative mx-auto grid size-14 place-items-center rounded-2xl border border-accent-500/30 bg-accent-500/10 text-accent-400">
                  <PartyPopper className="size-6" aria-hidden />
                </span>
                <h2 className="relative mt-5 text-[22px] font-semibold tracking-tight text-fg">
                  Welcome to ICODE
                </h2>
                <p className="relative mt-2 text-sm leading-relaxed text-dim">
                  Your free <span className="font-semibold text-accent-400">3-week trial</span> is
                  now enabled on this machine.
                </p>

                <div className="relative mt-7 flex items-center justify-center gap-3">
                  <div className="glass-strong flex min-w-32 flex-col items-center gap-1 rounded-2xl px-8 py-5">
                    <span className="text-5xl font-bold tracking-tight text-gradient-accent">
                      <Counter value={remainingDays} />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
                      Days left
                    </span>
                  </div>
                </div>
                <p className="relative mt-4 text-xs text-faint">
                  Trial ends <strong className="text-dim">{formatDate(trialExpires)}</strong>
                </p>

                <div className="relative mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-edge bg-white/[0.03] p-4 text-left">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
                    <p className="text-[13px] leading-relaxed text-dim">
                      Use ICODE with no limits while the trial lasts. No card required.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-edge bg-white/[0.03] p-4 text-left">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
                    <p className="text-[13px] leading-relaxed text-dim">
                      When it ends, pay 1,000 RWF and enter your passcode here to continue.
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {!trialStarted && (
            <Reveal variant="rise">
              <div className="glass rounded-3xl p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl border border-accent-500/25 bg-accent-500/10 text-accent-400">
                    <KeyRound className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-[17px] font-semibold tracking-tight text-fg">
                      Enter your passcode
                    </h2>
                    <p className="text-[13px] text-faint">
                      Provided by your ICODE administrator.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void submit();
                    }}
                    type="text"
                    placeholder="ICODE-XXXX-XXXX"
                    maxLength={64}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-label="ICODE passcode"
                    className={INPUT_CLS}
                  />
                  <button type="button" onClick={() => void submit()} disabled={busy} className={PRIMARY_BTN}>
                    {busy ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <ArrowRight className="size-4" aria-hidden />
                    )}
                    {busy ? "Verifying…" : "Continue to ICODE"}
                  </button>
                  {waitMachine && (
                    <p className="text-center text-xs text-faint">
                      The passcode binds to the terminal session that is waiting for you.
                    </p>
                  )}
                </div>

                <AnimatePresence>
                  {result && (
                    <motion.div
                      key={result.kind + result.message}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={reduced ? undefined : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed",
                        result.kind === "success" &&
                          "border-accent-500/40 bg-accent-500/10 text-accent-300",
                        result.kind === "error" &&
                          "border-red-500/40 bg-red-500/10 text-red-300",
                        result.kind === "info" &&
                          "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
                      )}
                      role={result.kind === "error" ? "alert" : "status"}
                    >
                      <p className="font-medium">{result.message}</p>
                      {result.hint && <p className="mt-0.5 text-xs opacity-80">{result.hint}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )}

          {trialStarted && (
            <Reveal variant="rise" delay={0.05}>
              <div className="glass rounded-3xl p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl border border-edge-strong bg-white/[0.04] text-fg">
                    <KeyRound className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-[17px] font-semibold tracking-tight text-fg">
                      Have a passcode?
                    </h2>
                    <p className="text-[13px] text-faint">
                      Type the passcode the admin gave you.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void submit();
                    }}
                    type="text"
                    placeholder="ICODE-XXXX-XXXX"
                    maxLength={64}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-label="ICODE passcode"
                    className={INPUT_CLS}
                  />
                  <button type="button" onClick={() => void submit()} disabled={busy} className={PRIMARY_BTN}>
                    {busy ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <CheckCircle2 className="size-4" aria-hidden />
                    )}
                    {busy ? "Verifying…" : "Continue"}
                  </button>
                </div>

                <AnimatePresence>
                  {result && (
                    <motion.div
                      key={result.kind + result.message}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={reduced ? undefined : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed",
                        result.kind === "success" &&
                          "border-accent-500/40 bg-accent-500/10 text-accent-300",
                        result.kind === "error" &&
                          "border-red-500/40 bg-red-500/10 text-red-300",
                        result.kind === "info" &&
                          "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
                      )}
                      role={result.kind === "error" ? "alert" : "status"}
                    >
                      <p className="font-medium">{result.message}</p>
                      {result.hint && <p className="mt-0.5 text-xs opacity-80">{result.hint}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )}

          <div className="flex items-center gap-4 py-1" role="separator">
            <span className="h-px flex-1 bg-edge" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">or</span>
            <span className="h-px flex-1 bg-edge" />
          </div>

          <Reveal variant="rise">
            <div className="overflow-hidden rounded-3xl border border-edge bg-white/[0.02]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-edge bg-white/[0.03] px-8 py-6 sm:px-10">
                <div>
                  <h2 className="text-[17px] font-semibold tracking-tight text-fg">
                    Continue after the trial
                  </h2>
                  <p className="mt-1 text-[13px] text-faint">
                    One-time activation · 3 weeks per payment
                  </p>
                </div>
                <div className="flex items-baseline gap-2 rounded-xl border border-accent-500/30 bg-accent-500/10 px-5 py-3">
                  <span className="text-2xl font-bold tracking-tight text-gradient-accent">
                    {PRICE}
                  </span>
                </div>
              </div>

              <div className="px-8 py-8 sm:px-10">
                <Stagger className="flex flex-col gap-3" amount={0.2}>
                  {PAYMENT_METHODS.map((m, i) => (
                    <PayMethod key={m.code} {...m} index={i} />
                  ))}
                </Stagger>

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-500/25 bg-yellow-500/[0.06] p-4">
                  <span className="text-yellow-300" aria-hidden>
                    ⚠
                  </span>
                  <p className="text-[13px] leading-relaxed text-dim">
                    <strong className="text-fg">Paying alone is not enough.</strong> You must also
                    fill in the Google Form so your payment can be verified and you receive a
                    passcode.
                  </p>
                </div>

                <a
                  href={PAYMENT_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(PRIMARY_BTN, "mt-4")}
                >
                  I PAID — FILL THE FORM
                  <ExternalLink className="size-4" aria-hidden />
                </a>
                <p className="mt-3 text-center text-xs text-faint">
                  After paying, fill in the form and wait for the admin to verify your payment.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal variant="fade" delay={0.1}>
            <div className="flex flex-col items-center gap-4 pt-4 text-center">
              <p className="text-xs text-faint">
                Return to your terminal and run again:{" "}
                <code className="rounded-md border border-edge bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-accent-400">
                  icode
                </code>
              </p>
              <Link
                to="/admin"
                className="text-xs text-faint underline-offset-2 transition-colors hover:text-accent-400 hover:underline"
              >
                Admin dashboard
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}