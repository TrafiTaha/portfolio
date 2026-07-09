"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    text: string;
    color: string;
    size: number;
}

const SYMBOLS = ["{ }", "</>", ";", "&&", "#", "=>"];
const COLORS = ["#00ff9f", "#00b8ff", "#ff0055", "#ffd700"];

export default function CanvasCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: -100, y: -100 });
    const isMoving = useRef(false);
    const lastTime = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            isMoving.current = true;

            // Spawn particles on move
            if (Math.random() > 0.5) {
                particles.current.push(createParticle(e.clientX, e.clientY));
            }
        };

        const createParticle = (x: number, y: number): Particle => {
            return {
                x,
                y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2 + 1, // Slight drift down
                life: 1.0,
                text: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: Math.random() * 10 + 10,
            };
        };

        const animate = (time: number) => {
            const deltaTime = time - lastTime.current;
            lastTime.current = time;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.current = particles.current.filter((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;

                ctx.font = `bold ${p.size}px monospace`;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillText(p.text, p.x, p.y);
                ctx.globalAlpha = 1.0;

                return p.life > 0;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);
        resize();
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[9999] pointer-events-none"
        />
    );
}
