import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export const CARD = "glass rounded-2xl p-5 sm:p-6";
export const INPUT_CLS =
  "w-full rounded-xl border border-edge-strong bg-black/40 px-3.5 py-2.5 text-sm text-fg placeholder:text-faint outline-none transition-colors focus:border-accent-500/60";
export const SELECT_CLS =
  "rounded-xl border border-edge-strong bg-black/40 px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-accent-500/60";
export const BTN_PRIMARY =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 text-sm font-semibold text-black transition-all hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50";
export const BTN_SECONDARY =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-edge-strong bg-white/[0.04] px-4 text-sm font-medium text-fg transition-all hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50";
export const BTN_DANGER =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50";
export const BTN_SM = "min-h-8 rounded-lg px-3 text-xs";

export function CountUp({ value }: { value: number }) {
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
    const duration = 650;
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

const BADGES: Record<string, string> = {
  PENDING: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  APPROVED: "border-accent-500/40 bg-accent-500/10 text-accent-300",
  REJECTED: "border-red-500/40 bg-red-500/10 text-red-300",
  active: "border-accent-500/40 bg-accent-500/10 text-accent-300",
  expired: "border-edge-strong bg-white/[0.05] text-faint",
  revoked: "border-red-500/40 bg-red-500/10 text-red-300",
  public: "border-accent-500/40 bg-accent-500/10 text-accent-300",
  personal: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  dup: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
};

export function Badge({
  status,
  children,
}: {
  status: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        BADGES[status] ?? "border-edge-strong bg-white/[0.05] text-dim",
      )}
    >
      {children}
    </span>
  );
}

export function CodeChip({ children }: { children: ReactNode }) {
  return (
    <code className="whitespace-nowrap rounded-md border border-edge-strong bg-black/50 px-2 py-0.5 font-mono text-xs text-accent-400">
      {children}
    </code>
  );
}

export function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "accent" | "warn" | "danger";
}) {
  return (
    <div className="glass rounded-2xl p-5 transition-colors hover:border-accent-500/25">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-3xl font-bold tracking-tight",
          tone === "accent" && "text-gradient-accent",
          tone === "warn" && "text-yellow-300",
          tone === "danger" && "text-red-400",
          tone === "default" && "text-fg",
        )}
      >
        <CountUp value={value} />
      </p>
    </div>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-faint">
      <Loader2 className="size-4 animate-spin text-accent-400" aria-hidden />
      <span className="text-xs">{label}</span>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-faint">
      <AlertTriangle className="size-4 opacity-60" aria-hidden />
      <p className="text-xs">{message}</p>
    </div>
  );
}

export type ToastKind = "success" | "error" | "warn" | "info";

export interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

const TOAST_STYLES: Record<ToastKind, string> = {
  success: "border-accent-500/50 text-accent-200",
  error: "border-red-500/50 text-red-200",
  warn: "border-yellow-500/50 text-yellow-200",
  info: "border-edge-strong text-fg",
};

export function ToastHost({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[110] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => onDismiss(t.id)}
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "pointer-events-auto max-w-md rounded-xl border bg-[#0d0d12]/90 px-4 py-3 text-left text-sm shadow-2xl backdrop-blur-xl",
              TOAST_STYLES[t.kind],
            )}
          >
            {t.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Dialog"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.95, y: 12 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "max-h-[88vh] w-full overflow-y-auto rounded-2xl border border-edge-strong bg-[#0d0d12] p-6 shadow-2xl sm:p-7",
              wide ? "max-w-2xl" : "max-w-md",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold tracking-tight text-fg">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="grid size-8 place-items-center rounded-lg border border-edge text-dim transition-colors hover:text-fg"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}