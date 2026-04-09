'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import GlowCard from '@/components/ui/GlowCard';
import { Settings as SettingsIcon, Github, Bell, Shield, Cpu, Save, Check } from 'lucide-react';

const container = { initial: {}, animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } } };

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6 max-w-3xl">
      <motion.div variants={fadeUp}><h1 className="text-2xl font-bold text-text-primary tracking-tight">Settings</h1><p className="text-sm text-text-secondary mt-1">Configure AutoHeal CI platform settings</p></motion.div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="violet" hover={false}>
          <div className="flex items-center gap-2.5 mb-5"><div className="w-8 h-8 rounded-lg bg-graphite-lighter/50 flex items-center justify-center"><Github className="w-4 h-4 text-text-primary" /></div><h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">GitHub Integration</h3></div>
          <div className="space-y-4">
            <div><label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1.5">GitHub Personal Access Token</label><input type="password" defaultValue="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="w-full bg-graphite/60 border border-graphite-border/40 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-violet/30 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.05)] transition-all duration-200 font-mono" /><p className="text-[11px] text-text-muted mt-1.5">Required for repository access. Needs repo and webhook scopes.</p></div>
            <div><label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1.5">Webhook URL</label><input type="text" defaultValue="https://autoheal.ci/webhook/github" className="w-full bg-graphite/60 border border-graphite-border/40 rounded-xl px-4 py-2.5 text-sm text-text-primary font-mono opacity-60 cursor-not-allowed" readOnly /></div>
          </div>
        </GlowCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="amber" hover={false}>
          <div className="flex items-center gap-2.5 mb-5"><div className="w-8 h-8 rounded-lg bg-graphite-lighter/50 flex items-center justify-center"><Bell className="w-4 h-4 text-amber" /></div><h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Notifications</h3></div>
          <div className="space-y-2.5">
            {[
              { label: 'Pipeline failures', desc: 'Get notified when a pipeline fails', on: true },
              { label: 'Auto-fix applied', desc: 'Notification when an automatic fix is applied', on: true },
              { label: 'High failure prediction', desc: 'Alert when prediction exceeds threshold', on: true },
              { label: 'Learning milestones', desc: 'When the system learns new error patterns', on: false },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between p-3.5 rounded-xl bg-graphite/30 border border-graphite-border/30 hover:border-graphite-border/50 transition-all duration-200 cursor-pointer group">
                <div><p className="text-sm text-text-primary group-hover:text-white transition-colors">{item.label}</p><p className="text-[11px] text-text-muted mt-0.5">{item.desc}</p></div>
                <input type="checkbox" defaultChecked={item.on} className="toggle-switch" />
              </label>
            ))}
          </div>
        </GlowCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="violet" hover={false}>
          <div className="flex items-center gap-2.5 mb-5"><div className="w-8 h-8 rounded-lg bg-graphite-lighter/50 flex items-center justify-center"><Cpu className="w-4 h-4 text-violet" /></div><h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">AI Configuration</h3></div>
          <div className="space-y-5">
            <div><label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-2">Failure Prediction Threshold</label><div className="flex items-center gap-3"><input type="range" min="0" max="100" defaultValue="70" className="flex-1" /><span className="text-sm font-mono text-violet w-12 text-right">70%</span></div><p className="text-[11px] text-text-muted mt-1.5">Auto-fix will trigger when failure probability exceeds this threshold.</p></div>
            <div><label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1.5">Auto-Fix Mode</label><select className="w-full bg-graphite/60 border border-graphite-border/40 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-violet/30 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.05)] transition-all duration-200 font-mono"><option value="auto">Automatic — Apply fixes without approval</option><option value="suggest">Suggest — Propose fixes for manual review</option><option value="disabled">Disabled — Only predict, no fixes</option></select></div>
            <div><label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1.5">Max Fix Retries</label><input type="number" defaultValue={3} min={1} max={10} className="w-full bg-graphite/60 border border-graphite-border/40 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-violet/30 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.05)] transition-all duration-200 font-mono" /></div>
          </div>
        </GlowCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlowCard glowColor="crimson" hover={false}>
          <div className="flex items-center gap-2.5 mb-5"><div className="w-8 h-8 rounded-lg bg-graphite-lighter/50 flex items-center justify-center"><Shield className="w-4 h-4 text-crimson" /></div><h3 className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Security</h3></div>
          <div className="space-y-2.5">
            {[
              { label: 'Require approval for destructive fixes', desc: 'Fixes that delete files or modify production configs', on: true },
              { label: 'Audit log all AI decisions', desc: 'Record every prediction and fix for compliance review', on: true },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between p-3.5 rounded-xl bg-graphite/30 border border-graphite-border/30 hover:border-graphite-border/50 transition-all duration-200 cursor-pointer group">
                <div><p className="text-sm text-text-primary group-hover:text-white transition-colors">{item.label}</p><p className="text-[11px] text-text-muted mt-0.5">{item.desc}</p></div>
                <input type="checkbox" defaultChecked={item.on} className="toggle-switch" />
              </label>
            ))}
          </div>
        </GlowCard>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-3 pb-8">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet to-electric hover:shadow-lg hover:shadow-violet/20 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5">
          <Save className="w-4 h-4" /> Save Settings
        </button>
        {saved && (
          <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-sm text-neon-green font-mono">
            <Check className="w-4 h-4" /> Settings saved
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
