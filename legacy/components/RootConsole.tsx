"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RootConsole() {
    const [input, setInput] = useState("");
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/") {
                e.preventDefault();
                setIsOverlayOpen(true);
            }
            if (e.key === "Escape") {
                setIsOverlayOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleCommand = (cmd: string) => {
        const lowerCmd = cmd.toLowerCase().trim();
        if (lowerCmd.startsWith("set --theme ")) {
            const theme = lowerCmd.replace("set --theme ", "");
            document.documentElement.setAttribute("data-theme", theme);
        } else if (lowerCmd === "set --gravity low") {
            window.dispatchEvent(new CustomEvent("system-update", { detail: { type: "GRAVITY", value: "LOW" } }));
        } else if (lowerCmd === "gh --sync") {
            window.dispatchEvent(new CustomEvent("terminal-output", { detail: { message: `INITIALIZING_GITHUB_NEURAL_SYNC...` } }));
            window.dispatchEvent(new CustomEvent("gh-sync"));
        }
        setInput("");
        setIsOverlayOpen(false);
    };

    return (
        <>
            {/* Minimal Bottom Input */}
            <div className="fixed bottom-0 left-0 w-full h-8 z-[2000] bg-black/80 backdrop-blur-md border-t border-white/5 flex items-center px-4 font-mono text-[9px] pointer-events-none">
                <div className="flex-1 flex items-center pointer-events-auto">
                    <span className="text-cyber-lime mr-2">ROOT_ACCESS:</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCommand(input)}
                        placeholder="TYPE '/' FOR COMMAND_OVERRIDE..."
                        className="flex-1 bg-transparent border-none outline-none text-white/60 placeholder:text-white/10"
                    />
                </div>
            </div>

            {/* Command Override Overlay */}
            <AnimatePresence>
                {isOverlayOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-20 font-mono pointer-events-auto"
                    >
                        <div className="w-full max-w-2xl">
                            <div className="flex items-center space-x-2 mb-8 opacity-40 text-xs">
                                <span className="w-2 h-2 bg-red-500 rounded-full" />
                                <span>COMMAND_OVERRIDE_ACTIVE</span>
                            </div>
                            <h2 className="text-4xl font-black text-cyber-lime mb-12 tracking-tighter uppercase">SYSTEM_VARIABLES_OVERRIDE</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 border-b border-white/10 pb-2">
                                    <span className="text-cyber-lime">$</span>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleCommand(input)}
                                        className="flex-1 bg-transparent border-none outline-none text-2xl text-white uppercase"
                                        placeholder="ENTER_COMMAND..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8 mt-12 text-[10px] text-white/20">
                                    <div>
                                        <p className="text-white/40 mb-2">AVAILABLE_SYSTEM_MODS:</p>
                                        <ul className="space-y-1">
                                            <li>SET --THEME [NEON|OBSIDIAN]</li>
                                            <li>SET --GRAVITY [LOW|HIGH]</li>
                                            <li>FLUSH --BUFFER</li>
                                        </ul>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/40 mb-2">SYSTEM_SIGNATURE:</p>
                                        <p>D17: 29119181</p>
                                        <p>BOOT_STAMP: 2026.01.25</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Esc to close */}
                        <div className="absolute bottom-10 text-[9px] text-white/10 italic">PRESS [ESC] TO TERMINATE_OVERRIDE</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
