import { mockPromiseRows, type MockPromiseRow } from '../data/mock/mockPromises';
import type { PromiseRecord } from '../domain/types';
import {
  PromiseNotFoundError,
  RepositoryError,
  type PromiseRepository,
  type RequestOptions,
} from './PromiseRepository';

export interface MockRepositoryOptions {
  /** Simulated network delay. Default 400 ms. Use 0 in tests. */
  latencyMs?: number;
  /** Force a scenario to preview UI states. */
  scenario?: 'normal' | 'empty' | 'error';
  rows?: MockPromiseRow[];
}

/** Public view of a row: approved evidence only. */
export function toPublicRecord(row: MockPromiseRow): PromiseRecord {
  return {
    ...row,
    evidence: row.evidence
      .filter((item) => item.approved)
      .map(({ approved: _approved, ...item }) => item)
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

export function createMockPromiseRepository(
  options: MockRepositoryOptions = {},
): PromiseRepository {
  const { latencyMs = 400, scenario = 'normal', rows = mockPromiseRows } = options;

  return {
    dataSource: 'mock',

    async listPublishedPromises({ signal }: RequestOptions = {}) {
      await delay(latencyMs, signal);
      if (scenario === 'error') throw new RepositoryError('Simulated list failure');
      if (scenario === 'empty') return [];
      return rows.map(toPublicRecord);
    },

    async getPromiseById(id: string, { signal }: RequestOptions = {}) {
      await delay(latencyMs, signal);
      if (scenario === 'error') throw new RepositoryError('Simulated detail failure');
      const row = scenario === 'empty' ? undefined : rows.find((r) => r.id === id);
      if (!row) throw new PromiseNotFoundError(id);
      return toPublicRecord(row);
    },

    async listBoeFeed() {
      return [];
    },

    async getBoeItem(id: string) {
      throw new PromiseNotFoundError(id);
    },
  };
}
