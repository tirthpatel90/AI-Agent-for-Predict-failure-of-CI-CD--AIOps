'use client';
import Link from 'next/link';
import { Search, Zap, Bell, Command, ChevronDown, GitBranch } from 'lucide-react';
import { useRepo } from '@/lib/RepoContext';
import { useState, useRef, useEffect } from 'react';

export default function TopBar() {
  const { connectedRepos, selectedRepo, selectRepo } = useRepo();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="flex items-center justify-between px-6 py-3 bg-graphite/70 backdrop-blur-2xl border-b border-graphite-border/20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet to-electric flex items-center justify-center shadow-md shadow-violet/15 transition-shadow group-hover:shadow-lg group-hover:shadow-violet/25">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-mono font-bold text-sm tracking-wider text-text-primary">AutoHeal</span>
        </Link>

        {/* Repo Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-graphite-lighter/40 border border-graphite-border/30 hover:border-graphite-border/50 transition-all duration-200 text-sm"
          >
            <GitBranch className="w-3.5 h-3.5 text-violet" />
            <span className="text-text-primary font-mono text-xs max-w-[180px] truncate">
              {selectedRepo ? selectedRepo.full_name : 'No repo selected'}
            </span>
            <ChevronDown className={`w-3 h-3 text-text-muted transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full mt-2 left-0 w-72 bg-graphite-light border border-graphite-border/40 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
              {connectedRepos.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-text-muted">No repos connected</p>
                  <Link href="/repositories" onClick={() => setShowDropdown(false)} className="text-xs text-violet hover:text-violet/80 transition-colors mt-1 inline-block">
                    + Connect a repo
                  </Link>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {connectedRepos.map((repo) => (
                    <button
                      key={repo.full_name}
                      onClick={() => { selectRepo(repo); setShowDropdown(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-graphite-hover/40 transition-colors duration-200 border-b border-graphite-border/20 last:border-0 ${
                        selectedRepo?.full_name === repo.full_name ? 'bg-violet/5 border-l-2 border-l-violet' : ''
                      }`}
                    >
                      <GitBranch className="w-4 h-4 text-violet flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-mono text-text-primary truncate">{repo.full_name}</p>
                        <p className="text-[10px] text-text-muted">{repo.language} · ⭐ {repo.stars}</p>
                      </div>
                      {selectedRepo?.full_name === repo.full_name && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet flex-shrink-0" />
                      )}
                    </button>
                  ))}
                  <Link
                    href="/repositories"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2.5 text-xs text-violet hover:bg-graphite-hover/40 transition-colors text-center border-t border-graphite-border/30"
                  >
                    + Connect another repo
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted transition-colors group-focus-within:text-text-secondary" />
            <input
              type="text"
              placeholder="Search pipelines, commits, errors..."
              className="w-full pl-10 pr-16 py-2 rounded-xl bg-graphite-lighter/40 border border-graphite-border/30 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-violet/30 focus:bg-graphite-lighter/60 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.05)] transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-graphite-border/30 text-[10px] text-text-muted font-mono">
              <Command className="w-2.5 h-2.5" />K
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-green/6 border border-neon-green/10">
            <span className="relative flex items-center justify-center w-2 h-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
              <span className="absolute w-2 h-2 rounded-full bg-neon-green animate-ping opacity-30" />
            </span>
            <span className="text-[11px] text-neon-green/80 font-mono font-medium">Online</span>
          </div>
          <button className="relative p-2 rounded-xl hover:bg-graphite-lighter/50 text-text-muted hover:text-text-secondary transition-all duration-200 group">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet shadow-sm shadow-violet/50">
              <span className="absolute inset-0 rounded-full bg-violet animate-ping opacity-40" />
            </span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-electric flex items-center justify-center text-[11px] font-bold text-white shadow-md shadow-violet/15 ring-2 ring-graphite ring-offset-0">
            AH
          </div>
        </div>
      </div>
    </header>
  );
}
