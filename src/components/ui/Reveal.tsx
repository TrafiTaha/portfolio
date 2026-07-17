"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Lightweight "rise into focus" reveal. Animates ONCE when the block scrolls
// into view, then stops — no scroll-linked per-frame work, so it stays smooth
// even with several on the page. Gives a subtle camera-depth entrance.
export default function Reveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
