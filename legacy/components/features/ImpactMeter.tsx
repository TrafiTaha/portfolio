"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Activity, Code, Users } from "lucide-react";

const Counter = ({ value, label, icon: Icon }: { value: number; label: string; icon: any }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    const displayValue = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (displayValue.current) {
                displayValue.current.textContent = Intl.NumberFormat("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                }).format(latest.toFixed(0) as any);
            }
        });
    }, [springValue]);

    return (
        <div ref={ref} className="flex flex-col items-center justify-center p-4 glass-panel rounded-2xl w-full">
            <div className="bg-white/5 p-3 rounded-full mb-3 text-cyber-lime">
                <Icon size={24} />
            </div>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                <span ref={displayValue}>0</span>+
            </span>
            <span className="text-sm text-gray-400 mt-1 uppercase tracking-wider text-center">{label}</span>
        </div>
    );
};

export default function ImpactMeter() {
    return (
        <div className="grid grid-cols-2 gap-4 w-full h-full">
            <Counter value={25} label="Public Repositories" icon={Code} />
            <Counter value={1200} label="Commits Pushed" icon={Users} />
            <div className="col-span-2 flex items-center justify-between p-4 glass-panel rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-electric-blue/10 rounded-lg text-electric-blue">
                        <Activity size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">System Status</div>
                        <div className="text-xs text-electric-blue flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-electric-blue animate-pulse" />
                            Operational
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold text-white">99.9%</div>
                    <div className="text-xs text-gray-500">Uptime</div>
                </div>
            </div>
        </div>
    );
}
