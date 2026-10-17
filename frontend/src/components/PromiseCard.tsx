import { Link } from 'react-router-dom';
import { TOPIC_META } from '../domain/labels';
import { pluralize } from '../domain/format';
import type { PromiseRecord } from '../domain/types';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../domain/format';

function sourceGlyph(source: string): string {
  if (source.toLowerCase().includes('boe')) return '▣';
  if (source.toLowerCase().includes('ine')) return '◫';
  if (source.toLowerCase().includes('moncloa')) return '◆';
  return '●';
}

export function PromiseCard({
  promise,
  backSearch,
}: {
  promise: PromiseRecord;
  backSearch: string;
}) {
  const count = promise.evidence.length;
  return (
    <article className="card">
      <div className="card-top">
        <StatusBadge status={promise.status} />
        <p className="card-meta">
          {TOPIC_META[promise.topic].label} · {promise.territory}
        </p>
      </div>
      <p className="source-chip">
        <span aria-hidden="true">{sourceGlyph(promise.officialSource.publisher)}</span>
        {promise.officialSource.publisher}
        {(promise.evidence[0]?.date || promise.officialSource.publishedAt) && (
          <time dateTime={promise.evidence[0]?.date ?? promise.officialSource.publishedAt}>
            {formatDate(promise.evidence[0]?.date ?? promise.officialSource.publishedAt!)}
          </time>
        )}
      </p>
      <h3 className="card-title">
        <Link
          to={`/promesas/${encodeURIComponent(promise.id)}`}
          state={{ backSearch }}
          className="card-link"
        >
          <span lang="es">«{promise.originalText}»</span>
        </Link>
      </h3>
      <p className="card-party">{promise.party.name}</p>
      {promise.evidence[0]?.originalExcerpt && (
        <p className="card-highlight">“{promise.evidence[0].originalExcerpt.slice(0, 160)}”</p>
      )}
      <p className="card-foot">
        {count === 0
          ? 'Sin pruebas aprobadas'
          : pluralize(count, 'prueba aprobada', 'pruebas aprobadas')}
        <span aria-hidden="true" className="card-arrow">
          Ver rastro →
        </span>
      </p>
    </article>
  );
}
