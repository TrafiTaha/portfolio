"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
};

export default function Section({ id, title, subtitle, className = "", children }: SectionProps) {
  const reduceMotion = useReducedMotion();

  const letterVariants: Variants = {
    initial: { y: "0%", opacity: 1 },
    animate: (i: number) =>
      reduceMotion
        ? { y: "0%", opacity: 1 }
        : {
            y: ["0%", "-115%", "115%", "0%"],
            opacity: [1, 0, 0, 1],
            transition: {
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1],
              delay: i * 0.04,
              repeat: Infinity,
              repeatDelay: 6,
            },
          },
  };

  let letterIndex = 0;

  return (
    <section
      id={id}
      className={`w-full max-w-[86rem] mx-auto px-5 py-16 md:px-16 md:py-24 lg:px-20 relative scroll-mt-16 md:scroll-mt-24 ${className}`}
    >
      {title && (
        <div className="relative w-full mb-8 md:mb-14 text-left">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-zinc-100 uppercase flex flex-wrap items-center leading-none">
            {title.toUpperCase().split(" ").map((word, w) => (
              <span key={w} className="flex overflow-hidden py-1 pr-2.5 mr-[0.25em]">
                {Array.from(word).map((letter) => {
                  const i = letterIndex++;
                  return (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={letterVariants}
                      initial="initial"
                      animate="animate"
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
          </h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest text-zinc-500 uppercase mt-2.5"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
