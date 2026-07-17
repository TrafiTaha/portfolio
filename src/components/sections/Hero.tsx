"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import Image from "next/image";
import Magnetic from "@/components/ui/Magnetic";
import TiltCard from "@/components/ui/TiltCard";
import { scrollToTarget } from "@/components/providers/SmoothScroll";
import { personal } from "@/data/portfolio";

const lineReveal = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const, delay: 0.3 + i * 0.12 },
  }),
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, 90]);
  const portraitY = reduceMotion ? undefined : parallaxY;

  // Fly-past exit: as you scroll into the page, the hero scales toward the
  // camera and fades, like the first plane of a 3D space passing behind you.
  const exitScale = useTransform(scrollY, [0, 800], [1, 1.16]);
  const exitOpacity = useTransform(scrollY, [0, 560, 800], [1, 0.25, 0]);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget("#projects", -70);
  };

  return (
    <section id="home" className="relative min-h-svh w-full max-w-[86rem] mx-auto flex flex-col justify-center px-5 md:px-16 lg:px-20 pt-24 pb-16 overflow-hidden">
      <motion.div
        className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8"
        style={
          reduceMotion
            ? undefined
            : { scale: exitScale, opacity: exitOpacity, transformPerspective: 1200, willChange: "transform, opacity" }
        }
      >
        {/* Text block */}
        <div className="w-full lg:w-3/5 flex flex-col items-start">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-cyber-lime uppercase mb-5"
          >
            {"// "}
            {personal.name}
          </motion.p>

          <h1 className="text-[13vw] sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] uppercase text-zinc-100">
            {personal.roles.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  custom={i}
                  variants={lineReveal}
                  initial={reduceMotion ? "visible" : "hidden"}
                  animate="visible"
                  className={`inline-block ${i === 1 ? "text-transparent [-webkit-text-stroke:1.5px_#3f3f46] hover:[-webkit-text-stroke:1.5px_#22c55e] transition-all duration-500" : ""}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-base md:text-lg text-zinc-400 font-medium leading-relaxed max-w-xl mt-8"
          >
            {personal.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap items-center gap-5 mt-10"
          >
            <Magnetic>
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="group inline-flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-950 font-bold text-sm px-6 py-3 hover:bg-cyber-lime transition-colors duration-300"
              >
                View my work
                <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
              </a>
            </Magnetic>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest text-zinc-500 uppercase">
              <MapPin size={13} className="text-cyber-lime" />
              {personal.location}
            </span>
          </motion.div>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
          style={{ y: portraitY }}
          className="w-full lg:w-2/5 flex justify-center"
        >
          <TiltCard className="relative w-56 sm:w-72 lg:w-96">
            <div
              className="absolute -inset-8 rounded-full bg-cyber-lime/15 blur-[90px] pointer-events-none"
              aria-hidden
            />
            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 shadow-2xl aspect-[4/5]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src={personal.image}
                alt={`Portrait of ${personal.name}`}
                fill
                priority
                sizes="(max-width: 640px) 14rem, (max-width: 1024px) 18rem, 24rem"
                className="object-cover"
                style={{ transform: "translateZ(24px)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" aria-hidden />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-zinc-300 uppercase">
                <span>{personal.role}</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-lime animate-pulse" />
                  Available
                </span>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-zinc-600"
        aria-hidden
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.span>
      </motion.div>
    </section>
  );
}
