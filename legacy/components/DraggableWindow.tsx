"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DraggableWindowProps {
    id: string;
    title: string;
    isOpen: boolean;
    onClose: () => void;
    zIndex: number;
    onFocus: () => void;
    children: ReactNode;
    initialPosition?: { x: number; y: number };
    url?: string;
}

export default function DraggableWindow({
    id,
    title,
    children,
    isOpen,
    onClose,
    zIndex,
    onFocus,
    initialPosition = { x: 100, y: 100 },
    url
}: DraggableWindowProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const windowContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    drag
                    dragMomentum={false}
                    onMouseDown={onFocus}
                    className="fixed obsidian-glass ray-traced-border rounded-xl shadow-2xl flex flex-col overflow-hidden min-w-[320px] min-h-[200px]"
                    style={{
                        zIndex,
                        left: initialPosition.x,
                        top: initialPosition.y,
                        width: 'clamp(400px, 60vw, 900px)',
                        height: 'clamp(300px, 50vh, 700px)'
                    }}
                >
                    {/* Header */}
                    <div className="p-3 border-b border-white/[0.05] flex items-center justify-between cursor-move select-none bg-black/40">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-2">{title}</span>
                        </div>
                        {url && (
                            <div className="flex-1 mx-4 bg-black/40 rounded px-3 py-0.5 text-[8px] font-mono text-gray-500 truncate max-w-[200px]">
                                <span className="text-green-500 mr-1">🔒</span> {url}
                            </div>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="p-1 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                            title="Close Window"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-6 bg-black/20 font-mono text-sm">
                        {children}
                    </div>

                    {/* Micro-resize handle (visual) */}
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-white/20" />
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(windowContent, document.body);
}
