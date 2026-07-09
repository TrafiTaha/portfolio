'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Copy, Check, CreditCard } from 'lucide-react';
import Confetti from 'react-confetti';

export default function SupportCard() {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHUD, setShowHUD] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('29119181');
      setCopied(true);
      setShowConfetti(true);
      setShowHUD(true);
      // Play success sound
      const audio = new Audio('/success.mp3'); // Assuming you have a success.mp3 in public
      audio.play().catch(() => {}); // Ignore if audio fails
      setTimeout(() => {
        setCopied(false);
        setShowConfetti(false);
        setShowHUD(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="py-20 text-center"
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      {showHUD && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg font-mono text-sm z-50"
        >
          Data Copied Successfully
        </motion.div>
      )}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 gradient-text">Supporting the future of open-source education and Language Transfer</h3>
        <p className="text-gray-400 mb-12 text-lg">
          Support the development of open-source tools and educational software.
        </p>

        <motion.div
          className="glassmorphism rounded-3xl p-8 border border-white/10 backdrop-blur-xl relative overflow-hidden"
          whileHover={{
            scale: 1.02,
            rotateX: 5,
            rotateY: 5,
            transformPerspective: 1000
          }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Holographic effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse"></div>
          {/* Additional holographic layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 animate-pulse holographic-delay-1"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-green-500/5 animate-pulse holographic-delay-2"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <CreditCard className="w-8 h-8 text-blue-400 mr-3" />
              <span className="text-xl font-semibold">Secure Transaction Node</span>
            </div>

            <motion.div
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 border border-white/10 relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                rotateX: -2,
                rotateY: -2
              }}
              transition={{ type: "spring", stiffness: 400 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Digital Scan Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
                initial={{ y: "-100%" }}
                whileHover={{ y: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              {/* Inner holographic effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-purple-400/20 animate-pulse"></div>
              <div className="relative z-10 text-center">
                <div className="text-2xl font-mono font-bold mb-2 text-cyan-300">29119181</div>
                <div className="text-sm text-gray-400">D17 Secure Account</div>
              </div>
            </motion.div>

            <motion.button
              onClick={copyToClipboard}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2"
              data-magnetic
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
