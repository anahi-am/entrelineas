import { createContext, useContext, type ReactNode } from 'react';
import type { PromiseRepository } from './PromiseRepository';

const RepositoryContext = createContext<PromiseRepository | null>(null);

export function RepositoryProvider({
  repository,
  children,
}: {
  repository: PromiseRepository;
  children: ReactNode;
}) {
  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>;
}

export function useRepository(): PromiseRepository {
  const repository = useContext(RepositoryContext);
  if (!repository) throw new Error('useRepository must be used inside <RepositoryProvider>');
  return repository;
}
