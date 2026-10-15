"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Section from "@/components/ui/Section";
import { aboutTags, certificates, personal, projects, skills } from "@/data/portfolio";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stats = [
  { value: String(projects.length), suffix: "", label: "featured projects", aside: "built to ship, not to demo" },
  { value: String(skills.length), suffix: "+", label: "technologies", aside: "and counting, every week" },
  { value: String(certificates.length), suffix: "", label: "certifications", aside: "from DevOps to AI" },
  { value: "1", suffix: "", label: "mission", aside: "simplify human complexity" },
];

export default function About() {
  return (
    <Section id="about" title="About Me" subtitle="Get to know me" index="01">
      <div className="grid items-start gap-12 md:grid-cols-12 md:gap-10">
        {/* taped, hand-framed portrait */}
        <motion.figure
          initial={{ opacity: 0, rotate: -6, y: 30 }}
          whileInView={{ opacity: 1, rotate: -2.5, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm md:col-span-5 md:max-w-none"
        >
          <span aria-hidden className="absolute -top-3 left-6 z-10 h-6 w-20 -rotate-6 bg-signal/80 shadow-sm" />
          <span aria-hidden className="absolute -top-3 right-6 z-10 h-6 w-20 rotate-6 bg-signal/80 shadow-sm" />
          <div className="border-2 border-ink bg-paper p-3 pb-14 shadow-[8px_8px_0_#111]">
            <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-ink grayscale-[0.35] contrast-[1.05]">
              <Image
                src={personal.image}
                alt={`Portrait of ${personal.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 40vw"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-3 text-center font-hand text-2xl text-ink">
              {personal.firstName}, {personal.location.split(",")[0]}
            </figcaption>
          </div>
        </motion.figure>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={container}
          className="md:col-span-7"
        >
          <motion.h3
            variants={fadeUp}
            className="font-display text-4xl leading-[0.95] tracking-tight text-ink uppercase md:text-5xl lg:text-6xl"
          >
            High-impact{" "}
            <span className="text-transparent [-webkit-text-stroke:2px_#111]">mobile &amp; web</span> applications
          </motion.h3>

          <motion.p variants={fadeUp} className="mt-6 text-base leading-relaxed text-ink/80 md:text-lg">
            Based in <strong className="text-ink">Tunis, Tunisia</strong>, I am a{" "}
            <strong className="text-ink">Software Engineer</strong> focused on shipping products people actually use:
            interactive web platforms, secure backend APIs and mobile experiences. I care about the details, from
            performance budgets and clean data models to interfaces that feel alive. Currently open to{" "}
            <mark className="bg-signal/30 px-1 font-semibold text-ink">new opportunities and collaborations</mark>.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            {aboutTags.map((tag, i) => (
              <span
                key={tag}
                style={{ rotate: `${((i * 5) % 7) - 3}deg` }}
                className={`border-2 border-dashed px-3 py-1.5 font-mono text-xs font-bold tracking-widest uppercase transition-colors md:text-sm ${
                  i % 4 === 0 ? "border-signal text-signal" : "border-ink text-ink"
                } hover:bg-ink hover:text-paper`}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ledger of honest numbers */}
      <div className="mt-16 grid grid-cols-2 gap-[2px] border-2 border-ink bg-ink md:mt-24 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="flex flex-col bg-paper p-5 md:p-7"
          >
            <span className="font-display text-5xl leading-none text-ink md:text-7xl">
              {stat.value}
              <span className="text-signal">{stat.suffix}</span>
            </span>
            <span className="mt-3 font-mono text-xs font-bold tracking-widest text-ink uppercase">{stat.label}</span>
            <span className="mt-1 font-hand text-lg text-ink-soft">{stat.aside}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
