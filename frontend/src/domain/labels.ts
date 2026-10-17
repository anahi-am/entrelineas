import type { EvidenceKind, EvidenceStatus, Topic } from './types';

export const TOPICS: readonly Topic[] = ['housing'];

export const TOPIC_META: Record<Topic, { label: string; slug: string }> = {
  housing: { label: 'Vivienda', slug: 'vivienda' },
  pensions: { label: 'Pensiones', slug: 'pensiones' },
  employment: { label: 'Empleo', slug: 'empleo' },
};

export function topicFromSlug(slug: string | null): Topic | null {
  if (!slug) return null;
  return TOPICS.find((topic) => TOPIC_META[topic].slug === slug) ?? null;
}

export const EVIDENCE_STATUSES: readonly EvidenceStatus[] = [
  'done',
  'in_progress',
  'blocked',
  'no_trace',
  'insufficient_evidence',
];

export const EVIDENCE_STATUS_META: Record<
  EvidenceStatus,
  { label: string; description: string }
> = {
  done: {
    label: 'Hecho',
    description:
      'Hay evidencia aprobada de que la acción prometida se ha llevado a cabo.',
  },
  in_progress: {
    label: 'En trámite',
    description:
      'Hay evidencia aprobada de un proceso oficial en marcha que todavía no ha terminado.',
  },
  blocked: {
    label: 'Bloqueada',
    description:
      'Hay evidencia aprobada de que el proceso oficial está detenido o impedido.',
  },
  no_trace: {
    label: 'Sin rastro',
    description:
      'No hay evidencia aprobada de acción oficial. No significa que no exista: significa que no consta documentada.',
  },
  insufficient_evidence: {
    label: 'Evidencia insuficiente',
    description:
      'Hay indicios, pero no bastan para afirmar si la promesa se ha cumplido o no.',
  },
};

export const EVIDENCE_KIND_LABEL: Record<EvidenceKind, string> = {
  official_document: 'Documento oficial',
  official_record: 'Registro oficial',
  official_statement: 'Declaración oficial',
  independent_report: 'Informe independiente',
};
