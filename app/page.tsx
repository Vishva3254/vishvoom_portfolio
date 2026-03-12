'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import BootSequence from '@/components/BootSequence';
import UniverseCanvas from '@/components/UniverseCanvas';
import PlanetInfoPanel from '@/components/PlanetInfoPanel';
import HologramChatbot from '@/components/HologramChatbot';
import { Move, MousePointerClick } from 'lucide-react';

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [isIntro, setIsIntro] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [introText, setIntroText] = useState("");
  
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const greeting = "Hello to Vishwa's space lets explore it!";
  const instructions = "To move, use W A S D or the 4 arrow keys. To see any planet, click the Space bar.";

  const skipIntro = () => {
    window.speechSynthesis.cancel();
    setIsIntro(false);
    setIsStarted(true);
    setShowControls(true);
    setIntroText("");
  };

  const startIntro = () => {
    setIsIntro(true);
    const utterance1 = new SpeechSynthesisUtterance(greeting);
    const utterance2 = new SpeechSynthesisUtterance(instructions);
    
    setIntroText(greeting);
    window.speechSynthesis.speak(utterance1);
    
    const handleNext = () => {
      setIntroText(instructions);
      window.speechSynthesis.speak(utterance2);
    };

    const finishIntro = () => {
      setIsIntro(false);
      setIsStarted(true);
      setShowControls(true);
      setIntroText("");
    };

    utterance1.onend = handleNext;
    utterance2.onend = finishIntro;

    // Safety fallbacks
    setTimeout(() => {
      if (introText === greeting) handleNext();
    }, 6000);
    
    setTimeout(() => {
      if (isIntro) finishIntro();
    }, 15000);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isIntro) {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIntro]);

  return (
    <main className="relative h-screen overflow-hidden bg-black">
      <AnimatePresence>
        {booting && (
          <BootSequence onComplete={() => setBooting(false)} />
        )}
      </AnimatePresence>

      {!booting && (
        <>
          <UniverseCanvas 
            selectedPlanet={selectedPlanet} 
            onSelectPlanet={setSelectedPlanet} 
            isStarted={isStarted}
            isIntro={isIntro}
            onIntroComplete={() => {}}
          />

          {/* Start Overlay (Ensures user interaction for speech) */}
          <AnimatePresence>
            {!isIntro && !isStarted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startIntro}
                  className="px-8 py-4 bg-cyan-500 text-black font-mono font-bold rounded-full shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center gap-3 group"
                >
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                  INITIALIZE NEURAL LINK
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <PlanetInfoPanel 
            planetId={selectedPlanet} 
            onClose={() => setSelectedPlanet(null)} 
          />
          
          {isStarted && <HologramChatbot />}

          {/* Robot Speech Bubble */}
          <AnimatePresence>
            {isIntro && introText && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
              >
                <div className="bg-cyan-950/80 backdrop-blur-xl border border-cyan-500/40 p-6 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Neural Assistant</span>
                    </div>
                    <button 
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        setIsIntro(false);
                        setIsStarted(true);
                        setShowControls(true);
                        setIntroText("");
                      }}
                      className="text-[10px] font-mono text-cyan-500/60 hover:text-cyan-400 uppercase tracking-widest transition-colors"
                    >
                      Skip Intro [ESC]
                    </button>
                  </div>
                  <p className="text-white font-mono text-sm leading-relaxed mb-2">
                    {introText}
                  </p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-950/80 border-r border-b border-cyan-500/40 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HUD Overlay */}
          <div className="fixed top-8 left-8 z-30 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                Vishwa Patel
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">
                  AI / Machine Learning Engineer
                </span>
              </div>
            </motion.div>
          </div>

          {/* Navigation Hints */}
          <AnimatePresence>
            {showControls && !selectedPlanet && isStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-8"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">
                  <Move size={14} />
                  <span>WASD to Move</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">
                  <span className="border border-cyan-500/40 px-1 rounded">SPACE</span>
                  <span>Jump</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </main>
  );
}
