'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Github, Linkedin, ExternalLink } from 'lucide-react';
import { PlanetData, planets } from '@/data/portfolio';

export default function PlanetInfoPanel({ 
  planetId, 
  onClose 
}: { 
  planetId: string | null, 
  onClose: () => void 
}) {
  const planet = planets.find(p => p.id === planetId);

  if (!planet) return null;

  return (
    <AnimatePresence>
      {planetId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 100 }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-40 w-full max-w-md"
        >
          <div className="relative p-6 bg-cyan-950/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden">
            {/* Holographic Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[200%] animate-scanline" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-cyan-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <div className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-1">Sector Detected</div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{planet.name}</h2>
              <div className="w-12 h-1 bg-cyan-500 mt-2" />
            </div>

            <p className="text-cyan-100/80 mb-8 leading-relaxed">
              {planet.description}
            </p>

            {planet.projects && planet.projects.length > 0 && (
              <div className="space-y-6">
                <div className="text-xs font-mono text-cyan-500 uppercase tracking-widest">Active Projects</div>
                {planet.projects.map((project, i) => (
                  <div key={i} className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      {project.title}
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-cyan-200/60 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {planet.id === 'contact' && (
              <div className="flex gap-4 mt-8">
                <a 
                  href="https://github.com/Vishva3254" 
                  target="_blank" 
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all text-white"
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/vishwa-patel-75a105288" 
                  target="_blank" 
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all text-white"
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
