"use client";

import { motion } from "framer-motion";
import { Home, Folder, Terminal, Cpu, Heart, Github, Linkedin } from "lucide-react";

interface TaskbarProps {
    onOpen: (windowId: string) => void;
}

const apps = [
    { id: "home", icon: Home, label: "Home", color: "bg-blue-500", action: "scroll" },
    { id: "projects", icon: Folder, label: "Projects", color: "bg-yellow-500", action: "window" },
    { id: "terminal", icon: Terminal, label: "Contact", color: "bg-gray-500", action: "window" },
    { id: "skills", icon: Cpu, label: "Skills", color: "bg-purple-500", action: "window" },
    { id: "support", icon: Heart, label: "Support", color: "bg-red-500", action: "window" },
    { id: "github", icon: Github, label: "GitHub", color: "bg-gray-800", action: "link", url: "https://github.com/TrafiTaha" },
    { id: "linkedin", icon: Linkedin, label: "LinkedIn", color: "bg-blue-700", action: "link", url: "https://www.linkedin.com/in/taha-ben-romdhane-765b09371" },
];

const DockIcon = ({ app, onOpen }: { app: typeof apps[0], onOpen: (id: string) => void }) => {
    return (
        <motion.button
            key={app.id}
            onClick={() => {
                if (app.action === 'link' && app.url) window.open(app.url, '_blank');
                else if (app.action === 'window') onOpen(app.id);
                else if (app.id === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onOpen('home');
                }
            }}
            whileHover={{ scale: 1.3, y: -10 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group relative flex flex-col items-center gap-1 shrink-0"
        >
            {/* Tooltip */}
            <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md text-white text-[10px] md:text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none border border-white/10 translate-y-2 group-hover:translate-y-0 duration-200">
                {app.label}
            </span>

            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${app.color} flex items-center justify-center shadow-lg bg-gradient-to-br from-white/20 to-transparent border border-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow duration-300`}>
                <app.icon size={20} className="text-white drop-shadow-md" />
            </div>
            <div className="w-1 h-1 rounded-full bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
        </motion.button>
    );
};

export default function Taskbar({ onOpen }: TaskbarProps) {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
            <div className="flex items-end gap-2 md:gap-3 px-4 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-x-auto scrollbar-hide">
                {apps.map((app) => (
                    <DockIcon key={app.id} app={app} onOpen={onOpen} />
                ))}
            </div>
        </div>
    );
}
