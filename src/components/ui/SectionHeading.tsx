import type { ReactNode } from "react";
import { Reveal } from "../animations/Reveal";
import { cn } from "../../lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      id={id}
      className={cn(
        "relative z-10 mb-14 flex max-w-2xl flex-col gap-5 sm:mb-16",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal variant="fade">
          <span className="eyebrow flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-accent-400" aria-hidden />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <Reveal variant="rise" delay={0.05}>
        <h2 className="text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal variant="rise" delay={0.12}>
          <p className="max-w-xl text-[15px] leading-relaxed text-dim sm:text-base">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}