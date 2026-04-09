'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, GitCommit, Scan, Brain, Wrench, Rocket } from 'lucide-react';

const stages = [
  { label: 'Commit', icon: GitCommit, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.3)' },
  { label: 'Analyze', icon: Scan, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.3)' },
  { label: 'Predict', icon: Brain, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.3)' },
  { label: 'Fix', icon: Wrench, color: '#34d399', glowColor: 'rgba(52, 211, 153, 0.3)' },
  { label: 'Deploy', icon: Rocket, color: '#22d3ee', glowColor: 'rgba(34, 211, 238, 0.3)' },
];

export default function HeroPipeline() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto py-6">
      {/* Connection lines */}
      <div className="absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 h-px">
        <div className="w-full h-full bg-graphite-border/40 relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet via-electric to-cyan"
            animate={{ width: `${(activeStage / (stages.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Nodes */}
      <div className="relative flex items-center justify-between px-[5%]">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i === activeStage;
          const isDone = i < activeStage;
          const isUpcoming = i > activeStage;

          return (
            <div key={stage.label} className="flex flex-col items-center gap-3 relative">
              {/* Glow ring */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full"
                    style={{ backgroundColor: stage.glowColor }}
                  />
                )}
              </AnimatePresence>

              {/* Circle */}
              <motion.div
                animate={{
                  borderColor: isUpcoming ? '#252836' : stage.color,
                  backgroundColor: isDone ? stage.color + '15' : isActive ? stage.color + '20' : '#11131a',
                  boxShadow: isActive ? `0 0 20px ${stage.glowColor}` : '0 0 0px transparent',
                }}
                transition={{ duration: 0.4 }}
                className="relative w-11 h-11 rounded-full border-2 flex items-center justify-center z-10"
              >
                {isDone ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                    <Check className="w-4 h-4" style={{ color: stage.color }} />
                  </motion.div>
                ) : isActive ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 className="w-4 h-4" style={{ color: stage.color }} />
                  </motion.div>
                ) : (
                  <Icon className="w-4 h-4 text-text-muted" />
                )}
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{
                  color: isUpcoming ? '#475569' : '#f1f5f9',
                  opacity: isUpcoming ? 0.5 : 1,
                }}
                className="text-[11px] font-mono font-medium"
              >
                {stage.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
