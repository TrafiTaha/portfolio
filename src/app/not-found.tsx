import Link from "next/link";
import InkDefs from "@/components/ui/InkDefs";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <InkDefs />
      <p className="font-mono text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">Error · Nº 404</p>
      <h1 className="relative mt-2 font-display text-[34vw] leading-[0.85] tracking-tight text-ink sm:text-[24vw] lg:text-[18rem]">
        4
        <span className="text-transparent [-webkit-text-stroke:3px_#111]">0</span>4
        <svg
          aria-hidden
          viewBox="0 0 600 24"
          preserveAspectRatio="none"
          className="sketch on pointer-events-none absolute -bottom-1 left-0 h-[0.07em] w-full"
          style={{ filter: "url(#wobble)" }}
        >
          <path d="M4 14C80 4 140 22 220 12S380 6 460 14 560 18 596 8" fill="none" stroke="#ff4d1c" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </h1>
      <p className="mt-6 max-w-sm -rotate-1 border-2 border-ink bg-paper px-4 py-3 text-sm font-medium shadow-[4px_4px_0_#111]">
        This room isn&apos;t in the house. The door you tried leads nowhere.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex cursor-pointer items-center gap-2 border-2 border-ink bg-signal px-5 py-3 font-mono text-xs font-bold tracking-wider text-ink uppercase shadow-[3px_3px_0_#111] hover:-translate-y-0.5"
      >
        ← Back to the workshop
      </Link>
    </main>
  );
}
