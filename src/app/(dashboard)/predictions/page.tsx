'use client';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { mockPrediction, mockLearningStats, mockCommits } from '@/lib/mock-data';
import { AlertTriangle, TrendingUp, FileSearch, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const predictionHistory = mockLearningStats.recentPredictions.map(p => ({
  commit: p.commit.slice(0, 7),
  predicted: p.predicted * 100,
  actual: p.actual === 'failure' ? 100 : p.actual === 'warning' ? 50 : 0,
}));

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function PredictionsPage() {
  const { failureProbability, likelyCauses, analyzedFiles, riskLevel } = mockPrediction;
  const riskColors = { low: '#34d399', medium: '#f59e0b', high: '#f43f5e', critical: '#f43f5e' };

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">AI Predictions</h1>
        <p className="text-sm text-text-secondary mt-1">ML-powered failure probability analysis for incoming commits</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="crimson" className="flex flex-col items-center justify-center h-full">
            <p className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-4">Failure Probability</p>
            <div className="relative w-44 h-44 mb-4">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1a1d28" strokeWidth="12" strokeLinecap="round" strokeDasharray="402 100" transform="rotate(135 100 100)" />
                <motion.circle cx="100" cy="100" r="80" fill="none" stroke={riskColors[riskLevel]} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${failureProbability * 402} 502`} transform="rotate(135 100 100)" initial={{ strokeDasharray: "0 502" }} animate={{ strokeDasharray: `${failureProbability * 402} 502` }} transition={{ duration: 2, ease: "easeOut" }} />
                <motion.circle cx="100" cy="100" r="80" fill="none" stroke={riskColors[riskLevel]} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${failureProbability * 402} 502`} transform="rotate(135 100 100)" opacity={0.1} initial={{ strokeDasharray: "0 502" }} animate={{ strokeDasharray: `${failureProbability * 402} 502` }} transition={{ duration: 2, ease: "easeOut" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span className="text-4xl font-bold font-mono" style={{ color: riskColors[riskLevel] }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  {(failureProbability * 100).toFixed(0)}%
                </motion.span>
                <span className="text-[11px] text-text-muted mt-1">failure risk</span>
              </div>
            </div>
            <StatusBadge status="failure" label={`${riskLevel.toUpperCase()} RISK`} size="md" />
          </GlowCard>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlowCard glowColor="violet">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber" />
              <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Likely Failure Causes</h3>
            </div>
            <div className="space-y-3">
              {likelyCauses.map((cause, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12, duration: 0.3 }} className="p-3.5 rounded-xl bg-graphite/40 border border-graphite-border/40 hover:border-graphite-border/60 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm text-text-primary">{cause.cause}</span>
                    <span className="text-sm font-mono font-bold" style={{ color: cause.confidence > 0.7 ? '#f43f5e' : cause.confidence > 0.4 ? '#f59e0b' : '#34d399' }}>
                      {(cause.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-graphite-lighter rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: cause.confidence > 0.7 ? '#f43f5e' : cause.confidence > 0.4 ? '#f59e0b' : '#34d399' }} initial={{ width: 0 }} animate={{ width: `${cause.confidence * 100}%` }} transition={{ duration: 0.8, delay: i * 0.12 }} />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-graphite-border/30">
              <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-violet/8 flex items-center justify-center"><FileSearch className="w-4 h-4 text-violet" /></div><div><p className="text-[11px] text-text-muted">Files Analyzed</p><p className="text-sm font-mono text-text-primary font-medium">{analyzedFiles}</p></div></div>
              <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-violet/8 flex items-center justify-center"><Shield className="w-4 h-4 text-violet" /></div><div><p className="text-[11px] text-text-muted">Model Version</p><p className="text-sm font-mono text-text-primary font-medium">v3.2-beta</p></div></div>
            </div>
          </GlowCard>
        </motion.div>
      </div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="violet" hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-violet" />
            <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Prediction vs Actual — Recent Commits</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionHistory} barGap={2} barCategoryGap="20%">
                <XAxis dataKey="commit" stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ background: '#11131a', border: '1px solid #252836', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }} formatter={(value) => `${Number(value).toFixed(0)}%`} />
                <Bar dataKey="predicted" name="Predicted" radius={[4, 4, 0, 0]}>
                  {predictionHistory.map((_, i) => (<Cell key={i} fill="#8b5cf6" opacity={0.7} />))}
                </Bar>
                <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
                  {predictionHistory.map((entry, i) => (<Cell key={i} fill={entry.actual > 50 ? '#f43f5e' : '#34d399'} opacity={0.7} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="none" hover={false}>
          <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-4">Commit Risk Assessment</h3>
          <div className="space-y-1.5">
            {mockCommits.map((commit, i) => (
              <motion.div key={commit.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4 p-3 rounded-xl bg-graphite/30 hover:bg-graphite-hover/40 transition-all duration-200 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-violet/8 border border-violet/12 flex items-center justify-center text-[10px] font-bold text-violet flex-shrink-0">{commit.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate group-hover:text-white transition-colors">{commit.message}</p>
                  <p className="text-[11px] text-text-muted font-mono">{commit.id} · {commit.branch}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-mono font-bold" style={{ color: commit.predictionScore > 0.7 ? '#f43f5e' : commit.predictionScore > 0.4 ? '#f59e0b' : '#34d399' }}>
                    {(commit.predictionScore * 100).toFixed(0)}%
                  </p>
                  <p className="text-[11px] text-text-muted">{commit.filesChanged} files</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}
