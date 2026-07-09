'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PerformanceHUD() {
  const [stats, setStats] = useState({
    cpu: 'OPTIMAL',
    memory: '291.1KB',
    ping: '12ms',
    uptime: '00:00:00',
  });

  useEffect(() => {
    const updateStats = () => {
      // Simulate real-time updates
      setStats(prev => ({
        ...prev,
        memory: `${(291.1 + Math.random() * 10 - 5).toFixed(1)}KB`,
        ping: `${Math.floor(10 + Math.random() * 10)}ms`,
      }));
    };

    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const updateUptime = () => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setStats(prev => ({
        ...prev,
        uptime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      }));
    };

    const uptimeInterval = setInterval(updateUptime, 1000);
    return () => clearInterval(uptimeInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="fixed top-4 right-4 z-50 glassmorphism rounded-lg p-4 min-w-[200px]"
    >
      <div className="text-xs font-mono text-cyan-400 mb-3">SYSTEM PERFORMANCE</div>
      <div className="space-y-2 text-sm font-mono">
        <div className="flex justify-between">
          <span className="text-gray-400">CPU_LOAD:</span>
          <span className="text-green-400">{stats.cpu}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">MEMORY:</span>
          <span className="text-blue-400">{stats.memory}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">PING:</span>
          <span className="text-purple-400">{stats.ping}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">UPTIME:</span>
          <span className="text-cyan-400">{stats.uptime}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs font-mono text-green-400">ALL SYSTEMS NOMINAL</span>
      </div>
    </motion.div>
  );
}