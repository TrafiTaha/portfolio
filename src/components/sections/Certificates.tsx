"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, Clock, Building2, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import { certificates, type Certificate } from "@/data/portfolio";

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const noteVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ---------- lightbox (Esc closes, scroll lock always released) ---------- */

function Lightbox({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!cert.image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
    >
      <div className="absolute inset-0 bg-ink/85" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0, transition: { duration: 0.35 } }}
        exit={{ opacity: 0, scale: 0.94, y: 16, transition: { duration: 0.2 } }}
        className="relative z-10 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          autoFocus
          className="absolute -top-12 right-0 cursor-pointer rounded-full border-2 border-ink bg-paper p-2 text-ink hover:bg-signal"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>
        <div className="relative aspect-[1.414/1] w-full border-[3px] border-ink bg-white shadow-[8px_8px_0_#ff4d1c]">
          <Image
            src={cert.image}
            alt={`${cert.title} certificate`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 95vw, 56rem"
            priority
          />
        </div>
        <div className="mt-4 text-center text-paper">
          <h3 className="font-display text-2xl tracking-wide uppercase">{cert.title}</h3>
          <p className="mt-1 font-mono text-xs tracking-wider uppercase">
            {cert.issuer} · {cert.date}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- pinned paper note ---------- */

function Note({ cert, index, onOpen }: { cert: Certificate; index: number; onOpen?: () => void }) {
  const tilt = [-2.2, 1.6, -1.2, 2.4][index % 4];

  const body = (
    <>
      <div className="relative aspect-[1.414/1] w-full overflow-hidden border-2 border-ink bg-paper-2">
        {cert.image ? (
          <>
            <Image
              src={cert.image}
              alt={`${cert.title} certificate`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 30vw"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/35 group-hover:opacity-100 group-focus-visible:bg-ink/35 group-focus-visible:opacity-100">
              <span className="inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-1.5 font-mono text-xs font-bold uppercase">
                <ZoomIn size={14} aria-hidden /> View
              </span>
            </span>
          </>
        ) : (
          <div className="hatch absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="-rotate-6 border-[3px] border-signal bg-paper px-4 py-2 font-mono text-xs font-bold tracking-[0.25em] text-signal uppercase">
              Academic license
            </span>
            <Award size={36} className="text-ink" aria-hidden />
          </div>
        )}
      </div>

      <h3 className="mt-4 font-display text-xl leading-tight tracking-wide text-ink uppercase">{cert.title}</h3>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
        <Building2 size={12} aria-hidden /> {cert.issuer}
      </p>
      <p className="mt-3 flex items-center gap-4 border-t border-dashed border-ink pt-3 font-mono text-[11px] font-bold tracking-wider text-ink uppercase">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={11} aria-hidden /> {cert.duration}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={11} aria-hidden /> {cert.date}
        </span>
      </p>
    </>
  );

  const shell =
    "group relative block h-full w-full border-2 border-ink bg-[#fffdf8] p-4 pt-6 text-left shadow-[5px_5px_0_#111] transition-transform duration-300";

  return (
    <motion.li variants={noteVariants} className="relative pt-4">
      {/* pin */}
      <span
        aria-hidden
        className="absolute top-1 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ink bg-signal shadow-[1px_2px_0_#111]"
      />
      <div style={{ rotate: `${tilt}deg` }} className="transition-transform duration-300 hover:rotate-0!">
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`View ${cert.title} certificate`}
            className={`${shell} cursor-pointer hover:-translate-y-1`}
          >
            {body}
          </button>
        ) : (
          <div className={shell}>{body}</div>
        )}
      </div>
    </motion.li>
  );
}

export default function Certificates() {
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const closeLightbox = useCallback(() => setActiveCert(null), []);

  return (
    <>
      <Section id="certificates" title="Certificates" subtitle="Professional training & credentials" index="03">
        <div className="relative">
          {/* the cord everything is pinned to */}
          <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-x-0 top-1 h-8 w-full" aria-hidden>
            <path d="M0 10Q250 40 500 14T1000 12" fill="none" stroke="#111" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
            className="grid grid-cols-1 gap-x-8 gap-y-10 pt-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {certificates.map((cert, i) => (
              <Note key={cert.title} cert={cert} index={i} onOpen={cert.image ? () => setActiveCert(cert) : undefined} />
            ))}
          </motion.ul>
        </div>
      </Section>

      <AnimatePresence>{activeCert && <Lightbox cert={activeCert} onClose={closeLightbox} />}</AnimatePresence>
    </>
  );
}
