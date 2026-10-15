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

const headingContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const wordReveal = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
};

const link =
  "font-bold text-ink underline decoration-signal decoration-2 underline-offset-4 transition-colors hover:text-signal";

export default function Contact() {
  return (
    <Section id="contact" title="Contact" subtitle="Let's build something together" index="06">
      <div className="pt-6 pb-16 md:pb-24">
        {/* trigger on the container; masked words animate via variants */}
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          variants={headingContainer}
          className="max-w-6xl font-display text-[15vw] leading-[0.95] tracking-tight text-ink uppercase sm:text-8xl lg:text-[9rem]"
        >
          {"Let's build something great".split(" ").map((word, i) => (
            <span key={i} className="mr-[0.22em] inline-flex overflow-hidden pt-[0.05em] pb-[0.04em]">
              <motion.span
                variants={wordReveal}
                className={`inline-block ${i >= 2 ? "text-transparent [-webkit-text-stroke:2px_#111]" : ""}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h3>

        <div className="mt-10 flex flex-wrap items-center gap-6 md:mt-14">
          <Magnetic strength={0.25}>
            <a
              href={personal.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border-[3px] border-ink bg-signal px-8 py-4 font-display text-2xl tracking-wide text-ink uppercase shadow-[6px_6px_0_#111] transition-transform hover:-translate-y-1 md:px-10 md:py-5 md:text-3xl"
            >
              Let&apos;s talk
              <ArrowUpRight size={26} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </Magnetic>
          <span className="font-mono text-xs font-bold tracking-widest text-ink-soft uppercase">
            {personal.whatsappNumber} · WhatsApp, anytime
          </span>
        </div>
      </div>

      <div className="grid gap-10 border-t-[3px] border-ink pt-10 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-6 md:col-span-6">
          <div>
            <span className="mb-1 block font-mono text-xs font-bold tracking-widest text-ink-soft uppercase">Location</span>
            <span className="text-base font-semibold text-ink">{personal.location} (Remote-friendly)</span>
          </div>
          <p className="max-w-md text-base leading-relaxed text-ink/80">
            Message me on{" "}
            <a href={personal.whatsapp} target="_blank" rel="noopener noreferrer" className={link}>
              WhatsApp
            </a>{" "}
            or{" "}
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
              LinkedIn
            </a>
            . For code, issues and collaboration, find me on{" "}
            <a href={personal.github} target="_blank" rel="noopener noreferrer" className={link}>
              GitHub
            </a>
            .
          </p>
        </div>

        <div className="md:col-span-3">
          <span className="mb-4 block font-mono text-xs font-bold tracking-widest text-ink-soft uppercase">Social</span>
          <div className="flex flex-col gap-3">
            {socials.map((s) => (
              <Magnetic key={s.label} strength={0.3} className="w-fit">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit items-center border-b-2 border-ink pb-0.5 font-display text-2xl tracking-wide text-ink uppercase transition-colors hover:border-signal hover:text-signal"
                >
                  {s.label}
                  <ArrowUpRight className="ml-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" size={20} aria-hidden />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 md:col-span-3 md:text-right">
          <div>
            <p className="font-hand text-2xl text-ink">Drawn and built</p>
            <p className="text-base font-bold text-ink">
              by <span className="text-signal">{personal.name}</span>
            </p>
          </div>
          <p className="flex items-center gap-1 font-mono text-xs font-bold tracking-wider text-ink-soft md:justify-end">
            <Copyright size={14} aria-hidden /> {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </Section>
  );
}
