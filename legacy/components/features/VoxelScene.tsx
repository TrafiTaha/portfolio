"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Center, Text3D } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import * as random from "maath/random/dist/maath-random.esm";

import VoxelNode from "@/components/ui/VoxelNode";

function MirrorTrail() {
    const { mouse } = useThree();
    const [trail, setTrail] = useState<{ id: number, x: number, y: number, char: string, opacity: number }[]>([]);

    useFrame((state) => {
        if (state.clock.getElapsedTime() % 0.05 < 0.01) {
            setTrail(prev => [
                ...prev.slice(-20),
                { id: Math.random(), x: mouse.x * 2, y: mouse.y * 2, char: Math.random() > 0.5 ? "0" : "1", opacity: 1 }
            ]);
        }
        setTrail(prev => prev.map(t => ({ ...t, opacity: t.opacity - 0.02 })).filter(t => t.opacity > 0));
    });

    return (
        <group>
            {trail.map(t => (
                <Center key={t.id} position={[t.x, t.y, 0.1]}>
                    <Text3D
                        font="/fonts/geist_mono_bold.json" // Assuming this exists or I'll need to provide one. I'll fallback to a simple point for now if font fails.
                        size={0.05}
                        height={0.01}
                    >
                        {t.char}
                        <meshBasicMaterial color="#22c55e" transparent opacity={t.opacity * 0.5} />
                    </Text3D>
                </Center>
            ))}
        </group>
    );
}

function BinaryMirror() {
    const { mouse } = useThree();
    const count = 100;
    const [positions] = useState(() => new Float32Array(count * 3));
    const [opacities] = useState(() => new Float32Array(count));
    const ref = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const attr = ref.current.geometry.attributes.position;

        // Cycle positions
        for (let i = count - 1; i > 0; i--) {
            positions[i * 3] = positions[(i - 1) * 3];
            positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
            positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
        }
        positions[0] = mouse.x * 2.5;
        positions[1] = mouse.y * 2.5;
        positions[2] = 0;

        attr.needsUpdate = true;
    });

    return (
        <Points ref={ref} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#00ff9f"
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.3}
            />
        </Points>
    );
}

function ActionCrystals() {
    const [crystals, setCrystals] = useState<{ id: number, pos: [number, number, number], color: string }[]>([]);

    useEffect(() => {
        const handleAction = (e: any) => {
            const isSuccess = !e.detail.message.includes("FAILURE");
            setCrystals(prev => [
                ...prev.slice(-10),
                {
                    id: Date.now(),
                    pos: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2],
                    color: isSuccess ? "#22c55e" : "#ff0055"
                }
            ]);
        };
        window.addEventListener("terminal-output", handleAction);
        return () => window.removeEventListener("terminal-output", handleAction);
    }, []);

    return (
        <group>
            {crystals.map(c => (
                <mesh key={c.id} position={c.pos}>
                    <octahedronGeometry args={[0.05, 0]} />
                    <meshBasicMaterial color={c.color} transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    );
}

function VoxelCore({ points }: { points: Float32Array }) {
    const ref = useRef<THREE.Points>(null);
    const lightRef = useRef<THREE.AmbientLight>(null);
    const { mouse } = useThree();
    const [progress, setProgress] = useState(100);
    const [isChaos, setIsChaos] = useState(false);

    useEffect(() => {
        const handleSync = (e: any) => setProgress(e.detail.progress);
        const handleChaos = (e: any) => setIsChaos(e.detail.active);
        window.addEventListener("temporal-sync", handleSync);
        window.addEventListener("chaos-mode", handleChaos);
        return () => {
            window.removeEventListener("temporal-sync", handleSync);
            window.removeEventListener("chaos-mode", handleChaos);
        };
    }, []);

    useFrame((state, delta) => {
        if (!ref.current) return;

        // Chaos Rotation: Chaotic vs Controlled
        ref.current.rotation.y += isChaos ? delta * 2 : delta / 20;
        ref.current.rotation.x += isChaos ? delta : 0;

        // Neural Lighting
        if (lightRef.current) {
            const baseIntensity = isChaos ? 0.2 : 0.5;
            const pulse = isChaos
                ? Math.sin(state.clock.elapsedTime * 10) * 0.5
                : Math.sin(state.clock.elapsedTime * 2) * 0.2;
            lightRef.current.intensity = baseIntensity + pulse;
            if (isChaos) lightRef.current.color.set("#ff0055");
            else lightRef.current.color.set("#ffffff");
        }

        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        const initialPositions = points;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];

            if (isChaos) {
                positions[i] += (x - 0) * 0.01 + (x - mouse.x * 2.5) * 0.05;
                positions[i + 1] += (y - 0) * 0.01 + (y - mouse.y * 2.5) * 0.05;
                if (Math.abs(positions[i]) > 5) positions[i] *= 0.1;
                if (Math.abs(positions[i + 1]) > 5) positions[i + 1] *= 0.1;
            } else {
                const dx = x - (mouse.x * 2.5);
                const dy = y - (mouse.y * 2.5);
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 0.5) {
                    positions[i] += (mouse.x * 2.5 - x) * 0.02;
                    positions[i + 1] += (mouse.y * 2.5 - y) * 0.02;
                } else {
                    positions[i] += (initialPositions[i] - x) * 0.01;
                    positions[i + 1] += (initialPositions[i + 1] - y) * 0.01;
                    positions[i + 2] += (initialPositions[i + 2] - positions[i + 2]) * 0.01;
                }
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <>
            <ambientLight ref={lightRef} intensity={0.5} />
            <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={isChaos ? "#ff0055" : "#22c55e"}
                    size={isChaos ? 0.02 : 0.01}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.3}
                />
            </Points>

            <BinaryMirror />
            <ActionCrystals />

            {/* Neural Branching Nodes (Temporal States) */}
            <VoxelNode position={[0, 0, 0]} size={[1.6, 1]} targetYear={2026} currentTemporalProgress={progress} color={isChaos ? "#ff0055" : "#22c55e"} />
            <VoxelNode position={[1.8, 0.5, -0.5]} size={[0.8, 0.5]} targetYear={2025} currentTemporalProgress={progress} color={isChaos ? "#ff0055" : "#00ff9f"} />
            <VoxelNode position={[-1.8, -0.5, -0.5]} size={[0.8, 0.5]} targetYear={2024} currentTemporalProgress={progress} color={isChaos ? "#ff0055" : "#00ff9f"} />
            <VoxelNode position={[0, -1.5, -1]} size={[1.2, 0.4]} targetYear={2023} currentTemporalProgress={progress} color={isChaos ? "#ff0055" : "#00ffff"} />
        </>
    );
}

export default function VoxelScene() {
    const spherePoints = useMemo(() => {
        const p = random.inSphere(new Float32Array(15000), { radius: 1.5 }) as Float32Array;
        return p;
    }, []);

    return (
        <div className="fixed inset-0 z-0 bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <VoxelCore points={spherePoints} />
            </Canvas>
        </div>
    );
}
