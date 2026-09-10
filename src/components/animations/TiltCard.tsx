import type { ReactNode, MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useIsTouch, usePrefersReducedMotion } from "../../lib/hooks";
import { cn } from "../../lib/cn";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

export function TiltCard({
  children,
  className,
  intensity = 10,
  glare = true,
}: TiltCardProps) {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [intensity, -intensity]), {
    stiffness: 220,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-intensity, intensity]), {
    stiffness: 220,
    damping: 24,
  });
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${useTransform(
    x,
    [0, 1],
    [0, 100],
  )}% 50%, rgba(255,255,255,0.08), transparent 55%)`;

  const disabled = isTouch || reduced;

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  };

  const onLeave = () => {
    if (disabled) return;
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      className={cn("relative [transform-style:preserve-3d]", className)}
      style={
        disabled
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900 }
      }
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      {glare && !disabled && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}