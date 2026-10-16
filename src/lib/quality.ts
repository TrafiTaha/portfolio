"use client";

// Remembered render tier. "lite" is set automatically when the hallway measures slow frames
// (see Hall), and persists so the next visit starts smooth. try/catch: storage may be blocked.
const KEY = "tbr-quality";
const EVT = "tbr-quality-change";
let mem: "lite" | null = null;

export const readQuality = (): "lite" | null => {
  if (mem) return mem;
  try {
    return window.localStorage.getItem(KEY) === "lite" ? "lite" : null;
  } catch {
    return null;
  }
};

export const setLiteQuality = () => {
  try {
    // localStorage tbr-quality = "full" pins the full tier (for profiling): never auto-downgrade
    if (window.localStorage.getItem(KEY) === "full") return;
  } catch {
    /* ignore */
  }
  mem = "lite";
  try {
    window.localStorage.setItem(KEY, "lite");
  } catch {
    /* memory only */
  }
  window.dispatchEvent(new Event(EVT));
};

export const subscribeQuality = (cb: () => void) => {
  window.addEventListener(EVT, cb);
  return () => window.removeEventListener(EVT, cb);
};
