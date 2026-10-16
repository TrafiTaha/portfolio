"use client";

import { useSyncExternalStore } from "react";

const Q = "(pointer: coarse), (max-width: 768px)";

const subscribe = (cb: () => void) => {
  const q = window.matchMedia(Q);
  q.addEventListener("change", cb);
  return () => q.removeEventListener("change", cb);
};

// "Lite" render mode for phones / touch / low-core devices: no SVG displacement filters on the hallway art,
// no blend modes or blur, a handful of motes. Desktop with a fine pointer and enough cores is unchanged.
const getSnapshot = () => window.matchMedia(Q).matches || (navigator.hardwareConcurrency ?? 8) <= 4;

export function useLite(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
