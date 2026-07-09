"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DiagnosticsSplash({ onComplete }: { onComplete: () => void }) {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    const diagnosticSteps = [
        "INITIALIZING_VANGUARD_BOOT_PROTOCOL...",
        "CHECKING_HARDWARE_COMPATIBILITY: OK",
        "SYNCING_NEURAL_MESH_ADAPTORS: 100%",
        "LOADING_OBSIDIAN_VOID_SHADERS...",
        "VERIFYING_D17_ENCRYPTION_NODE...",
        "SYSTEM_STABLE: INITIALIZING_SINGULARITY_INTERFACE"
    ];

    useEffect(() => {
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < diagnosticSteps.length) {
                setLogs(prev => [...prev, diagnosticSteps[currentStep]]);
                setProgress((currentStep + 1) * (100 / diagnosticSteps.length));
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 1000);
            }
        }, 600);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-8 font-mono ${progress >= 100 ? 'pointer-events-none' : ''}`}
        >
            <div className="w-full max-w-md h-auto">
                <div className="flex items-center justify-between mb-2 text-[10px] text-cyber-lime/40">
                    <span>SYSTEM_DIAGNOSTICS_RUNNING</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 overflow-hidden rounded-full mb-8">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-cyber-lime shadow-[0_0_10px_#22c55e]"
                    />
                </div>
                <div className="space-y-1">
                    <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[10px] text-cyber-lime"
                            >
                                <span className="opacity-40 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Background Scanner Effect */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-cyber-lime/5 to-transparent animate-scan-slow pointer-events-none" />
        </motion.div>
    );
}
