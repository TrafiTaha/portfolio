'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', updatePosition);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-magnetic]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" className="reticle">
        <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="1" opacity="0.8" />
        <circle cx="12" cy="12" r="6" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
        <line x1="12" y1="2" x2="12" y2="6" stroke="white" strokeWidth="1" opacity="0.8" />
        <line x1="12" y1="18" x2="12" y2="22" stroke="white" strokeWidth="1" opacity="0.8" />
        <line x1="2" y1="12" x2="6" y2="12" stroke="white" strokeWidth="1" opacity="0.8" />
        <line x1="18" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1" opacity="0.8" />
        <circle cx="12" cy="12" r="1" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}
