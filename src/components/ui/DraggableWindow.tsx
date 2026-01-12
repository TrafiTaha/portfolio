"use client";

import { motion, useDragControls } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";
import { ReactNode } from "react";

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
    isOpen,
    onClose,
    zIndex,
    onFocus,
    children,
    initialPosition = { x: 50, y: 50 },
    url
}: DraggableWindowProps) {
    const dragControls = useDragControls();

    if (!isOpen) return null;

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, x: 0, y: 0 }} /* Default to 0, let MD override */
            animate={{ opacity: 1, scale: 1, x: initialPosition.x, y: initialPosition.y }} /* Animated positioning only on Desktop really matters here */
            // Reset mobile transform
            style={{
                zIndex,
                // Position logic is tricky with Framer Motion 'drag'.
                // We'll use CSS classes to force fixed fullscreen on mobile
            }}
            className="fixed inset-0 md:absolute md:inset-auto w-full h-full md:w-[800px] md:h-auto md:max-h-[85vh] bg-[#0a0a0a] md:bg-[#0a0a0a]/90 backdrop-blur-xl border-0 md:border border-white/10 md:rounded-xl overflow-hidden shadow-2xl flex flex-col"
        >
            {/* Window Title Bar */}
            <div
                className="h-12 md:h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <div className="flex items-center gap-2">
                    <button
                        className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center group relative overflow-hidden"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        onPointerDown={(e) => { e.stopPropagation(); }}
                        onTouchEnd={(e) => { e.stopPropagation(); onClose(); }}
                        aria-label="Close Window"
                    >
                        <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
                    </button>
                    <div className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500" />
                    <div className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-green-500/80 hover:bg-green-500" />
                </div>

                {/* Browser Address Bar (Fake) */}
                {url ? (
                    <div className="flex-1 mx-4 bg-black/40 rounded px-3 py-0.5 text-[10px] md:text-xs font-mono text-gray-400 flex items-center justify-center opacity-80 border border-white/5 truncate max-w-[200px] md:max-w-xs pointer-events-none">
                        <span className="text-green-500 mr-1">🔒</span> {url}
                    </div>
                ) : (
                    <span className="text-sm md:text-xs font-mono text-gray-400">{title}</span>
                )}

                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Window Content */}
            <div className="flex-1 p-0 overflow-y-auto cursor-auto flex flex-col md:flex-row" onPointerDown={(e) => e.stopPropagation()}>
                {children}
            </div>
        </motion.div>
    );
}
