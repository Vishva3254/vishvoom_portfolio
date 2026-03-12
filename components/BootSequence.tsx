'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BOOT_LINES = [
  "Booting AI Exploration System...",
  "Loading Neural Navigation Engine...",
  "Initializing Robotic Explorer...",
  "Scanning Knowledge Galaxy...",
  "Welcome Explorer."
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (currentLine < BOOT_LINES.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsFinished(true);
        setTimeout(onComplete, 1000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentLine, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-cyan-400 p-4"
        >
          <div className="w-full max-w-md space-y-2">
            <div className="mb-8 flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-cyan-400 rounded-full border-t-transparent animate-spin" />
              <h1 className="text-xl font-bold tracking-widest uppercase">System Boot</h1>
            </div>
            
            {BOOT_LINES.slice(0, currentLine + 1).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <span className="text-cyan-600" suppressHydrationWarning>[{new Date().toLocaleTimeString()}]</span>
                <span>{line}</span>
              </motion.div>
            ))}
            
            {currentLine < BOOT_LINES.length && (
              <motion.div
                animate={{ opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-2 h-5 bg-cyan-400 inline-block align-middle ml-1"
              />
            )}
          </div>
          
          <div className="absolute bottom-10 left-10 text-xs text-cyan-800 uppercase tracking-[0.3em]">
            Neural Interface v4.0.2
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
