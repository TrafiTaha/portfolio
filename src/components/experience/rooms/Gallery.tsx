"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Plaque from "@/components/experience/rooms/Plaque";
import ProjectCover from "@/components/sections/ProjectCovers";
import { useProjects } from "@/lib/useRepos";

const mod = (a: number, n: number) => ((a % n) + n) % n;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Item = { key: string; label: string; sub: string; cover: ReactNode; aria: string };

const G = { fill: "none", stroke: "#111", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// Workshop wall decor: tool silhouettes hanging on a pegboard
function Tools() {
  return (
    <svg viewBox="0 0 800 120" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-14 h-28 w-full opacity-70" aria-hidden>
      <g {...G} strokeWidth={2.4} filter="url(#wobble-lg)">
        <path d="M60 20l40 70M50 30q-14 8-6 20l8 8q10 6 22-6" />
        <path d="M190 90V30M170 30h40v-10h-40z" />
        <path d="M300 24h110l-12 22h-86zM320 46v44M390 46v44" />
        <path d="M520 20v70M500 20q20-14 40 0M510 90h20" />
        <path d="M640 30l60 60M700 90l-14-8M630 38l-14 14" />
      </g>
    </svg>
  );
}

// Generic "rail" room: items hang from a rail/cord and slide sideways with wheel / keys / touch, looping forever.
function Rail({
  items,
  hint,
  theme,
  plaque,
}: {
  items: Item[];
  hint: string;
  theme: "pegboard" | "cork";
  plaque: (i: number, close: () => void) => ReactNode;
}) {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [open, setOpen] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const pos = useRef(0);
  const tgt = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);
  const geo = useRef({ w: 0, S: 0, LS: 0, L: 0, PW: 0, sag: false });

  const n = items.length;
  const PW = clamp(size.w * 0.26, 170, 300);
  const S = PW * 1.3;
  const L = n * Math.ceil(Math.max(n, Math.ceil(size.w / S) + 2) / n);
  const LS = L * S;
  const sag = theme === "cork";
  const ropeY = size.h * 0.2;

  const apply = useCallback(() => {
    const { w, S, LS, L, PW, sag } = geo.current;
    for (let j = 0; j < L; j++) {
      const el = els.current[j];
      if (!el) continue;
      const rel = mod(j * S - pos.current + LS / 2, LS) - LS / 2;
      const t = clamp((w / 2 + rel) / w, 0, 1);
      const y = sag ? 110 * t * (1 - t) : 0;
      const swing = clamp((tgt.current - pos.current) * 0.02, -5, 5);
      el.style.transform = `translate3d(${rel}px,${y}px,0) rotate(${((j % 5) - 2) * 0.9 + swing}deg)`;
      el.style.visibility = Math.abs(rel) > w / 2 + PW ? "hidden" : "visible";
    }
  }, []);

  useEffect(() => {
    geo.current = { w: size.w, S, LS, L, PW, sag };
    apply();
  }, [size.w, S, LS, L, PW, sag, apply]);

  const kick = useCallback(() => {
    if (raf.current) return;
    last.current = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000);
      last.current = now;
      const diff = tgt.current - pos.current;
      if (Math.abs(diff) < 0.3) {
        pos.current = tgt.current;
        apply();
        raf.current = 0;
        return;
      }
      pos.current += diff * (1 - Math.exp(-dt * 8));
      apply();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  }, [apply]);

  const move = useCallback(
    (d: number) => {
      tgt.current += d;
      kick();
    },
    [kick]
  );

  const centerOn = useCallback(
    (j: number) => {
      const base = j * S;
      tgt.current = base + Math.round((tgt.current - base) / LS) * LS;
      kick();
    },
    [S, LS, kick]
  );

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    const onWheel = (e: WheelEvent) => {
      if ((e.target as Element | null)?.closest?.("[role=dialog][aria-modal]:not([data-room])")) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (d === 0) return;
      move(clamp(d * unit, -120, 120) * 1.1);
    };
    let lx = 0;
    const onTs = (e: TouchEvent) => {
      lx = e.touches[0].clientX;
    };
    const onTm = (e: TouchEvent) => {
      const x = e.touches[0].clientX;
      move(lx - x);
      lx = x;
    };
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector("[role=dialog][aria-modal]:not([data-room])")) return;
      if (e.key === "ArrowRight") move(S);
      else if (e.key === "ArrowLeft") move(-S);
    };
    window.addEventListener("resize", onResize);
    box.addEventListener("wheel", onWheel, { passive: false });
    box.addEventListener("touchstart", onTs, { passive: true });
    box.addEventListener("touchmove", onTm, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      box.removeEventListener("wheel", onWheel);
      box.removeEventListener("touchstart", onTs);
      box.removeEventListener("touchmove", onTm);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [move, S]);

  const bg =
    theme === "pegboard"
      ? "radial-gradient(circle, rgba(17,17,17,.35) 1.6px, transparent 2.2px) 0 0/26px 26px, #e8e2d4"
      : "radial-gradient(circle, rgba(90,60,30,.3) 1.6px, transparent 2.4px) 0 0/14px 14px, #dccfb4";

  return (
    <div ref={boxRef} className="absolute inset-0 touch-pan-y overflow-hidden" style={{ background: bg }}>
      {theme === "pegboard" && <Tools />}
      {/* bench / frame */}
      <div className={`absolute inset-x-0 bottom-0 h-14 border-t-[6px] border-ink ${theme === "pegboard" ? "hatch" : "bg-[#c9b894]"}`} />
      {theme === "cork" && <div className="pointer-events-none absolute inset-3 border-[6px] border-ink" />}

      {/* rail or cord */}
      <svg className="absolute inset-x-0 w-full overflow-visible" style={{ top: ropeY }} height={sag ? 60 : 12} viewBox={`0 0 ${size.w} ${sag ? 60 : 12}`} aria-hidden>
        <path
          d={sag ? `M0 0Q${size.w / 2} 55 ${size.w} 0` : `M0 4H${size.w}`}
          fill="none"
          stroke="#111"
          strokeWidth={sag ? 3 : 8}
          strokeLinecap="round"
        />
      </svg>

      {Array.from({ length: L }, (_, j) => {
        const it = items[j % n];
        return (
          <button
            key={j}
            type="button"
            ref={(el) => {
              els.current[j] = el;
            }}
            onClick={() => setOpen(j % n)}
            onFocus={() => centerOn(j)}
            aria-label={it.aria}
            tabIndex={j < n ? 0 : -1}
            aria-hidden={j >= n}
            className="group absolute left-1/2 cursor-pointer text-left focus-visible:outline-offset-4"
            style={{ top: ropeY, width: PW, marginLeft: -PW / 2, visibility: "hidden" }}
          >
            <span aria-hidden className="absolute -top-2 left-1/2 z-10 h-5 w-3 -translate-x-1/2 rounded-sm border-2 border-ink bg-signal" />
            <span className="relative mt-3 block border-[3px] border-ink bg-[#fffdf8] p-2 shadow-[5px_5px_0_#111] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[5px_5px_0_#ff4d1c] group-focus-visible:-translate-y-1">
              {theme === "pegboard" && (
                <>
                  {/* washi-tape corners */}
                  <span aria-hidden className="absolute -top-2 -left-4 z-10 h-4 w-12 -rotate-[38deg] border border-ink/30 bg-[#ffe27a]/85" />
                  <span aria-hidden className="absolute -top-2 -right-4 z-10 h-4 w-12 rotate-[38deg] border border-ink/30 bg-signal/70" />
                </>
              )}
              {it.cover}
              <span className="mt-2 block font-display text-xl leading-none tracking-wide text-ink uppercase">{it.label}</span>
              <span className="block font-mono text-[10px] font-bold tracking-wider text-ink-soft uppercase">{it.sub}</span>
            </span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => move(-S)}
        aria-label="Previous"
        className="absolute top-1/2 left-3 z-20 cursor-pointer border-2 border-ink bg-paper p-2 shadow-[3px_3px_0_#111] hover:bg-signal"
      >
        <ArrowLeft size={18} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => move(S)}
        aria-label="Next"
        className="absolute top-1/2 right-3 z-20 cursor-pointer border-2 border-ink bg-paper p-2 shadow-[3px_3px_0_#111] hover:bg-signal"
      >
        <ArrowRight size={18} aria-hidden />
      </button>

      <p className="absolute bottom-3 left-1/2 z-20 w-max max-w-[92%] -translate-x-1/2 -rotate-1 border-2 border-ink bg-paper px-3 py-1.5 text-center font-mono text-[10px] font-bold tracking-wider uppercase shadow-[3px_3px_0_#111] sm:text-xs">
        {hint}
      </p>

      <AnimatePresence>{open !== null && plaque(open, () => setOpen(null))}</AnimatePresence>
    </div>
  );
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" });

// Drafting wall: every public repo (curated three first) hangs as a blueprint sheet.
export function ProjectsGallery() {
  const { projects, status } = useProjects();
  const items: Item[] = projects.map((p) => ({
    key: p.title,
    label: p.title,
    sub: p.tagline,
    aria: `Inspect ${p.title}`,
    cover: (
      <span className="blueprint-grid block aspect-[8/5] w-full border-2 border-ink">
        <ProjectCover title={p.title} drawn language={p.language} />
      </span>
    ),
  }));
  const note =
    status === "loading" ? " · loading all repositories…" : status === "error" ? " · GitHub unreachable, showing curated projects" : ` · ${projects.length} repositories`;
  return (
    <Rail
      items={items}
      theme="pegboard"
      hint={`Drafting wall: scroll to slide the sheets, click one to inspect${note}`}
      plaque={(i, close) => {
        const p = projects[i % projects.length];
        const meta = [
          ...(p.stars !== null ? [`★ ${p.stars}`] : []),
          ...(p.pushed ? [`Last pushed ${fmtDate(p.pushed)}`] : []),
        ];
        return (
          <Plaque
            key={p.title}
            kicker="Project details"
            title={p.title}
            sub={p.tagline}
            tech={p.tech}
            meta={meta}
            cta={{ href: p.github, label: "Open project" }}
            secondary={p.homepage ? { href: p.homepage, label: "Live demo" } : undefined}
            onClose={close}
          >
            <p>{p.description ?? `${p.language ?? "Repository"} · no description yet`}</p>
            {p.features.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="font-bold text-signal">▸</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 font-mono text-[10px] tracking-wider text-ink-soft uppercase">Illustrated cover, not a screenshot</p>
          </Plaque>
        );
      }}
    />
  );
}
