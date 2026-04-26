'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NetworkBackground from '@/components/home/NetworkBackground';
import HeroPipeline from '@/components/home/HeroPipeline';
import { Shield, Brain, Zap, GitBranch, BarChart3, RefreshCw, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Predictions', description: 'Analyze code changes and predict pipeline failures before execution begins.', color: '#8b5cf6', gradient: 'from-violet/10 to-violet/5' },
  { icon: Zap, title: 'Auto-Fix Engine', description: 'Automatically detect and repair common build failures in real-time.', color: '#34d399', gradient: 'from-neon-green/10 to-neon-green/5' },
  { icon: RefreshCw, title: 'Self-Learning', description: 'Continuously improve predictions and fixes from every pipeline run.', color: '#f59e0b', gradient: 'from-amber/10 to-amber/5' },
  { icon: Shield, title: 'Error Knowledge Base', description: 'Growing database of error signatures and proven fix strategies.', color: '#f43f5e', gradient: 'from-crimson/10 to-crimson/5' },
  { icon: BarChart3, title: 'Analytics', description: 'Track learning progress, fix success rates, and compute time saved.', color: '#3b82f6', gradient: 'from-electric/10 to-electric/5' },
  { icon: GitBranch, title: 'GitHub Integration', description: 'Connect repositories and analyze commits directly from your workflow.', color: '#22d3ee', gradient: 'from-cyan/10 to-cyan/5' },
];



const staggerChildren = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-graphite relative overflow-hidden">
      <NetworkBackground />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet to-electric flex items-center justify-center shadow-lg shadow-violet/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-mono font-bold text-sm tracking-wider text-text-primary">AutoHeal CI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/overview" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">Dashboard</Link>
          <Link href="https://github.com" target="_blank" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">GitHub</Link>
          <Link
            href="/overview"
            className="text-sm bg-gradient-to-r from-violet to-electric hover:shadow-lg hover:shadow-violet/25 text-white font-semibold px-5 py-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <motion.div variants={staggerChildren} initial="initial" animate="animate" className="flex flex-col items-center">
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet/8 border border-violet/15 text-violet text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered CI/CD Platform
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            <span className="text-text-primary">CI/CD That </span>
            <span className="bg-gradient-to-r from-violet via-electric to-cyan bg-clip-text text-transparent animate-gradient">
              Fixes Itself
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed">
            Predict failures before they happen. Let AI repair them automatically.
            A self-learning system that gets smarter with every build.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-20">
            <Link
              href="/repositories"
              className="group flex items-center gap-2 bg-gradient-to-r from-violet to-electric hover:shadow-xl hover:shadow-violet/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 text-sm"
            >
              <GitBranch className="w-4 h-4" />
              Connect Repository
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/overview"
              className="flex items-center gap-2 bg-graphite-lighter/80 backdrop-blur-sm border border-graphite-border/60 hover:border-violet/20 hover:bg-graphite-hover text-text-primary px-7 py-3.5 rounded-xl font-medium transition-all duration-300 text-sm"
            >
              Explore Dashboard
            </Link>
          </motion.div>
        </motion.div>



        {/* Hero Pipeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className="bg-graphite-light/50 backdrop-blur-2xl border border-graphite-border/40 rounded-2xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-graphite-border/30">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-crimson/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" />
              </div>
              <span className="text-[11px] font-mono text-text-muted ml-2">autoheal-ci / pipeline-preview</span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                <span className="text-[11px] font-mono text-neon-green/70">live</span>
              </span>
            </div>
            <HeroPipeline />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">How It Works</h2>
            <p className="text-text-secondary max-w-lg mx-auto">A self-improving loop that learns from every pipeline run to predict and prevent failures.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="group relative bg-graphite-light/50 backdrop-blur-xl border border-graphite-border/40 rounded-2xl p-6 hover:border-graphite-border/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-5 h-5" style={{ color: feat.color }} />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{feat.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feat.description}</p>
                  {/* Top border accent */}
                  <div
                    className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${feat.color}40, transparent)` }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trusted section */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-graphite-light/60 to-graphite-lighter/30 backdrop-blur-2xl border border-graphite-border/40 rounded-2xl p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 tracking-tight">Ready to stop babysitting your CI?</h3>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">Join teams saving hours of debugging time every week with AI-powered pipeline healing.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/overview"
                className="group flex items-center gap-2 bg-gradient-to-r from-violet to-electric hover:shadow-xl hover:shadow-violet/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 text-sm"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                No credit card required
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-graphite-border/30 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet to-electric flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-mono text-text-muted">AutoHeal CI</span>
          </div>
          <p className="text-xs text-text-muted">Next-Generation AI DevOps Platform</p>
        </div>
      </footer>
    </div>
  );
}
