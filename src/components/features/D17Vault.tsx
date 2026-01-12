"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Copy, Check } from "lucide-react";

export default function D17Vault() {
    const [decrypted, setDecrypted] = useState(false);
    const [copied, setCopied] = useState(false);

    // The target number: 29119181
    const target = "29119181";
    const [display, setDisplay] = useState("D17-SECURE");

    const handleDecrypt = () => {
        if (decrypted) {
            handleCopy();
            return;
        }

        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(
                target
                    .split("")
                    .map((char, index) => {
                        if (index < iterations) {
                            return target[index];
                        }
                        return Math.floor(Math.random() * 10).toString();
                    })
                    .join("")
            );

            if (iterations >= target.length) {
                clearInterval(interval);
                setDecrypted(true);
                handleCopy();
            }
            iterations += 1 / 3;
        }, 30);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(target);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleDecrypt}
            className="relative w-full h-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden group hover:border-yellow-500/50 transition-colors"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-white/[0.05] opacity-50" />

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="mb-2 p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/50 transition-all">
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Check size={20} className="text-green-500" />
                            </motion.div>
                        ) : decrypted ? (
                            <motion.div key="unlock" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Unlock size={20} className="text-yellow-500" />
                            </motion.div>
                        ) : (
                            <motion.div key="lock" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Lock size={20} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <h4 className="font-mono text-lg font-bold text-white tracking-widest tabular-nums">
                    {display}
                </h4>

                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1Group-hover:text-yellow-500/80 transition-colors">
                    {copied ? "COPIED TO CLIPBOARD" : decrypted ? "SECURE NODE UNLOCKED" : "CLICK TO DECRYPT"}
                </p>
            </div>

            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[20%] w-full animate-scan pointer-events-none" />
        </button>
    );
}
