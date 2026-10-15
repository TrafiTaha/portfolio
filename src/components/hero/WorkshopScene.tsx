// Original hand-drawn workshop frontage, in three parallax depth layers.
// All three share one 800x520 viewBox so HTML hotspots can be placed in %.
// Strokes draw on via the global .sketch.on CSS; #wobble adds the hand tremble.

const G = {
  fill: "none",
  stroke: "#111",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const svgProps = {
  viewBox: "0 0 800 520",
  className: "sketch on absolute inset-0 h-full w-full overflow-visible",
  "aria-hidden": true,
} as const;

const corrugation = Array.from({ length: 24 }, (_, i) => 120 + i * 24.4);
const wallRibs = Array.from({ length: 12 }, (_, i) => 160 + i * 45);

export function SceneBack() {
  return (
    <svg {...svgProps}>
      <g {...G} filter="url(#wobble-lg)">
        <circle cx="650" cy="72" r="34" fill="#ff4d1c" />
        <path d="M650 22v-10M650 132v-10M700 72h10M590 72h-10M686 36l8-8M614 36l-8-8" />
        <path d="M430 52q16-14 32-2q18-10 30 4q-6 10-30 10q-26 0-32-12z" />
        <path d="M0 452q120-70 250-18t250-14 300-30" />
        <path d="M60 470q40-20 80-8M690 462q40-16 90-4" strokeWidth={2} />
      </g>
    </svg>
  );
}

export function SceneMain() {
  return (
    <svg {...svgProps}>
      <defs>
        <pattern id="hp" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line className="keep" x1="0" y1="0" x2="0" y2="8" stroke="#111" strokeWidth="1.4" />
        </pattern>
      </defs>
      <g {...G} filter="url(#wobble)">
        {/* wall */}
        <rect x="130" y="170" width="540" height="300" fill="#f4f1ea" />
        {wallRibs.map((x) => (
          <path key={x} d={`M${x} 176V466`} strokeWidth={1.4} opacity={0.35} />
        ))}
        <path d="M630 176v290M640 190v270M650 200v262" strokeWidth={1.2} opacity={0.6} />
        {/* corrugated roof */}
        <path d="M90 170h620l-22-60H112z" fill="#e9e4d8" />
        {corrugation.map((x, i) => (
          <path key={i} d={`M${x} 112q4 28 -2 56`} strokeWidth={1.8} />
        ))}
        <path d="M82 172h636" strokeWidth={4} />
        {/* door opening: dark interior with bulb + bench */}
        <rect x="300" y="270" width="200" height="200" fill="url(#hp)" />
        <path d="M400 270v34" strokeWidth={2} />
        <circle cx="400" cy="312" r="8" fill="#ff4d1c" />
        <path d="M320 420h160M328 420v50M472 420v50M345 420v-26h40v26" />
        <rect x="292" y="258" width="216" height="14" fill="#f4f1ea" />
        <path d="M292 270v200M508 270v200" strokeWidth={4} />
        {/* sign ropes */}
        <path d="M340 172v20M460 172v20" />
        {/* window with CRT */}
        <rect x="160" y="225" width="110" height="95" fill="#f4f1ea" />
        <rect x="168" y="233" width="94" height="79" />
        <rect x="180" y="242" width="70" height="52" rx="9" fill="#e9e4d8" />
        <rect x="188" y="249" width="54" height="36" rx="6" fill="#111" />
        <path d="M195 258l8 5-8 5" stroke="#f4f1ea" strokeWidth={2.4} />
        <rect className="animate-blink keep" x="208" y="266" width="11" height="4" fill="#ff4d1c" stroke="none" />
        <path d="M207 294l-5 18M223 294l5 18M196 312h38" />
        <path d="M150 320h130" strokeWidth={5} />
        {/* dangling cables */}
        <path d="M575 174q-18 30 4 52q18 20-2 44" />
        <path d="M588 174q10 24-6 38q-14 14 4 30" strokeWidth={2.4} />
        <path d="M575 270l-3 12h10l-3-12" fill="#111" />
        {/* shelf: lamp, mug, cactus */}
        <path d="M530 332h125M545 332l-10 18M640 332l10 18" strokeWidth={4} />
        <ellipse cx="556" cy="327" rx="14" ry="4" fill="#f4f1ea" />
        <path d="M556 327v-26l20-22" />
        <path d="M566 273l22 12-12 14z" fill="#f4f1ea" />
        <path d="M580 304l-4 14M588 300l0 16M596 292l8 12" stroke="#ff4d1c" strokeWidth={2.6} />
        <path d="M606 308h22v22h-22zM628 313q9 3 0 11" fill="#f4f1ea" />
        <path className="animate-steam keep" d="M613 300q-4-8 2-14M621 300q-4-8 2-14" strokeWidth={2} />
        <path d="M638 330v-26M638 318l-8-4v-8M638 312l8-3v-7" />
        <path d="M631 330h14l-2 0z" />
        {/* mailbox on post */}
        <path d="M738 470v-72" strokeWidth={5} />
        <path d="M712 398v-18q0-14 26-14t26 14v18z" fill="#f4f1ea" />
        <path d="M722 384h32" strokeWidth={2} />
        <rect x="764" y="368" width="6" height="22" fill="#ff4d1c" />
        {/* ground */}
        <path d="M30 470h740" strokeWidth={4} />
        <path d="M50 484l16-5M110 486l16-5M200 484l16-5M330 487l16-5M480 485l16-5M610 486l16-5M700 484l16-5" strokeWidth={2} />
      </g>
    </svg>
  );
}

export function SceneFront() {
  return (
    <svg {...svgProps}>
      <g {...G} filter="url(#wobble)">
        {/* potted palm */}
        <path d="M44 420h72l-8 50H52z" fill="#f4f1ea" />
        <path d="M52 436h56" strokeWidth={2} />
        <path d="M80 420q-10-40 4-86" />
        <path d="M84 334q-30-34-62-26M84 334q-14-44 6-62M84 334q30-38 66-26M84 334q36-18 62 6M84 334q-38-12-60 12" />
        <path d="M60 314l-4 10M40 320l-6 8M92 300l4 10M120 320l8 6M132 336l10 2" strokeWidth={2} />
        {/* crate + laptop */}
        <rect x="540" y="420" width="116" height="50" fill="#f4f1ea" />
        <path d="M540 437h116M540 454h116M570 420v50M626 420v50" strokeWidth={2} />
        <path d="M578 420l-4-34h58l-4 34z" fill="#f4f1ea" />
        <rect x="582" y="372" width="48" height="36" rx="3" fill="#111" transform="rotate(-4 606 390)" />
        <path d="M594 384l-7 6 7 6M618 384l7 6-7 6" stroke="#f4f1ea" strokeWidth={2.4} />
        <path d="M608 380l-4 20" stroke="#ff4d1c" strokeWidth={2.6} />
        <path d="M572 420h68" strokeWidth={4} />
        {/* grass tufts */}
        <path d="M150 470l-6-14M156 470l2-16M162 470l8-12M690 470l-6-14M696 470l2-16M702 470l8-12" strokeWidth={2.4} />
        {/* floor cable from crate */}
        <path d="M540 462q-60 14-120 6t-90 4" strokeWidth={2.4} />
      </g>
    </svg>
  );
}
