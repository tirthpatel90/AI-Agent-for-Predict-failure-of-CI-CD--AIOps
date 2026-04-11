'use client';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'success' | 'failure' | 'warning' | 'processing' | 'idle' | 'pending';
  label?: string;
  size?: 'sm' | 'md';
}

const statusConfig = {
  success: { bg: 'bg-neon-green/10', text: 'text-neon-green', border: 'border-neon-green/20', dot: 'bg-neon-green', label: 'Success', shadow: 'shadow-neon-green/10' },
  failure: { bg: 'bg-crimson/10', text: 'text-crimson', border: 'border-crimson/20', dot: 'bg-crimson', label: 'Failure', shadow: 'shadow-crimson/10' },
  warning: { bg: 'bg-amber/10', text: 'text-amber', border: 'border-amber/20', dot: 'bg-amber', label: 'Warning', shadow: 'shadow-amber/10' },
  processing: { bg: 'bg-violet/10', text: 'text-violet', border: 'border-violet/20', dot: 'bg-violet', label: 'Processing', shadow: 'shadow-violet/10' },
  idle: { bg: 'bg-text-muted/8', text: 'text-text-muted', border: 'border-text-muted/15', dot: 'bg-text-muted', label: 'Idle', shadow: '' },
  pending: { bg: 'bg-amber/10', text: 'text-amber', border: 'border-amber/20', dot: 'bg-amber', label: 'Pending', shadow: 'shadow-amber/10' },
};

export default function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const isAnimated = status === 'processing';

  return (
    <span className={`
      inline-flex items-center gap-1.5 border rounded-full font-mono
      ${config.bg} ${config.text} ${config.border}
      ${size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3.5 py-1 text-xs'}
      transition-colors duration-200
    `}>
      <span className="relative flex items-center justify-center">
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${isAnimated ? '' : ''}`} />
        {isAnimated && (
          <motion.span
            className={`absolute w-1.5 h-1.5 rounded-full ${config.dot}`}
            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </span>
      <span className="font-medium tracking-wide">{label || config.label}</span>
    </span>
  );
}
