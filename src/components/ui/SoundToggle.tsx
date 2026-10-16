"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { getSound, scratch, subscribeSound, tick, toggleSound } from "@/lib/sound";

const INTERACTIVE = "a, button, [role='button']";

// Bottom-right switch. Sound stays off until the visitor turns it on.
const PLACE = {
  base: "bottom-3 sm:bottom-5",
  // on phones the hallway door plate and room hint bars span the bottom, so float above them
  hall: "bottom-[13.5rem] sm:bottom-5",
  room: "bottom-24 sm:bottom-5",
} as const;

export default function SoundToggle({ place = "base" }: { place?: keyof typeof PLACE }) {
  const on = useSyncExternalStore(subscribeSound, getSound, () => false);

  useEffect(() => {
    if (!on) return;
    let lastEl: Element | null = null;
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      if (el && el !== lastEl) scratch();
      lastEl = el;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.("[data-sound-toggle]")) return;
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) tick();
    };
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    return () => {
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("click", onClick);
    };
  }, [on]);

  return (
    <button
      type="button"
      data-sound-toggle
      onClick={toggleSound}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className={`fixed right-3 z-[120] inline-flex cursor-pointer items-center gap-2 border-2 border-ink bg-paper p-2 font-mono text-[10px] font-bold tracking-wider uppercase shadow-[3px_3px_0_#111] hover:bg-signal sm:right-5 sm:px-2.5 sm:text-xs ${PLACE[place]}`}
    >
      {on ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
      <span className="hidden sm:inline">Sound {on ? "on" : "off"}</span>
    </button>
  );
}
