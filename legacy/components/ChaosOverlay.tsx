"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import Matter from "matter-js";

interface ChaosOverlayProps {
    isActive: boolean;
}

export default function ChaosOverlay({ isActive }: ChaosOverlayProps) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);

    useEffect(() => {
        if (!isActive || !sceneRef.current) return;

        const engine = Matter.Engine.create();
        const render = Matter.Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: "transparent",
            }
        });

        if (render.canvas) {
            render.canvas.style.pointerEvents = "none";
        }

        // Create random "UI fragments"
        const fragments = [...Array(30)].map(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            return Matter.Bodies.rectangle(x, y, 40, 20, {
                render: {
                    fillStyle: "#22c55e",
                    opacity: 0.2
                }
            });
        });

        const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });

        Matter.World.add(engine.world, [...fragments, ground]);
        Matter.Runner.run(engine);
        Matter.Render.run(render);

        engineRef.current = engine;

        return () => {
            Matter.Engine.clear(engine);
            Matter.Render.stop(render);
            render.canvas.remove();
        };
    }, [isActive]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] pointer-events-none mix-blend-difference overflow-hidden"
                >
                    <div ref={sceneRef} className="absolute inset-0" />

                    {/* Inversion Layer */}
                    <div className="absolute inset-0 bg-white mix-blend-difference opacity-10" />

                    {/* Glitch Strips */}
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-full h-1 bg-cyber-lime/10"
                            initial={{ top: `${Math.random() * 100}%`, left: "-100%" }}
                            animate={{
                                left: "100%",
                                opacity: [0, 1, 0],
                                scaleY: [1, 2, 1]
                            }}
                            transition={{
                                duration: Math.random() * 2 + 1,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}
                        />
                    ))}

                    {/* Static Logs Overlay */}
                    <div className="absolute inset-0 p-10 font-mono text-[8px] text-cyber-lime/20 whitespace-pre overflow-hidden leading-none select-none">
                        {Array(50).fill(0).map((_, i) => (
                            <div key={i}>
                                {`[ENTROPY_CRITICAL] ADDR: 0x${Math.random().toString(16).slice(2, 6).toUpperCase()} | SIG: ${Math.random().toString(36).substring(7).toUpperCase()}`}
                            </div>
                        ))}
                    </div>

                    {/* Chromatic Aberration */}
                    <div className="absolute inset-0 border-[20px] border-red-500/10 blur-xl animate-pulse" />
                    <div className="absolute inset-0 border-[20px] border-blue-500/10 blur-xl animate-pulse delay-75" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
