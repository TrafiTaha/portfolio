"use client";

import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowUp, DoorOpen, Menu, X } from "lucide-react";
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from "react";
import { DOORS } from "@/components/experience/doors";
import Motes from "@/components/experience/Motes";

const N = DOORS.length;
const mod = (a: number, n: number) => ((a % n) + n) % n;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ss = (t: number) => t * t * (3 - 2 * t);

export type HallHandle = { enter: (idx: number) => void };

const G = { fill: "none", stroke: "#111", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* ---------- small hand-drawn wall art (6 variants) ---------- */
function Art({ v }: { v: number }) {
  const art = [
    <path key="a" d="M14 80l28-36 18 24 18-32 28 44z M30 30a8 8 0 1 0 .1 0" />,
    <path key="b" d="M60 24a16 16 0 1 0 .1 0M26 84q4-26 34-26t34 26" />,
    <path key="c" d="M60 18a32 32 0 1 0 .1 0M60 50V32M60 50l16 8" />,
    <path key="d" d="M16 78h88M30 78V66h22v12M74 78V54M74 62l-12-8M74 56l12-10M74 54v-14" />,
    <path key="e" d="M24 24v14M52 24v14M80 24v14M20 24h68M30 70q30-30 62 0M30 70h62" />,
    <path key="f" d="M14 60q16-24 32 0t32 0 28 0M14 78q16-24 32 0t32 0 28 0" />,
  ];
  return (
    <svg viewBox="0 0 120 100" className="h-full w-full" aria-hidden>
      <g {...G} filter="url(#ink)">
        <rect x="4" y="4" width="112" height="92" fill="#fffdf8" />
        <rect x="11" y="11" width="98" height="78" strokeWidth={1.6} />
        {art[v % 6]}
        {v % 3 === 0 && <circle cx="92" cy="28" r="7" fill="#ff4d1c" />}
      </g>
    </svg>
  );
}

function Lamp() {
  return (
    <svg viewBox="0 0 100 130" className="h-full w-full overflow-visible" aria-hidden>
      <g {...G} filter="url(#ink)">
        <path d="M50 0v52" />
        <path d="M22 98q0-46 28-46t28 46z" fill="#fffdf8" />
        <circle cx="50" cy="104" r="9" fill="#ff4d1c" />
        <path d="M30 122l-8 6M50 124v6M70 122l8 6" stroke="#ff4d1c" strokeWidth={3} />
      </g>
    </svg>
  );
}

function DoorPanelArt() {
  return (
    <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <g {...G} strokeWidth={2.8} filter="url(#ink)">
        <rect x="14" y="14" width="72" height="74" />
        <rect x="19" y="19" width="62" height="64" strokeWidth={1.2} />
        <rect x="14" y="108" width="72" height="78" />
        <rect x="19" y="113" width="62" height="68" strokeWidth={1.2} />
        {/* graphite shading in the lower-left of each recess */}
        <path d="M22 80l14-14M22 70l8-8M22 60l4-4M22 178l20-22M22 166l12-14M22 154l6-6" strokeWidth={0.8} opacity={0.5} />
        <circle cx="84" cy="102" r="5" fill="#ff4d1c" />
      </g>
      {/* pencil smudges */}
      <ellipse cx="30" cy="150" rx="18" ry="10" fill="#111" opacity={0.06} style={{ filter: "blur(4px)" }} />
      <ellipse cx="74" cy="104" rx="10" ry="6" fill="#111" opacity={0.08} style={{ filter: "blur(3px)" }} />
    </svg>
  );
}

type Geo = { D: number; HW: number; FH: number; CH: number; Hd: number; Wd: number; P: number };

export default function Hall({
  active,
  reduced,
  onRoomChange,
  onExit,
  ref,
}: {
  active: boolean;
  reduced: boolean;
  onRoomChange: (open: boolean) => void;
  onExit: () => void;
  ref?: Ref<HallHandle>;
}) {
  const [dims, setDims] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [ui, setUi] = useState({ cur: 0, still: true });
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [room, setRoom] = useState<number | null>(null);

  const p = useMotionValue(0);
  const centerMv = useMotionValue(0); // 0 = door on its wall, 1 = centred in front of the camera
  const [menu, setMenu] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const bob = useRef({ t: 0, pv: 0, v: 0 });
  const vel = useRef(0);
  const segs = useRef<(HTMLDivElement | null)[]>([]);
  const doorEls = useRef<(HTMLDivElement | null)[]>([]);
  const snap = useRef(0);
  const target = useRef(0);
  const busy = useRef(false);
  const openRef = useRef<number | null>(null);
  const raf = useRef(0);
  const last = useRef(0);
  const gBase = useRef<number | null>(null);
  const wheelG = useRef({ t: 0, dir: 0, acc: 0, active: false, ema: 0, block: 0 });
  const timers = useRef<number[]>([]);
  const idle = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const reducedRef = useRef(reduced);

  const geo = useMemo<Geo>(() => {
    const { w, h } = dims;
    const Hd = h * 0.48;
    return {
      D: h * 0.62,
      HW: Math.max(w * 0.62, h * 0.35),
      FH: h * 0.27,
      CH: h * 0.42,
      Hd,
      Wd: Math.min(Hd * 0.5, w * 0.5),
      P: h * 1.1,
    };
  }, [dims]);
  const geoRef = useRef(geo);

  /* ----- per-frame camera: writes transforms straight to the DOM ----- */
  const apply = useCallback((pv: number) => {
    const { D, HW } = geoRef.current;
    // tiny head-bob / sway tied to camera speed (transform only; zero for reduced motion and when stopped)
    const scene = sceneRef.current;
    if (scene) {
      const now = performance.now();
      const b = bob.current;
      const dtm = now - b.t;
      if (dtm > 0 && dtm < 120) b.v = b.v * 0.8 + ((pv - b.pv) / (dtm / 1000)) * 0.2;
      else if (dtm >= 120) b.v = 0;
      b.t = now;
      b.pv = pv;
      const settled = Math.abs(pv - Math.round(pv)) < 0.002;
      const amp = reducedRef.current || settled ? 0 : clamp01(Math.abs(b.v) / 2.5) * 2.6;
      scene.style.transform = amp
        ? `translate3d(${Math.sin(pv * Math.PI * 3) * amp * 0.7}px,${Math.sin(pv * Math.PI * 6) * amp}px,0) rotate(${Math.sin(pv * Math.PI * 3) * amp * 0.03}deg)`
        : "";
    }
    for (let k = 0; k < N; k++) {
      const seg = segs.current[k];
      const door = doorEls.current[k];
      if (!seg || !door) continue;
      const d = mod(k - pv + 1, N) - 1; // depth in door units, range [-1, N-1)
      const far = clamp01((4.2 - d) / 1.4);
      const o = clamp01((d + 0.9) / 0.5) * far;
      seg.style.transform = `translate3d(0,0,${-d * D}px)`;
      seg.style.setProperty("--o", String(o));
      seg.style.visibility = o < 0.01 ? "hidden" : "visible";
      const side = k % 2 === 0 ? -1 : 1;
      // wall-mounted doors: flat on the wall far away, swinging toward you as they approach
      const u = d >= 0 ? ss(clamp01(d / 1.6)) : ss(clamp01(-d / 0.8));
      let x = side * HW * (0.55 + 0.4 * u);
      let yaw = -side * (35 + 55 * u);
      if (openRef.current === k) {
        const c = centerMv.get();
        x *= 1 - c;
        yaw *= 1 - c;
      }
      door.style.transform = `translate3d(${x}px,0,0) rotateY(${yaw}deg)`;
      door.style.setProperty("--o", String(clamp01((d + 0.85) / 0.4) * far));
      // depth of field: only distant doors soften (quantised so the filter rarely changes); near ones stay sharp
      const blur = openRef.current === k ? 0 : Math.round(Math.min(1.6, Math.max(0, (d - 1.4) * 0.55)) * 4) / 4;
      if (door.dataset.b !== String(blur)) {
        door.dataset.b = String(blur);
        door.style.filter = blur ? `blur(${blur}px)` : "";
      }
    }
  }, [centerMv]);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => {
    geoRef.current = geo;
    apply(p.get());
  }, [geo, apply, p]);

  useEffect(() => {
    const off = p.on("change", (v) => {
      apply(v);
      const near = mod(Math.round(v), N);
      const still = Math.abs(v - Math.round(v)) < 0.04;
      setUi((prev) => (prev.cur === near && prev.still === still ? prev : { cur: near, still }));
    });
    const off2 = centerMv.on("change", () => apply(p.get()));
    return () => {
      off();
      off2();
    };
  }, [p, apply, centerMv]);

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    const list = timers.current;
    return () => {
      window.removeEventListener("resize", onResize);
      list.forEach(window.clearTimeout);
      window.clearTimeout(idle.current);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, []);

  /* ----- virtual scroll: input accumulates into a target, springs follow ----- */
  // One rAF loop eases the camera toward `target` with frame-rate independent damping
  // (1 - e^(-dt*k)). Input only ever moves `target`; nothing is ignored or locked while it runs.
  const moveTo = useCallback(
    (t: number) => {
      target.current = t;
      if (reducedRef.current) {
        p.set(t);
        return;
      }
      if (raf.current) return;
      last.current = performance.now();
      // slightly underdamped spring (w=10, zeta=0.78): eases in, overshoots a hair and settles when stopping at a door
      const loop = (now: number) => {
        const dt = Math.min(0.033, (now - last.current) / 1000);
        last.current = now;
        const cur = p.get();
        const diff = target.current - cur;
        if (Math.abs(diff) < 0.0008 && Math.abs(vel.current) < 0.01) {
          p.set(target.current);
          vel.current = 0;
          raf.current = 0;
          return;
        }
        vel.current += (100 * diff - 15.6 * vel.current) * dt;
        p.set(cur + vel.current * dt);
        raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
    },
    [p]
  );

  // After a short idle, release to the nearest door; a modest push (~half a notch) moves on to the next.
  const settle = useCallback(() => {
    const base = gBase.current ?? Math.round(target.current);
    gBase.current = null;
    const delta = target.current - base;
    const steps = Math.abs(delta) > 0.15 ? Math.sign(delta) * Math.min(3, Math.max(1, Math.round(Math.abs(delta)))) : 0;
    snap.current = base + steps;
    moveTo(snap.current);
  }, [moveTo]);

  const gesture = useCallback(
    (du: number, cap = Infinity) => {
      if (busy.current) return;
      if (gBase.current === null) gBase.current = Math.round(target.current);
      let t = Math.min(gBase.current + cap, Math.max(gBase.current - cap, target.current + du));
      const cur = p.get();
      t = Math.min(cur + 1.6, Math.max(cur - 1.6, t)); // max lead: speed is bounded
      moveTo(t);
      window.clearTimeout(idle.current);
      idle.current = window.setTimeout(settle, 150);
    },
    [moveTo, settle, p]
  );

  const step = useCallback(
    (dir: number) => {
      if (busy.current) return;
      window.clearTimeout(idle.current);
      gBase.current = null;
      const t = target.current;
      snap.current = dir > 0 ? Math.floor(t + 0.001) + 1 : Math.ceil(t - 0.001) - 1;
      moveTo(snap.current);
    },
    [moveTo]
  );

  const goTo = useCallback(
    (idx: number) => {
      if (busy.current) return;
      window.clearTimeout(idle.current);
      gBase.current = null;
      const base = Math.round(target.current);
      snap.current = base + mod(idx - base + N / 2, N) - N / 2;
      moveTo(snap.current);
    },
    [moveTo]
  );

  useImperativeHandle(
    ref,
    () => ({
      enter: (idx: number) => {
        window.clearTimeout(idle.current);
        busy.current = false;
        gBase.current = null;
        vel.current = 0;
        wheelG.current.block = performance.now() + 700;
        snap.current = idx;
        p.set(reducedRef.current ? idx : idx - 0.9);
        moveTo(idx);
      },
    }),
    [p, moveTo]
  );

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    if (!root) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom
      // native scrolling inside an open room (or lightbox) must keep working
      if ((e.target as Element | null)?.closest?.("[role=dialog]")) return;
      e.preventDefault();
      if (busy.current) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const dy = e.deltaY * unit;
      if (dy === 0 || Math.abs(e.deltaX * unit) > Math.abs(dy)) return; // horizontal / empty events are ignored
      const px = Math.max(-80, Math.min(80, dy));
      const now = performance.now();
      const g = wheelG.current;
      if (now < g.block) {
        g.t = now; // momentum tail of the wheel/flick that just opened the hallway
        return;
      }
      const dir = Math.sign(px);
      const gap = now - g.t;
      if (now - g.t > 200|| (dir !== g.dir && Math.abs(px) >= 20)) {
        // a new gesture: quiet gap, or a clear reversal
        g.acc = 0;
        g.active = false;
        g.ema = 0;
        gBase.current = null;
      }
      g.t = now;
      g.dir = dir;
      // discrete notches: line/page mode, or round 100/120px steps arriving >=30ms apart (trackpads stream faster)
      const mouse = e.deltaMode !== 0 || ((Math.abs(dy) % 100 === 0 || Math.abs(dy) % 120 === 0) && gap >= 30);
      if (mouse) {
        gesture(px * 0.0035); // a notch is ~0.3 of a door; no cap, keep rolling to go further
        return;
      }
      // trackpad: tiny stray deltas (cursor movement) are a dead zone, and one gesture
      // (including its momentum tail) travels at most one door
      if (!g.active) {
        g.acc += px;
        if (Math.abs(g.acc) < 8) return;
        g.active = true;
      }
      if (gBase.current === null) gBase.current = Math.round(target.current);
      const a = Math.abs(px);
      if (g.ema === 0) g.ema = a;
      if (g.ema > 0 && a > 20 && a > g.ema * 1.6) gBase.current = Math.round(target.current); // user re-accelerated: fresh gesture
      g.ema = g.ema * 0.8 + a * 0.2;
      gesture(px * 0.0016, 1);
    };
    let ly = 0;
    const onTs = (e: TouchEvent) => {
      ly = e.touches[0].clientY;
    };
    const onTm = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      gesture((ly - y) * 0.005, 1.5);
      ly = y;
    };
    const onTe = () => {
      if (!busy.current) settle();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "Escape") setMenu(false);
      if (busy.current) return; // a room is open: leave keys to it (native scrolling)
      const interactive = (e.target as HTMLElement | null)?.closest?.("a,button,input,textarea,select");
      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") dir = -1;
      else if (e.key === " " && !interactive) dir = e.shiftKey ? -1 : 1;
      if (!dir) return;
      e.preventDefault();
      step(dir);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTs, { passive: true });
    root.addEventListener("touchmove", onTm, { passive: false });
    root.addEventListener("touchend", onTe, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTs);
      root.removeEventListener("touchmove", onTm);
      root.removeEventListener("touchend", onTe);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, gesture, settle, step]);

  /* ----- door -> room ----- */
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const openDoor = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    window.clearTimeout(idle.current);
    gBase.current = null;
    const base = Math.round(target.current);
    snap.current = base;
    moveTo(base);
    const k = mod(base, N);
    openRef.current = k;
    setOpenIdx(k);
    animate(centerMv, 1, { duration: reducedRef.current ? 0 : 0.5 });
    later(() => moveTo(base + 0.85), 450);
    later(() => {
      setRoom(k);
      onRoomChange(true);
    }, 1050);
  }, [moveTo, later, onRoomChange, centerMv]);

  const closeRoom = useCallback(() => {
    setRoom(null);
    onRoomChange(false);
    setOpenIdx(null);
    moveTo(snap.current);
    later(() => animate(centerMv, 0, { duration: reducedRef.current ? 0 : 0.4 }), 700);
    later(() => {
      openRef.current = null;
      centerMv.set(0);
      busy.current = false;
      openerRef.current?.focus();
    }, 1200);
  }, [moveTo, later, onRoomChange, centerMv]);

  useEffect(() => {
    if (room === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // a nested dialog (certificate lightbox) handles its own Escape
      if (document.querySelectorAll("[role=dialog]").length > 1) return;
      closeRoom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [room, closeRoom]);

  const { D, HW, FH, CH, Hd, Wd, P } = geo;
  const curIdx = openIdx ?? ui.cur;
  const cur = DOORS[curIdx];
  const RoomView = room !== null ? DOORS[room].Room : null;
  const pad = (n: number) => String(n).padStart(2, "0");
  const planeVars = { opacity: "var(--o)" } as const;

  return (
    <>
      <div
        ref={rootRef}
        inert={!active || room !== null}
        data-lenis-prevent
        aria-hidden={!active}
        className={`fixed inset-0 z-[55] touch-none overflow-hidden bg-paper transition-[opacity,scale] duration-700 select-none ${
          active ? "scale-100 opacity-100" : "pointer-events-none scale-[0.92] opacity-0"
        }`}
        style={{ overscrollBehavior: "none" }}
      >
        {/* 3D corridor */}
        <div className="absolute inset-0" style={{ perspective: `${P}px`, perspectiveOrigin: "50% 46%" }} aria-hidden>
          <div ref={sceneRef} className="absolute inset-0 [transform-style:preserve-3d]">
            {DOORS.map((door, k) => {
              const side = k % 2 === 0 ? -1 : 1;
              return (
                <div
                  key={door.id}
                  ref={(el) => {
                    segs.current[k] = el;
                  }}
                  className="absolute top-1/2 left-1/2 h-0 w-0 [transform-style:preserve-3d]"
                  style={{ visibility: "hidden" }}
                >
                  {/* floor + rug */}
                  <div
                    className="absolute border-t-[3px] border-ink"
                    style={{
                      ...planeVars,
                      width: 2 * HW,
                      height: D,
                      left: -HW,
                      top: -D / 2,
                      transform: `translate3d(0,${FH}px,${D / 2}px) rotateX(90deg)`,
                      background: `repeating-linear-gradient(180deg, rgba(17,17,17,.3) 0 2px, transparent 2px ${D / 5}px), repeating-linear-gradient(90deg, rgba(17,17,17,.4) 0 2px, transparent 2px ${(2 * HW) / 16}px), #e4ded0`,
                    }}
                  >
                    <div className="tex-wood absolute inset-0 opacity-60" />
                    <div
                      className="absolute border-[3px] border-ink bg-[#fffdf8] shadow-[0_0_14px_rgba(20,12,4,.35)]"
                      style={{ width: Wd * 1.7, left: `calc(50% - ${Wd * 0.85}px)`, top: "3%", height: "94%" }}
                    >
                      <div className="tex-paper absolute inset-0 opacity-80" />
                      <div className="absolute inset-[7%] border-2 border-dashed border-ink" />
                      <div className="absolute inset-y-[7%] left-1/2 w-[18%] -translate-x-1/2 bg-signal/90" />
                    </div>
                    {/* ambient occlusion where the floor meets the walls, and the warm pool under the pendant lamp */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(25,14,4,.34), transparent 13%, transparent 87%, rgba(25,14,4,.34)), radial-gradient(ellipse 34% 46% at 50% 50%, rgba(255,205,140,.5), rgba(255,205,140,.16) 48%, transparent 72%)",
                      }}
                    />
                  </div>
                  {/* ceiling + beam */}
                  <div
                    className="absolute border-t-[8px] border-ink"
                    style={{
                      ...planeVars,
                      width: 2 * HW,
                      height: D,
                      left: -HW,
                      top: -D / 2,
                      transform: `translate3d(0,${-CH}px,${D / 2}px) rotateX(-90deg)`,
                      background: "#efeade",
                    }}
                  >
                    <div className="tex-paper absolute inset-0" />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(25,14,4,.28), transparent 14%, transparent 86%, rgba(25,14,4,.28)), radial-gradient(ellipse 30% 40% at 50% 50%, rgba(255,214,160,.6), transparent 70%)",
                      }}
                    />
                  </div>
                  {/* walls with wainscot + art */}
                  {[-1, 1].map((sd) => (
                    <div
                      key={sd}
                      className="absolute border-y-[4px] border-ink"
                      style={{
                        ...planeVars,
                        width: D,
                        height: FH + CH,
                        left: -D / 2,
                        top: -(FH + CH) / 2,
                        transform: `translate3d(${sd * HW}px,${(FH - CH) / 2}px,${D / 2}px) rotateY(${-sd * 90}deg)`,
                        background: "#ece7db",
                      }}
                    >
                      <div className="tex-paper absolute inset-0" />
                      <div className="hatch absolute inset-x-0 bottom-0 h-[26%] border-t-[3px] border-ink opacity-70" />
                      {/* ambient occlusion at ceiling and floor lines + lamp spill on the wall */}
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(rgba(25,14,4,.34), transparent 16%, transparent 80%, rgba(25,14,4,.4)), radial-gradient(ellipse 36% 55% at 50% 12%, rgba(255,205,140,.4), transparent 70%)",
                        }}
                      />
                      <div className="absolute border-l-2 border-ink/50" style={{ left: 0, top: 0, bottom: 0 }} />
                      <div className="absolute" style={{ left: "31%", top: "16%", width: "38%", height: `${D * 0.38 * (100 / 120)}px` }}>
                        <Art v={sd === -1 ? k : k + 3} />
                      </div>
                      {/* wall vent */}
                      <div
                        className="absolute border-[3px] border-ink bg-paper"
                        style={{ [sd === -1 ? "left" : "right"]: "10%", top: "8%", width: "9%", height: "9%", backgroundImage: "repeating-linear-gradient(180deg, #111 0 2px, transparent 2px 7px)" }}
                      />
                      {/* console table + plant, only on the wall opposite each door */}
                      {sd === (k % 2 === 0 ? 1 : -1) && (
                        <div className="absolute bottom-0" style={{ left: "62%", width: "22%", height: "46%" }}>
                          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
                            <g {...G} strokeWidth={2.5} filter="url(#ink)">
                              <path d="M8 56h84M14 56v44M86 56v44M14 74h72" />
                              <path d="M50 56V36M50 46l-12-8M50 42l12-10M50 38v-14" />
                              <path d="M42 56l2-8h12l2 8" fill="#fffdf8" />
                            </g>
                          </svg>
                        </div>
                      )}
                      {/* arrow pointing at the door this wall segment leads to */}
                      {sd === (k % 2 === 0 ? -1 : 1) && (
                        <div className="absolute" style={{ [sd === -1 ? "right" : "left"]: "12%", top: "46%", width: "20%", height: "10%" }}>
                          <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible" aria-hidden>
                            <g {...G} stroke="#ff4d1c" strokeWidth={5} filter="url(#ink)" transform={sd === -1 ? "" : "translate(100 0) scale(-1 1)"}>
                              <path d="M4 22q40-14 86-2M70 4l22 16-20 16" />
                            </g>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* pendant lamp */}
                  <div
                    className="absolute"
                    style={{ ...planeVars, width: Wd * 0.3, height: Wd * 0.39, left: -Wd * 0.15, top: -CH, transform: `translate3d(0,0,${D / 2}px)` }}
                  >
                    {/* lamp halo */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -inset-[170%] rounded-full"
                      style={{ background: "radial-gradient(circle, rgba(255,200,120,.45), rgba(255,200,120,.12) 40%, transparent 66%)" }}
                    />
                    <Lamp />
                  </div>
                  {/* door */}
                  <div
                    ref={(el) => {
                      doorEls.current[k] = el;
                    }}
                    className="absolute [transform-style:preserve-3d]"
                    style={{ left: -Wd / 2, top: FH - Hd, width: Wd, height: Hd }}
                  >
                    <div
                      className="absolute bottom-full left-1/2 mb-[5%] -translate-x-1/2 border-[3px] border-ink bg-paper px-[0.6em] py-[0.12em] leading-none whitespace-nowrap text-ink uppercase shadow-[3px_3px_0_#111]"
                      style={{ opacity: "var(--o)", fontFamily: "var(--f-hand)", fontSize: Wd * 0.17 }}
                    >
                      {door.title}
                    </div>
                    {/* soft contact shadow on the floor under the door */}
                    <div
                      aria-hidden
                      className="absolute -bottom-[3%] -left-[12%] h-[7%] w-[124%]"
                      style={{ opacity: "var(--o)", background: "radial-gradient(ellipse at 50% 50%, rgba(20,10,0,.5), transparent 70%)" }}
                    />
                    <div
                      className="absolute -inset-[4%] border-[5px] border-ink bg-paper-2 shadow-[0_16px_30px_rgba(20,12,4,.35)]"
                      style={{ opacity: "var(--o)", transform: "translateZ(-2px)" }}
                    >
                      <div className="tex-paper absolute inset-0" />
                    </div>
                    <div
                      className="absolute inset-0 bg-[#fffdf8]"
                      style={{
                        opacity: "var(--o)",
                        backgroundImage: "radial-gradient(circle at 50% 45%, rgba(255,77,28,.35), transparent 70%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 border-[3px] border-ink bg-[#fffdf8] shadow-[0_0_0_1px_rgba(17,17,17,.4)] transition-transform duration-[1050ms] ease-[cubic-bezier(.55,0,.2,1.16)]"
                      style={{
                        opacity: "var(--o)",
                        transformOrigin: side === -1 ? "0% 50%" : "100% 50%",
                        transform: `translateZ(2px) rotateY(${openIdx === k ? side * 105 : 0}deg)`,
                      }}
                    >
                      {/* heavy start, soft settle, small final bounce (the bezier overshoots 1) */}
                      <div className="tex-wood absolute inset-0 opacity-55" />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{ background: "linear-gradient(180deg, rgba(255,214,160,.34), transparent 38%), linear-gradient(90deg, rgba(25,14,4,.16), transparent 22%)" }}
                      />
                      <DoorPanelArt />
                      <span
                        className="absolute top-[11%] left-0 w-[86%] text-center font-display leading-none text-transparent [-webkit-text-stroke:2px_#111]"
                        style={{ fontSize: Wd * 0.34 }}
                      >
                        {pad(k + 1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* vanishing-point haze */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 12% 14% at 50% 46%, #fffdf8 0%, rgba(255,253,248,0) 100%), radial-gradient(ellipse 34% 30% at 50% 46%, rgba(255,230,205,.75) 0%, rgba(244,241,234,0) 100%)",
          }}
          aria-hidden
        />
        {/* bloom at the far end, dust in the light, and a darker vignette toward the edges */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 22% 20% at 50% 46%, rgba(255,246,228,.7), rgba(255,236,205,.22) 55%, transparent 100%)" }}
          aria-hidden
        />
        <Motes />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 78% 72% at 50% 46%, transparent 52%, rgba(30,18,6,.14) 78%, rgba(30,18,6,.42) 100%)" }}
          aria-hidden
        />

        {/* HUD */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-5">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onExit}
              className="w-fit cursor-pointer border-2 border-ink bg-paper px-2.5 py-1 font-display text-lg leading-none tracking-wide shadow-[3px_3px_0_#111] hover:bg-signal"
              aria-label="Back to the entrance"
            >
              TBR<span className="text-signal">.</span>
            </button>
            <div className="flex items-center gap-2 border-2 border-ink bg-paper px-2.5 py-1.5 shadow-[3px_3px_0_#111]">
              <span className="font-mono text-xs font-bold tracking-widest whitespace-nowrap">
                {pad(ui.cur + 1)} / {pad(N)}
              </span>
              <ul className="flex items-center" aria-label="Doors">
                {DOORS.map((d, i) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to door ${i + 1}: ${d.title}`}
                      aria-current={ui.cur === i ? "true" : undefined}
                      className="group flex h-6 w-6 cursor-pointer items-center justify-center"
                    >
                      <span
                        className={`block h-2.5 w-2.5 rounded-full border-2 border-ink transition-colors ${
                          ui.cur === i ? "bg-signal" : "bg-paper group-hover:bg-ink"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative mr-32 flex items-start gap-2 sm:mr-40">
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-controls="door-menu"
              aria-label="Door menu"
              className="cursor-pointer border-2 border-ink bg-paper p-2 shadow-[3px_3px_0_#111] hover:bg-signal"
            >
              {menu ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
            </button>
            {menu && (
              <div id="door-menu" className="absolute top-full right-0 mt-2 w-64" style={{ filter: "drop-shadow(5px 5px 0 #111)" }}>
                <div
                  className="px-4 pt-3 pb-8"
                  style={{
                    background:
                      "radial-gradient(circle at 20% 10%, rgba(255,255,255,.7), transparent 40%), radial-gradient(circle at 80% 70%, rgba(17,17,17,.07), transparent 45%), #ebe3cf",
                    clipPath:
                      "polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)",
                  }}
                >
                  <p className="border-b-2 border-dashed border-ink pb-1 font-display text-3xl tracking-[0.2em] uppercase">Map</p>
                  <ul className="relative mt-3 flex flex-col gap-1">
                    <span aria-hidden className="absolute top-3 bottom-3 left-[1.05rem] border-l-2 border-dashed border-ink" />
                    {DOORS.map((d, i) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setMenu(false);
                            goTo(i);
                          }}
                          aria-current={curIdx === i ? "location" : undefined}
                          className={`relative flex w-full cursor-pointer items-center gap-3 py-1.5 pr-2 pl-1 text-left font-mono text-xs font-bold tracking-wider uppercase hover:bg-ink hover:text-paper ${
                            curIdx === i ? "bg-signal/40" : ""
                          }`}
                        >
                          <span
                            className={`relative flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-[#fffdf8] ${
                              curIdx === i ? "!bg-signal" : ""
                            }`}
                          >
                            <d.Icon size={16} aria-hidden />
                          </span>
                          <span>
                            {pad(i + 1)} {d.title}
                          </span>
                          {curIdx === i && <span className="ml-auto text-[10px] tracking-widest text-signal">You are here</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* door plate + choices */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3 sm:pb-6">
          <div
            className={`tex-paper-bg pointer-events-auto w-full max-w-xl border-[3px] border-ink bg-paper p-3 shadow-[6px_6px_0_#111,0_22px_34px_rgba(20,12,4,.3)] transition-opacity duration-300 sm:p-4 ${
              ui.still ? "opacity-100" : "opacity-60"
            }`}
          >
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-signal uppercase">
              Door {pad(curIdx + 1)} of {pad(N)}
            </p>
            <h2 className="font-display text-3xl leading-none tracking-wide text-ink uppercase sm:text-4xl">{cur.title}</h2>
            <p className="mt-1 font-hand text-xl text-ink-soft">{cur.line}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                ref={openerRef}
                type="button"
                onClick={openDoor}
                className="inline-flex cursor-pointer items-center gap-2 border-2 border-ink bg-signal px-4 py-2 font-mono text-xs font-bold tracking-wider text-ink uppercase shadow-[3px_3px_0_#111] hover:-translate-y-0.5"
              >
                <DoorOpen size={16} aria-hidden /> Open door
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="inline-flex cursor-pointer items-center gap-2 border-2 border-ink bg-paper px-4 py-2 font-mono text-xs font-bold tracking-wider uppercase hover:bg-ink hover:text-paper"
              >
                Next door <ArrowDown size={14} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous door"
                className="inline-flex cursor-pointer items-center border-2 border-ink bg-paper p-2 hover:bg-ink hover:text-paper"
              >
                <ArrowUp size={14} aria-hidden />
              </button>
              <span className="ml-auto hidden font-mono text-[10px] tracking-wider text-ink-soft uppercase sm:block">
                Scroll · swipe · arrow keys
              </span>
            </div>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {ui.still ? `Door ${ui.cur + 1} of ${N}: ${cur.title}. ${cur.line}` : ""}
        </p>
      </div>

      {/* the room behind the door: real content, native scroll inside */}
      <AnimatePresence>
        {room !== null && RoomView && (
          <motion.div
            key="room"
            role="dialog"
            aria-modal="true"
            aria-label={`${DOORS[room].title} room`}
            data-lenis-prevent
            data-room
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-0 z-[90] overflow-x-clip overscroll-contain bg-paper ${
              DOORS[room].scroll ? "overflow-y-auto" : "overflow-hidden"
            }`}
          >
            <div className="pointer-events-none sticky top-0 z-[60] h-0">
              <button
                type="button"
                autoFocus
                onClick={closeRoom}
                aria-label="Back to hallway"
                className="pointer-events-auto absolute top-3 left-3 inline-flex cursor-pointer items-center gap-2 border-2 border-ink bg-signal px-3 py-2 font-mono text-xs font-bold tracking-wider text-ink uppercase shadow-[3px_3px_0_#111] hover:-translate-y-0.5 sm:top-5 sm:left-5"
              >
                <ArrowLeft size={14} aria-hidden /> Back to hallway
              </button>
              <span className="pointer-events-none absolute top-4 right-40 hidden font-mono text-xs font-bold tracking-widest uppercase sm:right-48 md:block">
                Door {pad(room + 1)}/{pad(N)} · {DOORS[room].title}
              </span>
            </div>
            <RoomView />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
