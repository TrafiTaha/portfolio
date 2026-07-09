"use client";

import { motion } from "framer-motion";

export default function SecurityStrip() {
    return (
        <div className="fixed right-0 inset-y-0 w-8 z-[90] flex flex-col items-center justify-center border-l border-white/[0.05] bg-black/40 backdrop-blur-md pointer-events-none">
            {/* Decoded/Encoded ID Animation */}
            <div className="rotate-90 origin-center whitespace-nowrap flex items-center space-x-4">
                <span className="text-[8px] font-mono text-white/40 tracking-[0.3em]">SECURE_SIGNATURE_NODE</span>
                <motion.span
                    animate={{
                        opacity: [0.4, 1, 0.4],
                        textShadow: ["0 0 0px #22c55e", "0 0 10px #22c55e", "0 0 0px #22c55e"]
                    }}
                    transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() * 2 }}
                    className="text-[10px] font-mono text-cyber-lime font-bold tracking-widest"
                >
                    D17: 29119181
                </motion.span>
                <span className="text-[8px] font-mono text-white/20">VERIFIED_2026</span>
            </div>

            {/* Pulsing Dots */}
            <div className="absolute top-8 space-y-2">
                <div className="w-1 h-1 bg-cyber-lime rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-cyber-lime/20 rounded-full" />
                <div className="w-1 h-1 bg-cyber-lime/40 rounded-full" />
            </div>

            <div className="absolute bottom-8 space-y-2">
                <div className="w-1 h-1 bg-cyber-lime/20 rounded-full" />
                <div className="w-1 h-1 bg-cyber-lime/40 rounded-full" />
                <div className="w-1 h-1 bg-cyber-lime rounded-full animate-pulse" />
            </div>

            {/* Micro-text along the ridge */}
            <div className="absolute inset-y-0 -left-1 flex flex-col justify-around py-20 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-[1px] h-4 bg-white/10" />
                ))}
            </div>
        </div>
    );
}
