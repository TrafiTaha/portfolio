"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import ClassicPage from "@/components/experience/ClassicPage";
import { DOORS } from "@/components/experience/doors";
import Hall, { type HallHandle } from "@/components/experience/Hall";
import Hero from "@/components/sections/Hero";
import Cursor from "@/components/ui/Cursor";
import { useMotionMode } from "@/lib/useMotionMode";

type Mode = "hall" | "classic";
const KEY = "tbr-view";
const EVT = "tbr-view-change";
const idxOf = (id: string) => DOORS.findIndex((d) => d.id === id);
const noop = () => {};

// Remembered choice (localStorage, with an in-memory fallback when storage is blocked).
let memView: Mode | null = null;
const readView = (): Mode | null => {
  if (memView) return memView;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "hall" || v === "classic" ? v : null;
  } catch {
    return null;
  }
};
const writeView = (v: Mode) => {
  memView = v;
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* storage blocked: memory only */
  }
  window.dispatchEvent(new Event(EVT));
};
const subscribeView = (cb: () => void) => {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
};
const subscribeMounted = () => () => {};

// Chooses between the hallway (virtual-scroll, pseudo-3D) and the classic long page.
// Server + first paint render the classic page (SEO / no-JS); hallway mounts after hydration.
export default function Experience() {
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  const stored = useSyncExternalStore(subscribeView, readView, () => null);
  const reduced = useMotionMode() === "still";
  const [phase, setPhase] = useState<"entrance" | "hall">("entrance");
  const hallRef = useRef<HallHandle>(null);
  const entranceRef = useRef<HTMLDivElement>(null);

  const mode: Mode = !mounted ? "classic" : (stored ?? (reduced ? "classic" : "hall"));

  // Native scroll is locked only while the hallway is mounted; always released on teardown.
  useEffect(() => {
    if (mode !== "hall") return;
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
    };
  }, [mode]);

  const enter = useCallback((idx = 0) => {
    hallRef.current?.enter(idx);
    setPhase("hall");
  }, []);

  // At the entrance: scroll / swipe up / arrow down walks in.
  useEffect(() => {
    if (mode !== "hall" || phase !== "entrance") return;
    const atBottom = () => {
      const el = entranceRef.current;
      return !el || el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 12 && atBottom()) enter(0);
    };
    let y0 = 0;
    const onTs = (e: TouchEvent) => {
      y0 = e.touches[0].clientY;
    };
    const onTe = (e: TouchEvent) => {
      if (y0 - e.changedTouches[0].clientY > 50 && atBottom()) enter(0);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        enter(0);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTs, { passive: true });
    window.addEventListener("touchend", onTe, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTs);
      window.removeEventListener("touchend", onTe);
      window.removeEventListener("keydown", onKey);
    };
  }, [mode, phase, enter]);

  const toggle = () => {
    setPhase("entrance");
    window.scrollTo(0, 0);
    writeView(mode === "hall" ? "classic" : "hall");
  };

  return (
    <>
      <Cursor />
      {!mounted && <div className="boot-cover fixed inset-0 z-[300] bg-paper" aria-hidden />}
      <noscript>
        <style>{".boot-cover{display:none}"}</style>
      </noscript>

      {mode === "classic" ? (
        <ClassicPage />
      ) : (
        <>
          <Hall
            ref={hallRef}
            active={phase === "hall"}
            reduced={reduced}
            onRoomChange={noop}
            onExit={() => setPhase("entrance")}
          />
          <AnimatePresence>
            {phase === "entrance" && (
              <motion.div
                key="entrance"
                ref={entranceRef}
                data-lenis-prevent
                initial={false}
                exit={{ opacity: 0, scale: 1.25, transition: { duration: 0.6, ease: [0.7, 0, 0.3, 1] } }}
                style={{ transformOrigin: "50% 75%" }}
                className="fixed inset-0 z-[60] overflow-x-clip overflow-y-auto bg-paper"
              >
                <Hero onEnter={() => enter(0)} onJump={(id) => enter(idxOf(id))} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* One switch, always top right, above every layer (exterior, hallway, rooms, classic page). */}
      <button
        type="button"
        onClick={toggle}
        className="fixed top-3 right-3 z-[120] cursor-pointer border-2 border-ink bg-paper px-3 py-2 font-mono text-[10px] font-bold tracking-wider uppercase shadow-[3px_3px_0_#111] hover:bg-signal sm:top-5 sm:right-5 sm:text-xs"
      >
        {mode === "hall" ? "Classic view" : "Walk-through view"}
      </button>
    </>
  );
}
