'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { Group, Vector3 } from 'three';

interface Skill {
  name: string;
  level: number;
  color: string;
}

const skills: Skill[] = [
  { name: 'Laravel', level: 9, color: '#FF2D20' },
  { name: 'Vue.js', level: 8, color: '#4FC08D' },
  { name: 'Three.js', level: 7, color: '#049EF4' },
  { name: 'React', level: 9, color: '#61DAFB' },
  { name: 'Node.js', level: 8, color: '#339933' },
  { name: 'PHP', level: 9, color: '#777BB4' },
  { name: 'TypeScript', level: 8, color: '#3178C6' },
  { name: 'Python', level: 7, color: '#3776AB' },
  { name: 'Docker', level: 8, color: '#2496ED' },
  { name: 'MySQL', level: 8, color: '#4479A1' },
];

function SkillOrb({ skill, position, index }: { skill: Skill; position: Vector3; index: number }) {
  const meshRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + index) * 0.2;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime + index) * 0.2;
      meshRef.current.position.copy(position);
    }
  });

  const size = 0.3 + (skill.level / 10) * 0.4;

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Text
        position={[0, size + 0.2, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/mono.woff"
      >
        {skill.name}
      </Text>
    </group>
  );
}

function SkillsCloud() {
  const groupRef = useRef<Group>(null);

  const skillPositions = useMemo(() => {
    return skills.map((_, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const radius = 3;
      const height = Math.sin(angle * 2) * 1.5;
      return new Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/mono.woff"
      >
        CORE
      </Text>

      {/* Skill orbs */}
      {skills.map((skill, index) => (
        <SkillOrb
          key={skill.name}
          skill={skill}
          position={skillPositions[index]}
          index={index}
        />
      ))}
    </group>
  );
}

export default function SkillsVisualization() {
  return (
    <div className="w-full h-96">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <SkillsCloud />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}