"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Terminal, AlertCircle, CheckCircle2 } from "lucide-react";

export default function GitHubActionMonitor() {
    const [actions, setActions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActions = async () => {
            try {
                // Using a generic way to show recent activity if dedicated actions API is restricted or not authorized
                const res = await fetch("https://api.github.com/users/TrafiTaha/events/public");
                const data = await res.json();
                const pushEvents = data.filter((e: any) => e.type === "PushEvent").slice(0, 5);
                setActions(pushEvents);
            } catch (err) {
                console.error("GH_SYNC_FAILURE", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActions();

        const interval = setInterval(fetchActions, 30000);
        window.addEventListener("gh-sync", fetchActions);

        return () => {
            clearInterval(interval);
            window.removeEventListener("gh-sync", fetchActions);
        };
    }, []);

    const getStatusIcon = (type: string) => {
        switch (type) {
            case "PushEvent": return <CheckCircle2 size={12} className="text-cyber-lime" />;
            case "CreateEvent": return <Activity size={12} className="text-blue-500" />;
            default: return <AlertCircle size={12} className="text-white/20" />;
        }
    };

    return (
        <div className="h-full flex flex-col p-6 font-mono">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Activity size={14} className="text-cyber-lime" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">ACTION_MONITOR_SYS</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[8px] text-blue-500 uppercase">RUNNING</span>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                <AnimatePresence>
                    {actions.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-3 rounded-lg border border-white/5 bg-black/40 font-mono text-[9px] relative overflow-hidden group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(event.type)}
                                    <span className="text-white font-bold">{event.repo.name.split('/')[1]?.toUpperCase() || "CORE_SYS"}</span>
                                </div>
                                <span className="text-white/20">{new Date(event.created_at).toLocaleTimeString()}</span>
                            </div>
                            <div className="text-cyber-lime/60 italic overflow-hidden text-ellipsis whitespace-nowrap">
                                {`> trigger: ${event.payload?.commits?.[0]?.message || 'system_update'}`}
                            </div>
                            {/* Terminal scan effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-lime/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!loading && actions.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <Terminal size={32} />
                        <span className="mt-4 text-[10px]">NO_ACTIVE_STREAM</span>
                    </div>
                )}
            </div>
        </div>
    );
}
