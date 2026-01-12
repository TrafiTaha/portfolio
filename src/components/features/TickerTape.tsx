"use client";

import { motion } from "framer-motion";

export default function TickerTape() {
    const items = [
        "[SYSTEM ONLINE]",
        "•",
        "[FULL STACK ENGINEER]",
        "•",
        "[OPEN SOURCE CONTRIBUTOR]",
        "•",
        "[LARAVEL EXPERT]",
        "•",
        "[REACT / NEXT.JS]",
        "•",
        "[BUILDING THE FUTURE]",
        "•",
    ];

    return (
        <div className="w-full bg-black/50 backdrop-blur-md text-green-400 overflow-hidden py-1 border-b border-green-500/20 z-50 relative top-0 flex select-none">
            <motion.div
                className="flex whitespace-nowrap font-mono font-bold text-xs tracking-widest uppercase"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20,
                }}
            >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <span key={i} className="mx-4">
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
