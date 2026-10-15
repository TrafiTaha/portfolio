"use client";

import About from "@/components/sections/About";

// The About section on the workbench: a small drawn desk (lamp, mug, cactus) sits above the content.
export default function AboutRoom() {
  return (
    <div className="relative pt-14">
      <svg viewBox="0 0 400 120" className="pointer-events-none absolute top-14 right-4 hidden h-28 w-80 sm:block" aria-hidden>
        <g fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#wobble-lg)">
          <path d="M10 108h380" strokeWidth={5} />
          <path d="M60 108V60l40-34M84 38l40 22-24 26z" fill="#f4f1ea" />
          <path d="M112 74l-8 22M126 70v26" stroke="#ff4d1c" />
          <path d="M200 70h40v38h-40zM240 78q18 6 0 22" fill="#f4f1ea" />
          <path d="M214 62q-6-12 2-22M228 62q-6-12 2-22" strokeWidth={2} />
          <path d="M320 108V70M320 92l-14-6v-14M320 84l14-6v-12M320 70V50" />
        </g>
      </svg>
      <About />
    </div>
  );
}
