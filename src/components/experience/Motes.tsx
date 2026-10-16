// A few dozen dust motes drifting through the lamp light. Pure CSS (transform/opacity keyframes), deterministic
// layout so server and client agree; hidden for reduced motion and paused by the browser when the tab is hidden.
const motes = Array.from({ length: 28 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: 12 + r(1) * 76,
    top: 6 + r(2) * 70,
    size: 1.5 + r(3) * 2.5,
    dx: (r(4) - 0.5) * 60,
    dy: -20 - r(5) * 50,
    dur: 7 + r(6) * 8,
    delay: -r(7) * 12,
  };
});

export default function Motes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {motes.map((m, i) => (
        <span
          key={i}
          className="mote absolute rounded-full"
          style={
            {
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              background: "rgba(255, 236, 200, 0.95)",
              boxShadow: "0 0 6px rgba(255, 214, 150, 0.9)",
              "--dx": `${m.dx}px`,
              "--dy": `${m.dy}px`,
              "--dur": `${m.dur}s`,
              "--delay": `${m.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
