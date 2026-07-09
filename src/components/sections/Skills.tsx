"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Section from "@/components/ui/Section";
import { skills, type Skill } from "@/data/portfolio";

type Ball = {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  r: number;
  spinSpeed: number;
  interacted: boolean;
};

/* ---------- simulation helpers (module scope: free to mutate) ---------- */

function layoutGrid(balls: Ball[], count: number, isMobile: boolean): Ball[] {
  const r = isMobile ? 0.85 : 1.1;
  const cols = isMobile ? 4 : 7;
  const gap = r * 2;
  const rows = Math.ceil(count / cols);
  const startX = -((cols - 1) * gap) / 2;
  const startY = ((rows - 1) * gap) / 2;

  if (balls.length !== count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: startX + (i % cols) * gap,
      y: startY - Math.floor(i / cols) * gap,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      r,
      spinSpeed: 0,
      interacted: false,
    }));
  }
  balls.forEach((b, i) => {
    b.r = r;
    if (!b.interacted) {
      b.x = startX + (i % cols) * gap;
      b.y = startY - Math.floor(i / cols) * gap;
    }
  });
  return balls;
}

function stepSimulation(
  balls: Ball[],
  mouse: { x: number; y: number },
  viewport: { width: number; height: number },
  isMobile: boolean
) {
  const mx = (mouse.x * viewport.width) / 2;
  const my = (mouse.y * viewport.height) / 2;
  const mouseActive = Math.abs(mouse.x) > 0.01 || Math.abs(mouse.y) > 0.01;
  const repelRadius = isMobile ? 2.4 : 5.5;
  const homePull = 3e-4;
  const damping = mouseActive ? 0.98 : 0.995;

  for (const b of balls) {
    b.vx += (0 - b.x) * homePull;
    b.vy += (0 - b.y) * homePull;
    b.vz += (0 - b.z) * 0.01;

    if (mouseActive) {
      const dx = b.x - mx;
      const dy = b.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < repelRadius && dist > 0) {
        b.interacted = true;
        const force = (repelRadius - dist) * 0.02;
        b.vx += (dx / dist) * force;
        b.vy += (dy / dist) * force;
        b.vz += (Math.random() - 0.5) * force;
      }
    }

    b.x += b.vx;
    b.y += b.vy;
    b.z += b.vz;
    b.vx *= damping;
    b.vy *= damping;
    b.vz *= damping;

    const maxX = viewport.width / 2 - b.r;
    const maxY = viewport.height / 2 - b.r;
    if (b.x > maxX) { b.x = maxX; b.vx *= -0.9; }
    if (b.x < -maxX) { b.x = -maxX; b.vx *= -0.9; }
    if (b.y > maxY) { b.y = maxY; b.vy *= -0.9; }
    if (b.y < -maxY) { b.y = -maxY; b.vy *= -0.9; }
    if (b.z > 2) { b.z = 2; b.vz *= -0.8; }
    if (b.z < -2) { b.z = -2; b.vz *= -0.8; }
  }

  // pairwise separation
  for (let i = 0; i < balls.length; i++) {
    const a = balls[i];
    for (let j = i + 1; j < balls.length; j++) {
      const c = balls[j];
      const dx = c.x - a.x;
      const dy = c.y - a.y;
      const dz = c.z - a.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const minDist = a.r + c.r;
      if (dist < minDist && dist > 0) {
        if (a.interacted || c.interacted) {
          a.interacted = true;
          c.interacted = true;
        }
        const push = (minDist - dist) * 0.05;
        const px = (dx / dist) * push;
        const py = (dy / dist) * push;
        const pz = (dz / dist) * push;
        a.vx -= px; a.vy -= py; a.vz -= pz;
        c.vx += px; c.vy += py; c.vz += pz;
      }
    }
  }
}

function applyBallTransform(group: THREE.Group, b: Ball) {
  group.position.set(b.x, b.y + Math.sin(Date.now() * 0.0015 + b.id) * 0.12, b.z);
  if (b.interacted) {
    group.rotation.x += b.vy * 0.15;
    group.rotation.y += b.vx * 0.15;
  } else {
    group.rotation.set(0, 0, 0);
  }
  if (b.spinSpeed > 0.001) {
    group.rotation.z += b.spinSpeed;
    b.spinSpeed *= 0.95;
  }
}

