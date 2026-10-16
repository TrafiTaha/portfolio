"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { getSound, scratch, subscribeSound, tick, toggleSound } from "@/lib/sound";

const INTERACTIVE = "a, button, [role='button']";

// Switch for the synthesized UI sounds. Off until the visitor turns it on. Placement keeps it clear of other UI.
const PLACE = {
  base: "right-3 bottom-3 sm:right-5 sm:bottom-5",
  // on phones the hallway door plate and room hint bars span the bottom, so float above them
  hall: "right-3 bottom-[13.5rem] sm:right-5 sm:bottom-5",
  // in rooms on phones it sits beside the Classic toggle (top row) so it never covers content
  room: "top-3 right-[9.25rem] sm:top-auto sm:right-5 sm:bottom-5",
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
      className={`fixed z-[120] inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-paper px-2 font-mono text-[10px] font-bold tracking-wider uppercase shadow-[3px_3px_0_#111] hover:bg-signal sm:px-2.5 sm:text-xs ${PLACE[place]}`}
      style={place === "room" ? { marginTop: "env(safe-area-inset-top)" } : { marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {on ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
      <span className="hidden sm:inline">Sound {on ? "on" : "off"}</span>
    </button>
  );
}
