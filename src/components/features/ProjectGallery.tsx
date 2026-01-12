"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

const projects = [
    {
        id: 1,
        title: "AlphaDocTN",
        category: "Enterprise Engine",
        tech: ["Laravel", "PHP", "RBAC"],
        description: "Enterprise-level document architect with advanced Role-Based Access Control.",
        color: "from-red-600 to-orange-600",
        link: "https://github.com/TrafiTaha/AlphaDocTN",
        github: "https://github.com/TrafiTaha/AlphaDocTN",
    },
    {
        id: 2,
        title: "Agrisdol",
        category: "Agri-Intelligence",
        tech: ["Node.js", "Laravel", "SQLite"],
        description: "Agricultural Intelligence Platform for smart farming solutions.",
        color: "from-green-600 to-emerald-500",
        link: "https://github.com/TrafiTaha/Agrisdol",
        github: "https://github.com/TrafiTaha/Agrisdol",
    },
    {
        id: 3,
        title: "WorkSphere",
        category: "Productivity",
        tech: ["Laravel", "Blade", "MySQL"],
        description: "Team synchronization engine designed for high-performance productivity.",
        color: "from-blue-600 to-cyan-500",
        link: "https://github.com/TrafiTaha/WorkSphere",
        github: "https://github.com/TrafiTaha/WorkSphere",
    },
];

export default function ProjectGallery({ isWindowMode = false }: { isWindowMode?: boolean }) {
    return (
        <div className={`w-full h-full flex flex-col ${isWindowMode ? 'p-2' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-cyber-lime rounded-full" />
                    {isWindowMode ? 'All Projects' : 'Selected Works'}
                </h3>
                <a href="https://github.com/TrafiTaha?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                    View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4 flex gap-4 snap-x snap-mandatory scrollbar-hide">
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex-shrink-0 w-[300px] h-full glass-panel rounded-2xl p-6 flex flex-col justify-between snap-center group relative overflow-hidden"
                    >
                        {/* Background Gradient Blob */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${project.color} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />

                        <div>
                            <span className="text-xs font-mono text-cyber-lime mb-2 block">{project.category}</span>
                            <h4 className="text-2xl font-bold text-white mb-2">{project.title}</h4>
                            <p className="text-sm text-gray-400 mb-4">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tech.map((t) => (
                                    <span key={t} className="text-[10px] px-2 py-1 bg-white/5 rounded-full border border-white/10 text-gray-300">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-auto">
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 animate-pulse-glow">
                                Live Demo <ExternalLink size={14} />
                            </a>
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                                <Github size={18} />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