function kickBall(b: Ball | undefined) {
  if (!b) return;
  b.interacted = true;
  b.spinSpeed = 0.4;
  b.vz = (Math.random() - 0.5) * 0.5;
  b.vx += (Math.random() - 0.5) * 0.5;
  b.vy += (Math.random() - 0.5) * 0.5;
}

/* ---------- textures ---------- */

function textColorFor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const yiq = (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
  return yiq > 160 ? "#18181b" : "#ffffff";
}

function makeLabelTexture(skill: Skill) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  // brand-colored badge
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.38, 0, Math.PI * 2);
  ctx.fillStyle = skill.color;
  ctx.fill();

  // label
  ctx.fillStyle = textColorFor(skill.color);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let fontSize = 150;
  ctx.font = `900 ${fontSize}px "Geist", "Segoe UI", sans-serif`;
  while (ctx.measureText(skill.short).width > size * 0.58 && fontSize > 40) {
    fontSize -= 8;
    ctx.font = `900 ${fontSize}px "Geist", "Segoe UI", sans-serif`;
  }
  ctx.fillText(skill.short, size / 2, size / 2 + 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/* ---------- components ---------- */

// Mounts once when the element first becomes visible and stays mounted —
// avoids repeatedly tearing down the WebGL context while scrolling.
// A plain scroll check backs up IntersectionObserver for robustness.
function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el === null || inView) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });
    observer.observe(el);
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.2 && r.bottom > -100) setInView(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", check);
    };
  }, [threshold, inView]);
  return [ref, inView] as const;
}

// four longitude patches so the badge is visible from any angle
const PATCH_PHI_STARTS = [Math.PI / 2 - 0.5, Math.PI * 1.5 - 0.5, -0.5, Math.PI - 0.5];

function SkillBall({
  index,
  skill,
  radius,
  ballsRef,
}: {
  index: number;
  skill: Skill;
  radius: number;
  ballsRef: React.RefObject<Ball[]>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => makeLabelTexture(skill), [skill]);
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    const group = groupRef.current;
    const b = ballsRef.current[index];
    if (group && b) applyBallTransform(group, b);
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        kickBall(ballsRef.current[index]);
      }}
    >
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.05} roughness={0.3} />
      </mesh>
      {PATCH_PHI_STARTS.map((phiStart) => (
        <mesh key={phiStart}>
          <sphereGeometry args={[radius * 1.01, 32, 32, phiStart, 1, Math.PI / 2 - 0.5, 1]} />
          <meshStandardMaterial map={texture} transparent depthWrite={false} roughness={0.3} metalness={0.1} color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function BallPit({ isMobile }: { isMobile: boolean }) {
  const ballsRef = useRef<Ball[]>([]);
  const radius = isMobile ? 0.85 : 1.1;

  useEffect(() => {
    ballsRef.current = layoutGrid(ballsRef.current, skills.length, isMobile);
  }, [isMobile]);

  useFrame(({ mouse, viewport }) => {
    stepSimulation(ballsRef.current, mouse, viewport, isMobile);
  });

  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[5, 10, 7]} intensity={1.5} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <pointLight position={[0, 0, 10]} intensity={0.8} />
      {skills.map((skill, i) => (
        <SkillBall key={skill.name} index={i} skill={skill} radius={radius} ballsRef={ballsRef} />
      ))}
    </>
  );
}

export default function Skills() {
  const [containerRef, inView] = useInView(0.05);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <Section id="skills" title="Skills" subtitle="Hover to scatter — click to spin">
      <div
        ref={containerRef}
        className="w-full h-[24rem] md:h-[34rem] relative overflow-hidden flex items-center justify-center cursor-crosshair rounded-2xl border border-white/5 bg-zinc-950"
      >
        {inView ? (
          <Canvas camera={{ position: [0, 0, 40], fov: 20 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
            <BallPit isMobile={isMobile} />
          </Canvas>
        ) : (
          <div className="w-full h-full bg-zinc-950" />
        )}
      </div>
    </Section>
  );
}
