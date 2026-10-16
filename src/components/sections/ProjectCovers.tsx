// Original illustrated covers (hand-drawn style SVG, NOT screenshots).
// One per project, ink + a single orange accent. `drawn` triggers the ink draw-on.

const G = { fill: "none", stroke: "#111", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Frame({ drawn, label, children }: { drawn: boolean; label: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-label={label}
      className={`sketch h-full w-full ${drawn ? "on" : ""}`}
    >
      <g {...G} filter="url(#wobble-lg)">
        {children}
      </g>
    </svg>
  );
}

// AlphaDocTN: documents behind a padlock, with a role tree (RBAC)
function DocCover({ drawn }: { drawn: boolean }) {
  return (
    <Frame drawn={drawn} label="Illustrated cover: stacked documents behind a padlock and a role tree">
      <path d="M70 70h120l14 16h86v150H70z" fill="#fffdf8" />
      <path d="M90 60h120l14 16h86v150H90z" fill="#fffdf8" />
      <path d="M110 50h120l14 16h86v150H110z" fill="#fffdf8" />
      <path d="M135 100h110M135 120h150M135 140h90M135 160h130" strokeWidth={2} />
      <rect x="190" y="168" width="84" height="62" rx="8" fill="#ff4d1c" />
      <path d="M205 168v-20q27-34 54 0v20" strokeWidth={5} />
      <circle cx="232" cy="196" r="7" fill="#111" />
      <path d="M232 203v12" strokeWidth={4} />
      <circle cx="400" cy="70" r="14" fill="#fffdf8" />
      <path d="M400 84v26M400 110h-52v20M400 110h52v20M400 110v20" />
      <circle cx="348" cy="142" r="12" fill="#fffdf8" />
      <circle cx="400" cy="142" r="12" fill="#fffdf8" />
      <circle cx="452" cy="142" r="12" fill="#ff4d1c" />
      <path d="M340 178h16M392 178h16M444 178h16M340 192h10M392 192h10M444 192h10" strokeWidth={2} />
      <path d="M300 250h160" strokeDasharray="6 8" className="keep" strokeWidth={2} />
    </Frame>
  );
}

// Agrisdol: furrowed field, sprout, soil sensor and a small yield chart
function FieldCover({ drawn }: { drawn: boolean }) {
  return (
    <Frame drawn={drawn} label="Illustrated cover: farm field with a sprout, a soil sensor and a yield chart">
      <circle cx="390" cy="62" r="26" fill="#ff4d1c" />
      <path d="M390 22v-8M390 110v-8M350 62h-8M438 62h8" />
      <path d="M0 130q120-26 240-8t240-10" />
      <path d="M0 160q120-24 240-6t240-8M0 192q120-22 240-4t240-6M0 226q120-20 240-2t240-4M0 262q120-18 240 0t240-2" strokeWidth={2.4} />
      <path d="M110 232q-2-40 6-70M116 168q-34-12-40-40q30-2 40 40M116 188q30-10 46-34q-30-6-46 34" fill="#fffdf8" />
      <path d="M300 250V170M290 170h20M300 190h-14M300 205h14" />
      <rect x="284" y="150" width="32" height="20" rx="3" fill="#fffdf8" />
      <circle cx="300" cy="160" r="3" fill="#ff4d1c" stroke="none" />
      <rect x="352" y="170" width="104" height="78" fill="#fffdf8" />
      <path d="M368 238v-24M388 238v-44M408 238v-34M428 238v-58" strokeWidth={9} />
      <path d="M362 190l26 -4 22 12 34 -20" stroke="#ff4d1c" strokeWidth={3} />
    </Frame>
  );
}

// WorkSphere: a kanban board orbiting a sphere of connected people
function BoardCover({ drawn }: { drawn: boolean }) {
  return (
    <Frame drawn={drawn} label="Illustrated cover: a task board with cards, and a sphere of connected team members">
      <rect x="40" y="50" width="250" height="200" fill="#fffdf8" />
      <path d="M123 50v200M206 50v200M40 82h250" strokeWidth={2.4} />
      <path d="M54 66h56M137 66h56M220 66h56" strokeWidth={2} />
      <rect x="50" y="94" width="64" height="34" fill="#f4f1ea" />
      <rect x="50" y="138" width="64" height="34" fill="#f4f1ea" />
      <rect x="133" y="94" width="64" height="40" fill="#ff4d1c" />
      <rect x="216" y="94" width="64" height="34" fill="#f4f1ea" />
      <rect x="216" y="138" width="64" height="34" fill="#f4f1ea" />
      <rect x="216" y="182" width="64" height="34" fill="#f4f1ea" />
      <path d="M58 106h40M58 150h30M141 106h40M224 106h30M224 150h42M224 194h28" strokeWidth={2} />
      <circle cx="390" cy="150" r="64" fill="#fffdf8" />
      <ellipse cx="390" cy="150" rx="64" ry="22" />
      <ellipse cx="390" cy="150" rx="24" ry="64" />
      <circle cx="342" cy="130" r="9" fill="#111" />
      <circle cx="430" cy="110" r="9" fill="#ff4d1c" />
      <circle cx="418" cy="190" r="9" fill="#111" />
      <circle cx="370" cy="200" r="9" fill="#fffdf8" />
      <path d="M342 130l88-20M430 110l-12 80M418 190l-48 10M370 200l-28-70" strokeWidth={2} />
    </Frame>
  );
}

const LANG_COLOR: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  PHP: "#8892bf",
  Blade: "#ff2d20",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dart: "#00b4ab",
  Python: "#3572a5",
  Kotlin: "#a97bff",
  Java: "#b07219",
};

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

