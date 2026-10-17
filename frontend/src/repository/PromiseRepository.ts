import type { BoeFeedItem, PromiseRecord } from '../domain/types';

export interface RequestOptions {
  signal?: AbortSignal;
}

/**
 * The only thing the UI knows about where data comes from.
 * Implementations must return approved evidence only.
 *
 *   listPublishedPromises  <->  GET /published/promises
 *   getPromiseById         <->  GET /promises/{id}
 */
export interface PromiseRepository {
  readonly dataSource: 'mock' | 'api';
  listPublishedPromises(options?: RequestOptions): Promise<PromiseRecord[]>;
  /** Rejects with PromiseNotFoundError when the id does not exist. */
  getPromiseById(id: string, options?: RequestOptions): Promise<PromiseRecord>;
  listBoeFeed(options?: RequestOptions): Promise<BoeFeedItem[]>;
  getBoeItem(id: string, options?: RequestOptions): Promise<BoeFeedItem>;
}

export class PromiseNotFoundError extends Error {
  constructor(public readonly promiseId: string) {
    super(`Promise not found: ${promiseId}`);
    this.name = 'PromiseNotFoundError';
  }
}

export class RepositoryError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'RepositoryError';
  }
}
