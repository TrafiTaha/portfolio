"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, type ReactNode } from "react";

// Lenis owns scrolling once mounted, so programmatic navigation MUST go
// through lenis.scrollTo — native window.scrollTo is swallowed by its rAF.
// The instance is published on window so navigation can reach it without any
// module-singleton ambiguity across client bundles.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Layout position of an element, summed through the offsetParent chain.
// Transform-independent (unlike getBoundingClientRect), so it stays correct
// even while a section is mid depth-zoom animation.
function layoutTop(el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

export function scrollToTarget(target: number | string, offset = 0) {
  let top: number;
  if (typeof target === "number") {
    top = target;
  } else {
    const el = typeof document !== "undefined" ? document.querySelector<HTMLElement>(target) : null;
    if (!el) return;
    top = layoutTop(el) + offset;
  }
  top = Math.max(0, top);

  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.4 });
  } else if (typeof window !== "undefined") {
    window.scrollTo({ top, behavior: "smooth" });
  }
}

// Global weightless scrolling. Mounted once in the root layout so every
// route shares the same physics. Skipped entirely for reduced-motion users.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Slightly longer glide so the camera-zoom depth effects decelerate softly
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
