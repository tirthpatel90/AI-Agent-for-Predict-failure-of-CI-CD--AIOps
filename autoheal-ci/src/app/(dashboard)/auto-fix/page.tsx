'use client';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import { useRepo } from '@/lib/RepoContext';
import { Wrench, Zap, GitBranch, Plus, Brain, Sparkles, Lock } from 'lucide-react';

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function AutoFixPage() {
  const { selectedRepo } = useRepo();

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Auto Fix Engine</h1>
        <p className="text-sm text-text-secondary mt-1">Automated error detection and repair system</p>
      </motion.div>

      {/* Coming soon state */}
      <motion.div variants={fadeUp}>
        <GlowCard glowColor="amber" hover={false}>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-amber/8 border border-amber/15 flex items-center justify-center mb-6 relative">
              <Wrench className="w-9 h-9 text-amber" />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-graphite-light border border-graphite-border/40 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-violet" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">AI Auto-Fix Coming Soon</h3>
            <p className="text-sm text-text-muted text-center max-w-lg mb-8">
              The Auto Fix engine will automatically detect CI/CD failures and suggest or apply fixes in real-time.
              It learns from your repository patterns to provide increasingly accurate solutions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
              {[
                { icon: Brain, title: 'Smart Detection', desc: 'Identifies common CI/CD errors from build logs', color: '#8b5cf6' },
                { icon: Zap, title: 'Auto Repair', desc: 'Generates and applies fixes automatically', color: '#f59e0b' },
                { icon: Lock, title: 'Safe Guards', desc: 'Reviews changes before applying to production', color: '#34d399' },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="p-4 rounded-xl bg-graphite/30 border border-graphite-border/40 text-center">
                    <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: feature.color }} />
                    <h4 className="text-sm font-semibold text-text-primary mb-1">{feature.title}</h4>
                    <p className="text-[11px] text-text-muted">{feature.desc}</p>
                  </div>
                );
              })}
            </div>

            {!selectedRepo ? (
              <a href="/repositories" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-electric text-white font-semibold text-sm">
                <Plus className="w-4 h-4" /> Connect a Repository First
              </a>
            ) : (
              <a href="/predictions" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-electric text-white font-semibold text-sm">
                <Brain className="w-4 h-4" /> Try AI Predictions Instead
              </a>
            )}
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}
