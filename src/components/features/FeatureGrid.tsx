import { Globe, Sparkles, Terminal, Workflow, Zap, Layers } from "lucide-react";
import { FEATURES } from "../../lib/data";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "../animations/Reveal";
import { TiltCard } from "../animations/TiltCard";
import type { ComponentType } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  terminal: Terminal,
  zap: Zap,
  workflow: Workflow,
  seconds: Layers,
  globe: Globe,
};

export function FeatureGrid() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Features"
          title="Built for the way you actually code"
          description="Everything about ICODE is designed around one idea: intelligent development happens where the developer is — inside the terminal."
        />

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = ICONS[feature.icon] ?? Sparkles;
            return (
              <StaggerItem key={feature.title}>
                <TiltCard className="group/tilt h-full">
                  <article className="relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-edge bg-panel/80 p-6 transition-colors duration-300 hover:border-accent-500/30">
                    <div
                      className="pointer-events-none absolute -top-20 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/tilt:opacity-100"
                      style={{
                        background:
                          "radial-gradient(60% 60% at 50% 50%, rgba(61,216,186,0.18), transparent 70%)",
                      }}
                      aria-hidden
                    />
                    <span className="relative grid size-11 place-items-center rounded-xl border border-accent-500/25 bg-accent-500/10 text-accent-400 transition-transform duration-300 group-hover/tilt:scale-110">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="relative">
                      <h3 className="text-[17px] font-semibold tracking-tight text-fg">
                        {feature.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-dim">
                        {feature.body}
                      </p>
                    </div>
                  </article>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal
          variant="fade"
          className="mx-auto mt-12 max-w-2xl text-center text-sm text-faint"
        >
          ICODE runs on Windows, macOS, and Linux — one command, the same experience
          everywhere.
        </Reveal>
      </div>
    </section>
  );
}