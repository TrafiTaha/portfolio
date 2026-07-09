"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Section from "@/components/ui/Section";
import ScrambleText from "@/components/ui/ScrambleText";
import TiltCard from "@/components/ui/TiltCard";
import { projects, type Project } from "@/data/portfolio";

function ProjectCover({ project }: { project: Project }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: `radial-gradient(120% 120% at 15% 10%, ${project.accent}26 0%, transparent 45%), radial-gradient(120% 130% at 90% 90%, ${project.accent2}33 0%, transparent 55%), #09090b`,
      }}
    >
      {/* grid lines */}
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* giant monogram */}
      <span
        className="absolute -bottom-8 -right-2 text-[11rem] md:text-[13rem] font-black leading-none select-none tracking-tighter"
        style={{ color: `${project.accent}1f`, WebkitTextStroke: `1px ${project.accent}40` }}
        aria-hidden
      >
        {project.title.slice(0, 2)}
      </span>
      {/* content */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-zinc-500">
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.accent }} />
            {project.tagline}
          </span>
          <span>{project.tech[0]}</span>
        </div>
        <div>
          <p className="text-2xl md:text-3xl font-black tracking-tight text-zinc-100">{project.title}</p>
          <div className="mt-3 h-px w-full" style={{ background: `linear-gradient(90deg, ${project.accent}80, transparent)` }} />
          <ul className="mt-3 space-y-1">
            {project.features.slice(0, 2).map((f) => (
              <li key={f} className="text-[11px] md:text-xs text-zinc-500 font-mono truncate">
                <span style={{ color: project.accent }}>▸</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <Section id="projects" title="My Work" subtitle="Featured projects">
      <div className="w-full mx-auto mt-4 md:mt-8 flex flex-col gap-16 md:gap-24">
        {projects.map((project, i) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center justify-between w-full pb-16 md:pb-24 border-b border-zinc-800/40 last:border-0 last:pb-0"
          >
            {/* Text column */}
            <div className="w-full md:w-1/2 flex flex-row items-start gap-3 md:gap-6">
              <span className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-800/60 leading-none select-none font-mono" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col flex-1">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-100 leading-tight cursor-default">
                  <ScrambleText text={project.title} />
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 md:mt-2 font-medium">{project.tagline}</p>

                <span className="text-xs font-medium tracking-widest text-zinc-500 uppercase mt-6 md:mt-8 block">
                  Overview
                </span>
                <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">{project.description}</p>

                <ul className="mt-4 space-y-1.5">
                  {project.features.map((f) => (
                    <li key={f} className="text-xs sm:text-sm text-zinc-500 leading-relaxed flex items-start gap-2">
                      <span className="text-cyber-lime mt-0.5 shrink-0">▸</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 px-2.5 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-6 md:mt-8">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} on GitHub`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-cyber-lime transition-colors px-4 py-2 rounded-full border border-zinc-800 hover:border-cyber-lime/40 hover:bg-green-950/20"
                  >
                    <Github size={16} />
                    View source
                  </a>
                </div>
              </div>
            </div>

            {/* Cover column */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <TiltCard className="w-full">
                <div
                  className="block relative group overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 bg-zinc-950/50 aspect-[16/10] shadow-2xl w-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <ProjectCover project={project} />
                  <div className="absolute inset-0 bg-zinc-950/10 group-hover:bg-transparent transition-colors duration-500" aria-hidden />
                </div>
              </TiltCard>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
