"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DecryptionText from "@/components/ui/DecryptionText";

interface ProjectModuleProps {
    name: string;
    status: string;
    techStack: string[];
    codeSnippet: string;
    className?: string;
}

export default function ProjectModule({ name, status, techStack, codeSnippet, className }: ProjectModuleProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-3xl p-6 transition-all duration-500 hover:border-cyber-lime/30 ${className}`}
        >
            {/* Micro-HUD Layer */}
            <div className="absolute top-2 right-6 z-10 font-mono text-[7px] text-cyber-lime/30 tracking-widest flex items-center space-x-4">
                <span className="animate-pulse">BUILD_STAMP: 2026.01</span>
                <span>MODULE_LOAD: 0.002ms</span>
            </div>

            {/* Metadata Layer */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono text-white/40 tracking-tighter">MODULE_BIOS: 0x{name.length.toString(16).padStart(4, '0')}</span>
                        <div className="flex items-center space-x-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${status === 'DEPLOYED' ? 'bg-cyber-lime shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500 animate-pulse'}`} />
                            <span className="text-[10px] font-mono text-white/60">{status}</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">
                        <DecryptionText text={name} delay={200} />
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {techStack.map((tech, i) => (
                            <span key={i} className="text-[9px] font-mono px-2 py-0.5 border border-white/10 rounded-full bg-white/5 text-white/40">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/20">SYSTEM_ID: {Math.random().toString(36).slice(2, 9).toUpperCase()}</span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-[10px] font-mono text-cyber-lime border border-cyber-lime/20 px-3 py-1 rounded bg-cyber-lime/5 hover:bg-cyber-lime hover:text-black transition-colors"
                    >
                        INITIALIZE_LINK
                    </motion.button>
                </div>
            </div>

            {/* Terminal Feed Layer (Hover) */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-0 z-20 bg-black/90 p-4 font-mono text-[9px] text-cyber-lime/80 overflow-hidden leading-tight"
                    >
                        <div className="flex items-center space-x-2 mb-2 border-b border-cyber-lime/20 pb-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                            <span className="text-[8px] opacity-40">terminal — {name.toLowerCase()}.bash</span>
                        </div>
                        <pre className="whitespace-pre-wrap">
                            {(codeSnippet || "").split('\n').map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    {`> ${line}`}
                                </motion.div>
                            ))}
                        </pre>
                        {/* Cursor Pulse */}
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-1.5 h-3 bg-cyber-lime mt-1"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-lime/20 animate-scan pointer-events-none" />
        </motion.div>
    );
}
