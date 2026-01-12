'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';
import { usePersistentState } from '@/hooks/usePersistentState';

export default function CommandTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [intensity, setIntensity] = usePersistentState('absoluteZeroIntensity', 'normal');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const executeCommand = (cmd: string) => {
    const newHistory = [...history, `> ${cmd}`];

    switch (cmd.toLowerCase()) {
      case 'help':
        newHistory.push('Available commands:');
        newHistory.push('  cd /projects - Navigate to projects');
        newHistory.push('  cat about.txt - View about section');
        newHistory.push('  exec hire - Execute hiring process');
        newHistory.push('  ls - List sections');
        newHistory.push('  intensity low|normal|high - Set Absolute Zero intensity');
        newHistory.push('  clear - Clear terminal');
        break;
      case 'cd /projects':
        newHistory.push('Navigating to projects...');
        // Scroll to projects section
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'cat about.txt':
        newHistory.push('Loading about information...');
        document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'exec hire':
        newHistory.push('Initiating contact protocol...');
        window.open('mailto:your.email@example.com?subject=Hiring Inquiry', '_blank');
        break;
      case 'ls':
        newHistory.push('Available sections:');
        newHistory.push('  hero/');
        newHistory.push('  projects/');
        newHistory.push('  skills/');
        newHistory.push('  contact/');
        break;
      case 'intensity low':
        setIntensity('low');
        newHistory.push('Absolute Zero intensity set to LOW');
        break;
      case 'intensity normal':
        setIntensity('normal');
        newHistory.push('Absolute Zero intensity set to NORMAL');
        break;
      case 'intensity high':
        setIntensity('high');
        newHistory.push('Absolute Zero intensity set to HIGH');
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        newHistory.push(`Command not found: ${cmd}`);
    }

    setHistory(newHistory);
    setCommand('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command.trim());
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 glassmorphism rounded-full p-3 hover:scale-110 transition-transform"
      >
        <Terminal className="w-5 h-5 text-cyan-400" />
      </motion.button>

      {/* Terminal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 z-50 glassmorphism rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-mono text-gray-400 ml-2">Terminal - System Control</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-auto font-mono text-sm">
              <div className="text-green-400 mb-4">
                Welcome to Taha Ben Romdhane's System Terminal
              </div>
              <div className="text-cyan-400 mb-4">
                Type 'help' for available commands
              </div>

              {history.map((line, index) => (
                <div key={index} className="mb-1">
                  {line.startsWith('>') ? (
                    <span className="text-cyan-400">{line}</span>
                  ) : (
                    <span className="text-gray-300">{line}</span>
                  )}
                </div>
              ))}

              <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-cyan-400 mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white"
                  placeholder="Enter command..."
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}