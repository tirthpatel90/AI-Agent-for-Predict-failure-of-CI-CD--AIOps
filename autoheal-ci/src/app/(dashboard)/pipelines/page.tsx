'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import GlowCard from '@/components/ui/GlowCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { Play, RotateCcw, X, Terminal, FileCode, Clock, ArrowRight } from 'lucide-react';

type NodeStatus = 'idle' | 'processing' | 'success' | 'warning' | 'failure';

interface PipelineNode {
  id: string;
  label: string;
  status: NodeStatus;
  x: number;
  y: number;
  logs: string[];
  duration: string;
  details: string;
}

const initialNodes: PipelineNode[] = [
  { id: 'commit', label: 'Commit', status: 'idle', x: 80, y: 200, logs: ['Received push event', 'Commit: a1b2c3d', 'Author: Sarah Chen', 'Files changed: 5'], duration: '0.2s', details: 'Git push event received from GitHub webhook' },
  { id: 'analyzer', label: 'Change Analyzer', status: 'idle', x: 250, y: 200, logs: ['Scanning changed files...', 'Detected: 3 source files, 2 config files', 'Dependency changes: package.json modified', 'Risk areas identified: auth middleware'], duration: '1.4s', details: 'Analyzes code changes to identify risk areas and dependencies' },
  { id: 'predictor', label: 'AI Predictor', status: 'idle', x: 420, y: 120, logs: ['Loading ML model v3.2...', 'Feature extraction complete', 'Running prediction...', 'Failure probability: 78%', 'Confidence: HIGH', 'Likely cause: dependency conflict'], duration: '2.1s', details: 'ML model predicts failure probability based on code analysis' },
  { id: 'rootcause', label: 'Root Cause', status: 'idle', x: 420, y: 280, logs: ['Analyzing error patterns...', 'Matching against knowledge base...', 'Found 3 similar past failures', 'Root cause: missing sklearn dependency', 'Confidence: 89%'], duration: '1.8s', details: 'Identifies the root cause by matching against the knowledge base' },
  { id: 'autofix', label: 'Auto Fix', status: 'idle', x: 590, y: 200, logs: ['Selecting best fix strategy...', 'Strategy: install_dependency (92% success rate)', 'Applying fix: pip install scikit-learn', 'Fix applied successfully', 'Regenerating pipeline config...'], duration: '3.2s', details: 'Applies the best fix strategy based on historical success rates' },
  { id: 'runner', label: 'CI Runner', status: 'idle', x: 760, y: 200, logs: ['Starting pipeline execution...', 'Step 1/4: Install dependencies ✓', 'Step 2/4: Run linter ✓', 'Step 3/4: Run tests ✓', 'Step 4/4: Build ✓', 'Pipeline completed successfully!'], duration: '124s', details: 'Executes the CI pipeline with applied fixes' },
];

const edges: [string, string][] = [
  ['commit', 'analyzer'],
  ['analyzer', 'predictor'],
  ['analyzer', 'rootcause'],
  ['predictor', 'autofix'],
  ['rootcause', 'autofix'],
  ['autofix', 'runner'],
];

const statusColors: Record<NodeStatus, string> = {
  idle: '#475569',
  processing: '#8b5cf6',
  success: '#34d399',
  warning: '#f59e0b',
  failure: '#f43f5e',
};

const statusGlows: Record<NodeStatus, string> = {
  idle: 'none',
  processing: '0 0 24px rgba(139, 92, 246, 0.4)',
  success: '0 0 24px rgba(52, 211, 153, 0.3)',
  warning: '0 0 24px rgba(245, 158, 11, 0.3)',
  failure: '0 0 24px rgba(244, 63, 94, 0.4)',
};

