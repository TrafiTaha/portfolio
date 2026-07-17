"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import { aboutTags, certificates, personal, projects, skills } from "@/data/portfolio";

const container = {
  visible: { transition: { staggerChildren: 0.2 } },
};

const wordReveal = {
  hidden: { y: "115%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const stats = [
  { value: String(projects.length), suffix: "", label: "featured projects", aside: "*built to ship, not to demo" },
  { value: String(skills.length), suffix: "+", label: "technologies", aside: "*and counting, every week" },
  { value: String(certificates.length), suffix: "", label: "certifications", aside: "*from DevOps to AI" },
  { value: "1", suffix: "", label: "mission", aside: "*simplify human complexity" },
];

export default function About() {
  return (
    <Section id="about" title="About Me" subtitle="Get to know me" index="01" className="min-h-[70svh] flex flex-col justify-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={container}
        className="max-w-4xl"
      >
        <motion.h3 className="text-3xl md:text-4xl lg:text-6xl font-black text-white leading-none tracking-tighter uppercase mb-6 flex flex-wrap gap-x-3 gap-y-1">
          {personal.headline.split(" ").map((word, i) => (
            <span key={i} className="overflow-hidden inline-flex pb-1">
              <motion.span variants={wordReveal} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h3>

        <motion.p variants={fadeUp} className="text-base md:text-lg lg:text-xl text-zinc-400 font-medium leading-relaxed mb-8">
          Based in <strong className="text-zinc-100">Tunis, Tunisia</strong>, I am a{" "}
          <strong className="text-zinc-100">Software Engineer</strong> focused on shipping products people actually
          use — interactive web platforms, secure backend APIs and mobile experiences. I care about the details:
          performance budgets, clean data models, and interfaces that feel alive. Currently open to{" "}
          <strong className="text-cyber-lime">new opportunities and collaborations</strong>.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-2 md:gap-3">
          {aboutTags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full border border-white/10 bg-zinc-900/50 text-zinc-300 font-mono text-xs md:text-sm tracking-wide hover:border-cyber-lime hover:text-cyber-lime hover:bg-green-950/20 transition-all duration-300 cursor-default"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Stats — big numbers with small honest asides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800/60 border border-zinc-800/60 rounded-2xl overflow-hidden mt-14 md:mt-20">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.76, 0, 0.24, 1] }}
            className="bg-zinc-950 p-6 md:p-8 flex flex-col"
          >
            <span className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-100 leading-none">
              {stat.value}
              <span className="text-cyber-lime">{stat.suffix}</span>
            </span>
            <span className="text-xs md:text-sm font-semibold text-zinc-300 uppercase tracking-widest mt-3">
              {stat.label}
            </span>
            <span className="font-mono text-[10px] md:text-xs text-zinc-600 mt-1.5">{stat.aside}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
