"use client";

const items = ["AVAILABLE FOR WORK", "SOFTWARE ENGINEER", "MOBILE & WEB", "TUNIS → WORLDWIDE"];

function Row() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="mx-5 whitespace-nowrap font-display text-3xl tracking-wide text-paper uppercase md:mx-8 md:text-5xl">
            {item}
          </span>
          <span className="select-none text-xl text-signal md:text-3xl">✦</span>
        </span>
      ))}
    </div>
  );
}

// Black "washi tape" strip, slightly skewed across the page.
export default function Marquee() {
  return (
    <div className="relative my-6 -rotate-[1.2deg] overflow-hidden" role="marquee" aria-label="Available for work. Software engineer. Mobile and web. Tunis to worldwide.">
      <div className="flex w-full select-none border-y-2 border-ink bg-ink py-3 md:py-4">
        <div className="animate-marquee flex">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