// Deterministic original cover for any repo: a terminal window whose lines, bars and badge come from the name,
// with the language's colour as its accent. No invented content; the label is just the repo name.
function RepoCover({ title, language, drawn }: { title: string; language: string | null; drawn: boolean }) {
  const h = hash(title);
  const accent = (language && LANG_COLOR[language]) || "#ff4d1c";
  const lines = 4 + (h % 3);
  const bars = 4 + ((h >>> 3) % 3);
  const shape = (h >>> 6) % 3;
  return (
    <Frame drawn={drawn} label={`Illustrated cover for ${title}`}>
      <rect x="40" y="36" width="400" height="228" fill="#fffdf8" />
      <path d="M40 72h400" />
      <circle cx="62" cy="54" r="6" fill="#ff4d1c" />
      <circle cx="84" cy="54" r="6" />
      <circle cx="106" cy="54" r="6" />
      {Array.from({ length: lines }, (_, i) => {
        const w = 70 + ((h >>> (i + 2)) % 120);
        return <path key={i} d={`M62 ${98 + i * 24}h${w}`} strokeWidth={2.6} />;
      })}
      {Array.from({ length: bars }, (_, i) => {
        const bh = 20 + ((h >>> (i * 2)) % 60);
        return <path key={`b${i}`} d={`M${290 + i * 22} 240v-${bh}`} strokeWidth={10} stroke={accent} />;
      })}
      {shape === 0 && <circle cx="360" cy="120" r="26" fill={accent} />}
      {shape === 1 && <path d="M334 146l26-48 26 48z" fill={accent} />}
      {shape === 2 && <rect x="334" y="94" width="52" height="52" fill={accent} />}
      <path d="M62 246h150" strokeDasharray="6 8" className="keep" strokeWidth={2} />
    </Frame>
  );
}

const CURATED = new Set(["AlphaDocTN", "Agrisdol", "WorkSphere"]);

export default function ProjectCover({ title, drawn, language = null }: { title: string; drawn: boolean; language?: string | null }) {
  if (!CURATED.has(title)) return <RepoCover title={title} language={language} drawn={drawn} />;
  if (title === "Agrisdol") return <FieldCover drawn={drawn} />;
  if (title === "WorkSphere") return <BoardCover drawn={drawn} />;
  return <DocCover drawn={drawn} />;
}
