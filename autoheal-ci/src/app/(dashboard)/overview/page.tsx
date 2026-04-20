'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import GlowCard from '@/components/ui/GlowCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import StatusBadge from '@/components/ui/StatusBadge';
import { useRepo } from '@/lib/RepoContext';
import * as api from '@/lib/api';
import {
  Activity, TrendingUp, Wrench, Clock, Brain, GitCommit, Zap, ArrowUpRight, ChevronRight,
  GitBranch, Plus, Loader2,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function OverviewPage() {
  const { selectedRepo } = useRepo();
  const [commits, setCommits] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRepo) {
      setCommits([]);
      setRuns([]);
      setPrediction(null);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const [commitsData, runsData] = await Promise.all([
          api.getRepoCommits(selectedRepo!.owner, selectedRepo!.repo, 10),
          api.getRepoRuns(selectedRepo!.owner, selectedRepo!.repo, 10),
        ]);
        setCommits(commitsData || []);
        setRuns(runsData?.runs || []);

        // Fetch AI prediction
        try {
          const predResult = await api.analyzeRepo(selectedRepo!.owner, selectedRepo!.repo);
          setPrediction(predResult?.prediction || null);
        } catch {
          setPrediction(null);
        }
      } catch (e) {
        console.error('Failed to fetch overview data:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedRepo]);

  // Calculate metrics from real data
  const totalRuns = runs.length;
  const successRuns = runs.filter((r: any) => r.conclusion === 'success').length;
  const failedRuns = runs.filter((r: any) => r.conclusion === 'failure').length;
  const pipelineHealth = totalRuns > 0 ? Math.round((successRuns / totalRuns) * 100) : 0;
  const failureRate = totalRuns > 0 ? Math.round((failedRuns / totalRuns) * 100) : 0;
  const avgDuration = totalRuns > 0 ? Math.round(runs.reduce((sum: number, r: any) => sum + (r.duration || 0), 0) / totalRuns) : 0;
  const failureProbability = prediction?.failure_probability ?? 0;
  const riskLevel = prediction?.risk_level ?? 'low';

  // Build chart data from runs
  const chartData = runs.slice().reverse().map((r: any, i: number) => ({
    run: `#${i + 1}`,
    result: r.conclusion === 'failure' ? 1 : r.conclusion === 'success' ? 0 : 0.5,
  }));

  // Empty state
  if (!selectedRepo) {
    return (
      <motion.div variants={container} initial="initial" animate="animate" className="space-y-5">
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Welcome — connect a repository to get started</p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-24">
          <div className="w-20 h-20 rounded-2xl bg-graphite-lighter/50 border border-graphite-border/40 flex items-center justify-center mb-6">
            <GitBranch className="w-9 h-9 text-text-muted" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No repository selected</h3>
          <p className="text-sm text-text-muted text-center max-w-md mb-8">Connect a public GitHub repository and select it to see real-time pipeline analytics, AI predictions, and build history.</p>
          <a href="/repositories" className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet to-electric text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet/20 transition-all duration-300 hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Connect Repository
          </a>
        </motion.div>
      </motion.div>
    );
  }

  const metrics = [
    { label: 'Pipeline Health', value: pipelineHealth, suffix: '%', color: '#34d399', icon: Activity, trend: `${successRuns}/${totalRuns} passed`, trendUp: pipelineHealth > 70, accentBorder: 'border-l-neon-green' },
    { label: 'Failure Rate', value: failureRate, suffix: '%', color: failureRate > 30 ? '#f43f5e' : '#f59e0b', icon: Brain, trend: `${failedRuns} failed`, trendUp: false, accentBorder: failureRate > 30 ? 'border-l-crimson' : 'border-l-amber' },
    { label: 'AI Risk Score', value: Math.round(failureProbability * 100), suffix: '%', color: '#8b5cf6', icon: Wrench, trend: riskLevel, trendUp: false, accentBorder: 'border-l-violet' },
    { label: 'Avg Duration', value: avgDuration, suffix: 's', color: '#22d3ee', icon: Clock, trend: 'per run', trendUp: false, accentBorder: 'border-l-cyan', decimals: 0 },
  ];

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-5">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Analyzing <span className="text-violet font-mono">{selectedRepo.full_name}</span>
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-green/6 border border-neon-green/10">
          <span className="relative flex items-center justify-center w-2 h-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
            <span className="absolute w-2 h-2 rounded-full bg-neon-green animate-ping opacity-30" />
          </span>
          <span className="text-[11px] text-neon-green/80 font-mono font-medium">Live Data</span>
        </motion.div>
      </div>

      {loading && (
        <motion.div variants={fadeUp} className="flex items-center gap-2 text-violet">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-mono">Fetching repo data...</span>
        </motion.div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              className={`bg-graphite-light/80 border border-graphite-border/40 border-l-2 ${metric.accentBorder} rounded-2xl p-5 hover:bg-graphite-hover/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15 group`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">{metric.label}</p>
                <div className="w-8 h-8 rounded-lg bg-graphite-lighter/50 flex items-center justify-center transition-colors group-hover:bg-graphite-lighter">
                  <Icon className="w-3.5 h-3.5" style={{ color: metric.color, opacity: 0.7 }} />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight" style={{ color: metric.color }}>
                <AnimatedCounter target={metric.value} suffix={metric.suffix} decimals={metric.decimals} />
              </p>
              <p className="text-[11px] text-text-muted mt-2 flex items-center gap-1">
                {metric.trendUp && <ArrowUpRight className="w-3 h-3 text-neon-green" />}
                <span className={metric.trendUp ? 'text-neon-green' : ''}>{metric.trend}</span>
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart + Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Run results chart */}
        <motion.div variants={fadeUp} className="lg:col-span-3 bg-graphite-light/80 border border-graphite-border/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-text-secondary font-medium">Build Results — Recent Runs</h3>
            <span className="text-[11px] text-text-muted font-mono px-2 py-0.5 rounded-lg bg-graphite-lighter/50">Last {runs.length} runs</span>
          </div>
          {chartData.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="run" stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={(v) => v === 1 ? 'Fail' : v === 0 ? 'Pass' : ''} />
                  <Tooltip
                    contentStyle={{ background: '#11131a', border: '1px solid #252836', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
                    formatter={(value) => [Number(value) === 1 ? 'Failed' : 'Passed', 'Result']}
                  />
                  <Area type="monotone" dataKey="result" stroke="#f43f5e" fill="url(#probGradient)" strokeWidth={2} dot={{ fill: '#f43f5e', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, stroke: '#f43f5e', strokeWidth: 2, fill: '#11131a' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-text-muted text-sm">No workflow runs found for this repo</div>
          )}
        </motion.div>

        {/* AI Prediction gauge */}
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-graphite-light/80 border border-graphite-border/40 border-t-2 border-t-crimson/30 rounded-2xl p-5 flex flex-col items-center justify-center">
          <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-4">AI Risk Assessment</p>
          {prediction ? (
            <>
              <div className="relative w-32 h-32 mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1d28" strokeWidth="6" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={failureProbability > 0.7 ? '#f43f5e' : failureProbability > 0.4 ? '#f59e0b' : '#34d399'}
                    strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${failureProbability * 251.2} 251.2`}
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${failureProbability * 251.2} 251.2` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold font-mono" style={{ color: failureProbability > 0.7 ? '#f43f5e' : failureProbability > 0.4 ? '#f59e0b' : '#34d399' }}>
                    {Math.round(failureProbability * 100)}%
                  </span>
                </div>
              </div>
              <StatusBadge
                status={riskLevel === 'high' || riskLevel === 'critical' ? 'failure' : riskLevel === 'medium' ? 'warning' : 'success'}
                label={`${riskLevel.toUpperCase()} RISK`}
                size="md"
              />
              <div className="w-full mt-5 space-y-2">
                {(prediction.likely_causes || []).slice(0, 3).map((cause: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary truncate mr-2">{cause.cause}</span>
                    <span className="font-mono text-crimson font-medium">{Math.round(cause.confidence * 100)}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-violet mx-auto mb-2" />
              ) : (
                <Brain className="w-8 h-8 text-text-muted mx-auto mb-2" />
              )}
              <p className="text-xs text-text-muted">{loading ? 'Analyzing repo...' : 'AI prediction unavailable'}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Commits + Runs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Commits */}
        <motion.div variants={fadeUp} className="bg-graphite-light/80 border border-graphite-border/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-text-secondary font-medium">Recent Commits</h3>
            <span className="text-[10px] text-text-muted font-mono">{commits.length} commits</span>
          </div>
          <div className="space-y-1.5">
            {commits.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">No commits found</p>
            ) : (
              commits.slice(0, 6).map((commit: any) => (
                <a key={commit.full_sha || commit.sha} href={commit.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-graphite-hover/40 transition-colors duration-200 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-violet/8 border border-violet/12 flex items-center justify-center text-[10px] font-bold text-violet flex-shrink-0">
                    {commit.author?.slice(0, 2).toUpperCase() || '??'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary truncate group-hover:text-white transition-colors">{commit.message}</p>
                    <p className="text-[10px] text-text-muted font-mono mt-0.5">{commit.sha} · {commit.author}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Runs */}
        <motion.div variants={fadeUp} className="bg-graphite-light/80 border border-graphite-border/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-text-secondary font-medium">Recent Workflow Runs</h3>
            <span className="text-[10px] text-text-muted font-mono">{runs.length} runs</span>
          </div>
          <div className="space-y-1.5">
            {runs.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">No workflow runs found</p>
            ) : (
              runs.slice(0, 6).map((run: any) => (
                <a key={run.id} href={run.html_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl hover:bg-graphite-hover/40 transition-colors duration-200 group cursor-pointer block">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-primary truncate mr-2 group-hover:text-white transition-colors">{run.name}</span>
                    <StatusBadge status={run.conclusion === 'success' ? 'success' : run.conclusion === 'failure' ? 'failure' : 'pending'} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-text-muted">{run.head_sha} · {run.head_branch}</span>
                    <span className="text-[10px] font-mono text-text-muted">{run.duration}s</span>
                  </div>
                </a>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Summary */}
      {prediction?.summary && (
        <motion.div variants={fadeUp} className="bg-graphite-light/80 border border-graphite-border/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-violet" />
            <h3 className="text-sm text-text-secondary font-medium">AI Analysis Summary</h3>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{prediction.summary}</p>
          {prediction.recommendations && prediction.recommendations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-graphite-border/30">
              <p className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-2">Recommendations</p>
              <ul className="space-y-1.5">
                {prediction.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-neon-green mt-0.5">•</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
