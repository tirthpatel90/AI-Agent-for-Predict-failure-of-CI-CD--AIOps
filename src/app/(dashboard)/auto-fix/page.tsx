'use client';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { mockFixAttempts, mockLearningStats, mockKnowledgeBase } from '@/lib/mock-data';
import { Wrench, CheckCircle, XCircle, Zap, TrendingUp, Terminal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function AutoFixPage() {
  const strategyData = mockLearningStats.strategyRankings.map(s => ({
    strategy: s.strategy.replace(/_/g, ' '),
    rate: s.successRate * 100,
    uses: s.uses,
  }));

  const statCards = [
    { label: 'Successful Fixes', value: mockLearningStats.successfulFixes, icon: CheckCircle, color: '#34d399', accentBorder: 'border-l-neon-green' },
    { label: 'Failed Fixes', value: mockLearningStats.totalFixAttempts - mockLearningStats.successfulFixes, icon: XCircle, color: '#f43f5e', accentBorder: 'border-l-crimson' },
    { label: 'Success Rate', value: `${(mockLearningStats.autoFixSuccessRate * 100).toFixed(0)}%`, icon: TrendingUp, color: '#8b5cf6', accentBorder: 'border-l-violet' },
  ];

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Auto Fix Engine</h1>
        <p className="text-sm text-text-secondary mt-1">Automated error detection and repair system</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={fadeUp} className={`bg-graphite-light/80 border border-graphite-border/40 border-l-2 ${card.accentBorder} rounded-2xl p-5 hover:bg-graphite-hover/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15 group`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-graphite-lighter/50 flex items-center justify-center transition-colors group-hover:bg-graphite-lighter">
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-[11px] text-text-muted font-mono uppercase tracking-wider">{card.label}</p>
                  <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="violet" hover={false}>
            <div className="flex items-center gap-2 mb-4"><Zap className="w-4 h-4 text-violet" /><h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Strategy Ranking</h3></div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strategyData} layout="vertical" barCategoryGap="15%">
                  <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="strategy" stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} width={120} />
                  <Tooltip contentStyle={{ background: '#11131a', border: '1px solid #252836', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }} formatter={(value) => `${Number(value).toFixed(0)}%`} />
                  <Bar dataKey="rate" name="Success Rate" radius={[0, 4, 4, 0]}>
                    {strategyData.map((entry, i) => (<Cell key={i} fill={entry.rate > 80 ? '#34d399' : entry.rate > 60 ? '#f59e0b' : '#f43f5e'} opacity={0.7} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlowCard glowColor="amber" hover={false}>
            <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-4">Error Knowledge Base</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {mockKnowledgeBase.map((entry, i) => (
                <motion.div key={entry.errorSignature} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="p-3 rounded-xl bg-graphite/30 border border-graphite-border/40 hover:border-graphite-border/60 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-violet group-hover:text-violet/80 transition-colors">{entry.errorSignature}</span>
                    <span className="text-xs font-mono font-medium" style={{ color: entry.fixSuccessRate > 0.8 ? '#34d399' : entry.fixSuccessRate > 0.6 ? '#f59e0b' : '#f43f5e' }}>{(entry.fixSuccessRate * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-text-secondary mb-1">{entry.rootCause}</p>
                  <div className="flex items-center justify-between text-[11px] text-text-muted"><span>{entry.environment} · {entry.errorType}</span><span>{entry.occurrenceCount} occurrences</span></div>
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </motion.div>
      </div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="none" hover={false}>
          <div className="flex items-center gap-2 mb-4"><Wrench className="w-4 h-4 text-amber" /><h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Recent Fix Attempts</h3></div>
          <div className="space-y-3">
            {mockFixAttempts.map((fix, i) => (
              <motion.div key={fix.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-4 rounded-xl bg-graphite/30 border border-graphite-border/40 hover:border-graphite-border/60 transition-all duration-200 group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-violet">{fix.errorSignature}</span>
                      <StatusBadge status={fix.result === 'success' ? 'success' : fix.result === 'failure' ? 'failure' : 'pending'} />
                    </div>
                    <p className="text-sm text-crimson font-mono">{fix.errorMessage}</p>
                  </div>
                </div>
                <div className="mt-3 p-2.5 rounded-lg bg-graphite-lighter/40 border border-graphite-border/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Terminal className="w-3 h-3 text-text-muted" />
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Fix Applied</p>
                  </div>
                  <p className="text-sm font-mono text-neon-green">
                    <span className="text-neon-green/50 mr-1.5">$</span>{fix.command}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2.5"><span className="text-[11px] text-text-muted">Strategy: {fix.fixStrategy}</span><span className="text-[11px] text-text-muted">Build: {fix.buildId}</span></div>
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}
