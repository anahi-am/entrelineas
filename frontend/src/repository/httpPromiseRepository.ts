import type {
  BoeFeedItem,
  EvidenceItem,
  PromiseRecord,
} from '../domain/types';
import {
  PromiseNotFoundError,
  RepositoryError,
  type PromiseRepository,
  type RequestOptions,
} from './PromiseRepository';

/**
 * Wire format supplied by src.api in camelCase JSON. Evidence items may carry
 * `approvalStatus`; if present, anything other than "approved" is dropped here
 * as a second line of defence.
 */
export type EvidenceItemDto = EvidenceItem & { approvalStatus?: string };
export type PromiseRecordDto = Omit<PromiseRecord, 'evidence'> & {
  evidence?: EvidenceItemDto[];
};

export function toPromiseRecord(dto: PromiseRecordDto): PromiseRecord {
  const evidence = (dto.evidence ?? [])
    .filter((item) => item.approvalStatus === undefined || item.approvalStatus === 'approved')
    .map(({ approvalStatus: _approvalStatus, ...item }) => item)
    .sort((a, b) => a.date.localeCompare(b.date));
  return { ...dto, evidence, unverifiedNotes: dto.unverifiedNotes ?? [] };
}

export function createHttpPromiseRepository(
  baseUrl: string,
  fetchImpl: typeof fetch = (...args) => fetch(...args),
): PromiseRepository {
  const base = baseUrl.replace(/\/+$/, '');

  async function getJson(path: string, signal?: AbortSignal): Promise<Response> {
    try {
      return await fetchImpl(`${base}${path}`, {
        headers: { Accept: 'application/json' },
        signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      throw new RepositoryError('Network request failed', error);
    }
  }

  return {
    dataSource: 'api',

    async listPublishedPromises({ signal }: RequestOptions = {}) {
      const response = await getJson('/published/promises', signal);
      if (!response.ok) throw new RepositoryError(`GET /published/promises -> ${response.status}`);
      const body = (await response.json()) as PromiseRecordDto[] | { items: PromiseRecordDto[] };
      const items = Array.isArray(body) ? body : body.items;
      return items.map(toPromiseRecord);
    },

    async getPromiseById(id: string, { signal }: RequestOptions = {}) {
      const response = await getJson(`/promises/${encodeURIComponent(id)}`, signal);
      if (response.status === 404) throw new PromiseNotFoundError(id);
      if (!response.ok) throw new RepositoryError(`GET /promises/{id} -> ${response.status}`);
      return toPromiseRecord((await response.json()) as PromiseRecordDto);
    },

    async listBoeFeed({ signal }: RequestOptions = {}) {
      const response = await getJson('/boe/feed', signal);
      if (!response.ok) throw new RepositoryError(`GET /boe/feed -> ${response.status}`);
      return ((await response.json()) as { items: BoeFeedItem[] }).items;
    },

    async getBoeItem(id: string, { signal }: RequestOptions = {}) {
      const response = await getJson(`/boe/feed/${encodeURIComponent(id)}`, signal);
      if (response.status === 404) throw new PromiseNotFoundError(id);
      if (!response.ok) throw new RepositoryError(`GET /boe/feed/{id} -> ${response.status}`);
      return (await response.json()) as BoeFeedItem;
    },
  };
}
