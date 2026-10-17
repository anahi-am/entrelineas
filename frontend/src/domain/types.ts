/** Technical identifiers are English; user-facing labels live in the *Meta maps (Spanish). */

export type Topic = 'housing' | 'pensions' | 'employment';

export type EvidenceStatus =
  | 'done' // Hecho
  | 'in_progress' // En trámite
  | 'blocked' // Bloqueada
  | 'no_trace' // Sin rastro
  | 'insufficient_evidence'; // Evidencia insuficiente

export type EvidenceKind =
  | 'official_document'
  | 'official_record'
  | 'official_statement'
  | 'independent_report';

export interface SourceLink {
  title: string;
  publisher: string;
  url: string;
  /** ISO date (YYYY-MM-DD), optional. */
  publishedAt?: string;
}

export interface EvidenceItem {
  id: string;
  kind: EvidenceKind;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  title: string;
  /** Plain-language summary written for readers (Spanish). */
  summary: string;
  /** Verbatim text from the source, in its original language. Never paraphrased. */
  originalExcerpt?: string;
  source: SourceLink;
}

export interface PromiseRecord {
  id: string;
  /** Verbatim promise as published by the party. Never edited. */
  originalText: string;
  party: { name: string };
  topic: Topic;
  territory: string;
  plainLanguageExplanation: string;
  officialSource: SourceLink;
  /** Label supplied by the data source. The UI never computes or changes it. */
  status: EvidenceStatus;
  /** Only approved evidence ever reaches this array (enforced in the data layer). */
  evidence: EvidenceItem[];
  /** What is still unverified for this promise. */
  unverifiedNotes: string[];
  /** ISO date (YYYY-MM-DD). */
  lastUpdatedAt: string;
}
