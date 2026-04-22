'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import { useRepo } from '@/lib/RepoContext';
import * as api from '@/lib/api';
import { Filter, AlertCircle, AlertTriangle, Info, Terminal, GitBranch, Plus, Loader2, ChevronDown } from 'lucide-react';

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

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  service: string;
  message: string;
}

export default function LogsPage() {
  const { selectedRepo } = useRepo();
  const [levelFilter, setLevelFilter] = useState<LogLevel>('all');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);

  // Fetch workflow runs first
  useEffect(() => {
    if (!selectedRepo) { setRuns([]); setLogs([]); return; }
    async function fetchRuns() {
      setLoading(true);
      try {
        const data = await api.getRepoRuns(selectedRepo!.owner, selectedRepo!.repo, 10);
        const fetchedRuns = data?.runs || [];
        setRuns(fetchedRuns);

        // Build log entries from run data
        const logEntries: LogEntry[] = fetchedRuns.map((r: any, i: number) => {
          const level: 'info' | 'warning' | 'error' = r.conclusion === 'failure' ? 'error' : r.conclusion === 'cancelled' ? 'warning' : 'info';
          return {
            id: `run-${r.id}`,
            timestamp: r.created_at,
            level,
            service: r.name || 'workflow',
            message: `${r.conclusion === 'success' ? '✓' : r.conclusion === 'failure' ? '✗' : '⚠'} ${r.name} — ${r.conclusion || r.status} (${r.head_branch}, ${r.head_sha}, ${r.duration}s)`,
          };
        });
        setLogs(logEntries);

        // Auto-select first run for detailed logs
        if (fetchedRuns.length > 0) {
          setSelectedRunId(fetchedRuns[0].id);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchRuns();
  }, [selectedRepo]);

  // Fetch detailed logs for the selected run
  const [jobLogs, setJobLogs] = useState<any[]>([]);
  const [jobLogsLoading, setJobLogsLoading] = useState(false);

  useEffect(() => {
    if (!selectedRepo || !selectedRunId) { setJobLogs([]); return; }
    async function fetchJobLogs() {
      setJobLogsLoading(true);
      try {
        const data = await api.getRunLogs(selectedRepo!.owner, selectedRepo!.repo, selectedRunId!);
        setJobLogs(data?.jobs || []);
      } catch (e) { console.error(e); }
      finally { setJobLogsLoading(false); }
    }
    fetchJobLogs();
  }, [selectedRepo, selectedRunId]);

  const filtered = useMemo(() => levelFilter === 'all' ? logs : logs.filter(l => l.level === levelFilter), [levelFilter, logs]);
  const formatTime = (ts: string) => ts ? new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';

  // Empty state
  if (!selectedRepo) {
    return (
      <motion.div initial="initial" animate="animate" className="space-y-6">
        <motion.div variants={fadeUp}><h1 className="text-2xl font-bold text-text-primary tracking-tight">System Logs</h1><p className="text-sm text-text-secondary mt-1">Real-time CI/CD log stream</p></motion.div>
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-graphite-lighter/50 border border-graphite-border/40 flex items-center justify-center mb-4"><GitBranch className="w-7 h-7 text-text-muted" /></div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No repository selected</h3>
          <p className="text-sm text-text-muted text-center max-w-md mb-6">Select a connected repository to view its CI/CD logs.</p>
          <a href="/repositories" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-electric text-white font-semibold text-sm"><Plus className="w-4 h-4" /> Connect Repository</a>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="animate" className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">System Logs</h1>
          <p className="text-sm text-text-secondary mt-1">CI/CD logs for <span className="text-violet font-mono">{selectedRepo.full_name}</span></p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-text-muted mr-1" />
          {(['all', 'info', 'warning', 'error'] as LogLevel[]).map(l => (
            <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-1.5 rounded-xl text-[11px] font-mono border transition-all duration-200 ${levelFilter === l ? 'bg-violet/10 text-violet border-violet/20' : 'bg-graphite-lighter/50 text-text-muted border-graphite-border/30 hover:text-text-secondary'}`}>
              {l === 'all' ? 'All' : l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </motion.div>
      </div>

      {loading && (
        <motion.div variants={fadeUp} className="flex items-center gap-2 text-violet">
          <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm font-mono">Loading logs...</span>
        </motion.div>
      )}

      {/* Run selector */}
      {runs.length > 0 && (
        <motion.div variants={fadeUp} className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted font-mono">Run:</span>
          <select
            value={selectedRunId || ''}
            onChange={(e) => setSelectedRunId(Number(e.target.value))}
            className="bg-graphite-lighter/40 border border-graphite-border/30 rounded-xl px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none focus:border-violet/30 transition-all"
          >
            {runs.map((r: any) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.conclusion || r.status} ({r.head_sha})
              </option>
            ))}
          </select>
        </motion.div>
      )}

      {/* Workflow run overview logs */}
      <motion.div variants={fadeUp}>
        <GlowCard glowColor="none" hover={false}>
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-graphite-border/30">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-crimson/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" />
            </div>
            <Terminal className="w-3.5 h-3.5 text-text-muted ml-1" />
            <span className="text-[11px] font-mono text-text-muted">logs / {selectedRepo.full_name}</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="relative flex w-2 h-2"><span className="w-1.5 h-1.5 rounded-full bg-neon-green" /><span className="absolute w-2 h-2 rounded-full bg-neon-green animate-ping opacity-30" /></span>
              <span className="text-[11px] font-mono text-neon-green font-medium">LIVE</span>
            </span>
          </div>
          <div className="bg-graphite/60 rounded-xl border border-graphite-border/30 p-4 font-mono text-xs space-y-0.5 max-h-[350px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-text-muted text-center py-6">No logs found</p>
            ) : (
              filtered.map((log, i) => {
                const config = levelConfig[log.level];
                const Icon = config.icon;
                return (
                  <motion.div key={log.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className={`flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-graphite-hover/30 transition-colors border-l-2 border-l-transparent hover:${config.borderLeft}`}>
                    <span className="text-text-muted/60 whitespace-nowrap select-none tabular-nums">{formatTime(log.timestamp)}</span>
                    <span className={`flex items-center gap-1 w-16 flex-shrink-0 ${config.color}`}><Icon className="w-3 h-3" />{log.level.toUpperCase()}</span>
                    <span className="text-violet/70 w-24 flex-shrink-0 truncate">[{log.service}]</span>
                    <span className="text-text-secondary">{log.message}</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </GlowCard>
      </motion.div>

      {/* Detailed job steps for selected run */}
      {selectedRunId && (
        <motion.div variants={fadeUp}>
          <GlowCard glowColor="violet" hover={false}>
            <h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-4">Job Details — Run #{selectedRunId}</h3>
            {jobLogsLoading ? (
              <div className="flex items-center gap-2 text-violet py-4"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Loading job details...</span></div>
            ) : jobLogs.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">No job details available</p>
            ) : (
              <div className="space-y-3">
                {jobLogs.map((job: any) => (
                  <div key={job.id} className="p-3 rounded-xl bg-graphite/30 border border-graphite-border/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-primary font-medium">{job.name}</span>
                      <span className={`text-xs font-mono font-medium ${job.conclusion === 'success' ? 'text-neon-green' : job.conclusion === 'failure' ? 'text-crimson' : 'text-amber'}`}>{job.conclusion || job.status}</span>
                    </div>
                    <div className="space-y-1">
                      {(job.steps || []).map((step: any) => (
                        <div key={step.number} className="flex items-center gap-2 text-xs">
                          <span className={`w-4 text-center ${step.conclusion === 'success' ? 'text-neon-green' : step.conclusion === 'failure' ? 'text-crimson' : step.conclusion === 'skipped' ? 'text-text-muted' : 'text-amber'}`}>
                            {step.conclusion === 'success' ? '✓' : step.conclusion === 'failure' ? '✗' : step.conclusion === 'skipped' ? '—' : '●'}
                          </span>
                          <span className="text-text-secondary">{step.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlowCard>
        </motion.div>
      )}
    </motion.div>
  );
}
