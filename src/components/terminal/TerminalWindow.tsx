import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface TerminalWindowProps {
  children: ReactNode;
  title?: string;
  className?: string;
  bodyClassName?: string;
  glow?: boolean;
}

export function TerminalWindow({
  children,
  title,
  className,
  bodyClassName,
  glow = false,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-edge bg-[#0b0b10]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl",
        glow && "glow-accent",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-edge bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]/80" />
          <span className="size-3 rounded-full bg-[#febc2e]/80" />
          <span className="size-3 rounded-full bg-[#28c840]/80" />
        </div>
        {title ? (
          <span className="truncate font-mono text-[11px] tracking-wide text-faint">
            {title}
          </span>
        ) : null}
      </div>
      <div className={cn("overflow-x-auto", bodyClassName)}>{children}</div>
    </div>
  );
}