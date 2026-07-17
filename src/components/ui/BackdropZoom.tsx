"use client";

import { useEffect, useRef } from "react";

// The "world" layer: a fixed grid field that eases toward the cursor to hint
// at depth. Deliberately lightweight — one rAF that only runs while the mouse
// moves, writing a single transform (no springs, no scroll listeners), so it
// never competes with Lenis for the main thread. Overscanned via CSS so the
// tilt never exposes edges. Inert on touch / reduced-motion.
export default function BackdropZoom() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;
    let running = false;

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      el.style.transform = `scale(1.06) translate3d(${curX}px, ${curY}px, 0)`;
      if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * -24;
      targetY = (e.clientY / window.innerHeight - 0.5) * -24;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="site-backdrop" aria-hidden />;
}
