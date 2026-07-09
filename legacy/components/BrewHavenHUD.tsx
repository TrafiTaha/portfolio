'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BrewHavenHUD() {
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="fixed top-4 left-4 z-50 glassmorphism rounded-lg p-4 min-w-[300px]"
    >
      <div className="text-xs font-mono text-cyan-400 mb-2">BREWHAVEN CONSTANT</div>
      <div className="relative overflow-hidden">
        <div className="text-lg font-mono text-white">
          Force = Milk × Coffee²
        </div>
        {/* Scanning line */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
          style={{
            transform: `translateX(${scanPosition - 100}%)`,
          }}
        />
      </div>
      <div className="text-xs font-mono text-gray-400 mt-1">
        Real-time calculation active
      </div>
    </motion.div>
  );
}