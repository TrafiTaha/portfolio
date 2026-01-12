"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, RotateCcw } from "lucide-react";

export default function GradeCalculator() {
    const [e1, setE1] = useState("");
    const [e2, setE2] = useState("");
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const v1 = parseFloat(e1);
        const v2 = parseFloat(e2);

        if (!isNaN(v1) && !isNaN(v2)) {
            // Formula: (E1 + (E2 * 2)) / 3
            const avg = (v1 + (v2 * 2)) / 3;
            setResult(avg);
        }
    };

    const reset = () => {
        setE1("");
        setE2("");
        setResult(null);
    };

    return (
        <div className="w-full h-full p-6 flex flex-col justify-between relative group">
            <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:opacity-100 transition-opacity">
                <button onClick={reset} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <RotateCcw size={14} className="text-gray-400 hover:text-white" />
                </button>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-4 text-cyber-lime">
                    <Calculator size={20} />
                    <span className="text-xs font-mono tracking-wider">1:2:3 GRADER</span>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Exam 1 (1x)</label>
                        <input
                            type="number"
                            value={e1}
                            onChange={(e) => setE1(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-lime/50 transition-colors"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Exam 2 (2x)</label>
                        <input
                            type="number"
                            value={e2}
                            onChange={(e) => setE2(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-lime/50 transition-colors"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={calculate}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-bold text-white transition-all hover:border-cyber-lime/50"
                >
                    CALCULATE
                </button>

                {result !== null && (
                    <div className="text-right">
                        <span className="block text-[10px] text-gray-500 uppercase">Weighted Avg</span>
                        <span className="text-2xl font-bold text-white tabular-nums">
                            {result.toFixed(2)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
