"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SystemHUD() {
    const [stats, setStats] = useState({
        latency: "2ms",
        uptime: "00:00:00:00",
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                latency: `${Math.floor(Math.random() * 5 + 1)}ms`,
            }));
        }, 3000);

        const startTime = Date.now();
        const uptimeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const ms = Math.floor((elapsed % 1000) / 10).toString().padStart(2, "0");
            const s = Math.floor((elapsed / 1000) % 60).toString().padStart(2, "0");
            const m = Math.floor((elapsed / 60000) % 60).toString().padStart(2, "0");
            const h = Math.floor(elapsed / 3600000).toString().padStart(2, "0");
            setStats(prev => ({ ...prev, uptime: `${h}:${m}:${s}:${ms}` }));
        }, 10);

        return () => {
            clearInterval(interval);
            clearInterval(uptimeInterval);
        };
    }, []);

    const [isChaos, setIsChaos] = useState(false);

    const toggleChaos = () => {
        const next = !isChaos;
        setIsChaos(next);
        window.dispatchEvent(new CustomEvent("chaos-mode", { detail: { active: next } }));
    };

    return (
        <div className="fixed top-0 left-0 w-full h-12 z-[2000] border-b border-white/[0.05] bg-black/50 backdrop-blur-md flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-widest overflow-hidden pointer-events-none">
            <div className="flex items-center space-x-8 pointer-events-auto">
                <div className="flex items-center space-x-2">
                    <span className="text-white/40">REGION:</span>
                    <span className="text-cyan-400">TUNIS_TN</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-white/40">LATENCY:</span>
                    <span className="text-cyber-lime">{stats.latency}</span>
                </div>
                {/* Chaos Toggle */}
                <button
                    onClick={toggleChaos}
                    className={`px-2 py-0.5 border rounded transition-colors ${isChaos ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'border-white/20 text-white/40 hover:text-white'}`}
                >
                    {isChaos ? 'SYSTEM_OVERLOAD_ACTIVE' : 'CHAOS_MODE:OFF'}
                </button>
            </div>

            <motion.div
                animate={{
                    textShadow: [
                        "0 0 8px rgba(34, 197, 94, 0.4)",
                        "2px 0 10px rgba(34, 197, 94, 0.8)",
                        "-2px 0 10px rgba(255, 0, 0, 0.6)",
                        "0 0 8px rgba(34, 197, 94, 0.4)"
                    ]
                }}
                transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror", repeatDelay: Math.random() * 5 }}
                className="text-cyber-lime font-bold text-xs"
            >
                ID: D17_NODE_29119181
            </motion.div>

            <div className="flex items-center space-x-8 pointer-events-auto">
                <div className="flex items-center space-x-2">
                    <span className="text-white/40">UPTIME:</span>
                    <span className="text-white font-bold">{stats.uptime}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyber-lime rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                    <span className="text-cyber-lime">SECURE_ACTIVE</span>
                </div>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>
    );
}
