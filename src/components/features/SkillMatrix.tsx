"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

const skills = [
    { name: "React / Next.js", level: 95, color: "bg-blue-500", verified: true },
    { name: "Laravel / PHP", level: 90, color: "bg-red-500", verified: true },
    { name: "TypeScript", level: 85, color: "bg-blue-400", verified: true },
    { name: "Node.js", level: 80, color: "bg-green-500", verified: false },
    { name: "Framer Motion", level: 85, color: "bg-purple-500", verified: false },
    { name: "DevOps", level: 70, color: "bg-cyan-500", verified: false },
];

export default function SkillMatrix() {
    return (
        <div className="w-full h-full flex flex-col p-4 bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Skill Verification
                </h3>
                <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                    LINKEDIN_SYNC
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 overflow-y-auto scrollbar-hide">
                {skills.map((skill, index) => (
                    <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-white/5 border border-white/5 hover:border-white/10 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-2 z-10">
                            <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors line-clamp-1">{skill.name}</span>
                            {skill.verified && (
                                <BadgeCheck size={14} className="text-blue-500 shrink-0" />
                            )}
                        </div>

                        <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden z-10">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
                                className={`h-full ${skill.color}`}
                            />
                        </div>

                        {/* Hover Glow */}
                        <div className={`absolute -right-4 -bottom-4 w-12 h-12 rounded-full ${skill.color} blur-[20px] opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none`} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
