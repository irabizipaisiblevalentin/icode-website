import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "../components/animations/Reveal";
import { BTN_PRIMARY, Field, INPUT_CLS } from "../components/admin/ui";
import {
  adminApi,
  clearAdminToken,
  getAdminName,
  setAdminName,
  setAdminToken,
  UnauthorizedError,
} from "../lib/control";
import { useDocumentTitle } from "../lib/route";
import { cn } from "../lib/cn";

export function AdminLogin() {
  useDocumentTitle("Admin sign in — ICODE");
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [name, setName] = useState(getAdminName());
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    const t = token.trim();
    if (!t) {
      setError("Enter your admin token to continue.");
      return;
    }
    setBusy(true);
    setError("");
    setAdminToken(t);
    try {
      await adminApi.stats();
      setAdminName(name.trim() || "admin");
      navigate("/admin", { replace: true });
    } catch (err) {
      clearAdminToken();
      if (err instanceof UnauthorizedError) {
        setError("That token was not accepted. Only the ICODE admin can sign in.");
      } else {
        setError("Could not reach the ICODE control server. Try again in a moment.");
      }
      setBusy(false);
    }
  };

  return (
    <>
      <header className="relative pt-[8rem] sm:pt-[10rem]">
        <div className="shell text-center">
          <Reveal variant="fade">
            <span className="eyebrow inline-flex items-center gap-2">
              <LockKeyhole className="size-3.5" aria-hidden />
              Restricted area
            </span>
          </Reveal>
          <Reveal variant="rise" delay={0.05}>
            <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-gradient">
              Admin <span className="text-gradient-accent">sign in</span>
            </h1>
          </Reveal>
          <Reveal variant="rise" delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-dim sm:text-base">
              This area is for the ICODE administrator only. Enter your admin token to manage
              users, payments, and passcodes.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="shell mt-10 pb-28 sm:mt-12 sm:pb-32">
        <Reveal variant="scale">
          <div className="mx-auto max-w-md">
            <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-accent-500/15 blur-[90px]"
              />

              <div className="relative flex flex-col items-center text-center">
                <span className="grid size-14 place-items-center rounded-2xl border border-accent-500/30 bg-accent-500/10 text-accent-400">
                  <ShieldCheck className="size-6" aria-hidden />
                </span>
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-fg">
                  Control center
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-dim">
                  Sign in with the admin token. Only authorized admins get in.
                </p>
              </div>

              <div className="relative mt-7 flex flex-col gap-4">
                <Field label="Admin token">
                  <div className="relative">
                    <input
                      value={token}
                      onChange={(e) => {
                        setToken(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void submit();
                      }}
                      type={show ? "text" : "password"}
                      placeholder="Enter your admin token"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      aria-label="Admin token"
                      className={cn(INPUT_CLS, "pr-11")}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? "Hide token" : "Show token"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-fg"
                    >
                      {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                    </button>
                  </div>
                </Field>

                <Field label="Your name (recorded in the audit log)">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="e.g. Paisible"
                    className={INPUT_CLS}
                  />
                </Field>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={reduced ? false : { opacity: 0, y: -4 }}
                      animate={reduced ? undefined : { opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-xs leading-relaxed text-red-300"
                      role="alert"
                    >
                      <KeyRound className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => void submit()}
                  disabled={busy}
                  className={cn(BTN_PRIMARY, "mt-1")}
                >
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <ShieldCheck className="size-4" aria-hidden />
                  )}
                  {busy ? "Verifying token…" : "Unlock dashboard"}
                </button>

                <p className="text-center text-[11px] leading-relaxed text-faint">
                  Your token and name are stored only in this browser. The token is never shown
                  again after sign in.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-dim transition-colors hover:text-accent-400"
              >
                <ArrowLeft className="size-4" aria-hidden />
                Back to ICODE
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}