"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Core3D from "@/components/features/Core3D";
import SkillMatrix from "@/components/features/SkillMatrix";
import D17Vault from "@/components/features/D17Vault";
import GitHubVault from "@/components/features/GitHubVault";
import ProjectModule from "@/components/ui/ProjectModule";
import DecryptionText from "@/components/ui/DecryptionText";
import GravitySystem from "@/components/features/GravitySystem";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Linkedin, Command } from "lucide-react";
import { soundEngine } from "@/utils/SoundEngine";

export default function BentoGrid({ onOpenWindow }: { onOpenWindow?: (id: string) => void }) {
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [isPingActive, setIsPingActive] = useState(false);
    const [spikes, setSpikes] = useState<{ id: number, top: number }[]>([]);

    useEffect(() => {
        const pingInterval = setInterval(() => {
            setIsPingActive(true);
            setTimeout(() => setIsPingActive(false), 500);

            // Trigger Neural Spike
            const id = Date.now();
            setSpikes(prev => [...prev, { id, top: Math.random() * 100 }]);
            setTimeout(() => setSpikes(prev => prev.filter(s => s.id !== id)), 1000);

            window.dispatchEvent(new CustomEvent("terminal-output", { detail: { message: `SINGULARITY_PING: NODE_29119181_HEARTBEAT_DETECTED` } }));
        }, 30000); // 30s for more "biological" rhythm

        return () => clearInterval(pingInterval);
    }, []);

    const handleInteraction = () => {
        soundEngine.init();
        soundEngine.start();
    };

    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const handleProjectClick = (id: string) => {
        setSelectedProject(id === selectedProject ? null : id);
        soundEngine.setTone(id ? "SUCCESS" : "FAILURE");
    };

    return (
        <div onClick={handleInteraction} className="w-full max-w-7xl mx-auto p-4 relative min-h-screen">
            <AnimatePresence>
                {isPingActive && <div key="ping" className="singularity-ping" />}
                {spikes.map(spike => (
                    <motion.div
                        key={spike.id}
                        className="neural-spike w-full left-0 pointer-events-none"
                        style={{ top: `${spike.top}%` }}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: [0, 1, 0], scaleX: [0, 1.5, 0] }}
                    />
                ))}
            </AnimatePresence>

            <GravitySystem nodes={[
                { id: 'alpha', mass: 2, size: 40, label: 'ALPHADOC' },
                { id: 'agris', mass: 1.5, size: 30, label: 'AGRISDOL' },
                { id: 'work', mass: 1.8, size: 35, label: 'WORKSPHERE' }
            ]} />

            <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 transition-all duration-1000 ${selectedProject ? 'opacity-20 scale-95 blur-sm overflow-hidden h-32' : 'opacity-100'}`}>
                {/* VANGUARD_CORE: BIO (Golden Ratio Lock) */}
                <motion.div
                    layout
                    className="col-span-1 md:col-span-8 obsidian-frozen-light ray-traced-border aspect-golden-inv rounded-3xl p-8 flex flex-col justify-between cursor-pointer"
                    onClick={() => handleProjectClick('bio')}
                >
                    <div className="flex items-start gap-8">
                        <div className="relative w-32 h-32 shrink-0 group">
                            <Image src="/myimage.png" alt="Taha" fill className="object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-1000" priority />
                            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyber-lime rounded-full shadow-[0_0_20px_#22c55e]" />
                        </div>
                        <div>
                            <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">
                                <DecryptionText text="TAHA_B_R" />
                            </h1>
                            <p className="text-xs font-mono text-white/60 uppercase tracking-[0.4em] mb-6">ARCHITECT_OF_DIGITAL_REALITIES // CORE</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    layout
                    className="col-span-1 md:col-span-4 obsidian-frozen-light ray-traced-border rounded-3xl aspect-golden overflow-hidden cursor-pointer"
                    onClick={() => handleProjectClick('alpha')}
                >
                    <ProjectModule
                        name="ALPHADOCTN"
                        status="SYNCHRONIZED"
                        techStack={["LARAVEL", "REACT"]}
                        codeSnippet={`// SYNCING_NODE...\nphp artisan singularity:provision\n[OK] ALPHA_DOC_READY`}
                        className="h-full border-0 !bg-transparent"
                    />
                </motion.div>

                <div className="col-span-1 md:col-span-12 obsidian-frozen-light rounded-3xl p-8 min-h-[400px]">
                    <GitHubVault />
                </div>
            </div>

            {/* Tesseract Expansion Layer */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0, rotateY: -90 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="fixed inset-10 z-[100] obsidian-frozen-light ray-traced-border rounded-3xl p-12 overflow-hidden flex flex-col"
                    >
                        <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 text-white/40 hover:text-white uppercase font-mono text-[10px] tracking-widest border border-white/10 px-4 py-2 rounded-full">/COLLAPSE_TESSERACT</button>
                        <h2 className="text-8xl font-black uppercase tracking-tighter text-cyber-lime mb-8">{selectedProject.toUpperCase()}</h2>
                        <div className="flex-1 overflow-auto custom-scrollbar pr-4">
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <p className="font-mono text-white/60 leading-relaxed uppercase">Neural state synchronized. Sub-surface scattering active. Loading holographic code stream for node: {selectedProject}...</p>
                                    <div className="h-64 bg-white/5 rounded-2xl border border-white/10 p-6 font-mono text-[10px] text-cyber-lime/40 overflow-hidden relative">
                                        <div className="animate-pulse mb-4 text-white">STREAMING_RAW_SOURCE:</div>
                                        <div className="absolute inset-x-6 top-16 bottom-6 overflow-hidden">
                                            {[...Array(50)].map((_, i) => (
                                                <div key={i} className="animate-scan-slow whitespace-nowrap">
                                                    {`0x${(Math.random() * 0xFFFFFF << 0).toString(16).toUpperCase()} >> SYNC_DATA_BUFFER_${i.toString().padStart(3, '0')} [STABLE]`}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="obsidian-glass rounded-2xl aspect-golden ray-traced-border" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
