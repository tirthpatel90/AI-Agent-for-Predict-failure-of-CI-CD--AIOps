'use client';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import StatusBadge from '@/components/ui/StatusBadge';
import { mockCommits, mockLearningStats, mockFixAttempts, mockPrediction } from '@/lib/mock-data';
import {
  Activity, TrendingUp, Wrench, Clock, Brain, GitCommit, Zap, ArrowUpRight, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const failureData = [
  { commit: '1', prob: 0.12 },
  { commit: '2', prob: 0.67 },
  { commit: '3', prob: 0.78 },
  { commit: '4', prob: 0.34 },
  { commit: '5', prob: 0.89 },
  { commit: '6', prob: 0.15 },
  { commit: '7', prob: 0.45 },
  { commit: '8', prob: 0.56 },
];

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function OverviewPage() {
  const metrics = [
    { label: 'Pipeline Health', value: 87, suffix: '%', color: '#34d399', icon: Activity, trend: '+3.2%', trendUp: true, accentBorder: 'border-l-neon-green' },
    { label: 'Prediction Accuracy', value: mockLearningStats.predictionAccuracy * 100, suffix: '%', color: '#8b5cf6', icon: Brain, trend: '+5.1%', trendUp: true, accentBorder: 'border-l-violet' },
    { label: 'Auto-Fix Rate', value: mockLearningStats.autoFixSuccessRate * 100, suffix: '%', color: '#f59e0b', icon: Wrench, trend: `${mockLearningStats.successfulFixes}/${mockLearningStats.totalFixAttempts}`, trendUp: false, accentBorder: 'border-l-amber' },
    { label: 'Time Saved', value: mockLearningStats.computeTimeSaved, suffix: 'h', color: '#22d3ee', icon: Clock, trend: 'compute hrs', trendUp: false, accentBorder: 'border-l-cyan', decimals: 1 },
  ];

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-5">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Welcome back — here&apos;s your infrastructure status</p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-green/6 border border-neon-green/10">
          <span className="relative flex items-center justify-center w-2 h-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
            <span className="absolute w-2 h-2 rounded-full bg-neon-green animate-ping opacity-30" />
          </span>
          <span className="text-[11px] text-neon-green/80 font-mono font-medium">All systems nominal</span>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric, i) => {
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
        {/* Large chart */}
        <motion.div variants={fadeUp} className="lg:col-span-3 bg-graphite-light/80 border border-graphite-border/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-text-secondary font-medium">Failure Probability — Recent Commits</h3>
            <span className="text-[11px] text-text-muted font-mono px-2 py-0.5 rounded-lg bg-graphite-lighter/50">Last 8 commits</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={failureData}>
                <defs>
                  <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="commit" stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={(v) => `${(Number(v) * 100).toFixed(0)}%`} />
                <Tooltip
                  contentStyle={{ background: '#11131a', border: '1px solid #252836', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Failure Prob.']}
                />
                <Area type="monotone" dataKey="prob" stroke="#f43f5e" fill="url(#probGradient)" strokeWidth={2} dot={{ fill: '#f43f5e', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, stroke: '#f43f5e', strokeWidth: 2, fill: '#11131a' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Prediction gauge */}
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-graphite-light/80 border border-graphite-border/40 border-t-2 border-t-crimson/30 rounded-2xl p-5 flex flex-col items-center justify-center">
          <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-4">Latest Prediction</p>
          <div className="relative w-32 h-32 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1d28" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r="40" fill="none"
                stroke={mockPrediction.failureProbability > 0.7 ? '#f43f5e' : mockPrediction.failureProbability > 0.4 ? '#f59e0b' : '#34d399'}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${mockPrediction.failureProbability * 251.2} 251.2`}
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{ strokeDasharray: `${mockPrediction.failureProbability * 251.2} 251.2` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold font-mono text-crimson">{(mockPrediction.failureProbability * 100).toFixed(0)}%</span>
            </div>
          </div>
          <StatusBadge status="failure" label="High Risk" size="md" />
          <div className="w-full mt-5 space-y-2">
            {mockPrediction.likelyCauses.slice(0, 3).map((cause, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-text-secondary truncate mr-2">{cause.cause}</span>
                <span className="font-mono text-crimson font-medium">{(cause.confidence * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Commits + Fixes + Learning */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recent Commits */}
        <motion.div variants={fadeUp} className="bg-graphite-light/80 border border-graphite-border/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-text-secondary font-medium">Recent Commits</h3>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </div>
          <div className="space-y-1.5">
            {mockCommits.slice(0, 4).map((commit) => (
              <div key={commit.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-graphite-hover/40 transition-colors duration-200 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-violet/8 border border-violet/12 flex items-center justify-center text-[10px] font-bold text-violet flex-shrink-0">
                  {commit.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-primary truncate group-hover:text-white transition-colors">{commit.message}</p>
                  <p className="text-[10px] text-text-muted font-mono mt-0.5">{commit.id} · {commit.timestamp}</p>
                </div>
                <span className="text-xs font-mono font-semibold" style={{ color: commit.predictionScore > 0.7 ? '#f43f5e' : commit.predictionScore > 0.4 ? '#f59e0b' : '#34d399' }}>
                  {(commit.predictionScore * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Auto Fix Attempts */}
        <motion.div variants={fadeUp} className="bg-graphite-light/80 border border-graphite-border/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-text-secondary font-medium">Recent Fixes</h3>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </div>
          <div className="space-y-1.5">
            {mockFixAttempts.slice(0, 4).map((fix) => (
              <div key={fix.id} className="p-2.5 rounded-xl hover:bg-graphite-hover/40 transition-colors duration-200 group cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-text-muted truncate mr-2">{fix.errorSignature}</span>
                  <StatusBadge status={fix.result === 'success' ? 'success' : fix.result === 'failure' ? 'failure' : 'pending'} />
                </div>
                <p className="text-xs font-mono text-neon-green/80 mt-1">
                  <span className="text-text-muted mr-1">$</span>{fix.command}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Learning Progress */}
        <motion.div variants={fadeUp} className="bg-graphite-light/80 border border-graphite-border/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-text-secondary font-medium">Learning Progress</h3>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLearningStats.learningGrowth}>
                <defs>
                  <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.12} /><stop offset="95%" stopColor="#34d399" stopOpacity={0} /></linearGradient>
                  <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.12} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#11131a', border: '1px solid #252836', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '11px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }} />
                <Area type="monotone" dataKey="errors" stroke="#34d399" fill="url(#eg)" strokeWidth={1.5} name="Errors Learned" />
                <Area type="monotone" dataKey="fixes" stroke="#8b5cf6" fill="url(#fg)" strokeWidth={1.5} name="Fixes Applied" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
