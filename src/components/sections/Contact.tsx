"use client";

import { ArrowUpRight, Copyright } from "lucide-react";
import Section from "@/components/ui/Section";
import { personal } from "@/data/portfolio";

const socials = [
  { label: "GitHub", href: personal.github },
  { label: "LinkedIn", href: personal.linkedin },
  { label: "Facebook", href: personal.facebook },
  { label: "Instagram", href: personal.instagram },
  { label: "WhatsApp", href: personal.whatsapp },
];

export default function Contact() {
  return (
    <Section id="contact" title="Contact" subtitle="Let's build something together">
      <div className="w-full flex flex-col md:flex-row gap-10 md:gap-8 items-start pt-12 border-t border-zinc-800/80">
        {/* Reach out */}
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div className="flex flex-col">
            <span className="text-xs font-mono font-semibold tracking-widest text-zinc-500 uppercase mb-1">
              Location
            </span>
            <span className="text-sm md:text-base text-zinc-200 font-semibold">
              {personal.location} (Remote-friendly)
            </span>
          </div>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-md">
            The fastest way to reach me is a message on{" "}
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-lime hover:text-green-300 font-semibold transition-colors"
            >
              LinkedIn
            </a>
            . For code, issues and collaboration, find me on{" "}
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-lime hover:text-green-300 font-semibold transition-colors"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        {/* Social */}
        <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col md:pl-10">
          <span className="text-xs font-mono font-semibold tracking-widest text-zinc-500 uppercase mb-4">Social</span>
          <div className="flex flex-col gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg text-zinc-200 hover:text-cyber-lime font-semibold transition-colors w-fit border-b border-zinc-800 hover:border-cyber-lime/50 pb-0.5 group"
              >
                {s.label}
                <ArrowUpRight
                  className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300"
                  size={19}
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </div>

        {/* Colophon */}
        <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col justify-between h-full md:text-right gap-6 md:gap-0">
          <div>
            <p className="text-sm md:text-base text-zinc-300 font-semibold leading-relaxed">Designed and developed</p>
            <p className="text-sm md:text-base text-zinc-200 font-bold leading-relaxed">
              by <span className="text-cyber-lime">{personal.name}</span>
            </p>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 font-mono font-semibold tracking-wider md:mt-24 flex flex-row items-center md:justify-end gap-1">
            <Copyright size={14} aria-hidden /> {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </Section>
  );
}