export default function PipelinesPage() {
  const [nodes, setNodes] = useState<PipelineNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [particlePositions, setParticlePositions] = useState<Record<string, number>>({});

  const getNodePos = useCallback((id: string) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  }, [nodes]);

  const runPipeline = useCallback(() => {
    const sequence: { nodeId: string; status: NodeStatus; delay: number }[] = [
      { nodeId: 'commit', status: 'processing', delay: 0 },
      { nodeId: 'commit', status: 'success', delay: 500 },
      { nodeId: 'analyzer', status: 'processing', delay: 600 },
      { nodeId: 'analyzer', status: 'success', delay: 1800 },
      { nodeId: 'predictor', status: 'processing', delay: 1900 },
      { nodeId: 'rootcause', status: 'processing', delay: 2000 },
      { nodeId: 'predictor', status: 'warning', delay: 3500 },
      { nodeId: 'rootcause', status: 'success', delay: 3800 },
      { nodeId: 'autofix', status: 'processing', delay: 4000 },
      { nodeId: 'autofix', status: 'success', delay: 6500 },
      { nodeId: 'runner', status: 'processing', delay: 6700 },
      { nodeId: 'runner', status: 'success', delay: 9000 },
    ];

    setIsRunning(true);
    setNodes(initialNodes);
    setSelectedNode(null);

    sequence.forEach(({ nodeId, status, delay }) => {
      setTimeout(() => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status } : n));
      }, delay);
    });

    setTimeout(() => setIsRunning(false), 9500);
  }, []);

  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setParticlePositions(prev => {
        const next: Record<string, number> = {};
        edges.forEach(([from, to]) => {
          const key = `${from}-${to}`;
          const current = prev[key] || 0;
          next[key] = (current + 0.005) % 1;
        });
        return next;
      });
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const reset = () => {
    setNodes(initialNodes);
    setSelectedNode(null);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Pipeline Visualizer</h1>
          <p className="text-sm text-text-secondary mt-1">Interactive node-based pipeline execution graph</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-graphite-lighter/80 border border-graphite-border/40 text-text-secondary hover:text-text-primary hover:border-graphite-border/70 transition-all duration-200 text-sm">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button onClick={runPipeline} disabled={isRunning} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet to-electric hover:shadow-lg hover:shadow-violet/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300 text-sm hover:-translate-y-0.5 disabled:hover:translate-y-0">
            <Play className="w-3.5 h-3.5" /> {isRunning ? 'Running...' : 'Run Pipeline'}
          </button>
        </div>
      </div>

      <GlowCard glowColor="violet" hover={false} className="relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-graphite-border/30">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-crimson/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" />
          </div>
          <span className="text-[11px] font-mono text-text-muted ml-1">pipeline-graph / autoheal-core</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span className="text-[11px] font-mono text-neon-green/70">active</span>
          </span>
        </div>

        <svg viewBox="0 0 840 400" className="w-full" style={{ minHeight: '350px' }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#141620" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="840" height="400" fill="url(#grid)" />

          {edges.map(([from, to]) => {
            const fromPos = getNodePos(from);
            const toPos = getNodePos(to);
            const fromNode = nodes.find(n => n.id === from);
            const toNode = nodes.find(n => n.id === to);
            const isActive = fromNode?.status === 'success' || fromNode?.status === 'warning';
            const edgeColor = isActive ? statusColors[toNode?.status || 'idle'] : '#1a1d28';
            const key = `${from}-${to}`;
            const t = particlePositions[key] || 0;

            // Bezier curve control points
            const mx = (fromPos.x + toPos.x) / 2;
            const my = (fromPos.y + toPos.y) / 2;
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const cx1 = fromPos.x + dx * 0.3;
            const cy1 = fromPos.y;
            const cx2 = toPos.x - dx * 0.3;
            const cy2 = toPos.y;
            const pathD = `M${fromPos.x},${fromPos.y} C${cx1},${cy1} ${cx2},${cy2} ${toPos.x},${toPos.y}`;

            // Linear interpolation for particle
            const px = fromPos.x + (toPos.x - fromPos.x) * t;
            const py = fromPos.y + (toPos.y - fromPos.y) * t;

            return (
              <g key={key}>
                <path d={pathD} fill="none" stroke={edgeColor} strokeWidth="1.5" strokeDasharray={isActive ? 'none' : '6 6'} opacity={isActive ? 0.5 : 0.2} />
                {isActive && (
                  <circle cx={px} cy={py} r="3" fill={edgeColor} opacity={0.8}>
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}

          {nodes.map((node) => (
            <g key={node.id} onClick={() => setSelectedNode(node)} className="cursor-pointer">
              {/* Outer glow ring */}
              {node.status !== 'idle' && (
                <circle cx={node.x} cy={node.y} r={36} fill="none" stroke={statusColors[node.status]} strokeWidth="1" opacity={0.2}>
                  {node.status === 'processing' && (
                    <>
                      <animate attributeName="r" values="34;42;34" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
                    </>
                  )}
                </circle>
              )}
              {/* Node circle */}
              <circle
                cx={node.x} cy={node.y} r={30}
                fill="#0d0f16"
                stroke={statusColors[node.status]}
                strokeWidth="2"
                style={{ filter: statusGlows[node.status] !== 'none' ? `drop-shadow(${statusGlows[node.status]})` : 'none' }}
              />
              {/* Processing spinner ring */}
              {node.status === 'processing' && (
                <circle
                  cx={node.x} cy={node.y} r={30}
                  fill="none"
                  stroke={statusColors[node.status]}
                  strokeWidth="2"
                  strokeDasharray="20 180"
                  strokeLinecap="round"
                  opacity={0.6}
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`0 ${node.x} ${node.y};360 ${node.x} ${node.y}`}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              {/* Inner dot */}
              <circle cx={node.x} cy={node.y} r={8} fill={statusColors[node.status]} opacity={node.status === 'idle' ? 0.2 : 0.7}>
                {node.status === 'processing' && (
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
                )}
              </circle>
              {/* Label */}
              <text x={node.x} y={node.y + 48} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="500">{node.label}</text>
            </g>
          ))}
        </svg>

        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-graphite-border/30">
          {(['idle', 'processing', 'success', 'warning', 'failure'] as NodeStatus[]).map(status => (
            <div key={status} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColors[status] }} />
              <span className="text-[11px] text-text-muted capitalize font-medium">{status}</span>
            </div>
          ))}
        </div>
      </GlowCard>

      <AnimatePresence>
        {selectedNode && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3 }}>
            <GlowCard glowColor={selectedNode.status === 'success' ? 'green' : selectedNode.status === 'failure' ? 'crimson' : 'violet'} hover={false}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-text-primary">{selectedNode.label}</h3>
                  <StatusBadge status={selectedNode.status} />
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-1.5 rounded-lg hover:bg-graphite-lighter/60 transition-colors text-text-muted hover:text-text-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-text-secondary mb-4">{selectedNode.details}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-graphite/60 rounded-xl p-4 border border-graphite-border/40">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-text-muted" />
                    <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Logs</span>
                  </div>
                  <div className="space-y-1">
                    {selectedNode.logs.map((log, i) => (
                      <p key={i} className="text-xs font-mono text-text-secondary">
                        <span className="text-text-muted/60 mr-2 select-none">{String(i + 1).padStart(2, '0')}</span>{log}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="bg-graphite/60 rounded-xl p-4 border border-graphite-border/40">
                  <div className="flex items-center gap-2 mb-3">
                    <FileCode className="w-4 h-4 text-text-muted" />
                    <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Details</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between"><span className="text-xs text-text-muted">Node ID</span><span className="text-xs font-mono text-text-primary">{selectedNode.id}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-text-muted">Status</span><span className="text-xs font-mono capitalize" style={{ color: statusColors[selectedNode.status] }}>{selectedNode.status}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-text-muted">Duration</span><span className="text-xs font-mono text-text-primary flex items-center gap-1"><Clock className="w-3 h-3" />{selectedNode.duration}</span></div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
