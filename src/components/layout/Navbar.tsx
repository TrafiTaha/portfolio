"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Facebook, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import { scrollToTarget } from "@/components/providers/SmoothScroll";
import { personal } from "@/data/portfolio";

const links = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Certs", id: "certificates" },
  { label: "Work", id: "projects" },
  { label: "GitHub", id: "github" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = links.map((l) => document.getElementById(l.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const top = () => window.scrollY < 200 && setActive("");
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToTarget(`#${id}`, -70);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-[4.25rem] sm:px-4 lg:pt-4"
    >
      <nav
        className="flex max-w-full items-center gap-1 rounded-full border-2 border-ink bg-paper px-2 py-1.5 shadow-[3px_3px_0_#111] sm:gap-2 sm:px-4"
        aria-label="Primary navigation"
      >
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="cursor-pointer pr-2 font-display text-lg leading-none tracking-wide text-ink hover:text-signal sm:pr-3"
          aria-label="Back to top"
        >
          TBR<span className="text-signal">.</span>
        </button>

        <ul className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none]">
          {links.map((link) => (
            <li key={link.id} className="shrink-0">
              <a
                href={`#${link.id}`}
                onClick={(e) => go(e, link.id)}
                aria-current={active === link.id ? "true" : undefined}
                className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] font-bold tracking-wide uppercase transition-colors sm:px-3 sm:text-xs ${
                  active === link.id ? "bg-signal text-ink" : "text-ink hover:bg-ink hover:text-paper"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-0.5 border-l-2 border-ink pl-3 lg:flex">
          {(
            [
              { href: personal.github, label: "GitHub profile", Icon: Github },
              { href: personal.linkedin, label: "LinkedIn profile", Icon: Linkedin },
              { href: personal.facebook, label: "Facebook profile", Icon: Facebook },
              { href: personal.instagram, label: "Instagram profile", Icon: Instagram },
            ] as const
          ).map(({ href, label, Icon }) => (
            <Magnetic key={label} strength={0.45}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex p-1.5 text-ink transition-colors hover:text-signal"
              >
                <Icon size={16} />
              </a>
            </Magnetic>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
