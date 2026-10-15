"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, Github, Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import Section from "@/components/ui/Section";
import ProjectCover from "@/components/sections/ProjectCovers";
import { useProjects, type ProjectView } from "@/lib/useRepos";

// One "blueprint sheet" per project. On lg+ the sheets pin and stack as you scroll.
function Sheet({ project, index, total }: { project: ProjectView; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const drawn = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const [open, setOpen] = useState(false);
  const panelId = `details-${index}`;

  return (
    <article
      ref={ref}
      className="group/sheet relative border-[3px] border-ink bg-[#fffdf8] shadow-[8px_8px_0_#111] lg:sticky"
      style={{ top: `${6 + Math.min(index, 3) * 0.9}rem` }}
    >
      {/* title block, like a drawing's corner stamp */}
      <div className="flex items-center justify-between border-b-[3px] border-ink bg-paper-2 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase sm:text-xs">
        <span className="whitespace-nowrap">Sheet {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <span className="text-ink-soft">{project.tagline}</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-12">
        <div className="blueprint-grid relative border-b-[3px] border-ink p-5 lg:col-span-6 lg:border-r-[3px] lg:border-b-0">
          <div className="aspect-[8/5] w-full transition-transform duration-500 group-hover/sheet:-rotate-1 group-hover/sheet:scale-[1.02]">
            <ProjectCover title={project.title} drawn={drawn} language={project.language} />
          </div>
          <span className="absolute bottom-2 left-3 font-mono text-[9px] tracking-wider text-ink-soft uppercase">
            Illustrated cover — not a screenshot
          </span>
        </div>

        <div className="flex flex-col p-5 sm:p-7 lg:col-span-6">
          <h3 className="font-display text-5xl leading-[0.95] tracking-tight text-ink uppercase sm:text-6xl">
            {project.title}
          </h3>
          <p className="mt-2 font-hand text-2xl text-signal">{project.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-ink/80 sm:text-base">
            {project.description ?? `${project.language ?? "Repository"} · no description yet`}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
            {project.tech.map((t) => (
              <li
                key={t}
                className="border-2 border-ink bg-paper px-2.5 py-0.5 font-mono text-xs font-bold tracking-wide uppercase"
              >
                {t}
              </li>
            ))}
          </ul>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <ul className="mt-5 space-y-2 border-t-2 border-dashed border-ink pt-4">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm leading-relaxed text-ink/80">
                      <span className="mt-0.5 shrink-0 font-bold text-signal">▸</span>
                      {f}
                    </li>
                  ))}
                  {project.stars !== null && (
                    <li className="font-mono text-xs font-bold tracking-wider text-ink uppercase">
                      ★ {project.stars}
                      {project.pushed && ` · last pushed ${new Date(project.pushed).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}`}
                    </li>
                  )}
                  {project.homepage && (
                    <li>
                      <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="font-mono text-xs font-bold tracking-wider underline decoration-signal decoration-2 underline-offset-4">
                        Live demo
                      </a>
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={panelId}
              className="inline-flex cursor-pointer items-center gap-2 border-2 border-ink bg-paper px-4 py-2 font-mono text-xs font-bold tracking-wider uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              {open ? <Minus size={14} aria-hidden /> : <Plus size={14} aria-hidden />}
              {open ? "Hide details" : "Details"}
            </button>
            <Magnetic strength={0.3}>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                className="inline-flex items-center gap-2 border-2 border-ink bg-signal px-4 py-2 font-mono text-xs font-bold tracking-wider text-ink uppercase shadow-[3px_3px_0_#111] transition-transform hover:-translate-y-0.5"
              >
                <Github size={14} aria-hidden />
                View source
                <ArrowUpRight size={14} aria-hidden />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const { projects, status } = useProjects();
  return (
    <Section id="projects" title="My Work" subtitle="Featured projects" index="04">
      <div className="flex flex-col gap-12 pb-4 lg:gap-24">
        {projects.map((project, i) => (
          <Sheet key={project.title} project={project} index={i} total={projects.length} />
        ))}
        {status === "loading" && <p className="font-mono text-xs font-bold tracking-widest text-ink-soft uppercase">Loading more repositories from GitHub…</p>}
        {status === "error" && <p className="font-mono text-xs font-bold tracking-widest text-ink-soft uppercase">Showing curated projects (GitHub is unreachable right now).</p>}
      </div>
    </Section>
  );
}
