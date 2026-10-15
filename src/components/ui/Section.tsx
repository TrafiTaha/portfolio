"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

type SectionProps = {
  id: string;
  title?: string;
  subtitle?: string;
  index?: string;
  className?: string;
  children: ReactNode;
};

const word: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: i * 0.07 },
  }),
};

// Shared section shell: mono index tab, huge condensed title with a hand-drawn
// underline. The trigger lives on the heading container; the masked words
// animate through variants (never whileInView on an element hidden by its own mask).
export default function Section({ id, title, subtitle, index, className = "", children }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-[86rem] scroll-mt-16 px-5 py-16 md:scroll-mt-24 md:px-16 md:py-24 lg:px-20 ${className}`}
    >
      {title && (
        <div ref={ref} className="mb-10 md:mb-16">
          <div className="mb-4 flex items-baseline justify-between gap-4 border-t-2 border-ink pt-3">
            <span className="rounded-sm bg-ink px-2 py-0.5 font-mono text-xs font-bold tracking-[0.25em] text-paper">
              Nº {index ?? "00"}
            </span>
            {subtitle && (
              <span className="text-right font-mono text-[10px] font-semibold tracking-widest text-ink-soft uppercase sm:text-xs">
                {subtitle}
              </span>
            )}
          </div>
          <motion.h2
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-wrap font-display text-[17vw] leading-[0.95] tracking-tight text-ink uppercase sm:text-7xl md:text-8xl lg:text-9xl"
          >
            {title.split(" ").map((w, i) => (
              <span key={i} className="mr-[0.25em] inline-flex overflow-hidden pt-[0.06em] pb-[0.04em]">
                <motion.span custom={i} variants={word} className="inline-block">
                  {w}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <svg viewBox="0 0 400 14" className={`sketch mt-1 h-3 w-52 overflow-visible sm:w-72 ${inView ? "on" : ""}`} aria-hidden>
            <path d="M3 8q50-8 100-2t100 0 100-3 94 4" fill="none" stroke="#ff4d1c" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
