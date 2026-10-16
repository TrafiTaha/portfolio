"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const canUseCursor = () =>
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sticker-style arrow: paper fill, 2px ink outline and a hard offset shadow, like the
// site's buttons and cards. Turns signal-orange and grows over interactive elements.
// Fine pointers with motion allowed only (hidden on touch / reduced motion).
export default function Cursor() {
  const enabled = useSyncExternalStore(noopSubscribe, canUseCursor, () => false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    let x = -100;
    let y = -100;
    let hovering = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      hovering = !!(e.target as Element | null)?.closest?.("a, button, [role='button'], input, textarea, select");
    };

    const loop = () => {
      const el = ref.current;
      if (el) {
        // hotspot is the arrow tip (top-left), so no centering offset
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${hovering ? 1.25 : 1}) rotate(${hovering ? -8 : 0}deg)`;
        el.style.setProperty("--cursor-fill", hovering ? "#ff4d1c" : "#f4f1ea");
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
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[10000] origin-top-left"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
      aria-hidden
    >
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
        {/* hard offset shadow, same as the 3px buttons */}
        <path d="M4 4 L4 25 L9.5 20 L13.5 29 L17 27.5 L13 18.5 L20.5 18.5 Z" fill="#111" />
        <path
          d="M2 2 L2 23 L7.5 18 L11.5 27 L15 25.5 L11 16.5 L18.5 16.5 Z"
          fill="var(--cursor-fill, #f4f1ea)"
          stroke="#111"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
