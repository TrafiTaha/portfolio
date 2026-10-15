"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import { skills } from "@/data/portfolio";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 24, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

// Sticker sheet: die-cut ink-outlined stickers, each slightly off-axis.
export default function Skills() {
  return (
    <Section id="skills" title="Skills" subtitle="Technologies I work with" index="02">
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={container}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-6"
      >
        {skills.map((skill, i) => {
          const hot = i % 5 === 2;
          return (
            <motion.li key={skill.name} variants={item}>
              <div
                style={{ rotate: `${((i * 37) % 11) - 5}deg` }}
                className={`group flex aspect-square flex-col items-center justify-center gap-2 rounded-[1.4rem] border-[3px] border-ink px-2 text-center shadow-[4px_4px_0_#111] transition-all duration-300 hover:-translate-y-1 hover:rotate-0! hover:bg-signal ${
                  hot ? "bg-signal" : "bg-[#fffdf8]"
                }`}
              >
                <span className="font-display text-3xl leading-none tracking-wide text-ink uppercase md:text-4xl">
                  {skill.short}
                </span>
                <span className="font-mono text-[10px] font-bold tracking-wider text-ink uppercase md:text-[11px]">
                  {skill.name}
                </span>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}
