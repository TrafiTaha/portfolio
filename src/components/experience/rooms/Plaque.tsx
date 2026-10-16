"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

// Paper "plaque" modal used by the gallery rooms. Esc closes (and only this dialog).
export default function Plaque({
  kicker,
  title,
  sub,
  children,
  tech,
  meta,
  cta,
  secondary,
  onClose,
}: {
  secondary?: { href: string; label: string };
  kicker: string;
  title: string;
  sub?: string;
  children?: ReactNode;
  tech?: string[];
  meta?: string[];
  cta?: { href: string; label: string };
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/70 p-3 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, rotate: -1.5, scale: 0.96 }}
        animate={{ y: 0, rotate: 0, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="tex-paper-bg relative my-auto w-full max-w-2xl border-[4px] border-ink bg-paper shadow-[10px_10px_0_#ff4d1c,0_30px_50px_rgba(20,12,4,.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-ink px-4 py-2 text-paper">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase">{kicker}</span>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Close details"
            className="flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-paper hover:bg-signal hover:text-ink"
          >
            <X size={16} aria-hidden />
          </button>
        </div>
        <div className="p-5 sm:p-7">
          <h3 className="font-display text-4xl leading-none tracking-wide text-ink uppercase sm:text-5xl">{title}</h3>
          {sub && <p className="mt-1 font-hand text-2xl text-signal">{sub}</p>}
          {meta && (
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs font-bold tracking-wider text-ink uppercase">
              {meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </p>
          )}
          <div className="mt-4 text-sm leading-relaxed text-ink/80 sm:text-base">{children}</div>
          {tech && tech.length > 0 && (
            <>
              <p className="mt-6 font-mono text-[11px] font-bold tracking-[0.3em] text-ink-soft uppercase">Tech stack</p>
              <ul className="mt-2 flex flex-wrap gap-3">
                {tech.map((t) => (
                  <li key={t} className="flex flex-col items-center gap-1">
                    <span className="flex h-14 w-14 items-center justify-center border-[3px] border-ink bg-[#fffdf8] font-display text-xl shadow-[3px_3px_0_#111]">
                      {t.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase">{t}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {secondary && (
            <a
              href={secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 border-[3px] border-ink bg-paper px-6 py-3 font-mono text-sm font-bold tracking-wider text-ink uppercase hover:bg-ink hover:text-paper"
            >
              {secondary.label}
              <ArrowUpRight size={16} aria-hidden />
            </a>
          )}
          {cta && (
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 flex w-full items-center justify-center gap-2 border-[3px] border-ink bg-signal px-6 py-4 font-display text-2xl tracking-wide text-ink uppercase shadow-[5px_5px_0_#111] transition-transform hover:-translate-y-1"
            >
              {cta.label}
              <ArrowUpRight size={24} aria-hidden />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
