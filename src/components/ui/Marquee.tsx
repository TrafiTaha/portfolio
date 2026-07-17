"use client";

const items = ["AVAILABLE FOR WORK", "SOFTWARE ENGINEER", "MOBILE & WEB", "TUNIS → WORLDWIDE"];

function Row() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="mx-6 md:mx-10 text-3xl md:text-5xl font-black tracking-tighter uppercase text-zinc-800 whitespace-nowrap">
            {item}
          </span>
          <span className="text-cyber-lime text-xl md:text-3xl select-none">✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      className="w-full overflow-hidden border-y border-zinc-800/60 py-5 md:py-7 flex select-none"
      role="marquee"
      aria-label="Available for work — Software Engineer — Mobile and Web — Tunis to worldwide"
    >
      <div className="flex animate-marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
}
