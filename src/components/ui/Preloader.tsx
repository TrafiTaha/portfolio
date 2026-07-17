"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { personal } from "@/data/portfolio";

const EASE = [0.76, 0, 0.24, 1] as const;
const DURATION = 1500;

// Intro curtain. Renders nothing on the server and on first client paint, so
// it can NEVER cover content by default. A client effect decides — once per
// browser session, motion allowed — whether to reveal it, then always tears
// it down (with a hard safety net) and restores scrolling.
export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("intro-done")) return;

    sessionStorage.setItem("intro-done", "1");
    document.body.style.overflow = "hidden";

    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      setPercent(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    // reveal on the next frame so the effect never sets state synchronously
    const reveal = requestAnimationFrame(() => {
      setVisible(true);
      raf = requestAnimationFrame(tick);
    });

    const hide = () => {
      document.body.style.overflow = "";
      setVisible(false);
    };
    // primary dismissal + hard safety net so it can never stay stuck
    const primary = setTimeout(hide, DURATION + 350);
    const safety = setTimeout(hide, 4000);

    return () => {
      cancelAnimationFrame(reveal);
      cancelAnimationFrame(raf);
      clearTimeout(primary);
      clearTimeout(safety);
      document.body.style.overflow = "";
    };
  }, []);

  const name = personal.name.toUpperCase();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%", transition: { duration: 0.9, ease: EASE } }}
          className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center"
          aria-hidden
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap justify-center gap-x-3 px-6">
              {name.split(" ").map((word, w) => (
                <span key={w} className="flex overflow-hidden py-1">
                  {Array.from(word).map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: "115%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.15 + (w * 4 + i) * 0.035 }}
                      className="inline-block text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-zinc-100"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-mono text-[10px] tracking-[0.35em] text-zinc-500 uppercase mt-4"
          >
            Portfolio — {new Date().getFullYear()}
          </motion.p>

          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-14 font-mono font-black text-5xl md:text-7xl text-zinc-800 tabular-nums select-none">
            {percent}
            <span className="text-cyber-lime text-2xl md:text-4xl align-top">%</span>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-px bg-cyber-lime"
            style={{ width: `${percent}%` }}
            aria-hidden
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
