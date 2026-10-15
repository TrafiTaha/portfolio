"use client";

import { useEffect, useRef, useState } from "react";
import { skills } from "@/data/portfolio";
import { useMotionMode } from "@/lib/useMotionMode";

const mod = (a: number, n: number) => ((a % n) + n) % n;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const L = 2400; // tunnel depth in px
const N = skills.length;

// Layout seeded from the golden angle so tiles spread around an open centre.
const slots = skills.map((_, i) => {
  const a = i * 2.399963;
  const r = 0.5 + 0.5 * (((i * 7) % 5) / 4);
  return { cx: Math.cos(a) * r, cy: Math.sin(a) * r, rot: ((i * 37) % 21) - 10 };
});

// Sticker-sheet tunnel: the workshop's skill stickers stream toward the camera.
export default function SkillsTunnel() {
  const mode = useMotionMode();
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let pos = 0;
    let boost = 0;
    let raf = 0;
    let last = performance.now();
    const drift = mode === "still" ? 0 : 90; // px/s, gentle ambient motion
    const draw = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      const rx = w * 0.44;
      const ry = h * 0.4;
      for (let i = 0; i < N; i++) {
        const el = els.current[i];
        if (!el) continue;
        const z = mod((i * L) / N + pos, L) - L + 300; // [-L+300, 300)
        const o = clamp((z + 1500) / 500, 0, 1) * clamp((330 - z) / 150, 0, 1);
        const s = slots[i];
        el.style.transform = `translate3d(${s.cx * rx}px,${s.cy * ry}px,${z}px) rotate(${s.rot}deg)`;
        el.style.opacity = String(o);
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
        el.style.pointerEvents = o < 0.4 ? "none" : "auto";
      }
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      pos += (drift + boost) * dt;
      boost *= Math.exp(-dt * 3);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const d = e.deltaY * unit;
      if (d === 0) return;
      boost = clamp(boost + clamp(d, -100, 100) * 4, -1400, 1400);
      if (mode === "still") {
        pos += clamp(d, -100, 100) * 3;
        draw();
      }
    };
    let ly = 0;
    const onTs = (e: TouchEvent) => {
      ly = e.touches[0].clientY;
    };
    const onTm = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      boost = clamp(boost + (ly - y) * 10, -1400, 1400);
      ly = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") boost = clamp(boost + 500, -1400, 1400);
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") boost = clamp(boost - 500, -1400, 1400);
    };
    draw();
    if (mode !== "still") raf = requestAnimationFrame(loop);
    box.addEventListener("wheel", onWheel, { passive: false });
    box.addEventListener("touchstart", onTs, { passive: true });
    box.addEventListener("touchmove", onTm, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      box.removeEventListener("wheel", onWheel);
      box.removeEventListener("touchstart", onTs);
      box.removeEventListener("touchmove", onTm);
      window.removeEventListener("keydown", onKey);
    };
  }, [mode]);

  return (
    <div ref={boxRef} className="blueprint-grid absolute inset-0 touch-none overflow-hidden" style={{ background: "radial-gradient(circle at 50% 50%, #fffdf8 0%, #ece7db 60%, #e4ded0 100%)" }}>
      <div className="absolute inset-0" style={{ perspective: "700px", perspectiveOrigin: "50% 50%" }}>
        <div className="absolute top-1/2 left-1/2 h-0 w-0 [transform-style:preserve-3d]">
          {skills.map((s, i) => (
            <button
              key={s.name}
              type="button"
              ref={(el) => {
                els.current[i] = el;
              }}
              tabIndex={-1}
              aria-hidden
              onPointerEnter={() => setName(s.name)}
              onClick={() => setName(s.name)}
              className={`absolute -mt-[3.5rem] -ml-[3.5rem] flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-[1.4rem] border-[3px] border-ink shadow-[4px_4px_0_#111] ${
                i % 5 === 2 ? "bg-signal" : "bg-[#fffdf8]"
              }`}
              style={{ visibility: "hidden" }}
            >
              <span className="font-display text-3xl leading-none tracking-wide text-ink uppercase">{s.short}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 font-display text-5xl tracking-wide text-ink uppercase sm:text-7xl">
        <span className="text-transparent [-webkit-text-stroke:2px_#111]">The </span>Studio
      </p>
      <p
        aria-live="polite"
        className="absolute bottom-16 left-1/2 min-h-9 -translate-x-1/2 border-[3px] border-ink bg-paper px-4 py-1 font-hand text-2xl whitespace-nowrap shadow-[4px_4px_0_#111]"
      >
        {name ?? "Hover or tap a sticker"}
      </p>
      <p className="absolute bottom-3 left-1/2 w-max max-w-[92%] -translate-x-1/2 -rotate-1 border-2 border-ink bg-paper px-3 py-1.5 text-center font-mono text-[10px] font-bold tracking-wider uppercase shadow-[3px_3px_0_#111] sm:text-xs">
        Scroll to fly through the sticker tunnel
      </p>
      <ul className="sr-only" aria-label="Skills">
        {skills.map((s) => (
          <li key={s.name}>{s.name}</li>
        ))}
      </ul>
    </div>
  );
}
