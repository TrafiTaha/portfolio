'use client';

import { useEffect, useRef } from 'react';

export default function AudioSystem() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Audio Context
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    // Create mechanical click sound
    const playClickSound = () => {
      if (!audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    };

    // System boot sequence
    const playBootSequence = () => {
      if (!audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5

      notes.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.3);
        }, index * 150);
      });
    };

    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initAudio();
      playBootSequence();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    // Add hover sound listeners
    const addHoverSounds = () => {
      const interactiveElements = document.querySelectorAll('a, button, [data-magnetic]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          if (audioContextRef.current?.state === 'running') {
            playClickSound();
          }
        });
      });
    };

    // Add sounds after a delay to ensure DOM is ready
    setTimeout(addHoverSounds, 1000);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return null; // This component doesn't render anything
}