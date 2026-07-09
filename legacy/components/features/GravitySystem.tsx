"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

interface GravityNode {
    id: string;
    mass: number;
    size: number;
    label: string;
}

export default function GravitySystem({ nodes }: { nodes: GravityNode[] }) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);

    useEffect(() => {
        if (!sceneRef.current) return;

        const engine = Matter.Engine.create();
        engine.gravity.y = 0; // Space-like gravity

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

        // The Singularity (D17)
        const singularity = Matter.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 60, {
            isStatic: true,
            render: {
                fillStyle: "transparent"
            }
        });

        const bodies = nodes.map(node => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 200;
            const x = window.innerWidth / 2 + Math.cos(angle) * distance;
            const y = window.innerHeight / 2 + Math.sin(angle) * distance;

            return Matter.Bodies.circle(x, y, node.size, {
                restitution: 0.8,
                frictionAir: 0.02,
                label: node.id,
                render: {
                    fillStyle: "#22c55e22",
                    strokeStyle: "#22c55e",
                    lineWidth: 1
                }
            });
        });

        Matter.World.add(engine.world, [singularity, ...bodies]);

        // Gravity Well Logic
        Matter.Events.on(engine, "beforeUpdate", () => {
            bodies.forEach(body => {
                const forceMag = 0.0005 * body.mass;
                const deltaX = singularity.position.x - body.position.x;
                const deltaY = singularity.position.y - body.position.y;
                const force = {
                    x: deltaX * forceMag,
                    y: deltaY * forceMag
                };
                Matter.Body.applyForce(body, body.position, force);

                // Add centrifugal-like force for orbiting
                const orbitForce = {
                    x: -deltaY * 0.0001,
                    y: deltaX * 0.0001
                };
                Matter.Body.applyForce(body, body.position, orbitForce);
            });
        });

        Matter.Runner.run(engine);
        Matter.Render.run(render);

        return () => {
            Matter.Render.stop(render);
            Matter.Engine.clear(engine);
            render.canvas.remove();
        };
    }, [nodes]);

    return (
        <div ref={sceneRef} className="fixed inset-0 z-0 pointer-events-none" />
    );
}
