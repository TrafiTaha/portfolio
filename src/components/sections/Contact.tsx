"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Copyright } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import Section from "@/components/ui/Section";
import { personal } from "@/data/portfolio";

const socials = [
  { label: "GitHub", href: personal.github },
  { label: "LinkedIn", href: personal.linkedin },
  { label: "Facebook", href: personal.facebook },
  { label: "Instagram", href: personal.instagram },
  { label: "WhatsApp", href: personal.whatsapp },
];

const wordReveal = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const, delay: i * 0.06 },
  }),
};

export default function Contact() {
  return (
    <Section id="contact" title="Contact" subtitle="Let's build something together" index="06">
      {/* Mega CTA */}
      <div className="pt-10 pb-16 md:pt-16 md:pb-24">
        <h3 className="text-[11vw] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.95] text-zinc-100 max-w-5xl">
          {"The future is waiting — let's build it".split(" ").map((word, i) => (
            <span key={i} className="inline-flex overflow-hidden pb-1 mr-[0.22em]">
              <motion.span
                custom={i}
                variants={wordReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className={`inline-block ${i >= 5 ? "text-transparent [-webkit-text-stroke:1.5px_#22c55e]" : ""}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h3>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center gap-6 mt-10 md:mt-14"
        >
          <Magnetic strength={0.25}>
            <a
              href={personal.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-cyber-lime text-zinc-950 font-black text-base md:text-lg px-8 py-4 md:px-10 md:py-5 hover:bg-zinc-100 transition-colors duration-300"
            >
              Let&apos;s Talk
              <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Magnetic>
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
            {personal.whatsappNumber} — WhatsApp, anytime
          </span>
        </motion.div>
      </div>

      {/* Footer columns */}
      <div className="w-full flex flex-col md:flex-row gap-10 md:gap-8 items-start pt-12 border-t border-zinc-800/80">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div className="flex flex-col">
            <span className="text-xs font-mono font-semibold tracking-widest text-zinc-500 uppercase mb-1">
              Location
            </span>
            <span className="text-sm md:text-base text-zinc-200 font-semibold">
              {personal.location} (Remote-friendly)
            </span>
          </div>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-md">
            Message me on{" "}
            <a
              href={personal.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-lime hover:text-green-300 font-semibold transition-colors"
            >
              WhatsApp
            </a>{" "}
            or{" "}
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-lime hover:text-green-300 font-semibold transition-colors"
            >
              LinkedIn
            </a>
            . For code, issues and collaboration, find me on{" "}
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-lime hover:text-green-300 font-semibold transition-colors"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col md:pl-10">
          <span className="text-xs font-mono font-semibold tracking-widest text-zinc-500 uppercase mb-4">Social</span>
          <div className="flex flex-col gap-3">
            {socials.map((s) => (
              <Magnetic key={s.label} strength={0.3} className="w-fit">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-base md:text-lg text-zinc-200 hover:text-cyber-lime font-semibold transition-colors w-fit border-b border-zinc-800 hover:border-cyber-lime/50 pb-0.5 inline-flex items-center"
                >
                  {s.label}
                  <ArrowUpRight
                    className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300"
                    size={19}
                    aria-hidden
                  />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col justify-between h-full md:text-right gap-6 md:gap-0">
          <div>
            <p className="text-sm md:text-base text-zinc-300 font-semibold leading-relaxed">Designed and developed</p>
            <p className="text-sm md:text-base text-zinc-200 font-bold leading-relaxed">
              by <span className="text-cyber-lime">{personal.name}</span>
            </p>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 font-mono font-semibold tracking-wider md:mt-24 flex flex-row items-center md:justify-end gap-1">
            <Copyright size={14} aria-hidden /> {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </Section>
  );
}
