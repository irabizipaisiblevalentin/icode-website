import { useEffect, useRef, useState } from "react";
import { useIsTouch, usePrefersReducedMotion, useMediaQuery } from "../../lib/hooks";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label, [data-cursor]";

export function CustomCursor() {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const [enabled, setEnabled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pressed, setPressed] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch || reduced || !finePointer) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");
    return () => {
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [isTouch, reduced, finePointer]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf = 0;
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let visible = false;

    const move = (event: PointerEvent) => {
      mx = event.clientX;
      my = event.clientY;
      if (!visible) {
        rx = mx;
        ry = my;
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
    };

    const over = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR);
      setExpanded(!!target);
    };

    const down = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR)) {
        setPressed(true);
      }
    };
    const up = () => setPressed(false);
    const leave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring) {
        const size = expanded ? 46 : 30;
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
        ring.style.transform = `translate3d(${rx - size / 2}px, ${ry - size / 2}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled, expanded]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] size-1.5 rounded-full bg-accent-400 opacity-0 transition-opacity duration-200"
      />
      <div
        ref={ringRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[199] ring-cursor-expand rounded-full border opacity-0 ${
          expanded
            ? "border-accent-400/70 bg-accent-400/10"
            : "border-faint/50 bg-transparent"
        } ${pressed ? "scale-[0.85]" : ""}`}
      />
    </>
  );
}