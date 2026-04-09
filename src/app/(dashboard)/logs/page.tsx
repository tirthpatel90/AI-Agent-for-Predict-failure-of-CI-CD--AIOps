'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import { mockSystemLogs } from '@/lib/mock-data';
import { Filter, AlertCircle, AlertTriangle, Info, Terminal } from 'lucide-react';

type LogLevel = 'all' | 'info' | 'warning' | 'error';

const levelConfig = {
  info: { icon: Info, color: 'text-neon-green', borderLeft: 'border-l-neon-green' },
  warning: { icon: AlertTriangle, color: 'text-amber', borderLeft: 'border-l-amber' },
  error: { icon: AlertCircle, color: 'text-crimson', borderLeft: 'border-l-crimson' },
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function LogsPage() {
  const [levelFilter, setLevelFilter] = useState<LogLevel>('all');
  const filtered = useMemo(() => levelFilter === 'all' ? mockSystemLogs : mockSystemLogs.filter(l => l.level === levelFilter), [levelFilter]);
  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <motion.div initial="initial" animate="animate" className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div variants={fadeUp}><h1 className="text-2xl font-bold text-text-primary tracking-tight">System Logs</h1><p className="text-sm text-text-secondary mt-1">Real-time system event log stream</p></motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-text-muted mr-1" />
          {(['all', 'info', 'warning', 'error'] as LogLevel[]).map(l => (
            <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-1.5 rounded-xl text-[11px] font-mono border transition-all duration-200 ${levelFilter === l ? 'bg-violet/10 text-violet border-violet/20' : 'bg-graphite-lighter/50 text-text-muted border-graphite-border/30 hover:text-text-secondary'}`}>
              {l === 'all' ? 'All' : l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </motion.div>
      </div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="none" hover={false}>
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-graphite-border/30">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-crimson/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" />
            </div>
            <Terminal className="w-3.5 h-3.5 text-text-muted ml-1" />
            <span className="text-[11px] font-mono text-text-muted">system-logs / autoheal-ci</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="relative flex w-2 h-2"><span className="w-1.5 h-1.5 rounded-full bg-neon-green" /><span className="absolute w-2 h-2 rounded-full bg-neon-green animate-ping opacity-30" /></span>
              <span className="text-[11px] font-mono text-neon-green font-medium">LIVE</span>
            </span>
          </div>
          <div className="bg-graphite/60 rounded-xl border border-graphite-border/30 p-4 font-mono text-xs space-y-0.5 max-h-[600px] overflow-y-auto">
            {filtered.map((log, i) => {
              const config = levelConfig[log.level as keyof typeof levelConfig];
              const Icon = config.icon;
              return (
                <motion.div key={log.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className={`flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-graphite-hover/30 transition-colors border-l-2 border-l-transparent hover:${config.borderLeft}`}>
                  <span className="text-text-muted/60 whitespace-nowrap select-none tabular-nums">{formatTime(log.timestamp)}</span>
                  <span className={`flex items-center gap-1 w-16 flex-shrink-0 ${config.color}`}><Icon className="w-3 h-3" />{log.level.toUpperCase()}</span>
                  <span className="text-violet/70 w-24 flex-shrink-0 truncate">[{log.service}]</span>
                  <span className="text-text-secondary">{log.message}</span>
                </motion.div>
              );
            })}
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}
