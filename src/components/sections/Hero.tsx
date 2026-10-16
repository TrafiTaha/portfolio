"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SceneBack, SceneFront, SceneMain } from "@/components/hero/WorkshopScene";
import { scrollToTarget } from "@/components/providers/SmoothScroll";
import { personal, skills } from "@/data/portfolio";
import { useMotionMode, type MotionMode } from "@/lib/useMotionMode";

const stickerOf = (name: string) => skills.find((s) => s.name === name)?.short ?? name;

// Real skills slapped on the door (x/y/rot in %/deg of the door panel)
const doorStickers = [
  { name: "React", x: 6, y: 8, r: -8 },
  { name: "TypeScript", x: 52, y: 6, r: 6 },
  { name: "Next.js", x: 28, y: 28, r: -3 },
  { name: "Node.js", x: 6, y: 46, r: 7 },
  { name: "Laravel", x: 50, y: 40, r: -7 },
  { name: "JavaScript", x: 26, y: 62, r: 5 },
  { name: "PHP", x: 62, y: 62, r: -4 },
  { name: "MySQL", x: 4, y: 74, r: -6 },
];
const crateStickers = [
  { name: "Git", x: 6, y: 18, r: -6 },
  { name: "GitHub Actions", x: 40, y: 40, r: 5 },
  { name: "Artificial Intelligence", x: 68, y: 12, r: -4 },
];

const chip =
  "absolute whitespace-nowrap rounded-[5px] border-2 border-ink bg-paper px-[0.5em] py-[0.12em] font-mono font-bold uppercase leading-none text-ink shadow-[1.5px_1.5px_0_#111]";

function Layer({
  depth,
  mx,
  my,
  mode,
  sway,
  className = "",
  children,
}: {
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  mode: MotionMode;
  sway: string;
  className?: string;
  children: ReactNode;
}) {
  const x = useTransform(mx, [-1, 1], [-depth, depth]);
  const y = useTransform(my, [-1, 1], [-depth * 0.6, depth * 0.6]);
  return (
    <motion.div
      className={`absolute inset-0 ${mode === "sway" ? sway : ""} ${className}`}
      style={mode === "mouse" ? { x, y } : undefined}
    >
      {children}
    </motion.div>
  );
}

const hot =
  "absolute group cursor-pointer rounded-md focus-visible:outline-offset-2";
const tag =
  "pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[4px] border-2 border-ink bg-paper px-[0.5em] py-[0.1em] font-hand leading-none text-ink shadow-[1.5px_1.5px_0_#111] transition-colors group-hover:bg-signal group-focus-visible:bg-signal";

