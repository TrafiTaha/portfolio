"use client";

import { useEffect, useState } from "react";
import { GitCommit, Activity, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GitHubEvent {
    id: string;
    type: string;
    repo: {
        name: string;
    };
    payload: {
        commits?: Array<{
            message: string;
        }>;
    };
    created_at: string;
}

export default function GitHubLog() {
    const [events, setEvents] = useState<GitHubEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchGitHubData = async () => {
            try {
                const res = await fetch("https://api.github.com/users/TrafiTaha/events?per_page=10");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();

                // Filter relevant events
                const validEvents = data.filter((e: any) =>
                    ["PushEvent", "WatchEvent", "CreateEvent"].includes(e.type)
                );

                setEvents(validEvents.slice(0, 5));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(true);
                setLoading(false);
            }
        };

        fetchGitHubData();
        // Refresh every 5 minutes
        const interval = setInterval(fetchGitHubData, 300000);
        return () => clearInterval(interval);
    }, []);

    const getEventIcon = (type: string) => {
        switch (type) {
            case "WatchEvent": return <Activity size={10} className="text-yellow-500" />;
            case "CreateEvent": return <Activity size={10} className="text-blue-500" />;
            default: return <GitCommit size={10} className="text-cyber-lime" />;
        }
    };

    const getEventMessage = (event: any) => {
        switch (event.type) {
            case "WatchEvent": return "Starred repository";
            case "CreateEvent": return "Created repository";
            case "PushEvent": return event.payload.commits?.[0]?.message || "Pushed code updates";
            default: return "Activity detected";
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 overflow-hidden flex flex-col relative group">
            {/* Header */}
            <h3 className="text-xs font-mono text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-white/5 pb-2">
                <Activity size={12} className="text-green-500 animate-pulse" />
                GitHub Activity Stream
            </h3>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col gap-2"
                        >
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-10 w-full bg-white/5 animate-pulse rounded-md" />
                            ))}
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-red-400 text-xs font-mono mt-4"
                        >
                            <AlertCircle size={14} />
                            <span>Connection to GitHub Sync Node failed.</span>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {events.slice(0, 5).map((event, i) => (
                                <motion.a
                                    key={event.id}
                                    href={`https://github.com/${event.repo.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col gap-1 p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group/item cursor-pointer"
                                >
                                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                                        <span className="flex items-center gap-1 text-cyber-lime">
                                            {getEventIcon(event.type)}
                                            {event.repo.name.replace("TrafiTaha/", "")}
                                        </span>
                                        <span>{formatTimeAgo(event.created_at)}</span>
                                    </div>
                                    <p className="text-xs text-gray-300 line-clamp-1 font-medium group-hover/item:text-white transition-colors">
                                        {getEventMessage(event)}
                                    </p>
                                </motion.a>
                            ))}

                            {events.length === 0 && (
                                <div className="text-xs text-gray-500 italic">No recent public activity found.</div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Decorative */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 blur-3xl pointer-events-none" />
        </div>
    );
}
