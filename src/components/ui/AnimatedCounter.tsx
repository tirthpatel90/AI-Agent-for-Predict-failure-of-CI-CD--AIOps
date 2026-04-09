'use client';
import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

function formatNumber(num: number, decimals: number): string {
  const fixed = num.toFixed(decimals);
  if (decimals > 0) return fixed;
  // add commas for large integers
  return Number(fixed).toLocaleString('en-US');
}

export default function AnimatedCounter({ target, duration = 1800, prefix = '', suffix = '', decimals = 0, className = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // spring-like ease: overshoot then settle
      const eased = progress < 1
        ? 1 - Math.pow(1 - progress, 4) + Math.sin(progress * Math.PI) * 0.02
        : 1;
      setCount(Math.min(eased * target, target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
        setDone(true);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span
      className={`font-mono tabular-nums inline-block transition-transform duration-200 ${done ? '' : ''} ${className}`}
      style={done ? { transform: 'scale(1)' } : { transform: 'scale(1)' }}
    >
      {prefix}{formatNumber(count, decimals)}{suffix}
    </span>
  );
}
