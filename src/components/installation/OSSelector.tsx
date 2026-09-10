import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Monitor, Terminal } from "lucide-react";
import { OS_DETAILS, OS_OPTIONS, type OsId } from "../../lib/data";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { cn } from "../../lib/cn";

const ICONS: Record<OsId, ReactNode> = {
  windows: <Monitor className="size-4" aria-hidden />,
  macos: (
    <svg viewBox="0 0 24 24" className="size-4 fill-none" aria-hidden>
      <path
        d="M16.2 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.4 2.8 2.3 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7c1.2 0 2-1.1 2.7-2.2.8-1.3 1.2-2.5 1.2-2.6-.1 0-2.1-.8-2-3.3"
        className="fill-current"
      />
      <ellipse cx="14.6" cy="5.9" rx="1.7" ry="2" className="fill-current" />
    </svg>
  ),
  linux: (
    <svg viewBox="0 0 24 24" className="size-4 fill-none" aria-hidden>
      <path
        d="M9.5 20.5s.5.9 1.8.7c1.1-.2 1.2-1 2.4-1s1.4.8 2.4 1c1.3.2 1.8-.7 1.8-.7M8 14.5c.6.4 1.5.3 1.9 0M16 14.5m-1.6 0c.5.3 1.3.4 1.7 0M10.4 16.5h3.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="stroke-current"
      />
      <path
        d="M7.5 11.5c-.6-.5-1.2-1.7-1.3-2.8-.1-1.3.6-2.4 1.4-2.2.9.2 1 .4.7 1.1-.3.8-1.3 3.4-1 4.6"
        className="fill-current opacity-80"
      />
      <path
        d="M16.5 11.5c.6-.5 1.2-1.7 1.3-2.8.1-1.3-.6-2.4-1.4-2.2-.9.2-1 .4-.7 1.1.3.8 1.3 3.4 1 4.6"
        className="fill-current opacity-80"
      />
      <path
        d="M8.8 13.9c-1.3.6-2.4 1.4-2.9 2.6-.5 1.3-.9 3.2-.4 4.7M15.2 13.9c1.3.6 2.5 1.5 3 2.6.2.7.2 1.5.1 2.3M8.4 13.4c.1-1.7.9-2.8 1.7-3.2.8-.4 2-.4 3.4-.4.9 0 2.1.1 2.8.6.7.4 1.2 1.3 1.3 2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        className="stroke-current"
      />
    </svg>
  ),
};

interface OSSelectorProps {
  onChange?: (os: OsId) => void;
  className?: string;
}

export function OSSelector({ onChange, className }: OSSelectorProps) {
  const [active, setActive] = useState<OsId>("linux");
  const reduced = usePrefersReducedMotion();
  const refs = useRef<Record<OsId, HTMLButtonElement | null>>(
    {} as Record<OsId, HTMLButtonElement | null>,
  );

  const select = (os: OsId) => {
    setActive(os);
    onChange?.(os);
  };

  const onKeyDown = (event: KeyboardEvent, os: OsId) => {
    const order = OS_OPTIONS.map((o) => o.id);
    const index = order.indexOf(os);
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % order.length;
    if (event.key === "ArrowLeft") next = (index - 1 + order.length) % order.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = order.length - 1;
    select(order[next]);
    refs.current[order[next]]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Operating system"
        className="inline-flex items-center gap-1 rounded-xl border border-edge bg-white/[0.03] p-1"
      >
        {OS_OPTIONS.map((os) => {
          const selected = active === os.id;
          return (
            <button
              key={os.id}
              ref={(el) => {
                refs.current[os.id] = el;
              }}
              role="tab"
              aria-selected={selected}
              id={`os-tab-${os.id}`}
              aria-controls="os-panel"
              onClick={() => select(os.id)}
              onKeyDown={(e) => onKeyDown(e, os.id)}
              type="button"
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                selected ? "text-fg" : "text-faint hover:text-dim",
              )}
            >
              {selected && !reduced && (
                <motion.span
                  layoutId="os-active-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/10"
                  aria-hidden
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {ICONS[os.id]}
                {os.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="os-panel"
        role="tabpanel"
        aria-labelledby={`os-tab-${active}`}
        className="mt-5"
      >
        <p className="font-mono text-xs text-faint">
          <Terminal className="mr-2 inline size-3.5" aria-hidden />
          {OS_DETAILS[active].shell}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-dim">
          {OS_DETAILS[active].note}
        </p>
      </div>
    </div>
  );
}