"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GitHubLog from "@/components/features/GitHubLog";
import { Star, GitBranch, Terminal } from "lucide-react";

export default function GitHubVault() {
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await fetch("https://api.github.com/users/TrafiTaha/repos?sort=updated&per_page=6");
                const data = await res.json();
                setRepos(data);
            } catch (err) {
                console.error("GITHUB_AUTH_ERROR", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRepos();

        window.addEventListener("gh-sync", fetchRepos);
        return () => window.removeEventListener("gh-sync", fetchRepos);
    }, []);

    return (
        <div className="h-full flex flex-col p-6 font-mono">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                    <Terminal size={14} className="text-cyber-lime" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">PROJECT_VAULT_NODE_GH</span>
                </div>
                {loading && <div className="w-1 h-1 bg-cyber-lime rounded-full animate-ping" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {repos.map((repo, i) => (
                        <motion.div
                            key={repo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-cyber-lime/30 group transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-bold text-white group-hover:text-cyber-lime transition-colors">
                                    {repo.name.toUpperCase()}
                                </h3>
                                <div className="flex items-center space-x-3 text-[9px] text-white/20">
                                    <span className="flex items-center gap-1"><Star size={10} /> {repo.stargazers_count}</span>
                                    <span className="flex items-center gap-1"><GitBranch size={10} /> {repo.forks_count}</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-white/40 line-clamp-2 mb-3 h-6">
                                {repo.description || "NO_DESCRIPTION_STORED"}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/10 uppercase`}>
                                    {repo.language || "STACK_UNDEFINED"}
                                </span>
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    className="text-[8px] text-cyber-lime underline opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    INITIALIZE_SOURCE
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
