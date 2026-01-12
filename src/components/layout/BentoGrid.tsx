"use client";

import Image from "next/image";
import Core3D from "@/components/features/Core3D";
import ImpactMeter from "@/components/features/ImpactMeter";
import ProjectGallery from "@/components/features/ProjectGallery";
import SkillMatrix from "@/components/features/SkillMatrix";
import D17Vault from "@/components/features/D17Vault";
import GitHubLog from "@/components/features/GitHubLog";
import BentoCard from "@/components/ui/BentoCard";
import { Mail, MapPin, Twitter, Linkedin, Terminal } from "lucide-react";

export default function BentoGrid({ onOpenWindow }: { onOpenWindow?: (id: string) => void }) {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
            {/* 1. Bio / Intro */}
            <BentoCard colSpan={2} rowSpan={1} className="flex flex-col justify-between">
                <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 group">
                        <div className="absolute inset-0 rounded-full border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] z-10 pointer-events-none group-hover:border-white/30 transition-colors" />
                        <Image src="/myimage.png" alt="Taha Ben Romdhane" fill className="object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500" priority />
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#0a0a0a] rounded-full z-20 shadow-[0_0_10px_#22c55e] animate-pulse" title="System Online" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                            Taha Ben Romdhane
                        </h1>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                            Creative Engineering Lead. Forging high-fidelity digital experiences.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                    <a href="https://twitter.com/TahaBenRomdhane" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="Twitter"><Twitter size={18} /></a>
                    <a href="https://www.linkedin.com/in/taha-ben-romdhane-765b09371" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
                    <a href="mailto:contact@taha.dev" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="Email"><Mail size={18} /></a>
                    <a href="https://github.com/TrafiTaha" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="GitHub"><span className="font-mono font-bold text-xs">GH</span></a>
                    <button onClick={() => onOpenWindow?.('terminal')} className="p-2 rounded-full bg-white/5 hover:bg-cyber-lime/20 text-cyber-lime transition-colors ml-2" title="Open Terminal" aria-label="Open Terminal">
                        <Terminal size={18} />
                    </button>
                    <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto border border-white/5 px-2 py-1 rounded-full">
                        <MapPin size={12} /> Tunis, TN
                    </div>
                </div>
            </BentoCard>

            {/* 2. Stats */}
            <BentoCard colSpan={1} rowSpan={1}>
                <ImpactMeter />
            </BentoCard>

            {/* 3. Support */}
            <BentoCard colSpan={1} rowSpan={1} className="!p-0 border-0 overflow-hidden">
                <D17Vault />
            </BentoCard>

            {/* 4. Core 3D (The Visual Anchor) */}
            <BentoCard colSpan={2} rowSpan={2} className="relative !p-0 overflow-hidden border-electric-blue/20">
                <div className="absolute inset-0 z-0">
                    <Core3D />
                </div>
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                    <span className="text-[10px] font-mono text-electric-blue border border-electric-blue/30 px-2 py-1 rounded bg-black/50 backdrop-blur-sm">
                        CORE_SYSTEM_ACTIVE
                    </span>
                </div>
            </BentoCard>

            {/* 5. System Logs & Skills split */}
            <BentoCard colSpan={2} rowSpan={1} className="!p-0 overflow-hidden">
                <GitHubLog />
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1}>
                <SkillMatrix />
            </BentoCard>

            {/* 6. Projects */}
            <BentoCard colSpan={4} rowSpan={2} className="relative">
                <div className="absolute top-4 right-4 z-20">
                    <button onClick={() => onOpenWindow?.('projects')} className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md border border-white/5 transition-colors">
                        Open Window
                    </button>
                </div>
                <ProjectGallery />
            </BentoCard>

            {/* Footer / Copyright */}
            <div className="col-span-1 md:col-span-4 flex items-center justify-between text-xs text-gray-600 mt-4 px-2">
                <span>© {new Date().getFullYear()} Taha Ben Romdhane. All rights reserved.</span>
                <span className="font-mono">v2.1.0 SYSTEM_READY</span>
            </div>
        </div>
    );
}
