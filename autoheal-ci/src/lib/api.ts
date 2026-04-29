const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

// --- GitHub Endpoints ---

export async function connectRepo(repoUrl: string) {
  const res = await fetch(`${API_BASE}/github/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Connection failed' }));
    throw new Error(err.detail || 'Failed to connect repository');
  }
  return res.json();
}

export async function disconnectRepo(owner: string, repo: string) {
  const res = await fetch(`${API_BASE}/github/disconnect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, repo }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Disconnect failed' }));
    throw new Error(err.detail || 'Failed to disconnect repository');
  }
  return res.json();
}

export async function getConnectedRepos() {
  const res = await fetch(`${API_BASE}/github/repos`);
  if (!res.ok) throw new Error('Failed to fetch connected repos');
  return res.json();
}

export async function getRepoInfo(owner: string, repo: string) {
  const res = await fetch(`${API_BASE}/github/repos/${owner}/${repo}/info`);
  if (!res.ok) throw new Error('Failed to fetch repo info');
  return res.json();
}

export async function getRepoCommits(owner: string, repo: string, perPage = 20) {
  const res = await fetch(`${API_BASE}/github/repos/${owner}/${repo}/commits?per_page=${perPage}`);
  if (!res.ok) throw new Error('Failed to fetch commits');
  return res.json();
}

export async function getRepoWorkflows(owner: string, repo: string) {
  const res = await fetch(`${API_BASE}/github/repos/${owner}/${repo}/workflows`);
  if (!res.ok) throw new Error('Failed to fetch workflows');
  return res.json();
}

export async function getRepoRuns(owner: string, repo: string, perPage = 20) {
  const res = await fetch(`${API_BASE}/github/repos/${owner}/${repo}/runs?per_page=${perPage}`);
  if (!res.ok) throw new Error('Failed to fetch runs');
  return res.json();
}

export async function getRunLogs(owner: string, repo: string, runId: number) {
  const res = await fetch(`${API_BASE}/github/repos/${owner}/${repo}/runs/${runId}/logs`);
  if (!res.ok) throw new Error('Failed to fetch run logs');
  return res.json();
}

export async function getFileContents(owner: string, repo: string, path: string) {
  const res = await fetch(`${API_BASE}/github/repos/${owner}/${repo}/contents/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch file: ${path}`);
  return res.json();
}

export async function analyzeRepo(owner: string, repo: string) {
  const res = await fetch(`${API_BASE}/github/repos/${owner}/${repo}/analyze`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to analyze repository');
  return res.json();
}

// --- AI Endpoints ---

export async function predictPipeline(repoContext: string, ciConfig?: string, recentLogs?: string) {
  const res = await fetch(`${API_BASE}/heal/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      repo_context: repoContext,
      ci_config: ciConfig || null,
      recent_logs: recentLogs || null,
    }),
  });
  if (!res.ok) throw new Error('Failed to predict pipeline');
  return res.json();
}

export async function analyzeError(errorLogs: string, codeContext?: string) {
  const res = await fetch(`${API_BASE}/heal/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error_logs: errorLogs,
      code_context: codeContext || null,
    }),
  });
  if (!res.ok) throw new Error('Failed to analyze error');
  return res.json();
}
