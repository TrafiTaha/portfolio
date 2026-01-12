"use client";

import { useEffect, useState, useRef } from "react";

const logs = [
    "SYSTEM_INIT: Core modules loaded.",
    "NET_DAEMON: Listening on port 3000.",
    "RENDERING_ENGINE: GPU Acceleration Enabled.",
    "SECURITY_PROTOCOL: Handshake verified.",
    "USER_AGENT: Detected High-Fidelity Client.",
    "CACHE_LAYER: Hot reload active.",
    "SERVICE_WORKER: Registered successfully.",
];

export default function SystemLogs() {
    const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < logs.length) {
                setDisplayedLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logs[index]}`]);
                index++;
            } else {
                // Occasionally add random keep-alive logs
                if (Math.random() > 0.7) {
                    const randomLog = `KEEP_ALIVE: Packet ID ${Math.floor(Math.random() * 99999)}`;
                    setDisplayedLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
                }
            }
        }, 800);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [displayedLogs]);

    return (
        <div className="w-full h-full bg-[#050505] font-mono text-[10px] md:text-xs text-green-500/80 p-4 border-l border-white/5 overflow-hidden flex flex-col">
            <div className="mb-2 text-white/50 border-b border-white/5 pb-1">KERNEL_LOGS</div>
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1" ref={scrollRef}>
                {displayedLogs.map((log, i) => (
                    <div key={i} className="whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity">
                        {log}
                    </div>
                ))}
                <div className="w-2 h-4 bg-green-500/50 animate-pulse mt-1" />
            </div>
        </div>
    );
}
