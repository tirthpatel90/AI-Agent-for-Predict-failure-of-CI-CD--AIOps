'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { useRepo } from '@/lib/RepoContext';
import { GitBranch, Plus, ExternalLink, Star, Clock, X, Trash2, Check, Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react';

const container = { initial: {}, animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } } };

export default function RepositoriesPage() {
  const { connectedRepos, selectedRepo, selectRepo, connectRepo, disconnectRepo, isLoading, error } = useRepo();
  const [showConnect, setShowConnect] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState('');
  const [connectSuccess, setConnectSuccess] = useState('');

  const handleConnect = async () => {
    if (!repoUrl.trim()) return;
    setConnectLoading(true);
    setConnectError('');
    setConnectSuccess('');
    try {
      const repo = await connectRepo(repoUrl.trim());
      setConnectSuccess(`Connected ${repo.full_name} successfully!`);
      setRepoUrl('');
      setTimeout(() => { setConnectSuccess(''); setShowConnect(false); }, 2000);
    } catch (e: any) {
      setConnectError(e.message || 'Failed to connect repository');
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = async (owner: string, repo: string) => {
    if (!confirm(`Disconnect ${owner}/${repo}?`)) return;
    try {
      await disconnectRepo(owner, repo);
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Repositories</h1>
          <p className="text-sm text-text-secondary mt-1">Connect public GitHub repositories for AI-powered pipeline analysis</p>
          {isLoading && <p className="text-xs text-violet mt-1 animate-pulse">Syncing with backend...</p>}
          {error && <p className="text-xs text-amber mt-1">{error}</p>}
        </motion.div>
        <motion.div variants={fadeUp}>
          <button onClick={() => setShowConnect(!showConnect)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet to-electric hover:shadow-lg hover:shadow-violet/20 text-white font-semibold transition-all duration-300 text-sm hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Connect Repository
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showConnect && (
          <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}>
            <GlowCard glowColor="violet">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text-primary">Connect a Public GitHub Repository</h3>
                <button onClick={() => { setShowConnect(false); setConnectError(''); setConnectSuccess(''); }} className="p-1.5 rounded-lg hover:bg-graphite-lighter/60 text-text-muted hover:text-text-secondary transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1.5">Repository URL or Owner/Repo</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                      placeholder="https://github.com/facebook/react  or  facebook/react"
                      className="w-full pl-10 bg-graphite/60 border border-graphite-border/40 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-violet/30 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.05)] transition-all duration-200 font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1.5">Works with any public GitHub repository. No token required.</p>
                </div>

                {connectError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-crimson/5 border border-crimson/15">
                    <AlertCircle className="w-4 h-4 text-crimson flex-shrink-0" />
                    <p className="text-xs text-crimson">{connectError}</p>
                  </div>
                )}

                {connectSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-neon-green/5 border border-neon-green/15">
                    <Check className="w-4 h-4 text-neon-green flex-shrink-0" />
                    <p className="text-xs text-neon-green">{connectSuccess}</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConnect}
                    disabled={connectLoading || !repoUrl.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet to-electric text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connectLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {connectLoading ? 'Connecting...' : 'Connect'}
                  </button>
                  <button onClick={() => { setShowConnect(false); setConnectError(''); setConnectSuccess(''); }} className="px-5 py-2.5 bg-graphite-lighter/60 border border-graphite-border/40 text-text-secondary hover:text-text-primary rounded-xl text-sm transition-all duration-200">Cancel</button>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {connectedRepos.length === 0 && !isLoading && (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-graphite-lighter/50 border border-graphite-border/40 flex items-center justify-center mb-4">
            <GitBranch className="w-7 h-7 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No repositories connected</h3>
          <p className="text-sm text-text-muted text-center max-w-md mb-6">Connect a public GitHub repository to start analyzing CI/CD pipelines with AI-powered predictions.</p>
          <button onClick={() => setShowConnect(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-electric text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet/20 transition-all duration-300 hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Connect Your First Repository
          </button>
        </motion.div>
      )}

      {/* Repo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectedRepos.map((repo) => (
          <motion.div key={repo.full_name} variants={fadeUp}>
            <GlowCard glowColor={selectedRepo?.full_name === repo.full_name ? 'green' : 'none'}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${selectedRepo?.full_name === repo.full_name ? 'bg-violet/10 border-violet/20' : 'bg-graphite/60 border-graphite-border/40'}`}>
                    <GitBranch className="w-5 h-5 text-violet" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{repo.name}</h3>
                    <p className="text-[11px] text-text-muted font-mono">{repo.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedRepo?.full_name === repo.full_name && (
                    <StatusBadge status="success" label="Active" />
                  )}
                  <StatusBadge status="success" label="Connected" />
                </div>
              </div>

              {repo.description && (
                <p className="text-xs text-text-secondary mb-3 line-clamp-2">{repo.description}</p>
              )}

              <div className="grid grid-cols-3 gap-2.5 mb-3">
                <div className="text-center p-2.5 rounded-xl bg-graphite/30 border border-graphite-border/20">
                  <p className="text-[10px] text-text-muted">Language</p>
                  <p className="text-sm font-mono text-text-primary font-medium">{repo.language}</p>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-graphite/30 border border-graphite-border/20">
                  <p className="text-[10px] text-text-muted">Stars</p>
                  <p className="text-sm font-mono text-text-primary font-medium">{repo.stars}</p>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-graphite/30 border border-graphite-border/20">
                  <p className="text-[10px] text-text-muted">Forks</p>
                  <p className="text-sm font-mono text-text-primary font-medium">{repo.forks}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stars}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{repo.last_push ? new Date(repo.last_push).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectRepo(repo)}
                    className={`flex items-center gap-1 font-medium transition-colors ${selectedRepo?.full_name === repo.full_name ? 'text-neon-green' : 'text-violet hover:text-violet/80'}`}
                  >
                    {selectedRepo?.full_name === repo.full_name ? <Check className="w-3 h-3" /> : null}
                    {selectedRepo?.full_name === repo.full_name ? 'Selected' : 'Select'}
                  </button>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-violet hover:text-violet/80 transition-colors font-medium">
                    <ExternalLink className="w-3 h-3" /> View
                  </a>
                  <button
                    onClick={() => handleDisconnect(repo.owner, repo.repo)}
                    className="flex items-center gap-1 text-crimson/60 hover:text-crimson transition-colors font-medium"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
