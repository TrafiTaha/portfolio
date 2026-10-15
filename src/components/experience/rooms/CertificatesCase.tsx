"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { certificates, type Certificate } from "@/data/portfolio";

const G = { fill: "none", stroke: "#111", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function RolledScroll({ tilt }: { tilt: number }) {
  return (
    <svg viewBox="0 0 240 90" className="h-auto w-full overflow-visible" style={{ rotate: `${tilt}deg` }} aria-hidden>
      <g {...G} filter="url(#wobble-lg)">
        <rect x="22" y="22" width="196" height="46" rx="14" fill="#fffdf8" />
        <ellipse cx="22" cy="45" rx="10" ry="23" fill="#ebe3cf" />
        <ellipse cx="218" cy="45" rx="10" ry="23" fill="#ebe3cf" />
        <path d="M22 45m-4 0a4 4 0 1 1 8 0a8 8 0 1 1-16 0M218 45m-4 0a4 4 0 1 1 8 0a8 8 0 1 1-16 0" strokeWidth={2} />
        <path d="M120 22v46" stroke="#ff4d1c" strokeWidth={9} />
        <path d="M120 68l-14 14M120 68l14 14" stroke="#ff4d1c" strokeWidth={5} />
      </g>
    </svg>
  );
}

// Unrolled certificate with a hover magnifier (pointer devices only).
function Unrolled({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const lens = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const move = (e: React.PointerEvent) => {
    const b = box.current;
    const l = lens.current;
    if (!b || !l || e.pointerType !== "mouse" || !cert.image) return;
    const r = b.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    l.style.opacity = "1";
    l.style.transform = `translate(${x - 70}px, ${y - 70}px)`;
    l.style.backgroundPosition = `${-(x * 2.2 - 70)}px ${-(y * 2.2 - 70)}px`;
    l.style.backgroundSize = `${r.width * 2.2}px ${r.height * 2.2}px`;
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/75 p-3 pt-16 sm:p-8 sm:pt-16"
      onClick={onClose}
    >
      <motion.div
        initial={{ scaleY: 0.04, opacity: 0.6 }}
        animate={{ scaleY: 1, opacity: 1 }}
        exit={{ scaleY: 0.04, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "top" }}
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* top and bottom rods */}
        <div aria-hidden className="mx-[-1.5%] h-5 rounded-full border-[3px] border-ink bg-[#ebe3cf]" />
        <div className="border-x-[3px] border-ink bg-paper px-4 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-3xl leading-none tracking-wide text-ink uppercase sm:text-4xl">{cert.title}</h3>
              <p className="mt-1 font-hand text-2xl text-signal">{cert.issuer}</p>
              <p className="mt-2 flex flex-wrap gap-x-5 font-mono text-xs font-bold tracking-wider uppercase">
                <span>{cert.duration}</span>
                <span>{cert.date}</span>
              </p>
            </div>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              aria-label="Roll the scroll back up"
              className="cursor-pointer border-2 border-ink bg-paper p-1.5 hover:bg-signal"
            >
              <X size={18} aria-hidden />
            </button>
          </div>
          {cert.image && (
            <div
              ref={box}
              onPointerMove={move}
              onPointerLeave={() => lens.current && (lens.current.style.opacity = "0")}
              className="relative mt-4 aspect-[1.414/1] w-full cursor-zoom-in overflow-hidden border-2 border-ink bg-white"
            >
              <Image src={cert.image} alt={`${cert.title} certificate`} fill loading="eager" className="object-contain" sizes="(max-width: 768px) 90vw, 48rem" />
              <div
                ref={lens}
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 h-[140px] w-[140px] rounded-full border-[3px] border-ink bg-no-repeat opacity-0 shadow-[3px_3px_0_#ff4d1c] transition-opacity"
                style={{ backgroundImage: `url(${cert.image})` }}
              />
              <span className="pointer-events-none absolute right-2 bottom-2 hidden bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase sm:block">
                Hover to magnify
              </span>
            </div>
          )}
        </div>
        <div aria-hidden className="mx-[-1.5%] h-5 rounded-full border-[3px] border-ink bg-[#ebe3cf]" />
      </motion.div>
    </motion.div>
  );
}

// Museum display case: rolled scrolls on glass shelves; click one and it unrolls from its rod.
export default function CertificatesCase() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div
      className="relative min-h-full px-4 pt-20 pb-16 sm:px-10"
      style={{
        background:
          "radial-gradient(ellipse 40% 60% at 25% 0%, rgba(255,253,248,.95), transparent 70%), radial-gradient(ellipse 40% 60% at 75% 0%, rgba(255,253,248,.95), transparent 70%), repeating-linear-gradient(90deg, transparent 0 119px, rgba(17,17,17,.07) 119px 121px), #e9e3d4",
      }}
    >
      <header className="mx-auto max-w-5xl">
        <p className="font-mono text-xs font-bold tracking-[0.3em] text-signal uppercase">Nº 04 · The display case</p>
        <h2 className="font-display text-6xl leading-[0.9] tracking-tight text-ink uppercase sm:text-8xl">Certificates</h2>
        <p className="mt-2 font-hand text-2xl text-ink-soft">Click a scroll to unroll it.</p>
      </header>

      <div className="relative mx-auto mt-8 max-w-5xl border-[5px] border-ink bg-[#fffdf8]/60 p-4 shadow-[10px_10px_0_#111] sm:p-8">
        {/* glass glint */}
        <span aria-hidden className="pointer-events-none absolute top-3 left-6 h-[85%] w-24 -skew-x-12 bg-gradient-to-r from-white/60 to-transparent" />
        <ul className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
          {certificates.map((c, i) => (
            <li key={c.title} className="relative">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Unroll ${c.title} certificate`}
                className="group relative block w-full cursor-pointer pb-4 text-left"
              >
                <span className="block transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[-1deg] group-focus-visible:-translate-y-2">
                  <RolledScroll tilt={[-3, 2, -1.5, 3][i % 4]} />
                </span>
                <span className="mt-1 block border-2 border-ink bg-paper px-3 py-2 shadow-[3px_3px_0_#111] group-hover:bg-signal">
                  <span className="block font-display text-xl leading-tight tracking-wide uppercase">{c.title}</span>
                  <span className="block font-mono text-[10px] font-bold tracking-wider text-ink-soft uppercase group-hover:text-ink">
                    {c.issuer} · {c.date}
                  </span>
                </span>
              </button>
              {/* the shelf */}
              <span aria-hidden className="absolute inset-x-[-1rem] bottom-0 h-3 border-y-[3px] border-ink bg-[#c9b894]" />
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>{open !== null && <Unrolled key={open} cert={certificates[open]} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}
