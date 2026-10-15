"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const canUseCursor = () =>
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Ink dot + trailing ring; both turn signal-orange over interactive elements.
// Fine pointers with motion allowed only (hidden on touch / reduced motion).
export default function Cursor() {
  const enabled = useSyncExternalStore(noopSubscribe, canUseCursor, () => false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let hovering = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      hovering = !!(e.target as Element | null)?.closest?.("a, button, [role='button'], input, textarea, select");
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${hovering ? 0.5 : 1})`;
        dot.style.background = hovering ? "#ff4d1c" : "#111";
      }
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;
        ring.style.borderColor = hovering ? "#ff4d1c" : "#111";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="pointer-events-none fixed top-0 left-0 z-[10000] h-2.5 w-2.5 rounded-full bg-ink" aria-hidden />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] h-8 w-8 rounded-full border-[1.5px] border-ink"
        aria-hidden
      />
    </>
  );
}
