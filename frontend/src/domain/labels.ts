import type { EvidenceKind, EvidenceStatus, ProgressStatus, PublicationStatus, ReviewStatus, Topic } from './types';

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

export const EVIDENCE_TIERS = [
  {
    label: 'Tier 1 · Resultado oficial directo',
    description: 'Una fuente oficial informa explícitamente del resultado relacionado con la promesa.',
  },
  {
    label: 'Tier 2 · Aplicación oficial',
    description: 'Existe una ley, decreto, presupuesto, contrato o programa oficial relacionado, pero no prueba por sí solo el resultado final.',
  },
  {
    label: 'Tier 3 · Contexto oficial',
    description: 'Una estadística oficial, como INE, aporta contexto, pero no atribuye el resultado a la promesa.',
  },
  {
    label: 'Tier 4 · Fuente secundaria',
    description: 'Prensa, ONG o investigación externa. Puede orientar la búsqueda, pero no basta por sí sola para publicar un resultado.',
  },
] as const;

export const REVIEW_STATUS_META: Record<ReviewStatus, { label: string; description: string }> = {
  pending_review: { label: 'Pendiente de revisión', description: 'La ficha aún no ha sido revisada por el equipo.' },
  source_verified: { label: 'Fuente verificada', description: 'La promesa aparece en la fuente citada; esto no demuestra su cumplimiento.' },
  insufficient_evidence: { label: 'Evidencia insuficiente', description: 'Las fuentes disponibles no permiten evaluar el cumplimiento.' },
  no_evidence_found: { label: 'Sin evidencia encontrada', description: 'No se encontró evidencia en las fuentes revisadas hasta la fecha indicada.' },
  rejected: { label: 'Rechazada', description: 'La ficha no cumple los criterios de publicación.' },
};

export const PROGRESS_STATUS_META: Record<ProgressStatus, string> = {
  not_started: 'No iniciada',
  in_progress: 'En proceso',
  outcome_documented: 'Resultado documentado',
  completed: 'Cumplida',
  discontinued: 'Decaída o retirada',
  not_assessable: 'No evaluable',
};

export const PUBLICATION_STATUS_META: Record<PublicationStatus, string> = {
  draft: 'Borrador',
  pending_review: 'Pendiente de revisión pública',
  approved: 'Registro público aprobado',
  rejected: 'No publicado',
};
