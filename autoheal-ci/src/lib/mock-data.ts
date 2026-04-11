export interface Commit {
  id: string;
  message: string;
  author: string;
  avatar: string;
  timestamp: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  predictionScore: number;
  branch: string;
}

export interface BuildRecord {
  id: string;
  commitId: string;
  author: string;
  message: string;
  filesChanged: number;
  predictionScore: number;
  actualResult: 'success' | 'failure' | 'warning';
  fixApplied: string | null;
  duration: number; // seconds
  timestamp: string;
}

export interface FixAttempt {
  id: string;
  errorSignature: string;
  errorMessage: string;
  fixStrategy: string;
  command: string;
  result: 'success' | 'failure' | 'pending';
  timestamp: string;
  buildId: string;
}

export interface LearningEntry {
  errorSignature: string;
  errorType: string;
  environment: string;
  rootCause: string;
  fixAttempted: string;
  fixSuccessRate: number;
  occurrenceCount: number;
  lastSeen: string;
}

export interface PredictionResult {
  failureProbability: number;
  likelyCauses: { cause: string; confidence: number }[];
  analyzedFiles: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const mockCommits: Commit[] = [
  { id: 'a1b2c3d', message: 'feat: add user authentication middleware', author: 'Sarah Chen', avatar: 'SC', timestamp: '2 min ago', filesChanged: 5, additions: 142, deletions: 23, predictionScore: 0.12, branch: 'main' },
  { id: 'e4f5g6h', message: 'fix: resolve docker build timeout issue', author: 'Marcus Lee', avatar: 'ML', timestamp: '15 min ago', filesChanged: 3, additions: 28, deletions: 45, predictionScore: 0.67, branch: 'fix/docker-timeout' },
  { id: 'i7j8k9l', message: 'chore: update dependencies to latest versions', author: 'Priya Sharma', avatar: 'PS', timestamp: '1 hr ago', filesChanged: 2, additions: 312, deletions: 298, predictionScore: 0.78, branch: 'chore/deps-update' },
  { id: 'm0n1o2p', message: 'feat: implement WebSocket real-time notifications', author: 'Jake Wilson', avatar: 'JW', timestamp: '2 hr ago', filesChanged: 8, additions: 267, deletions: 12, predictionScore: 0.34, branch: 'feat/websockets' },
  { id: 'q3r4s5t', message: 'refactor: migrate database layer to Prisma ORM', author: 'Nina Petrov', avatar: 'NP', timestamp: '3 hr ago', filesChanged: 14, additions: 456, deletions: 389, predictionScore: 0.89, branch: 'refactor/prisma' },
  { id: 'u6v7w8x', message: 'test: add integration tests for payment flow', author: 'Sarah Chen', avatar: 'SC', timestamp: '5 hr ago', filesChanged: 6, additions: 198, deletions: 0, predictionScore: 0.15, branch: 'test/payments' },
];

export const mockBuilds: BuildRecord[] = [
  { id: 'b-001', commitId: 'a1b2c3d', author: 'Sarah Chen', message: 'feat: add user authentication middleware', filesChanged: 5, predictionScore: 0.12, actualResult: 'success', fixApplied: null, duration: 124, timestamp: '2026-03-13T04:52:00Z' },
  { id: 'b-002', commitId: 'e4f5g6h', author: 'Marcus Lee', message: 'fix: resolve docker build timeout issue', filesChanged: 3, predictionScore: 0.67, actualResult: 'failure', fixApplied: 'Increased Docker build timeout to 600s', duration: 312, timestamp: '2026-03-13T04:37:00Z' },
  { id: 'b-003', commitId: 'i7j8k9l', author: 'Priya Sharma', message: 'chore: update dependencies to latest versions', filesChanged: 2, predictionScore: 0.78, actualResult: 'success', fixApplied: 'pip install scikit-learn==1.4.0', duration: 87, timestamp: '2026-03-13T03:52:00Z' },
  { id: 'b-004', commitId: 'm0n1o2p', author: 'Jake Wilson', message: 'feat: implement WebSocket real-time notifications', filesChanged: 8, predictionScore: 0.34, actualResult: 'success', fixApplied: null, duration: 156, timestamp: '2026-03-13T02:20:00Z' },
  { id: 'b-005', commitId: 'q3r4s5t', author: 'Nina Petrov', message: 'refactor: migrate database layer to Prisma ORM', filesChanged: 14, predictionScore: 0.89, actualResult: 'failure', fixApplied: 'npx prisma generate', duration: 201, timestamp: '2026-03-13T01:15:00Z' },
  { id: 'b-006', commitId: 'u6v7w8x', author: 'Sarah Chen', message: 'test: add integration tests for payment flow', filesChanged: 6, predictionScore: 0.15, actualResult: 'success', fixApplied: null, duration: 93, timestamp: '2026-03-12T23:45:00Z' },
  { id: 'b-007', commitId: 'y9z0a1b', author: 'Marcus Lee', message: 'fix: memory leak in worker threads', filesChanged: 4, predictionScore: 0.45, actualResult: 'warning', fixApplied: null, duration: 178, timestamp: '2026-03-12T22:30:00Z' },
  { id: 'b-008', commitId: 'c2d3e4f', author: 'Priya Sharma', message: 'feat: add rate limiting to API endpoints', filesChanged: 7, predictionScore: 0.56, actualResult: 'failure', fixApplied: 'npm install express-rate-limit', duration: 245, timestamp: '2026-03-12T21:10:00Z' },
  { id: 'b-009', commitId: 'g5h6i7j', author: 'Jake Wilson', message: 'docs: update API documentation', filesChanged: 3, predictionScore: 0.05, actualResult: 'success', fixApplied: null, duration: 45, timestamp: '2026-03-12T20:00:00Z' },
  { id: 'b-010', commitId: 'k8l9m0n', author: 'Nina Petrov', message: 'fix: SQL injection vulnerability in search', filesChanged: 2, predictionScore: 0.72, actualResult: 'success', fixApplied: 'Parameterized query applied', duration: 110, timestamp: '2026-03-12T18:30:00Z' },
];

export const mockFixAttempts: FixAttempt[] = [
  { id: 'f-001', errorSignature: 'dependency_missing_sklearn', errorMessage: "ModuleNotFoundError: No module named 'sklearn'", fixStrategy: 'install_dependency', command: 'pip install scikit-learn', result: 'success', timestamp: '2026-03-13T03:52:00Z', buildId: 'b-003' },
  { id: 'f-002', errorSignature: 'docker_timeout', errorMessage: 'Docker build exceeded timeout of 300s', fixStrategy: 'increase_timeout', command: 'docker build --timeout 600', result: 'success', timestamp: '2026-03-13T04:37:00Z', buildId: 'b-002' },
  { id: 'f-003', errorSignature: 'prisma_not_generated', errorMessage: 'PrismaClientInitializationError: Prisma client not generated', fixStrategy: 'run_prisma_generate', command: 'npx prisma generate', result: 'failure', timestamp: '2026-03-13T01:15:00Z', buildId: 'b-005' },
  { id: 'f-004', errorSignature: 'missing_rate_limit_pkg', errorMessage: "Cannot find module 'express-rate-limit'", fixStrategy: 'install_dependency', command: 'npm install express-rate-limit', result: 'success', timestamp: '2026-03-12T21:10:00Z', buildId: 'b-008' },
  { id: 'f-005', errorSignature: 'env_var_missing', errorMessage: 'Error: DATABASE_URL environment variable not set', fixStrategy: 'set_env_var', command: 'export DATABASE_URL=postgresql://localhost:5432/app', result: 'success', timestamp: '2026-03-12T17:45:00Z', buildId: 'b-011' },
  { id: 'f-006', errorSignature: 'flaky_test_timeout', errorMessage: 'Jest: Test timeout of 5000ms exceeded', fixStrategy: 'retry_build', command: 'npm test -- --forceExit', result: 'success', timestamp: '2026-03-12T15:30:00Z', buildId: 'b-012' },
];

export const mockKnowledgeBase: LearningEntry[] = [
  { errorSignature: 'dependency_missing_sklearn', errorType: 'dependency', environment: 'python', rootCause: 'Package name mismatch (sklearn vs scikit-learn)', fixAttempted: 'pip install scikit-learn', fixSuccessRate: 0.93, occurrenceCount: 47, lastSeen: '2026-03-13T03:52:00Z' },
  { errorSignature: 'docker_timeout', errorType: 'infrastructure', environment: 'docker', rootCause: 'Large image layer downloads', fixAttempted: 'Increase timeout + cache layers', fixSuccessRate: 0.81, occurrenceCount: 23, lastSeen: '2026-03-13T04:37:00Z' },
  { errorSignature: 'prisma_not_generated', errorType: 'orm', environment: 'nodejs', rootCause: 'Prisma client not regenerated after schema change', fixAttempted: 'npx prisma generate', fixSuccessRate: 0.96, occurrenceCount: 31, lastSeen: '2026-03-13T01:15:00Z' },
  { errorSignature: 'env_var_missing', errorType: 'configuration', environment: 'any', rootCause: 'Missing environment variable in CI config', fixAttempted: 'Inject env from secrets', fixSuccessRate: 0.88, occurrenceCount: 56, lastSeen: '2026-03-12T17:45:00Z' },
  { errorSignature: 'flaky_test_timeout', errorType: 'testing', environment: 'nodejs', rootCause: 'Async operations not properly awaited', fixAttempted: 'Retry with --forceExit', fixSuccessRate: 0.65, occurrenceCount: 89, lastSeen: '2026-03-12T15:30:00Z' },
  { errorSignature: 'port_already_in_use', errorType: 'infrastructure', environment: 'any', rootCause: 'Previous process not terminated', fixAttempted: 'Kill process on port', fixSuccessRate: 0.97, occurrenceCount: 34, lastSeen: '2026-03-12T14:00:00Z' },
  { errorSignature: 'npm_peer_dep_conflict', errorType: 'dependency', environment: 'nodejs', rootCause: 'Incompatible peer dependency versions', fixAttempted: 'npm install --legacy-peer-deps', fixSuccessRate: 0.72, occurrenceCount: 62, lastSeen: '2026-03-12T12:30:00Z' },
  { errorSignature: 'typescript_strict_null', errorType: 'type_error', environment: 'typescript', rootCause: 'Null check not performed', fixAttempted: 'Add optional chaining', fixSuccessRate: 0.85, occurrenceCount: 128, lastSeen: '2026-03-12T11:00:00Z' },
];

export const mockPrediction: PredictionResult = {
  failureProbability: 0.78,
  likelyCauses: [
    { cause: 'Dependency conflict in package.json', confidence: 0.89 },
    { cause: 'Missing environment variable DATABASE_URL', confidence: 0.73 },
    { cause: 'Docker base image incompatibility', confidence: 0.45 },
    { cause: 'Flaky test in auth.spec.ts', confidence: 0.31 },
  ],
  analyzedFiles: 14,
  riskLevel: 'high',
};

export const mockLearningStats = {
  totalErrorsLearned: 143,
  autoFixSuccessRate: 0.71,
  predictionAccuracy: 0.84,
  totalFixAttempts: 312,
  successfulFixes: 221,
  computeTimeSaved: 47.2, // hours
  learningGrowth: [
    { month: 'Sep', errors: 12, accuracy: 0.45, fixes: 8 },
    { month: 'Oct', errors: 28, accuracy: 0.52, fixes: 19 },
    { month: 'Nov', errors: 47, accuracy: 0.61, fixes: 34 },
    { month: 'Dec', errors: 68, accuracy: 0.69, fixes: 51 },
    { month: 'Jan', errors: 95, accuracy: 0.76, fixes: 72 },
    { month: 'Feb', errors: 122, accuracy: 0.81, fixes: 98 },
    { month: 'Mar', errors: 143, accuracy: 0.84, fixes: 112 },
  ],
  recentPredictions: [
    { commit: 'a1b2c3d', predicted: 0.12, actual: 'success' },
    { commit: 'e4f5g6h', predicted: 0.67, actual: 'failure' },
    { commit: 'i7j8k9l', predicted: 0.78, actual: 'success' },
    { commit: 'm0n1o2p', predicted: 0.34, actual: 'success' },
    { commit: 'q3r4s5t', predicted: 0.89, actual: 'failure' },
  ],
  strategyRankings: [
    { strategy: 'install_dependency', command: 'pip install / npm install', successRate: 0.92, uses: 87 },
    { strategy: 'retry_build', command: 'Retry pipeline', successRate: 0.65, uses: 45 },
    { strategy: 'clear_cache', command: 'rm -rf node_modules && npm ci', successRate: 0.78, uses: 34 },
    { strategy: 'update_base_image', command: 'docker pull latest', successRate: 0.71, uses: 22 },
    { strategy: 'set_env_var', command: 'Inject from CI secrets', successRate: 0.88, uses: 56 },
    { strategy: 'increase_timeout', command: 'Extend timeout config', successRate: 0.81, uses: 23 },
  ],
};

export const mockRepositories = [
  { id: 'r-001', name: 'autoheal-core', fullName: 'autoheal-org/autoheal-core', language: 'TypeScript', stars: 1240, lastPush: '2 hours ago', status: 'connected', pipelinesRun: 234, failureRate: 0.12 },
  { id: 'r-002', name: 'ml-predictor', fullName: 'autoheal-org/ml-predictor', language: 'Python', stars: 890, lastPush: '5 hours ago', status: 'connected', pipelinesRun: 156, failureRate: 0.23 },
  { id: 'r-003', name: 'infra-config', fullName: 'autoheal-org/infra-config', language: 'YAML', stars: 340, lastPush: '1 day ago', status: 'connected', pipelinesRun: 89, failureRate: 0.08 },
  { id: 'r-004', name: 'frontend-app', fullName: 'autoheal-org/frontend-app', language: 'TypeScript', stars: 675, lastPush: '3 hours ago', status: 'disconnected', pipelinesRun: 0, failureRate: 0 },
];

export const mockSystemLogs = [
  { id: 'l-001', timestamp: '2026-03-13T04:52:31Z', level: 'info', service: 'pipeline-runner', message: 'Pipeline b-001 completed successfully in 124s' },
  { id: 'l-002', timestamp: '2026-03-13T04:52:00Z', level: 'info', service: 'ai-predictor', message: 'Commit a1b2c3d analyzed — failure probability: 12%' },
  { id: 'l-003', timestamp: '2026-03-13T04:37:45Z', level: 'error', service: 'pipeline-runner', message: 'Pipeline b-002 failed: Docker build exceeded timeout of 300s' },
  { id: 'l-004', timestamp: '2026-03-13T04:37:30Z', level: 'warning', service: 'auto-fix', message: 'Attempting fix for docker_timeout: increase timeout to 600s' },
  { id: 'l-005', timestamp: '2026-03-13T04:37:00Z', level: 'info', service: 'ai-predictor', message: 'Commit e4f5g6h analyzed — failure probability: 67%' },
  { id: 'l-006', timestamp: '2026-03-13T03:52:15Z', level: 'info', service: 'auto-fix', message: 'Fix applied successfully: pip install scikit-learn' },
  { id: 'l-007', timestamp: '2026-03-13T03:52:00Z', level: 'warning', service: 'ai-predictor', message: 'High failure probability detected for commit i7j8k9l: 78%' },
  { id: 'l-008', timestamp: '2026-03-13T01:15:30Z', level: 'error', service: 'auto-fix', message: 'Fix attempt failed for prisma_not_generated: npx prisma generate' },
  { id: 'l-009', timestamp: '2026-03-13T01:15:00Z', level: 'error', service: 'pipeline-runner', message: 'Pipeline b-005 failed: PrismaClientInitializationError' },
  { id: 'l-010', timestamp: '2026-03-13T00:30:00Z', level: 'info', service: 'learning-engine', message: 'Knowledge base updated: 143 error signatures, avg fix rate 71%' },
  { id: 'l-011', timestamp: '2026-03-12T23:45:00Z', level: 'info', service: 'pipeline-runner', message: 'Pipeline b-006 completed successfully in 93s' },
  { id: 'l-012', timestamp: '2026-03-12T23:00:00Z', level: 'info', service: 'github-sync', message: 'Synced 3 repositories, 12 new commits detected' },
  { id: 'l-013', timestamp: '2026-03-12T22:30:00Z', level: 'warning', service: 'pipeline-runner', message: 'Pipeline b-007 completed with warnings: memory usage exceeded 80%' },
  { id: 'l-014', timestamp: '2026-03-12T22:00:00Z', level: 'info', service: 'learning-engine', message: 'Model retrained with 23 new data points — accuracy improved to 84%' },
  { id: 'l-015', timestamp: '2026-03-12T21:10:00Z', level: 'info', service: 'auto-fix', message: 'Fix applied successfully: npm install express-rate-limit' },
];
