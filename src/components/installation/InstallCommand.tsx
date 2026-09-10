import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { INSTALL_COMMAND } from "../../lib/data";
import { useCopyCommand } from "../../lib/hooks";
import { cn } from "../../lib/cn";

interface InstallCommandProps {
  command?: string;
  className?: string;
}

export function InstallCommand({ command = INSTALL_COMMAND, className }: InstallCommandProps) {
  const { copied, failed, copy } = useCopyCommand();

  const onCopy = () => {
    void copy(command);
  };

  return (
    <div
      className={cn(
        "relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-edge bg-[#0b0b10]/95 pr-2 font-mono shadow-[0_16px_48px_-16px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <div className="min-w-0 flex-1 overflow-x-auto py-4 pl-5 text-[13px]">
        <div className="flex items-center gap-2 whitespace-pre">
          <span className="shrink-0 select-none font-semibold text-accent-400">$</span>
          <span className="shrink-0 text-dim">{command}</span>
        </div>
      </div>

      <div className="relative shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-1.5 rounded-lg border border-accent-500/40 bg-accent-500/10 px-3.5 py-2 text-xs font-medium text-accent-400"
              aria-live="polite"
            >
              <Check className="size-3.5" aria-hidden />
              Copied
            </motion.span>
          ) : (
            <motion.button
              key="copy"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              onClick={onCopy}
              type="button"
              title="Copy command"
              aria-label="Copy install command to clipboard"
              className="flex items-center gap-1.5 rounded-lg border border-edge-strong bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-dim transition-colors hover:border-accent-500/50 hover:text-fg focus-visible:outline-accent-500"
            >
              <Copy className="size-3.5" aria-hidden />
              Copy
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {failed && (
        <div
          role="status"
          className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b0b10]/95 px-4 font-sans text-xs text-faint"
        >
          Unable to copy. Please copy the command manually.
        </div>
      )}
    </div>
  );
}