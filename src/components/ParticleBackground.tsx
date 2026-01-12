'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Points as ThreePoints, Vector3 } from 'three';

function Particles() {
  const ref = useRef<ThreePoints>(null);
  const { mouse, viewport } = useThree();
  const [mousePos, setMousePos] = useState(new Vector3());

  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = (Math.random() - 0.5) * 0.01;
      velocities[i + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i + 2] = (Math.random() - 0.5) * 0.01;
    }

    return { positions, velocities };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const velocities = particles.velocities;

      // Update mouse position in 3D space
      setMousePos(new Vector3(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      ));

      // D17:29119181 position (bottom center)
      const targetPos = new Vector3(0, -viewport.height / 2 + 2, 0);

      for (let i = 0; i < positions.length; i += 3) {
        // Mouse attraction
        const particlePos = new Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const mouseDistance = particlePos.distanceTo(mousePos);
        if (mouseDistance < 3) {
          const force = (3 - mouseDistance) / 3;
          const direction = new Vector3().subVectors(mousePos, particlePos).normalize();
          velocities[i] += direction.x * force * 0.02;
          velocities[i + 1] += direction.y * force * 0.02;
          velocities[i + 2] += direction.z * force * 0.02;
        }

        // D17 attraction
        const d17Distance = particlePos.distanceTo(targetPos);
        if (d17Distance < 4) {
          const force = (4 - d17Distance) / 4;
          const direction = new Vector3().subVectors(targetPos, particlePos).normalize();
          velocities[i] += direction.x * force * 0.01;
          velocities[i + 1] += direction.y * force * 0.01;
          velocities[i + 2] += direction.z * force * 0.01;
        }

        // Update positions
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Damping
        velocities[i] *= 0.99;
        velocities[i + 1] *= 0.99;
        velocities[i + 2] *= 0.99;

        // Wrap around
        if (Math.abs(positions[i]) > 10) positions[i] *= -0.9;
        if (Math.abs(positions[i + 1]) > 10) positions[i + 1] *= -0.9;
        if (Math.abs(positions[i + 2]) > 10) positions[i + 2] *= -0.9;
      }

      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00ffff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Particles />
      </Canvas>
    </div>
  );
}