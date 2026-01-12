"use client";

import { useState } from "react";
import DraggableWindow from "@/components/ui/DraggableWindow";
import Taskbar from "@/components/layout/Taskbar";
import BentoGrid from "@/components/layout/BentoGrid";
import ContactTerminal from "@/components/features/ContactTerminal";
import ProjectGallery from "@/components/features/ProjectGallery"; // Reusing for window content
import SkillMatrix from "@/components/features/SkillMatrix";
import NeuralBackground from "@/components/features/NeuralBackground";
import D17Vault from "@/components/features/D17Vault";
import TickerTape from "@/components/features/TickerTape";
import { AnimatePresence } from "framer-motion";

export default function DesktopEnvironment() {
    const [windows, setWindows] = useState<{ id: string; title: string; component: React.ReactNode; zIndex: number; isOpen: boolean, initialPos: { x: number, y: number }, url?: string }[]>([
        // Pre-define windows but maybe closed heavily
        { id: "projects", title: "Project Explorer", component: <ProjectGallery isWindowMode={true} />, zIndex: 1, isOpen: false, initialPos: { x: 100, y: 100 }, url: "taha://projects" },
        { id: "terminal", title: "Terminal - zsh", component: <ContactTerminal />, zIndex: 1, isOpen: false, initialPos: { x: 200, y: 200 } },
        { id: "skills", title: "Skill Matrix", component: <SkillMatrix />, zIndex: 1, isOpen: false, initialPos: { x: 300, y: 150 } },
        { id: "support", title: "Support / Donate", component: <D17Vault />, zIndex: 1, isOpen: false, initialPos: { x: 400, y: 300 } },
    ]);

    const [maxZIndex, setMaxZIndex] = useState(10);

    const openWindow = (id: string, url?: string) => {
        if (id === "home") {
            setWindows((prev) => prev.map((w) => ({ ...w, isOpen: false })));
            return;
        }
        if (url) return; // Links are handled by Taskbar directly, but just in case

        setWindows((prev) =>
            prev.map((w) =>
                w.id === id ? { ...w, isOpen: true, zIndex: maxZIndex + 1 } : w
            )
        );
        setMaxZIndex(prev => prev + 1);
    };

    const closeWindow = (id: string) => {
        setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
        );
    };

    const focusWindow = (id: string) => {
        setWindows((prev) =>
            prev.map((w) =>
                w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w
            )
        );
        setMaxZIndex(prev => prev + 1);
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden flex flex-col">
            {/* 0. Ticker Tape */}
            <div className="fixed top-0 left-0 w-full z-40">
                <TickerTape />
            </div>

            {/* Background Layer 0: Neural Network */}
            <NeuralBackground />

            {/* Background Layer 1: BentoGrid as 'Desktop Icons' */}
            <div className="absolute inset-0 z-0 p-4 pt-10 md:p-10 md:pt-14 pb-24 overflow-y-auto">
                <BentoGrid onOpenWindow={openWindow} />
            </div>

            {/* Window Layer */}
            <AnimatePresence>
                {windows.map((win) => (
                    <DraggableWindow
                        key={win.id}
                        id={win.id}
                        title={win.title}
                        isOpen={win.isOpen}
                        onClose={() => closeWindow(win.id)}
                        zIndex={win.zIndex}
                        onFocus={() => focusWindow(win.id)}
                        initialPosition={win.initialPos}
                        url={win.url}
                    >
                        {win.component}
                    </DraggableWindow>
                ))}
            </AnimatePresence>

            {/* Taskbar Layer */}
            <Taskbar onOpen={openWindow} />
        </div>
    );
}
