// Tiny synthesized UI sounds (Web Audio, no files). Off by default; the choice is remembered.
// An AudioContext may only start from a user gesture, so it is created inside toggleSound().
const KEY = "tbr-sound";
const EVT = "tbr-sound-change";

let on = false;
let loaded = false;
let ctx: AudioContext | null = null;

const load = () => {
  if (loaded) return;
  loaded = true;
  try {
    on = window.localStorage.getItem(KEY) === "1";
  } catch {
    /* storage blocked: stays off */
  }
};

export const getSound = () => {
  load();
  return on;
};
export const subscribeSound = (cb: () => void) => {
  window.addEventListener(EVT, cb);
  return () => window.removeEventListener(EVT, cb);
};

export function toggleSound() {
  load();
  on = !on;
  try {
    window.localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* memory only */
  }
  if (on) {
    ctx ??= new AudioContext();
    void ctx.resume();
    tick(); // confirms it is on
  }
  window.dispatchEvent(new Event(EVT));
}

const ready = () => {
  load();
  if (!on || !ctx || ctx.state !== "running") return null;
  return ctx;
};

// Pencil-on-paper scratch: a short band-passed noise burst.
export function scratch() {
  const c = ready();
  if (!c) return;
  const len = Math.floor(c.sampleRate * 0.07);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 2600;
  const g = c.createGain();
  g.gain.value = 0.05;
  src.connect(f).connect(g).connect(c.destination);
  src.start();
}

// Stamp / click: a soft low blip.
export function tick() {
  const c = ready();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(240, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.08);
  g.gain.setValueAtTime(0.09, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.1);
}
