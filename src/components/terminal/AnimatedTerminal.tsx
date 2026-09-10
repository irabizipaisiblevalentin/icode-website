import { useEffect, useState, type ReactNode } from "react";
import { TerminalWindow } from "./TerminalWindow";
import { cn } from "../../lib/cn";

export type ScriptLine =
  | { type: "typed"; prompt?: string; text: string; speed?: number }
  | { type: "output"; text: string; speed?: number; accent?: boolean }
  | { type: "progress"; label: string }
  | { type: "pause"; ms: number }
  | { type: "blank" };

interface AnimatedTerminalProps {
  lines: ScriptLine[];
  title?: string;
  className?: string;
  bodyClassName?: string;
  glow?: boolean;
  loop?: boolean;
  instant?: boolean;
}

export function AnimatedTerminal({
  lines,
  title,
  className,
  bodyClassName,
  glow = false,
  loop = false,
  instant = false,
}: AnimatedTerminalProps) {
  const [nodes, setNodes] = useState<ReactNode[]>([]);

  useEffect(() => {
    let cancelled = false;
    const emit = (node: ReactNode) => {
      if (!cancelled) setNodes([node]);
    };
    const play = async () => {
      if (instant) {
        emit(renderInstant(lines));
        return;
      }
      for (;;) {
        await runScript(lines, emit);
        if (!loop || cancelled) break;
        await wait(2600);
      }
    };
    play();
    return () => {
      cancelled = true;
    };
  }, [lines, loop, instant]);

  return (
    <TerminalWindow
      title={title}
      className={className}
      bodyClassName={cn("p-4 font-mono text-[13px] leading-relaxed", bodyClassName)}
      glow={glow}
    >
      <div className="min-h-[9.5rem]">{nodes}</div>
    </TerminalWindow>
  );
}

function renderInstant(lines: ScriptLine[]): ReactNode {
  const out: ReactNode[] = [];
  for (const line of lines) {
    if (line.type === "typed") {
      out.push(
        <PromptLine key={out.length} prompt={line.prompt ?? "$"} text={line.text} />,
      );
    } else if (line.type === "output") {
      out.push(
        <PromptLine
          key={out.length}
          prompt=""
          text={line.text}
          accent={line.accent}
        />,
      );
    } else if (line.type === "progress") {
      out.push(
        <ProgressLine
          key={out.length}
          label={line.label}
          fill="██████████████████"
        />,
      );
    } else if (line.type === "blank") {
      out.push(<div key={out.length} className="h-[1.25em]" />);
    }
  }
  return out;
}

async function runScript(
  lines: ScriptLine[],
  emit: (node: ReactNode) => void,
): Promise<void> {
  const queue: ReactNode[] = [];

  const commit = () => emit(<>{queue}</>);

  const push = (node: ReactNode) => {
    queue.push(node);
    commit();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    await wait(line.type === "pause" ? line.ms : line.type === "blank" ? 60 : 40);

    if (line.type === "blank") {
      push(<div className="h-[1.25em]" />);
      continue;
    }
    if (line.type === "pause") continue;

    if (line.type === "typed") {
      const prompt = line.prompt ?? "$";
      push(<PromptLine prompt={prompt} text="" cursor />);
      const shown = await typeText(line.text, line.speed ?? 26, (t) => {
        queue[queue.length - 1] = <PromptLine prompt={prompt} text={t} cursor />;
        commit();
      });
      queue[queue.length - 1] = <PromptLine prompt={prompt} text={shown} />;
      commit();
    } else if (line.type === "output") {
      push(<PromptLine prompt="" text="" cursor />);
      const shown = await typeText(line.text, line.speed ?? 14, (t) => {
        queue[queue.length - 1] = (
          <PromptLine prompt="" text={t} accent={line.accent} cursor />
        );
        commit();
      });
      queue[queue.length - 1] = (
        <PromptLine prompt="" text={shown} accent={line.accent} />
      );
      commit();
    } else if (line.type === "progress") {
      push(<ProgressLine label={line.label} fill={"░".repeat(18) + " "} />);
      for (let blocks = 2; blocks <= 18; blocks += 2) {
        const fill = "█".repeat(blocks) + "░".repeat(18 - blocks);
        queue[queue.length - 1] = <ProgressLine label={line.label} fill={fill} />;
        commit();
        await wait(26);
      }
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function typeText(text: string, speed: number, onUpdate: (shown: string) => void) {
  return new Promise<string>((resolve) => {
    let i = 0;
    const tick = () => {
      i++;
      onUpdate(text.slice(0, i));
      if (i >= text.length) {
        resolve(text);
      } else {
        window.setTimeout(tick, speed);
      }
    };
    window.setTimeout(tick, speed);
  });
}

function ProgressLine({ label, fill }: { label: string; fill: string }) {
  return (
    <div className="flex items-center gap-2 text-dim">
      <span className="shrink-0">{label}</span>
      <span className="text-accent-400">{fill}</span>
      <span className="font-medium text-faint">100%</span>
    </div>
  );
}

function PromptLine({
  prompt,
  text,
  accent = false,
  cursor = false,
}: {
  prompt: string;
  text: string;
  accent?: boolean;
  cursor?: boolean;
}) {
  return (
    <div
      className={cn(
        "whitespace-pre-wrap break-words",
        accent ? "text-accent-400" : "text-dim",
      )}
    >
      {prompt ? <span className="text-accent-400">{prompt}&nbsp;</span> : null}
      <span className={accent ? "text-accent-400" : "text-dim"}>{text}</span>
      {cursor ? (
        <span
          className="ml-[1px] inline-block h-[1.05em] w-[0.55em] translate-y-[0.16em] bg-fg/70 animate-blink"
          aria-hidden
        />
      ) : null}
    </div>
  );
}