"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import BackdropZoom from "@/components/ui/BackdropZoom";
import Cursor from "@/components/ui/Cursor";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";
import Preloader from "@/components/ui/Preloader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

// Below-the-fold sections are lazy-loaded to keep first paint light
const Skills = dynamic(() => import("@/components/sections/Skills"));
const Certificates = dynamic(() => import("@/components/sections/Certificates"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const GitHubActivity = dynamic(() => import("@/components/sections/GitHubActivity"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Home() {
  return (
    <main className="min-h-svh w-full relative">
      <BackdropZoom />
      <Preloader />
      <Cursor />
      <Navbar />
      <Hero />
      <Reveal>
        <Marquee />
      </Reveal>
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <Skills />
      </Reveal>
      <Reveal>
        <Certificates />
      </Reveal>
      <Reveal>
        <Projects />
      </Reveal>
      <Reveal>
        <GitHubActivity />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
    </main>
  );
}
