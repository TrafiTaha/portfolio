"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import { skills, type Skill } from "@/data/portfolio";

/* ---------- animation variants ---------- */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ---------- helpers ---------- */

function textColorFor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const yiq =
    (((n >> 16) & 255) * 299 +
      ((n >> 8) & 255) * 587 +
      (n & 255) * 114) /
    1000;
  return yiq > 160 ? "#18181b" : "#ffffff";
}

/* ---------- skill card ---------- */

function SkillCard({ skill }: { skill: Skill }) {
  const fg = textColorFor(skill.color);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.06, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-zinc-900/50 backdrop-blur-sm px-4 py-6 cursor-default overflow-hidden transition-colors duration-300 hover:border-white/15"
      style={
        {
          "--accent": skill.color,
        } as React.CSSProperties
      }
    >
      {/* hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${skill.color}18 0%, transparent 70%)`,
        }}
      />

      {/* brand badge */}
      <div
        className="relative z-10 flex items-center justify-center w-14 h-14 rounded-xl shadow-lg transition-shadow duration-300 group-hover:shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${skill.color}, ${skill.color}cc)`,
          boxShadow: `0 4px 20px ${skill.color}30`,
        }}
      >
        <span
          className="font-black text-sm tracking-tight select-none"
          style={{ color: fg }}
        >
          {skill.short}
        </span>
      </div>

      {/* skill name */}
      <span className="relative z-10 text-sm font-semibold text-zinc-300 group-hover:text-zinc-100 transition-colors duration-300 text-center">
        {skill.name}
      </span>

      {/* bottom accent line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-3/4 transition-all duration-500 rounded-full"
        style={{ background: skill.color }}
      />
    </motion.div>
  );
}

/* ---------- main section ---------- */

export default function Skills() {
  return (
    <Section id="skills" title="Skills" subtitle="Technologies I work with" index="02">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4"
      >
        {skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </motion.div>
    </Section>
  );
}
