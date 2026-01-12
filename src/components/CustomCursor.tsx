'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'button' | 'link'>('default');

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        setCursorType('button');
      } else if (target.tagName === 'A' || target.closest('a')) {
        setCursorType('link');
      }
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setCursorType('default');
      setIsHovering(false);
    };

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

  const getCursorVariant = () => {
    switch (cursorType) {
      case 'button':
        return {
          scale: 1.5,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 255, 255, 0.2)',
          border: '2px solid #00ffff',
        };
      case 'link':
        return {
          scale: 1.3,
          borderRadius: '25%',
          backgroundColor: 'rgba(147, 51, 234, 0.2)',
          border: '2px solid #9333ea',
        };
      default:
        return {
          scale: 1,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: '2px solid rgba(255, 255, 255, 0.8)',
        };
    }
  };

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x - 20,
        top: position.y - 20,
      }}
      animate={getCursorVariant()}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="w-10 h-10 rounded-full border-2 border-white/80 flex items-center justify-center">
        <motion.div
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            scale: isHovering ? 1.5 : 1,
            backgroundColor: cursorType === 'button' ? '#00ffff' : cursorType === 'link' ? '#9333ea' : '#ffffff',
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  );
}
