'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Linkedin, Github } from 'lucide-react';

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center py-20 flex flex-col items-center"
    >
      <div className="flex items-center justify-center mb-12 space-x-12">
        {/* Portrait with Neon Hex Border and Rotating Tech Ring */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative w-48 h-48">
            <Image
              src="/myimage.png"
              alt="Taha Ben Romdhane"
              width={192}
              height={192}
              className="object-cover rounded-lg"
            />
            {/* Neon Hex Border */}
            <div className="absolute inset-0 rounded-lg border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-pulse"></div>
            <div className="absolute inset-0 rounded-lg border border-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.3)] animate-pulse holographic-delay-1"></div>
            {/* Rotating Tech Ring */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <svg width="220" height="220" viewBox="0 0 220 220" className="absolute">
                <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="2" />
                {/* Angular Icon */}
                <g transform="translate(110, 10)">
                  <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="#DD0031">A</text>
                </g>
                {/* Laravel Icon */}
                <g transform="translate(210, 110)">
                  <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="#FF2D20">L</text>
                </g>
                {/* Flutter Icon */}
                <g transform="translate(110, 210)">
                  <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="#02569B">F</text>
                </g>
              </svg>
            </motion.div>
          </div>
          {/* Floating Neon Badge */}
          <motion.div
            className="absolute -top-4 -right-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-mono shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Open for Junior/Internship roles
          </motion.div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-left"
        >
          <div className="font-mono text-sm text-gray-400 mb-2">SYSTEM STATUS</div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-mono text-green-400 text-lg">SYSTEM ONLINE</span>
          </div>
          <div className="font-mono text-xs text-gray-500 mb-4">
            LATEST_DEPLOY: AlphaDocTN
          </div>
          <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg px-3 py-1 text-xs font-mono text-blue-300">
            Currently looking for internship or junior developer opportunities
          </div>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, scaleX: 0.9 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-4xl md:text-6xl font-bold gradient-text mb-8"
      >
        Architecting the future of Language Learning.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, scaleX: 0.95 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
      >
        10k+ users served via Language Transfer.
      </motion.p>

      {/* Action HUD Buttons */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex gap-6 justify-center"
      >
        <motion.a
          href="https://github.com/TrafiTaha"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 text-white font-mono text-sm uppercase tracking-wider hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Github className="w-5 h-5 inline mr-2" />
          GitHub Terminal
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/taha-ben-romdhane-765b09371"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-600 text-white font-mono text-sm uppercase tracking-wider hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Linkedin className="w-5 h-5 inline mr-2" />
          LinkedIn Network
        </motion.a>
      </motion.div>
    </motion.section>
  );
}
