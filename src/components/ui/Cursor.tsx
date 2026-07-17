"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const canUseCursor = () =>
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Custom cursor: a solid dot that sticks to the pointer plus a trailing ring
// that eases behind it and swells over interactive elements.
// Renders only for fine pointers with motion allowed.
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
      hovering = !!(e.target as Element | null)?.closest?.(
        "a, button, [role='button'], canvas, input, textarea, select"
      );
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${hovering ? 2.2 : 1})`;
        ring.style.opacity = hovering ? "0.9" : "0.5";
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
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10000] w-2 h-2 rounded-full bg-cyber-lime pointer-events-none"
        aria-hidden
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10000] w-8 h-8 rounded-full border border-zinc-100 pointer-events-none transition-opacity duration-300 mix-blend-difference"
        aria-hidden
      />
    </>
  );
}
