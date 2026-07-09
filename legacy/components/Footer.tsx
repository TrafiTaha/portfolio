'use client';

import { motion } from 'framer-motion';
import { Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-10 text-center">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Support the Developer</h3>
        <p className="text-gray-400 mb-4">Help fuel the next big project with your contribution</p>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 border border-white/10 inline-block">
          <div className="text-center">
            <motion.div
              className="text-lg font-mono font-bold mb-1 text-cyan-300"
              animate={{
                textShadow: [
                  '0 0 5px #00ffff',
                  '0 0 20px #00ffff, 0 0 30px #00ffff',
                  '0 0 5px #00ffff',
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              D17: 29119181
            </motion.div>
            <div className="text-xs text-gray-400">System Serial Number</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-8">
        <motion.a
          href="https://www.linkedin.com/in/taha-ben-romdhane-765b09371"
          target="_blank"
          rel="noopener noreferrer"
          className="glassmorphism rounded-2xl p-4 border border-white/10 backdrop-blur-xl text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Linkedin className="w-6 h-6" />
        </motion.a>
        <motion.a
          href="https://github.com/TrafiTaha"
          target="_blank"
          rel="noopener noreferrer"
          className="glassmorphism rounded-2xl p-4 border border-white/10 backdrop-blur-xl text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Github className="w-6 h-6" />
        </motion.a>
      </div>
    </footer>
  );
}
