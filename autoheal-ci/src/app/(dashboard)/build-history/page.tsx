'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { useRepo } from '@/lib/RepoContext';
import * as api from '@/lib/api';
import { Search, ArrowUpDown, SlidersHorizontal, GitBranch, Plus, Loader2, ExternalLink } from 'lucide-react';

type SortField = 'created_at' | 'duration';

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function BuildHistoryPage() {
  const { selectedRepo } = useRepo();
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterResult, setFilterResult] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    if (!selectedRepo) { setRuns([]); return; }
    async function fetchRuns() {
      setLoading(true);
      try {
        const data = await api.getRepoRuns(selectedRepo!.owner, selectedRepo!.repo, 30);
        setRuns(data?.runs || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchRuns();
  }, [selectedRepo]);

  const filtered = useMemo(() => {
    let data = [...runs];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.head_sha?.toLowerCase().includes(q) ||
        r.name?.toLowerCase().includes(q) ||
        r.head_branch?.toLowerCase().includes(q) ||
        r.head_commit?.message?.toLowerCase().includes(q) ||
        r.actor?.login?.toLowerCase().includes(q)
      );
    }
    if (filterResult !== 'all') data = data.filter(r => r.conclusion === filterResult);
    data.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'created_at') cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortField === 'duration') cmp = (a.duration || 0) - (b.duration || 0);
      return sortAsc ? cmp : -cmp;
    });
    return data;
  }, [runs, search, filterResult, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const filterCounts = useMemo(() => ({
    all: runs.length,
    success: runs.filter(r => r.conclusion === 'success').length,
    failure: runs.filter(r => r.conclusion === 'failure').length,
    cancelled: runs.filter(r => r.conclusion === 'cancelled').length,
  }), [runs]);

  // Empty state
  if (!selectedRepo) {
    return (
      <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
        <motion.div variants={fadeUp}><h1 className="text-2xl font-bold text-text-primary tracking-tight">Build History</h1><p className="text-sm text-text-secondary mt-1">Complete pipeline execution log</p></motion.div>
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-graphite-lighter/50 border border-graphite-border/40 flex items-center justify-center mb-4"><GitBranch className="w-7 h-7 text-text-muted" /></div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No repository selected</h3>
          <p className="text-sm text-text-muted text-center max-w-md mb-6">Select a connected repository to view its build history.</p>
          <a href="/repositories" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-electric text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet/20 transition-all"><Plus className="w-4 h-4" /> Connect Repository</a>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Build History</h1>
        <p className="text-sm text-text-secondary mt-1">Workflow runs for <span className="text-violet font-mono">{selectedRepo.full_name}</span></p>
      </motion.div>

      {loading && (
        <motion.div variants={fadeUp} className="flex items-center gap-2 text-violet">
          <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm font-mono">Loading builds...</span>
        </motion.div>
      )}

      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by commit, branch, or author..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-graphite-light/80 border border-graphite-border/40 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-violet/30 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.05)] transition-all duration-200 font-mono" />
        </div>
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted mr-1" />
          {(['all', 'success', 'failure', 'cancelled'] as const).map(r => (
            <button key={r} onClick={() => setFilterResult(r)} className={`px-3 py-2 rounded-xl text-[11px] font-mono border transition-all duration-200 ${filterResult === r ? 'bg-violet/10 text-violet border-violet/20' : 'bg-graphite-lighter/50 text-text-muted border-graphite-border/30 hover:text-text-secondary hover:border-graphite-border/50'}`}>
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="ml-1.5 text-[10px] opacity-60">{filterCounts[r]}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="none" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-graphite-border/40">
                {[
                  { label: 'Commit', field: null },
                  { label: 'Workflow', field: null },
                  { label: 'Branch', field: null },
                  { label: 'Event', field: null },
                  { label: 'Actor', field: null },
                  { label: 'Result', field: null },
                  { label: 'Duration', field: 'duration' as SortField },
                  { label: 'Link', field: null },
                ].map(col => (
                  <th key={col.label} className={`py-3 px-2.5 text-left text-[11px] font-mono text-text-muted uppercase tracking-wider ${col.field ? 'cursor-pointer hover:text-text-secondary transition-colors' : ''}`} onClick={() => col.field && toggleSort(col.field)}>
                    <span className="flex items-center gap-1">{col.label}{col.field && <ArrowUpDown className="w-3 h-3 opacity-50" />}</span>
                  </th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-8 text-center text-text-muted text-sm">No workflow runs found</td></tr>
                ) : (
                  filtered.map((run, i) => (
                    <motion.tr key={run.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-graphite-border/20 hover:bg-graphite-hover/30 transition-colors duration-200 group">
                      <td className="py-3.5 px-2.5 font-mono text-xs text-violet">{run.head_sha}</td>
                      <td className="py-3.5 px-2.5 text-text-primary max-w-[180px] truncate group-hover:text-white transition-colors">{run.name}</td>
                      <td className="py-3.5 px-2.5 text-text-secondary font-mono text-xs">{run.head_branch}</td>
                      <td className="py-3.5 px-2.5 text-text-muted text-xs">{run.event}</td>
                      <td className="py-3.5 px-2.5 text-text-secondary">{run.actor?.login || 'N/A'}</td>
                      <td className="py-3.5 px-2.5">
                        <StatusBadge status={run.conclusion === 'success' ? 'success' : run.conclusion === 'failure' ? 'failure' : 'warning'} label={run.conclusion || run.status} />
                      </td>
                      <td className="py-3.5 px-2.5 font-mono text-text-secondary">{run.duration}s</td>
                      <td className="py-3.5 px-2.5">
                        <a href={run.html_url} target="_blank" rel="noopener noreferrer" className="text-violet hover:text-violet/80 transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}
