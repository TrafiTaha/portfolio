"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { personal } from "@/data/portfolio";

const G = { fill: "none", stroke: "#111", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const cards = [
  { id: "whatsapp", name: "WhatsApp", shown: personal.whatsappNumber, href: personal.whatsapp, note: "Anytime" },
  { id: "linkedin", name: "LinkedIn", shown: "taha-ben-romdhane", href: personal.linkedin, note: "Professional" },
  { id: "github", name: "GitHub", shown: `github.com/${personal.githubUser}`, href: personal.github, note: "Code" },
  { id: "instagram", name: "Instagram", shown: "@txha_br", href: personal.instagram, note: "Day to day" },
  { id: "facebook", name: "Facebook", shown: "Taha Ben Romdhane", href: personal.facebook, note: "Social" },
];

function Postcard({ c, i }: { c: (typeof cards)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <li className="relative" style={{ perspective: 900 }}>
      <motion.div
        key={String(flipped)}
        initial={{ rotateY: flipped ? 90 : -90 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        style={{ rotate: flipped ? 0 : [-3, 2, -1.5, 3, -2][i % 5] }}
      >
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={flipped ? `${c.name} postcard, showing address. Flip back` : `Flip the ${c.name} postcard to read the address`}
          className="relative block aspect-[3/2] w-full cursor-pointer border-[3px] border-ink bg-[#fffdf8] p-4 text-left shadow-[6px_6px_0_#111] transition-shadow hover:shadow-[6px_6px_0_#ff4d1c]"
        >
          {!flipped ? (
            <>
              <span aria-hidden className="absolute top-3 right-3 flex h-14 w-12 -rotate-3 items-center justify-center border-2 border-dashed border-signal font-display text-xl text-signal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="block font-mono text-[10px] font-bold tracking-[0.3em] text-ink-soft uppercase">{c.note}</span>
              <span className="mt-1 block font-display text-4xl leading-none tracking-wide uppercase">{c.name}</span>
              <span aria-hidden className="mt-4 block h-px w-3/5 bg-ink/40" />
              <span aria-hidden className="mt-2 block h-px w-2/5 bg-ink/40" />
              <span className="absolute bottom-3 left-4 font-hand text-lg text-signal">tap to flip ↺</span>
            </>
          ) : (
            <>
              <span className="block font-mono text-[10px] font-bold tracking-[0.3em] text-signal uppercase">Address</span>
              <span className="mt-2 block font-display text-3xl leading-tight tracking-wide break-words uppercase">{c.shown}</span>
              <span aria-hidden className="absolute top-4 bottom-4 left-1/2 border-l border-ink/30" />
            </>
          )}
        </button>
        {flipped && (
          <a
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${c.name}`}
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 border-2 border-ink bg-signal px-3 py-1.5 font-mono text-xs font-bold tracking-wider text-ink uppercase shadow-[3px_3px_0_#111] hover:-translate-y-0.5"
          >
            Open <ArrowUpRight size={14} aria-hidden />
          </a>
        )}
      </motion.div>
    </li>
  );
}

// Reception / post-office scene: a desk with a telephone and mailbox, and one postcard per real channel.
export default function ContactRoom() {
  return (
    <div className="relative min-h-full px-4 pt-20 pb-40 sm:px-10" style={{ background: "linear-gradient(#ece7db 0 70%, #d9d2c0 70% 100%)" }}>
      <header className="mx-auto max-w-5xl">
        <p className="font-mono text-xs font-bold tracking-[0.3em] text-signal uppercase">Nº 06 · Reception</p>
        <h2 className="-rotate-2 font-hand text-[22vw] leading-[0.85] text-ink sm:text-[11rem]">
          Say <span className="text-signal">hello</span>
        </h2>
        <p className="mt-6 max-w-xl text-base text-ink/80 sm:text-lg">
          Pick a postcard, flip it, and send a message. {personal.location}, remote-friendly.
        </p>
      </header>

      <ul className="mx-auto mt-10 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Postcard key={c.id} c={c} i={i} />
        ))}
      </ul>

      {/* desk: telephone + mailbox */}
      <svg viewBox="0 0 800 150" preserveAspectRatio="xMidYMax meet" className="pointer-events-none absolute inset-x-0 bottom-0 h-36 w-full sm:h-44" aria-hidden>
        <g {...G} filter="url(#wobble)">
          <path d="M0 140h800" strokeWidth={5} />
          <path d="M120 140V70h160V140" fill="#e9e4d8" />
          <path d="M150 70q50-30 100 0M170 56l-10-14h-24v14M230 56l10-14h24v14" />
          <circle cx="200" cy="100" r="16" />
          <path d="M200 100m-5 0a5 5 0 1 0 10 0" strokeWidth={2} />
          <path d="M560 140V90M530 90v-30q0-26 40-26t40 26v30z" fill="#f4f1ea" />
          <path d="M545 70h50" strokeWidth={2} />
          <rect x="612" y="52" width="8" height="26" fill="#ff4d1c" />
          <path d="M360 140l40-16 80 0 40 16" />
          <path d="M392 124l10-26h60l10 26" fill="#fffdf8" />
        </g>
      </svg>
    </div>
  );
}
