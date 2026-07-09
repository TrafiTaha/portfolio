"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uRadius;
    uniform float uStrength;

    void main() {
        vec2 uv = vUv;
        vec2 mouse = uMouse;
        
        float dist = distance(uv, mouse);
        float warp = smoothstep(uRadius, 0.0, dist) * uStrength;
        
        vec2 dir = normalize(uv - mouse);
        vec2 warpedUv = uv + dir * warp * 0.1;
        
        // Final effect: subtle grid distortion
        float grid = sin(warpedUv.x * 100.0) * sin(warpedUv.y * 100.0);
        float color = smoothstep(0.9, 1.0, grid) * warp;
        
        gl_FragColor = vec4(vec3(0.13, 0.77, 0.36) * color, color * 0.5);
    }
`;

function WarpMesh() {
    const { mouse, viewport } = useThree();
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uRadius: { value: 0.15 },
        uStrength: { value: 0.5 },
    }), []);

    useFrame((state) => {
        const { clock } = state;
        uniforms.uTime.value = clock.getElapsedTime();
        uniforms.uMouse.value.set((mouse.x + 1) / 2, (mouse.y + 1) / 2);
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[viewport.width, viewport.height]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
            />
        </mesh>
    );
}

export default function WarpCursor() {
    return (
        <div className="fixed inset-0 z-[9998] pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <WarpMesh />
            </Canvas>
        </div>
    );
}
