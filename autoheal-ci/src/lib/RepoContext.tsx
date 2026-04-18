'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as api from './api';

export interface ConnectedRepo {
  owner: string;
  repo: string;
  full_name: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  open_issues: number;
  default_branch: string;
  last_push: string;
  html_url: string;
  connected_at: string;
}

interface RepoContextValue {
  connectedRepos: ConnectedRepo[];
  selectedRepo: ConnectedRepo | null;
  selectRepo: (repo: ConnectedRepo | null) => void;
  connectRepo: (url: string) => Promise<ConnectedRepo>;
  disconnectRepo: (owner: string, repo: string) => Promise<void>;
  refreshRepos: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const RepoContext = createContext<RepoContextValue | undefined>(undefined);

export function RepoProvider({ children }: { children: ReactNode }) {
  const [connectedRepos, setConnectedRepos] = useState<ConnectedRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<ConnectedRepo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshRepos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const repos = await api.getConnectedRepos();
      setConnectedRepos(repos);

      // If we had a selected repo, make sure it still exists
      if (selectedRepo) {
        const stillExists = repos.find(
          (r: ConnectedRepo) => r.full_name === selectedRepo.full_name
        );
        if (!stillExists) {
          setSelectedRepo(repos.length > 0 ? repos[0] : null);
        }
      }
    } catch (e: any) {
      console.error('Failed to load repos:', e);
      setError('Could not connect to backend. Make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRepo]);

  // Load repos on mount
  useEffect(() => {
    refreshRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = useCallback(async (url: string): Promise<ConnectedRepo> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.connectRepo(url);
      const newRepo: ConnectedRepo = result.repo;
      setConnectedRepos(prev => {
        const exists = prev.find(r => r.full_name === newRepo.full_name);
        return exists ? prev : [...prev, newRepo];
      });
      setSelectedRepo(newRepo);
      return newRepo;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDisconnect = useCallback(async (owner: string, repo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.disconnectRepo(owner, repo);
      setConnectedRepos(prev => prev.filter(r => !(r.owner === owner && r.repo === repo)));
      if (selectedRepo?.owner === owner && selectedRepo?.repo === repo) {
        setSelectedRepo(null);
      }
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [selectedRepo]);

  const selectRepo = useCallback((repo: ConnectedRepo | null) => {
    setSelectedRepo(repo);
  }, []);

  return (
    <RepoContext.Provider
      value={{
        connectedRepos,
        selectedRepo,
        selectRepo,
        connectRepo: handleConnect,
        disconnectRepo: handleDisconnect,
        refreshRepos,
        isLoading,
        error,
      }}
    >
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error('useRepo must be used within a RepoProvider');
  }
  return context;
}