export default function Hero({
  onEnter,
  onJump,
}: {
  onEnter?: () => void;
  onJump?: (id: "about" | "contact") => void;
}) {
  const mode = useMotionMode();
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 55, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 55, damping: 18 });
  const [open, setOpen] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (mode !== "mouse") return;
    const onMove = (e: MouseEvent) => {
      mxRaw.set((e.clientX / window.innerWidth) * 2 - 1);
      myRaw.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mode, mxRaw, myRaw]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(window.clearTimeout);
  }, []);

  const enterDoor = () => {
    setOpen(true);
    if (onEnter) {
      timers.current.push(window.setTimeout(onEnter, 600));
      return;
    }
    timers.current.push(
      window.setTimeout(() => scrollToTarget("#projects", -70), 650),
      window.setTimeout(() => setOpen(false), 2600)
    );
  };

  const chipStyle = { fontSize: "max(6.5px, 1.35cqw)" } as const;

  return (
    <section id="top" className="relative flex flex-col lg:min-h-svh overflow-x-clip px-4 pt-24 pb-10 sm:px-8 lg:pt-28">
      <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-ink-soft sm:text-xs">
        <span>Portfolio · Nº 2026</span>
        <span>{personal.location}</span>
      </div>

      <h1
        className="relative z-30 mx-auto mt-3 w-full max-w-[96rem] font-display leading-[0.86] tracking-tight text-ink uppercase text-[21vw] sm:text-[19vw] lg:text-[min(11.6vw,12.5rem)] lg:whitespace-nowrap"
        aria-label={personal.name}
      >
        <span aria-hidden className="block lg:inline">
          Taha Ben{" "}
        </span>
        <span
          aria-hidden
          className="relative block lg:inline text-transparent [-webkit-text-stroke:2px_#111] sm:[-webkit-text-stroke:3px_#111]"
        >
          Romdhane
          {/* hand-drawn underline */}
          <svg
            aria-hidden
            viewBox="0 0 600 24"
            preserveAspectRatio="none"
            className="sketch on pointer-events-none absolute left-0 -bottom-[0.02em] h-[0.07em] w-full overflow-visible"
            style={{ filter: "url(#wobble)" }}
          >
            <path d="M4 14C80 4 140 22 220 12S380 6 460 14 560 18 596 8" fill="none" stroke="#ff4d1c" strokeWidth="9" strokeLinecap="round" />
          </svg>
        </span>
      </h1>

      {/* scene */}
      <div
        className="relative mx-auto -mt-[4vw] aspect-[800/520] w-[min(100%,calc((100svh-24rem)*1.538))] min-w-[300px] [container-type:inline-size] lg:-mt-[3.5vw]"
      >
        <Layer depth={7} mx={mx} my={my} mode={mode} sway="sway-b">
          <SceneBack />
        </Layer>

        <Layer depth={16} mx={mx} my={my} mode={mode} sway="sway-a" className="z-10">
          <SceneMain />

          {/* hanging hand-lettered sign */}
          <div
            className="animate-swing absolute z-10 flex items-center justify-center rounded-[3px] border-[3px] border-ink bg-paper-2 text-center font-hand uppercase leading-[0.95] text-ink shadow-[3px_3px_0_#111]"
            style={{ left: "35.5%", top: "36.5%", width: "29%", height: "14.5%", fontSize: "max(10.5px, 3.3cqw)" }}
          >
            <span>
              Full-Stack
              <br />
              <span className="text-signal [-webkit-text-stroke:0.6px_#111]">Engineer</span>
            </span>
          </div>

          {/* roll-up door (real button) */}
          <button
            type="button"
            onClick={enterDoor}
            aria-label="Open the workshop door and see my work"
            className={`${hot} z-20 overflow-hidden`}
            style={{ left: "37.5%", top: "51.9%", width: "25%", height: "38.5%" }}
          >
            <span
              className="absolute inset-0 block transition-transform duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-[6%] group-focus-visible:-translate-y-[6%] motion-reduce:transition-none"
              style={{ transform: open ? "translateY(-96%)" : undefined }}
            >
              <span aria-hidden className="slats absolute inset-0 block border-[3px] border-ink" style={{ filter: "url(#wobble)" }} />
              {doorStickers.map((s) => (
                <span
                  key={s.name}
                  aria-hidden
                  className={chip}
                  style={{ ...chipStyle, left: `${s.x}%`, top: `${s.y}%`, rotate: `${s.r}deg` }}
                >
                  {stickerOf(s.name)}
                </span>
              ))}
              <span
                aria-hidden
                className="absolute bottom-[3%] left-1/2 -translate-x-1/2 rounded-[4px] border-2 border-ink bg-signal px-[0.6em] py-[0.1em] font-hand leading-none text-ink"
                style={{ fontSize: "max(8px, 2.1cqw)" }}
              >
                work ↑
              </span>
            </span>
          </button>

          {/* window -> About */}
          <button
            type="button"
            onClick={() => (onJump ? onJump("about") : scrollToTarget("#about", -70))}
            aria-label="Look through the window to read about me"
            className={`${hot} z-20`}
            style={{ left: "19.5%", top: "42.5%", width: "14.5%", height: "20%" }}
          >
            <span aria-hidden className={`${tag} top-[104%]`} style={{ fontSize: "max(8px, 2cqw)" }}>
              about ↓
            </span>
          </button>

          {/* mailbox -> Contact */}
          <button
            type="button"
            onClick={() => (onJump ? onJump("contact") : scrollToTarget("#contact", -70))}
            aria-label="Open the mailbox to get in touch"
            className={`${hot} z-20`}
            style={{ left: "88%", top: "69%", width: "8.6%", height: "22%" }}
          >
            <span aria-hidden className={`${tag} -top-[22%]`} style={{ fontSize: "max(8px, 2cqw)" }}>
              contact
            </span>
          </button>

          {/* hand-drawn "click the door" hint */}
          <span aria-hidden className="pointer-events-none absolute z-20 flex items-center" style={{ left: "16%", top: "79%" }}>
            <span className="-rotate-6 font-hand leading-none whitespace-nowrap text-ink" style={{ fontSize: "max(10px, 2.4cqw)" }}>
              click the door
            </span>
            <svg
              viewBox="0 0 90 40"
              className="sketch on ml-[0.5cqw] overflow-visible"
              style={{ width: "8cqw", height: "3.6cqw", filter: "url(#wobble)" }}
            >
              <path d="M4 30C30 36 56 24 82 12M64 6l20 5-8 18" fill="none" stroke="#ff4d1c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          {/* availability stamp */}
          <span
            aria-hidden
            className="absolute z-20 -rotate-12 rounded-md border-[3px] border-signal px-[0.7em] py-[0.25em] font-mono font-bold uppercase leading-none tracking-wider text-signal"
            style={{ left: "5%", top: "12%", fontSize: "max(7px, 1.55cqw)" }}
          >
            Open to work
          </span>
        </Layer>

        <Layer depth={30} mx={mx} my={my} mode={mode} sway="sway-b" className="pointer-events-none z-20">
          <SceneFront />
          {crateStickers.map((s) => (
            <span
              key={s.name}
              aria-hidden
              className={chip}
              style={{
                ...chipStyle,
                left: `${67.5 + s.x * 0.115}%`,
                top: `${81.5 + s.y * 0.16}%`,
                rotate: `${s.r}deg`,
              }}
            >
              {stickerOf(s.name)}
            </span>
          ))}
        </Layer>
      </div>

      <div className="relative z-30 mx-auto mt-6 flex w-full max-w-[96rem] flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div
          className="max-w-md -rotate-1 border-2 border-ink bg-paper px-4 py-3 shadow-[4px_4px_0_#111]"
          role="note"
        >
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-signal">Explorer</p>
          <p className="mt-1 text-sm leading-snug font-medium text-ink">
            {onEnter
              ? "Scroll, press the down arrow or click the door to walk into the house. The window jumps to About, the mailbox to Contact."
              : "Click the door to see my work. The window opens About, the mailbox opens Contact."}
          </p>
        </div>
        <p className="max-w-xs text-sm leading-snug text-ink-soft sm:text-right">{personal.summary}</p>
      </div>
    </section>
  );
}
