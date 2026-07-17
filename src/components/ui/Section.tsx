"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title?: string;
  subtitle?: string;
  index?: string; // e.g. "01" — rendered as an nk-style overline "/01"
  className?: string;
  children: ReactNode;
};

const letterVariants: Variants = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: i * 0.03 },
  }),
};

export default function Section({ id, title, subtitle, index, className = "", children }: SectionProps) {
  let letterIndex = 0;

  return (
    <section
      id={id}
      className={`w-full max-w-[86rem] mx-auto px-5 py-16 md:px-16 md:py-24 lg:px-20 relative scroll-mt-16 md:scroll-mt-24 ${className}`}
    >
      {title && (
        <div className="relative w-full mb-8 md:mb-14 text-left">
          {/* structural rule: index left, mono meta right */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-baseline justify-between gap-4 border-t border-white/[0.08] pt-4 mb-6 md:mb-8"
          >
            <span className="font-mono text-xs md:text-sm font-bold tracking-[0.3em] text-cyber-lime">
              {index ? `/${index}` : "//"}
            </span>
            {subtitle && (
              <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest text-zinc-500 uppercase text-right">
                {subtitle}
              </span>
            )}
          </motion.div>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-zinc-100 uppercase flex flex-wrap items-center leading-none"
          >
            {title.toUpperCase().split(" ").map((word, w) => (
              <span key={w} className="flex overflow-hidden py-1 pr-2.5 mr-[0.25em]">
                {Array.from(word).map((letter) => {
                  const i = letterIndex++;
                  return (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={letterVariants}
                      className="inline-block"
                      style={{
                        textShadow:
                          "2px 2px 0px rgba(34,197,94,0.08), 4px 4px 0px rgba(0,0,0,0.85), 8px 8px 24px rgba(0,0,0,0.9)",
                      }}
                    >
                      {letter}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </motion.h2>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
