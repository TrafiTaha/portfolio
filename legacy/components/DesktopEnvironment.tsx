"use client";

import DraggableWindow from "@/components/ui/DraggableWindow";
import Taskbar from "@/components/layout/Taskbar";
import BentoGrid from "@/components/layout/BentoGrid";
import ContactTerminal from "@/components/features/ContactTerminal";
import ProjectGallery from "@/components/features/ProjectGallery"; // Reusing for window content
import SkillMatrix from "@/components/features/SkillMatrix";
import SystemHUD from "@/components/layout/SystemHUD";
import ChaosOverlay from "@/components/ui/ChaosOverlay";
import RootConsole from "@/components/layout/RootConsole";
import SecurityStrip from "@/components/layout/SecurityStrip";
import D17Vault from "@/components/features/D17Vault";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import TemporalScrubber from "@/components/ui/TemporalScrubber";

import GitHubVault from "@/components/features/GitHubVault";
import GitHubActionMonitor from "@/components/features/GitHubActionMonitor";
import VoxelScene from "@/components/features/VoxelScene";

export default function DesktopEnvironment() {
    const [isChaosActive, setIsChaosActive] = useState(false);

    useEffect(() => {
        const handleChaos = (e: any) => setIsChaosActive(e.detail.active);
        window.addEventListener("chaos-mode", handleChaos);
        return () => window.removeEventListener("chaos-mode", handleChaos);
    }, []);

    // Track mouse for obsidian glass effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const angle = (Math.atan2(e.clientY - window.innerHeight / 2, e.clientX - window.innerWidth / 2) * 180) / Math.PI;
            document.documentElement.style.setProperty('--cursor-angle', `${angle}deg`);
            document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
            document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const [windows, setWindows] = useState<{ id: string; title: string; component: React.ReactNode; zIndex: number; isOpen: boolean, initialPos: { x: number, y: number }, url?: string }[]>([
        { id: "projects", title: "Project Explorer", component: <ProjectGallery isWindowMode={true} />, zIndex: 1000, isOpen: false, initialPos: { x: 100, y: 100 }, url: "taha://projects" },
        { id: "terminal", title: "Terminal - zsh", component: <ContactTerminal />, zIndex: 1000, isOpen: false, initialPos: { x: 200, y: 200 } },
        { id: "vault", title: "GitHub Node Vault", component: <GitHubVault />, zIndex: 1000, isOpen: false, initialPos: { x: 150, y: 150 } },
        { id: "actions", title: "Live Action Monitor", component: <GitHubActionMonitor />, zIndex: 1000, isOpen: false, initialPos: { x: 400, y: 100 } },
        { id: "skills", title: "Skill Matrix", component: <SkillMatrix />, zIndex: 1000, isOpen: false, initialPos: { x: 300, y: 150 } },
        { id: "support", title: "Support / Donate", component: <D17Vault />, zIndex: 1000, isOpen: false, initialPos: { x: 400, y: 300 } },
    ]);

    const [maxZIndex, setMaxZIndex] = useState(1100);

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
        <div className="relative w-full flex flex-col bg-black">
            {/* Chaos Engine */}
            <ChaosOverlay isActive={isChaosActive} />

            {/* Security Strip */}
            <SecurityStrip />

            {/* 0. System HUD */}
            <SystemHUD />

            {/* Background Layer 0: Neural Network */}
            <VoxelScene />

            {/* Background Layer 1: BentoGrid as 'Desktop Icons' */}
            <div className="relative z-0 p-4 pt-16 md:p-10 md:pt-20 pb-24">
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
            {/* <Taskbar onOpen={openWindow} /> */}

            {/* Temporal Navigation Hub */}
            <TemporalScrubber />

            {/* Root Console */}
            <RootConsole />
        </div>
    );
}
