"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { aboutTags, certificates, personal, skills } from "@/data/portfolio";

const G = { fill: "none", stroke: "#111", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// What each object on the desk says (all taken from the site's own About copy / data).
const notes = {
  monitor: { label: "On the monitor", text: personal.summary },
  lamp: { label: "Under the lamp", text: "I care about the details: performance budgets, clean data models, and interfaces that feel alive." },
  mug: { label: "In the mug", text: "Currently open to new opportunities and collaborations." },
  notebook: { label: "In the notebook", text: `Based in ${personal.location}. Remote-friendly.` },
} as const;
type Key = keyof typeof notes;

// pos = % of the desk SVG box
const hotspots: { key: Key; name: string; left: number; top: number; w: number; h: number }[] = [
  { key: "monitor", name: "monitor", left: 6, top: 8, w: 28, h: 40 },
  { key: "lamp", name: "desk lamp", left: 40, top: 6, w: 18, h: 44 },
  { key: "mug", name: "coffee mug", left: 66, top: 36, w: 11, h: 18 },
  { key: "notebook", name: "notebook", left: 56, top: 62, w: 28, h: 14 },
];

// Desk scene: a taped portrait on the wall and a drawn desk. Poke the objects to read about me.
export default function AboutRoom() {
  const [sel, setSel] = useState<Key>("monitor");
  const drawers = [
    { n: skills.length, l: "technologies" },
    { n: certificates.length, l: "certificates" },
    { n: 1, l: "mission: simplify human complexity" },
  ];

  return (
    <div
      className="relative min-h-full px-4 pt-20 pb-14 sm:px-10"
      style={{ background: "linear-gradient(#ece7db 0 62%, #d9d2c0 62% 100%)" }}
    >
      <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-12">
        {/* wall: portrait + tags as sticky notes */}
        <div className="relative md:col-span-4">
          <motion.figure
            initial={{ rotate: -6, y: 20, opacity: 0 }}
            animate={{ rotate: -2.5, y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-xs"
          >
            <span aria-hidden className="absolute -top-3 left-6 z-10 h-6 w-20 -rotate-6 bg-signal/80" />
            <span aria-hidden className="absolute -top-3 right-6 z-10 h-6 w-20 rotate-6 bg-signal/80" />
            <div className="border-2 border-ink bg-paper p-3 pb-12 shadow-[8px_8px_0_#111]">
              <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-ink grayscale-[0.35]">
                <Image src={personal.image} alt={`Portrait of ${personal.name}`} fill loading="eager" className="object-cover" sizes="320px" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-3 text-center font-hand text-2xl">
                {personal.firstName}, {personal.location.split(",")[0]}
              </figcaption>
            </div>
          </motion.figure>
          <ul className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Focus areas">
            {aboutTags.map((t, i) => (
              <li
                key={t}
                style={{ rotate: `${((i * 5) % 9) - 4}deg` }}
                className="border-2 border-ink bg-[#ffe27a] px-3 py-1.5 font-hand text-lg leading-none shadow-[3px_3px_0_#111]"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* desk */}
        <div className="md:col-span-8">
          <h2 className="font-display text-6xl leading-[0.9] tracking-tight uppercase sm:text-8xl">
            The <span className="text-transparent [-webkit-text-stroke:2px_#111]">desk</span>
          </h2>
          <p className="mt-1 font-hand text-2xl text-ink-soft">Poke the things on it.</p>

          <div className="relative mt-4 aspect-[600/380] w-full">
            <svg viewBox="0 0 600 380" className="absolute inset-0 h-full w-full" aria-hidden>
              <g {...G} filter="url(#wobble)">
                {/* wall shelf shadow-free desk */}
                <path d="M10 250h580M30 250v120M570 250v120M30 300h540" strokeWidth={4} />
                {/* monitor */}
                <rect x="38" y="40" width="168" height="132" rx="16" fill="#e9e4d8" />
                <rect x="54" y="56" width="136" height="92" rx="8" fill="#111" />
                <path d="M70 80l16 10-16 10" stroke="#f4f1ea" strokeWidth={4} />
                <rect className="animate-blink keep" x="100" y="94" width="22" height="7" fill="#ff4d1c" stroke="none" />
                <path d="M104 172l-10 40M140 172l10 40M80 212h92" />
                {/* lamp */}
                <path d="M270 250h56M298 250V120l42-70" />
                <path d="M322 36l60 28-30 34z" fill="#f4f1ea" />
                <path d="M360 106l-10 30M376 100v34M392 90l16 24" stroke="#ff4d1c" strokeWidth={4} />
                {/* mug */}
                <path d="M406 160h56v88h-56zM462 176q30 12 0 46" fill="#f4f1ea" />
                <path d="M422 148q-10-18 4-34M444 148q-10-18 4-34" strokeWidth={2.4} />
                {/* notebook + pen */}
                <path d="M340 236l150-8 14 22-150 10z" fill="#fffdf8" />
                <path d="M356 246l130-7" strokeWidth={2} />
                <path d="M510 242l50-14" stroke="#ff4d1c" strokeWidth={5} />
                {/* cactus */}
                <path d="M520 250v-60M520 224l-20-8v-20M520 214l22-6v-18" />
                <path d="M504 250h32l-4 30h-24z" fill="#f4f1ea" />
              </g>
            </svg>
            {hotspots.map((h) => (
              <button
                key={h.key}
                type="button"
                onClick={() => setSel(h.key)}
                aria-label={`Read what is on the ${h.name}`}
                aria-pressed={sel === h.key}
                className={`absolute cursor-pointer rounded-md border-2 border-dashed transition-colors ${
                  sel === h.key ? "border-signal bg-signal/15" : "border-transparent hover:border-ink"
                }`}
                style={{ left: `${h.left}%`, top: `${h.top}%`, width: `${h.w}%`, height: `${h.h}%` }}
              />
            ))}
          </div>

          <motion.div
            key={sel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            className="relative mt-3 border-[3px] border-ink bg-paper p-5 shadow-[6px_6px_0_#111]"
          >
            <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-signal uppercase">{notes[sel].label}</p>
            <p className="mt-1 text-base leading-relaxed sm:text-lg">{notes[sel].text}</p>
          </motion.div>

          <ul className="mt-6 grid grid-cols-3 gap-3">
            {drawers.map((d) => (
              <li key={d.l} className="border-[3px] border-ink bg-[#fffdf8] p-3 shadow-[4px_4px_0_#111]">
                <span className="block font-display text-4xl leading-none sm:text-5xl">{d.n}</span>
                <span className="mt-1 block font-mono text-[10px] font-bold tracking-wider uppercase">{d.l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
