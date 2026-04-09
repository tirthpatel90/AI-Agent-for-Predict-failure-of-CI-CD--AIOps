'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  GitBranch,
  Workflow,
  Brain,
  Wrench,
  History,
  GraduationCap,
  ScrollText,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Repositories', href: '/repositories', icon: GitBranch },
  { label: 'Pipelines', href: '/pipelines', icon: Workflow },
  { label: 'AI Predictions', href: '/predictions', icon: Brain },
  { label: 'Auto Fix Engine', href: '/auto-fix', icon: Wrench },
  { label: 'Build History', href: '/build-history', icon: History },
  { label: 'Learning Engine', href: '/learning', icon: GraduationCap },
  { label: 'System Logs', href: '/logs', icon: ScrollText },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`
        fixed top-0 left-0 h-screen z-40
        bg-graphite-light/50 backdrop-blur-2xl
        border-r border-graphite-border
        flex flex-col
        transition-all duration-300
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-graphite-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-neon-green flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-graphite" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono font-bold text-sm tracking-wider text-text-primary"
          >
            AutoHeal CI
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 group cursor-pointer
                  ${isActive
                    ? 'bg-violet/10 text-violet'
                    : 'text-text-secondary hover:bg-graphite-lighter hover:text-text-primary'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-violet' : 'text-text-muted group-hover:text-text-secondary'}`} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-graphite-border p-2 flex-shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-graphite-lighter transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
