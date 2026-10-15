"use client";

import { useSyncExternalStore } from "react";

export type MotionMode = "mouse" | "sway" | "still";

const subscribe = (cb: () => void) => {
  const queries = [window.matchMedia("(pointer: fine)"), window.matchMedia("(prefers-reduced-motion: reduce)")];
  queries.forEach((q) => q.addEventListener("change", cb));
  return () => queries.forEach((q) => q.removeEventListener("change", cb));
};

const getSnapshot = (): MotionMode => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "still";
  return window.matchMedia("(pointer: fine)").matches ? "mouse" : "sway";
};

// "mouse" = pointer parallax, "sway" = gentle idle drift on touch, "still" = reduced motion.
export function useMotionMode(): MotionMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => "still" as MotionMode);
}
