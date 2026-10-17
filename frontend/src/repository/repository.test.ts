import { describe, expect, it, vi } from 'vitest';
import { mockPromiseRows } from '../data/mock/mockPromises';
import { createHttpPromiseRepository, toPromiseRecord } from './httpPromiseRepository';
import { createMockPromiseRepository } from './mockPromiseRepository';
import { PromiseNotFoundError, RepositoryError } from './PromiseRepository';

describe('mock repository', () => {
  const repo = createMockPromiseRepository({ latencyMs: 0 });

  it('lists every published promise', async () => {
    expect(await repo.listPublishedPromises()).toHaveLength(mockPromiseRows.length);
  });

  it('never exposes unapproved evidence, in list or detail', async () => {
    const hiddenIds = mockPromiseRows.flatMap((r) => r.evidence.filter((e) => !e.approved)).map((e) => e.id);
    expect(hiddenIds.length).toBeGreaterThan(0); // the fixture must exercise the rule

    const list = await repo.listPublishedPromises();
    const detail = await repo.getPromiseById('demo-vivienda-001');
    const exposed = [...list.flatMap((p) => p.evidence), ...detail.evidence].map((e) => e.id);
    for (const id of hiddenIds) expect(exposed).not.toContain(id);
    expect(JSON.stringify(list)).not.toContain('"approved"');
  });

  it('keeps the original Spanish promise text untouched', async () => {
    const detail = await repo.getPromiseById('demo-vivienda-001');
    expect(detail.originalText).toBe(
      'Construiremos 2.000 viviendas de alquiler asequible en el municipio durante la legislatura.',
    );
  });

  it('rejects unknown ids with PromiseNotFoundError', async () => {
    await expect(repo.getPromiseById('nope')).rejects.toBeInstanceOf(PromiseNotFoundError);
  });

  it('can simulate empty and error scenarios', async () => {
    await expect(createMockPromiseRepository({ latencyMs: 0, scenario: 'empty' }).listPublishedPromises()).resolves.toEqual([]);
    await expect(createMockPromiseRepository({ latencyMs: 0, scenario: 'error' }).listPublishedPromises()).rejects.toBeInstanceOf(RepositoryError);
  });

  it('covers the statuses used by the housing demo fixture', () => {
    expect(new Set(mockPromiseRows.map((r) => r.status))).toEqual(
      new Set(['in_progress', 'blocked', 'no_trace']),
    );
  });
});

describe('http repository', () => {
  const pub = toPublicShape();

  function toPublicShape() {
    const { approved: _a, ...evidence } = mockPromiseRows[0].evidence[0];
    return { ...mockPromiseRows[0], evidence: [evidence] };
  }

  it('calls the documented endpoints', async () => {
    const fetchMock = vi.fn(async (_url: string) => new Response(JSON.stringify([pub]), { status: 200 }));
    const repo = createHttpPromiseRepository('https://api.test/', fetchMock as unknown as typeof fetch);
    await repo.listPublishedPromises();
    await repo.getPromiseById('a b');
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/published/promises');
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.test/promises/a%20b');
  });

  it('maps 404 to PromiseNotFoundError and other failures to RepositoryError', async () => {
    const make = (status: number) =>
      createHttpPromiseRepository('https://api.test', (async () => new Response('', { status })) as unknown as typeof fetch);
    await expect(make(404).getPromiseById('x')).rejects.toBeInstanceOf(PromiseNotFoundError);
    await expect(make(500).getPromiseById('x')).rejects.toBeInstanceOf(RepositoryError);
    await expect(make(500).listPublishedPromises()).rejects.toBeInstanceOf(RepositoryError);
  });

  it('drops evidence whose approvalStatus is present and not approved', () => {
    const base = pub.evidence[0];
    const record = toPromiseRecord({
      ...pub,
      evidence: [
        { ...base, id: 'ok', approvalStatus: 'approved' },
        { ...base, id: 'pending', approvalStatus: 'pending' },
        { ...base, id: 'rejected', approvalStatus: 'rejected' },
        { ...base, id: 'no-flag' },
      ],
    });
    expect(record.evidence.map((e) => e.id).sort()).toEqual(['no-flag', 'ok']);
  });
});
