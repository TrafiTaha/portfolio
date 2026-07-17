"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, Clock, Building2, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import { certificates, type Certificate } from "@/data/portfolio";

/* ---------- animation variants ---------- */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.25 },
  },
};

/* ---------- lightbox modal ---------- */

function Lightbox({
  cert,
  onClose,
}: {
  cert: Certificate;
  onClose: () => void;
}) {
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

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* modal content */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>

        {/* certificate image */}
        <div className="relative w-full aspect-[1.414/1] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
          <Image
            src={cert.image}
            alt={`${cert.title} certificate`}
            fill
            className="object-contain bg-white"
            sizes="(max-width: 768px) 95vw, 56rem"
            priority
          />
        </div>

        {/* label */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold text-zinc-100">{cert.title}</h3>
          <p className="text-sm text-zinc-400 mt-1">
            {cert.issuer} · {cert.date}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- certificate card ---------- */

function CertificateCard({
  cert,
  onOpen,
}: {
  cert: Certificate;
  onOpen: () => void;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl border border-white/[0.06] bg-zinc-900/50 backdrop-blur-sm overflow-hidden cursor-pointer transition-colors duration-300 hover:border-white/15"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
    >
      {/* top glow */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl"
        style={{ background: cert.color }}
      />

      {/* certificate image preview */}
      <div className="relative w-full aspect-[1.414/1] bg-zinc-800 overflow-hidden">
        <Image
          src={cert.image}
          alt={`${cert.title} certificate`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 35vw"
        />
        {/* overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/20">
            <ZoomIn size={16} className="text-white" />
            <span className="text-sm font-medium text-white">View</span>
          </div>
        </div>
      </div>

      {/* info section */}
      <div className="relative z-10 p-5">
        {/* accent stripe */}
        <div
          className="absolute top-0 left-5 right-5 h-[2px] rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)`,
          }}
        />

        <div className="flex items-start gap-3 mt-2">
          {/* icon */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `${cert.color}20`,
              border: `1px solid ${cert.color}30`,
            }}
          >
            <Award size={18} style={{ color: cert.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-zinc-100 leading-tight group-hover:text-white transition-colors">
              {cert.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-zinc-500">
              <Building2 size={12} />
              <span className="text-xs font-medium">{cert.issuer}</span>
            </div>
          </div>
        </div>

        {/* meta badges */}
        <div className="flex items-center gap-3 mt-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wider text-zinc-500 uppercase">
            <Clock size={11} />
            {cert.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wider text-zinc-500 uppercase">
            <Calendar size={11} />
            {cert.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- main section ---------- */

export default function Certificates() {
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const closeLightbox = useCallback(() => setActiveCert(null), []);

  return (
    <>
      <Section
        id="certificates"
        title="Certificates"
        subtitle="Professional training & credentials"
        index="03"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.title}
              cert={cert}
              onOpen={() => setActiveCert(cert)}
            />
          ))}
        </motion.div>
      </Section>

      {/* lightbox portal */}
      <AnimatePresence>
        {activeCert && (
          <Lightbox cert={activeCert} onClose={closeLightbox} />
        )}
      </AnimatePresence>
    </>
  );
}
