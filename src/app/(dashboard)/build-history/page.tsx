'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { mockBuilds } from '@/lib/mock-data';
import { Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react';

type SortField = 'timestamp' | 'predictionScore' | 'duration';

const container = {
  initial: {},
  animate: { transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function BuildHistoryPage() {
  const [search, setSearch] = useState('');
  const [filterResult, setFilterResult] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let data = [...mockBuilds];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(b => b.commitId.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.message.toLowerCase().includes(q));
    }
    if (filterResult !== 'all') data = data.filter(b => b.actualResult === filterResult);
    data.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'timestamp') cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      else if (sortField === 'predictionScore') cmp = a.predictionScore - b.predictionScore;
      else if (sortField === 'duration') cmp = a.duration - b.duration;
      return sortAsc ? cmp : -cmp;
    });
    return data;
  }, [search, filterResult, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const filterCounts = useMemo(() => ({
    all: mockBuilds.length,
    success: mockBuilds.filter(b => b.actualResult === 'success').length,
    failure: mockBuilds.filter(b => b.actualResult === 'failure').length,
    warning: mockBuilds.filter(b => b.actualResult === 'warning').length,
  }), []);

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}><h1 className="text-2xl font-bold text-text-primary tracking-tight">Build History</h1><p className="text-sm text-text-secondary mt-1">Complete pipeline execution log</p></motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by commit, author, or message..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-graphite-light/80 border border-graphite-border/40 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-violet/30 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.05)] transition-all duration-200 font-mono" />
        </div>
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted mr-1" />
          {(['all', 'success', 'failure', 'warning'] as const).map(r => (
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
                  { label: 'Author', field: null },
                  { label: 'Message', field: null },
                  { label: 'Files', field: null },
                  { label: 'Prediction', field: 'predictionScore' as SortField },
                  { label: 'Result', field: null },
                  { label: 'Fix', field: null },
                  { label: 'Duration', field: 'duration' as SortField },
                ].map(col => (
                  <th key={col.label} className={`py-3 px-2.5 text-left text-[11px] font-mono text-text-muted uppercase tracking-wider ${col.field ? 'cursor-pointer hover:text-text-secondary transition-colors' : ''}`} onClick={() => col.field && toggleSort(col.field)}>
                    <span className="flex items-center gap-1">{col.label}{col.field && <ArrowUpDown className="w-3 h-3 opacity-50" />}</span>
                  </th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((build, i) => (
                  <motion.tr key={build.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-graphite-border/20 hover:bg-graphite-hover/30 transition-colors duration-200 group cursor-pointer">
                    <td className="py-3.5 px-2.5 font-mono text-xs text-violet">{build.commitId}</td>
                    <td className="py-3.5 px-2.5 text-text-secondary">{build.author}</td>
                    <td className="py-3.5 px-2.5 text-text-primary max-w-[200px] truncate group-hover:text-white transition-colors">{build.message}</td>
                    <td className="py-3.5 px-2.5 text-text-muted font-mono">{build.filesChanged}</td>
                    <td className="py-3.5 px-2.5 font-mono font-bold" style={{ color: build.predictionScore > 0.7 ? '#f43f5e' : build.predictionScore > 0.4 ? '#f59e0b' : '#34d399' }}>
                      {(build.predictionScore * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-2.5"><StatusBadge status={build.actualResult as 'success' | 'failure' | 'warning'} /></td>
                    <td className="py-3.5 px-2.5">{build.fixApplied ? <span className="text-xs font-mono text-neon-green">✓ {build.fixApplied}</span> : <span className="text-xs text-text-muted">—</span>}</td>
                    <td className="py-3.5 px-2.5 font-mono text-text-secondary">{build.duration}s</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}
