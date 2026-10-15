"use client";

import Navbar from "@/components/layout/Navbar";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import { Skills, Certificates, Projects, GitHubActivity, Contact } from "@/components/experience/doors";

// The normal long page: SSR'd for SEO, used for reduced motion and the "Classic view" toggle.
export default function ClassicPage() {
  return (
    <main className="relative min-h-svh w-full overflow-x-clip">
      <Navbar />
      <Hero />
      <Marquee />
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <Skills />
      </Reveal>
      <Reveal>
        <Certificates />
      </Reveal>
      <Projects />
      <Reveal>
        <GitHubActivity />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
    </main>
  );
}
