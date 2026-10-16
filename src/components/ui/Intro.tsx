"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { personal } from "@/data/portfolio";

const KEY = "tbr-intro";
const EASE = [0.76, 0, 0.24, 1] as const;

// One-time pencil sketch of the name over paper, then it lifts away.
// Renders nothing on the server or first paint (never covers content by default), plays once
// per browser session, never for reduced motion, click to skip, hard timeout so it cannot stick.
export default function Intro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (window.sessionStorage.getItem(KEY)) return;
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage blocked: just play it */
    }
    // next frame, so the effect never sets state synchronously
    const show = requestAnimationFrame(() => setVisible(true));
    const done = window.setTimeout(() => setVisible(false), 2000);
    const safety = window.setTimeout(() => setVisible(false), 3500);
    return () => {
      cancelAnimationFrame(show);
      window.clearTimeout(done);
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          exit={{ y: "-100%", transition: { duration: 0.7, ease: EASE } }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[9980] flex flex-col items-center justify-center bg-paper px-4"
          aria-hidden
        >
          <svg viewBox="0 0 1600 240" className="w-full max-w-5xl overflow-visible" style={{ filter: "url(#wobble)" }}>
            <text
              x="800"
              y="190"
              textAnchor="middle"
              className="intro-text"
              style={{ fontFamily: "var(--f-display), Impact, sans-serif", fontSize: 190 }}
              fill="#111"
              stroke="#111"
              strokeWidth="3"
              strokeLinejoin="round"
            >
              {personal.name.toUpperCase()}
            </text>
          </svg>
          <p className="mt-4 font-mono text-[10px] font-bold tracking-[0.3em] text-ink-soft uppercase sm:text-xs">
            {personal.role} · Portfolio Nº 2026
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
