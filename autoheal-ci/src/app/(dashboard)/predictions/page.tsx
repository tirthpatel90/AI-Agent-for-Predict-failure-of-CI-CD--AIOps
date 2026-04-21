'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import GlowCard from '@/components/ui/GlowCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { useRepo } from '@/lib/RepoContext';
import * as api from '@/lib/api';
import { AlertTriangle, TrendingUp, FileSearch, Shield, GitBranch, Plus, Loader2, Brain, RefreshCw } from 'lucide-react';

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function PredictionsPage() {
  const { selectedRepo } = useRepo();
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState<any[]>([]);

  const fetchPrediction = async () => {
    if (!selectedRepo) return;
    setLoading(true);
    try {
      const [predData, commitsData] = await Promise.all([
        api.analyzeRepo(selectedRepo.owner, selectedRepo.repo),
        api.getRepoCommits(selectedRepo.owner, selectedRepo.repo, 10),
      ]);
      setPrediction(predData?.prediction || null);
      setCommits(commitsData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedRepo) { setPrediction(null); setCommits([]); return; }
    fetchPrediction();
  }, [selectedRepo]);

  const failureProbability = prediction?.failure_probability ?? 0;
  const riskLevel = prediction?.risk_level ?? 'low';
  const likelyCauses = prediction?.likely_causes || [];
  const riskColors: Record<string, string> = { low: '#34d399', medium: '#f59e0b', high: '#f43f5e', critical: '#f43f5e' };

  // Empty state
  if (!selectedRepo) {
    return (
      <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
        <motion.div variants={fadeUp}><h1 className="text-2xl font-bold text-text-primary tracking-tight">AI Predictions</h1><p className="text-sm text-text-secondary mt-1">AI-powered failure probability analysis</p></motion.div>
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-graphite-lighter/50 border border-graphite-border/40 flex items-center justify-center mb-4"><GitBranch className="w-7 h-7 text-text-muted" /></div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No repository selected</h3>
          <p className="text-sm text-text-muted text-center max-w-md mb-6">Select a connected repository to run AI-powered CI/CD predictions.</p>
          <a href="/repositories" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-electric text-white font-semibold text-sm"><Plus className="w-4 h-4" /> Connect Repository</a>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">AI Predictions</h1>
          <p className="text-sm text-text-secondary mt-1">Analysis for <span className="text-violet font-mono">{selectedRepo.full_name}</span></p>
        </motion.div>
        <motion.div variants={fadeUp}>
          <button onClick={fetchPrediction} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet to-electric hover:shadow-lg hover:shadow-violet/20 disabled:opacity-50 text-white font-semibold text-sm transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {loading ? 'Analyzing...' : 'Re-analyze'}
          </button>
        </motion.div>
      </div>

      {loading && (
        <motion.div variants={fadeUp} className="flex items-center gap-2 text-violet">
          <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm font-mono">AI is analyzing your repo...</span>
        </motion.div>
      )}

      {prediction && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Failure probability gauge */}
            <motion.div variants={fadeUp}>
              <GlowCard glowColor="crimson" className="flex flex-col items-center justify-center h-full">
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-4">Failure Probability</p>
                <div className="relative w-44 h-44 mb-4">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#1a1d28" strokeWidth="12" strokeLinecap="round" strokeDasharray="402 100" transform="rotate(135 100 100)" />
                    <motion.circle cx="100" cy="100" r="80" fill="none" stroke={riskColors[riskLevel] || '#f59e0b'} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${failureProbability * 402} 502`} transform="rotate(135 100 100)" initial={{ strokeDasharray: "0 502" }} animate={{ strokeDasharray: `${failureProbability * 402} 502` }} transition={{ duration: 2, ease: "easeOut" }} />
                    <motion.circle cx="100" cy="100" r="80" fill="none" stroke={riskColors[riskLevel] || '#f59e0b'} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${failureProbability * 402} 502`} transform="rotate(135 100 100)" opacity={0.1} initial={{ strokeDasharray: "0 502" }} animate={{ strokeDasharray: `${failureProbability * 402} 502` }} transition={{ duration: 2, ease: "easeOut" }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span className="text-4xl font-bold font-mono" style={{ color: riskColors[riskLevel] || '#f59e0b' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                      {Math.round(failureProbability * 100)}%
                    </motion.span>
                    <span className="text-[11px] text-text-muted mt-1">failure risk</span>
                  </div>
                </div>
                <StatusBadge status={riskLevel === 'high' || riskLevel === 'critical' ? 'failure' : riskLevel === 'medium' ? 'warning' : 'success'} label={`${riskLevel.toUpperCase()} RISK`} size="md" />
              </GlowCard>
            </motion.div>

            {/* Likely causes */}
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <GlowCard glowColor="violet">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber" />
                  <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Likely Failure Causes</h3>
                </div>
                {likelyCauses.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-6">No specific causes identified</p>
                ) : (
                  <div className="space-y-3">
                    {likelyCauses.map((cause: any, i: number) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12, duration: 0.3 }} className="p-3.5 rounded-xl bg-graphite/40 border border-graphite-border/40 hover:border-graphite-border/60 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-sm text-text-primary">{cause.cause}</span>
                          <span className="text-sm font-mono font-bold" style={{ color: cause.confidence > 0.7 ? '#f43f5e' : cause.confidence > 0.4 ? '#f59e0b' : '#34d399' }}>
                            {Math.round(cause.confidence * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-graphite-lighter rounded-full overflow-hidden">
                          <motion.div className="h-full rounded-full" style={{ backgroundColor: cause.confidence > 0.7 ? '#f43f5e' : cause.confidence > 0.4 ? '#f59e0b' : '#34d399' }} initial={{ width: 0 }} animate={{ width: `${cause.confidence * 100}%` }} transition={{ duration: 0.8, delay: i * 0.12 }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-graphite-border/30">
                  <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-violet/8 flex items-center justify-center"><FileSearch className="w-4 h-4 text-violet" /></div><div><p className="text-[11px] text-text-muted">Files Analyzed</p><p className="text-sm font-mono text-text-primary font-medium">{prediction.analyzed_files || 'N/A'}</p></div></div>
                  <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-violet/8 flex items-center justify-center"><Shield className="w-4 h-4 text-violet" /></div><div><p className="text-[11px] text-text-muted">CI Config</p><p className="text-sm font-mono text-text-primary font-medium">{prediction.ci_config_found ? 'Found' : 'Not Found'}</p></div></div>
                </div>
              </GlowCard>
            </motion.div>
          </div>

          {/* Summary & Recommendations */}
          {prediction.summary && (
            <motion.div variants={fadeUp}>
              <GlowCard glowColor="violet" hover={false}>
                <div className="flex items-center gap-2 mb-3"><Brain className="w-4 h-4 text-violet" /><h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">AI Summary</h3></div>
                <p className="text-sm text-text-primary leading-relaxed mb-4">{prediction.summary}</p>
                {prediction.recommendations?.length > 0 && (
                  <div className="pt-3 border-t border-graphite-border/30">
                    <p className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-2">Recommendations</p>
                    <ul className="space-y-1.5">
                      {prediction.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-xs text-text-secondary flex items-start gap-2"><span className="text-neon-green mt-0.5">•</span> {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </GlowCard>
            </motion.div>
          )}
        </>
      )}

      {/* Recent commits */}
      {commits.length > 0 && (
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="none" hover={false}>
            <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-4">Recent Commits</h3>
            <div className="space-y-1.5">
              {commits.map((commit: any) => (
                <a key={commit.full_sha || commit.sha} href={commit.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl bg-graphite/30 hover:bg-graphite-hover/40 transition-all duration-200 cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-violet/8 border border-violet/12 flex items-center justify-center text-[10px] font-bold text-violet flex-shrink-0">
                    {commit.author?.slice(0, 2).toUpperCase() || '??'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate group-hover:text-white transition-colors">{commit.message}</p>
                    <p className="text-[11px] text-text-muted font-mono">{commit.sha} · {commit.author}</p>
                  </div>
                </a>
              ))}
            </div>
          </GlowCard>
        </motion.div>
      )}
    </motion.div>
  );
}
