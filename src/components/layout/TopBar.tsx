'use client';
import Link from 'next/link';
import { Search, Zap, Bell, Command } from 'lucide-react';

export default function TopBar() {
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
