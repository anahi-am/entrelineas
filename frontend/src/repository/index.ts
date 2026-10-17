import { createHttpPromiseRepository } from './httpPromiseRepository';
import { createMockPromiseRepository } from './mockPromiseRepository';
import type { PromiseRepository } from './PromiseRepository';

export * from './PromiseRepository';

/**
 * The single switch between mock and real data.
 *  - VITE_API_BASE_URL set  -> HTTP repository (GET /published/promises, GET /promises/{id})
 *  - otherwise              -> mock repository
 * With the mock you can preview states via ?demo=slow | empty | error.
 */
export function createDefaultPromiseRepository(search = window.location.search): PromiseRepository {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (apiBaseUrl) return createHttpPromiseRepository(apiBaseUrl);

  const demo = new URLSearchParams(search).get('demo');
  if (demo === 'empty') return createMockPromiseRepository({ scenario: 'empty' });
  if (demo === 'error') return createMockPromiseRepository({ scenario: 'error' });
  if (demo === 'slow') return createMockPromiseRepository({ latencyMs: 3000 });
  return createMockPromiseRepository();
}
