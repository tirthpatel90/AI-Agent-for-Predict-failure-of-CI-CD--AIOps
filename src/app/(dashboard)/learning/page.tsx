'use client';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { mockLearningStats, mockKnowledgeBase } from '@/lib/mock-data';
import { GraduationCap, Brain, Target, TrendingUp, Sparkles, Database, ArrowRight } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#34d399', '#8b5cf6', '#f59e0b', '#f43f5e', '#3b82f6'];

const errorTypeData = Object.entries(
  mockKnowledgeBase.reduce<Record<string, number>>((acc, e) => {
    acc[e.errorType] = (acc[e.errorType] || 0) + e.occurrenceCount;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function LearningPage() {
  const stats = mockLearningStats;
  const statCards = [
    { label: 'Errors Learned', value: stats.totalErrorsLearned, icon: Database, color: '#8b5cf6', accentBorder: 'border-l-violet' },
    { label: 'Fix Success Rate', value: stats.autoFixSuccessRate * 100, suffix: '%', icon: Target, color: '#34d399', accentBorder: 'border-l-neon-green' },
    { label: 'Prediction Accuracy', value: stats.predictionAccuracy * 100, suffix: '%', icon: Brain, color: '#f59e0b', accentBorder: 'border-l-amber' },
    { label: 'Total Fix Attempts', value: stats.totalFixAttempts, icon: Sparkles, color: '#3b82f6', accentBorder: 'border-l-electric' },
  ];

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Learning Engine</h1>
        <p className="text-sm text-text-secondary mt-1">Self-improving AI that learns from every pipeline run</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  <p className="text-2xl font-bold" style={{ color: card.color }}><AnimatedCounter target={card.value} suffix={card.suffix} /></p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlowCard glowColor="green" hover={false}>
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-neon-green" /><h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Learning Growth Over Time</h3></div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.learningGrowth}>
                  <defs>
                    <linearGradient id="errorsG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.15} /><stop offset="95%" stopColor="#34d399" stopOpacity={0} /></linearGradient>
                    <linearGradient id="fixesG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#11131a', border: '1px solid #252836', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }} />
                  <Area type="monotone" dataKey="errors" stroke="#34d399" fill="url(#errorsG)" strokeWidth={2} name="Errors Learned" />
                  <Area type="monotone" dataKey="fixes" stroke="#8b5cf6" fill="url(#fixesG)" strokeWidth={2} name="Fixes Applied" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlowCard glowColor="violet" hover={false}>
            <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-4">Error Type Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={errorTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {errorTypeData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.75} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#11131a', border: '1px solid #252836', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {errorTypeData.map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /><span className="text-text-secondary capitalize">{entry.name}</span></div>
                  <span className="font-mono text-text-primary">{entry.value}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>
      </div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="amber" hover={false}>
          <div className="flex items-center gap-2 mb-4"><GraduationCap className="w-4 h-4 text-amber" /><h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Prediction Accuracy Over Time</h3></div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.learningGrowth}>
                <XAxis dataKey="month" stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={(v) => `${(Number(v) * 100).toFixed(0)}%`} />
                <Tooltip contentStyle={{ background: '#11131a', border: '1px solid #252836', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }} formatter={(v) => `${(Number(v) * 100).toFixed(0)}%`} />
                <Line type="monotone" dataKey="accuracy" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, stroke: '#f59e0b', strokeWidth: 2, fill: '#11131a' }} name="Accuracy" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="violet" hover={false}>
          <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-6">Self-Learning Feedback Loop</h3>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {['Commit Pushed', 'AI Analyzes', 'Pipeline Runs', 'Result Collected', 'Knowledge Updated', 'Model Improves'].map((step, i) => (
                <motion.div key={step} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12, type: 'spring', stiffness: 300, damping: 20 }} className="flex items-center gap-2">
                  <div className="px-3.5 py-2 rounded-xl bg-violet/8 border border-violet/15 text-sm text-violet font-mono whitespace-nowrap hover:bg-violet/12 hover:border-violet/25 transition-all duration-200 cursor-default">{step}</div>
                  {i < 5 && <ArrowRight className="w-4 h-4 text-text-muted/40" />}
                </motion.div>
              ))}
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}
