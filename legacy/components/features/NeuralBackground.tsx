"use client";

"use client";

import { useMemo, useRef } from "react";
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
    uniform float uTime;
    uniform vec2 uMouse;

    // Simplex Noise for Liquid Motion
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 a0 = x - floor(x + 0.5);
      vec3 g = a0 * vec3(x0.x,x12.xz) + h * vec3(x0.y,x12.yw);
      vec3 l = 1.79284291400159 - 0.85373472095314 * ( g*g + h*h );
      vec3 r = g * l;
      return 130.0 * dot(m, r);
    }

    void main() {
        vec2 uv = vUv;
        vec2 mouse = (uMouse + 1.0) / 2.0;
        
        // Distort UV with noise
        float n = snoise(uv * 3.0 + uTime * 0.2);
        vec2 distortedUv = uv + n * 0.05;
        
        // Mouse influence as a "Gravity Well"
        float mDist = distance(uv, mouse);
        float mForce = smoothstep(0.4, 0.0, mDist);
        distortedUv += normalize(uv - mouse) * mForce * -0.1;

        // Mercury Sheen Logic
        float f = snoise(distortedUv * 5.0 + uTime * 0.1);
        float sheen = smoothstep(0.3, 0.7, f);
        
        // Specular highlights
        float spec = pow(sheen, 10.0) * 0.5;
        
        vec3 baseColor = vec3(0.02, 0.02, 0.02); // Deep Obsidian
        vec3 mercuryColor = vec3(0.13, 0.77, 0.36) * sheen * 0.2; // Cyber Lime glow in fluid
        
        vec3 finalColor = baseColor + mercuryColor + spec;
        
        // Add subtle chromatic aberration to the fluid edges
        float edge = length(fwidth(distortedUv));
        finalColor.r += edge * 0.1;
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

function DataStreams() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { mouse, viewport } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
    }), []);

    useFrame((state) => {
        const { clock } = state;
        uniforms.uTime.value = clock.getElapsedTime();
        uniforms.uMouse.value.lerp(mouse, 0.1);
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

export default function NeuralBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <DataStreams />
            </Canvas>
        </div>
    );
}
