"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const TIMELINE = [
    { year: "2023", label: "GENESIS", pos: 0 },
    { year: "2024", label: "EXPANSION", pos: 33 },
    { year: "2025", label: "SYNCHRONY", pos: 66 },
    { year: "2026", label: "SINGULARITY", pos: 100 },
];

export default function TemporalScrubber() {
    const [progress, setProgress] = useState(100);

    const handleChange = (val: number) => {
        setProgress(val);
        window.dispatchEvent(new CustomEvent("temporal-sync", { detail: { progress: val } }));
    };

    return (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8 z-50 pointer-events-none">
            <div className="obsidian-glass rounded-full h-12 flex items-center px-6 relative pointer-events-auto border border-white/5">
                {/* Track */}
                <div className="absolute inset-x-12 h-[1px] bg-white/10 top-1/2 -translate-y-1/2" />

                {/* Slider Handle */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => handleChange(parseInt(e.target.value))}
                    className="absolute inset-x-12 h-2 opacity-0 cursor-pointer z-10"
                    title="Temporal Axis Scrubber"
                />

                <motion.div
                    className="absolute h-3 w-3 bg-cyber-lime rounded-full shadow-[0_0_15px_#22c55e] z-0 pointer-events-none"
                    style={{ left: `calc(3rem + ${(progress / 100) * (100 - (6 / 40) * 100)}%)` }} // Simple calc for demo
                    animate={{ x: "-50%", y: "-50%" }}
                />

                {/* Markers */}
                <div className="w-full flex justify-between relative">
                    {TIMELINE.map((item) => (
                        <div key={item.year} className="flex flex-col items-center">
                            <div className={`w-1 h-1 rounded-full mb-2 transition-colors duration-500 ${progress >= item.pos ? 'bg-cyber-lime' : 'bg-white/20'}`} />
                            <span className={`font-mono text-[8px] tracking-[0.2em] transition-opacity duration-500 ${Math.abs(progress - item.pos) < 15 ? 'opacity-100' : 'opacity-20'}`}>
                                {item.year} // {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Ghosting */}
            <div className="mt-4 text-center font-mono text-[7px] text-white/20 tracking-[0.5em] uppercase">
                Temporal_Axis: {progress < 50 ? 'GHOST_MODE_PAST' : progress < 90 ? 'ACTIVE_SYNC' : 'PREDICTIVE_FUTURE'}
            </div>
        </div>
    );
}
