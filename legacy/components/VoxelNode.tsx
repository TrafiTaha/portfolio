"use client";

import { useMemo, useRef } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface VoxelNodeProps {
    position: [number, number, number];
    size: [number, number]; // width, height in units
    density?: number;
    color?: string;
    targetYear?: number; // 2023-2026
    currentTemporalProgress?: number; // 0-100
}

export default function VoxelNode({ position, size, density = 20, color = "#22c55e", targetYear = 2026, currentTemporalProgress = 100 }: VoxelNodeProps) {
    // Map year to 0-100 range based on TIMELINE in Scrubber
    const yearPosMap: Record<number, number> = { 2023: 0, 2024: 33, 2025: 66, 2026: 100 };
    const nodeTimelinePos = yearPosMap[targetYear] ?? 100;

    // Ghost Logic: If we haven't reached the year, it's a blueprint (flickering). 
    // If we've passed it significantly, it's a wireframe (ghost).
    const isFuture = nodeTimelinePos > currentTemporalProgress + 5;
    const isPast = nodeTimelinePos < currentTemporalProgress - 30;
    const isPresent = !isFuture && !isPast;

    const points = useMemo(() => {
        const count = Math.floor(size[0] * size[1] * (isPresent ? density : density / 4));
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * size[0];
            p[i * 3 + 1] = (Math.random() - 0.5) * size[1];
            p[i * 3 + 2] = (Math.random() - 0.5) * 0.1; // Thin card depth
        }
        return p;
    }, [size, density, isPresent]);

    const ref = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const targetOpacity = isPresent ? 0.6 : 0.1;
        const targetScale = isPresent ? 1 : 0.8;

        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        (ref.current.material as THREE.PointsMaterial).opacity = THREE.MathUtils.lerp((ref.current.material as THREE.PointsMaterial).opacity, targetOpacity, 0.05);

        // Subtle hover bounce
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.02;
    });

    return (
        <group position={position}>
            <Points ref={ref} positions={points} stride={3}>
                <PointMaterial
                    transparent
                    color={isFuture ? "#ffffff" : color}
                    size={isFuture ? 0.005 : 0.008}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0} // Managed logic-side
                />
            </Points>

            {/* Outline points for structure */}
            <mesh scale={[isPresent ? 1.05 : 1, isPresent ? 1.05 : 1, 1]}>
                <boxGeometry args={[size[0], size[1], 0.05]} />
                <meshBasicMaterial
                    color={isFuture ? "#ffffff" : color}
                    wireframe
                    transparent
                    opacity={isPresent ? 0.05 : 0.02}
                />
            </mesh>
        </group>
    );
}
