'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { mockRepositories } from '@/lib/mock-data';
import { GitBranch, Plus, ExternalLink, Star, Clock, Activity, X } from 'lucide-react';

const container = { initial: {}, animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } } };

export default function RepositoriesPage() {
  const [showConnect, setShowConnect] = useState(false);

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div variants={fadeUp}><h1 className="text-2xl font-bold text-text-primary tracking-tight">Repositories</h1><p className="text-sm text-text-secondary mt-1">Connect GitHub repositories for AI-powered pipeline analysis</p></motion.div>
        <motion.div variants={fadeUp}>
          <button onClick={() => setShowConnect(!showConnect)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet to-electric hover:shadow-lg hover:shadow-violet/20 text-white font-semibold transition-all duration-300 text-sm hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Connect Repository
          </button>
        </motion.div>
      </div>

      {showConnect && (
        <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10 }}>
          <GlowCard glowColor="violet">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary">Connect a GitHub Repository</h3>
              <button onClick={() => setShowConnect(false)} className="p-1.5 rounded-lg hover:bg-graphite-lighter/60 text-text-muted hover:text-text-secondary transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1.5">Repository URL</label><input type="text" placeholder="https://github.com/org/repo" className="w-full bg-graphite/60 border border-graphite-border/40 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-violet/30 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.05)] transition-all duration-200 font-mono" /></div>
              <div><label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1.5">GitHub Token</label><input type="password" placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="w-full bg-graphite/60 border border-graphite-border/40 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-violet/30 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.05)] transition-all duration-200 font-mono" /></div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 bg-gradient-to-r from-violet to-electric text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet/20">Connect</button>
                <button onClick={() => setShowConnect(false)} className="px-5 py-2.5 bg-graphite-lighter/60 border border-graphite-border/40 text-text-secondary hover:text-text-primary rounded-xl text-sm transition-all duration-200">Cancel</button>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRepositories.map((repo, i) => (
          <motion.div key={repo.id} variants={fadeUp}>
            <GlowCard glowColor={repo.status === 'connected' ? 'green' : 'none'}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-graphite/60 border border-graphite-border/40 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-violet" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{repo.name}</h3>
                    <p className="text-[11px] text-text-muted font-mono">{repo.fullName}</p>
                  </div>
                </div>
                <StatusBadge status={repo.status === 'connected' ? 'success' : 'idle'} label={repo.status} />
              </div>
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                <div className="text-center p-2.5 rounded-xl bg-graphite/30 border border-graphite-border/20"><p className="text-[10px] text-text-muted">Pipelines</p><p className="text-sm font-mono text-text-primary font-medium">{repo.pipelinesRun}</p></div>
                <div className="text-center p-2.5 rounded-xl bg-graphite/30 border border-graphite-border/20"><p className="text-[10px] text-text-muted">Fail Rate</p><p className="text-sm font-mono font-medium" style={{ color: repo.failureRate > 0.15 ? '#f59e0b' : '#34d399' }}>{(repo.failureRate * 100).toFixed(0)}%</p></div>
                <div className="text-center p-2.5 rounded-xl bg-graphite/30 border border-graphite-border/20"><p className="text-[10px] text-text-muted">Language</p><p className="text-sm font-mono text-text-primary font-medium">{repo.language}</p></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <div className="flex items-center gap-3"><span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stars}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{repo.lastPush}</span></div>
                <button className="flex items-center gap-1 text-violet hover:text-violet/80 transition-colors font-medium"><ExternalLink className="w-3 h-3" /> View</button>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
