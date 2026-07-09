'use client';

import ParticleBackground from './ParticleBackground';

export default function ParallaxBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-black">
      <ParticleBackground />
    </div>
  );
}
