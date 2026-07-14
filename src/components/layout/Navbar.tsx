"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Facebook, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex items-center gap-1 sm:gap-2 rounded-full border px-3 sm:px-5 py-2 transition-all duration-500 ${
          scrolled
            ? "border-white/10 bg-zinc-950/70 backdrop-blur-xl shadow-2xl shadow-black/40"
            : "border-transparent bg-transparent"
        }`}
        aria-label="Primary navigation"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-sm font-bold tracking-tight text-zinc-100 hover:text-cyber-lime transition-colors pr-2 sm:pr-4 cursor-pointer"
          aria-label="Back to top"
        >
          TBR<span className="text-cyber-lime">.</span>
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => scrollTo(e, link.id)}
                className="px-3 py-1.5 text-xs font-semibold tracking-wide text-zinc-400 uppercase rounded-full hover:text-zinc-100 hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 pl-2 sm:pl-4 border-l border-white/10">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Github size={16} />
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={personal.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook profile"
            className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Facebook size={16} />
          </a>
          <a
            href={personal.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram profile"
            className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Instagram size={16} />
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
