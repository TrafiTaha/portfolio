"use client";

import { useState, useCallback } from "react";
import Confetti from "react-confetti";
import { Copy, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportTile() {
    const [showConfetti, setShowConfetti] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleSupport = useCallback(() => {
        // Synthesized Beep
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 800;
                osc.type = "sine";
                gain.gain.value = 0.1;
                osc.start();
                gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
                osc.stop(ctx.currentTime + 0.15);
            }
        } catch (e) { console.error(e); }

        navigator.clipboard.writeText("29119181");
        setShowConfetti(true);
        setShowToast(true);

        // Reset confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
        // Hide toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden group cursor-pointer" onClick={handleSupport}>
            {showConfetti && (
                <div className="absolute inset-0 z-50 pointer-events-none">
                    <Confetti
                        width={400}
                        height={400}
                        recycle={false}
                        numberOfPieces={200}
                        gravity={0.3}
                    />
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">D17</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">Support the Architect</h3>
                <p className="text-xs text-gray-400 mb-4 px-4">Click to copy D17 Number</p>

                <div className="flex items-center gap-2 text-xs font-mono text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] transition-shadow duration-500">
                    <Heart size={12} className="fill-yellow-500 animate-pulse" />
                    <span className="font-bold tracking-widest drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]">29119181</span>
                    <Copy size={12} />
                </div>
            </div>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-2xl whitespace-nowrap z-50 flex items-center gap-2"
                    >
                        <span className="text-green-600">✓</span> Copied to clipboard!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
