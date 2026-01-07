'use client';

import { useState, useEffect } from 'react';

export default function SystemLog() {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(0);
  const [activeNode, setActiveNode] = useState('HERO');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      setScrollDepth(scrollPercent);

      if (scrollPercent < 25) setActiveNode('HERO');
      else if (scrollPercent < 50) setActiveNode('PROJECTS');
      else if (scrollPercent < 75) setActiveNode('SUPPORT');
      else setActiveNode('CONTACT');
    };

    const handleLoad = () => {
      setAssetsLoaded(100);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 border border-cyan-500/50 rounded-lg p-3 font-mono text-xs text-cyan-400 z-40">
      <div>SYSTEM LOG</div>
      <div>SCROLL_DEPTH: {scrollDepth}%</div>
      <div>ASSETS_LOADED: {assetsLoaded}%</div>
      <div>ACTIVE_NODE: {activeNode}</div>
    </div>
  );
}