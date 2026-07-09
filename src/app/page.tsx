"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

// Below-the-fold sections are lazy-loaded to keep first paint light
const Skills = dynamic(() => import("@/components/sections/Skills"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const GitHubActivity = dynamic(() => import("@/components/sections/GitHubActivity"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Home() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-svh w-full relative">
      <div className="site-backdrop" aria-hidden />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <GitHubActivity />
      <Contact />
    </main>
  );
}
