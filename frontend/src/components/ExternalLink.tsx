import type { SourceLink } from '../domain/types';
import { formatDate, hostnameOf, isSafeHttpUrl } from '../domain/format';

/** Source link with publisher, host and date. Opens in a new tab and says so. */
export function SourceReference({ source }: { source: SourceLink }) {
  const safe = isSafeHttpUrl(source.url);
  return (
    <p className="source">
      {safe ? (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="source-link">
          {source.title}
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      ) : (
        <span className="source-link source-link--disabled">
          {source.title} <em>(enlace no disponible)</em>
        </span>
      )}
      <span className="source-meta">
        {source.publisher}
        {safe && <> · {hostnameOf(source.url)}</>}
        {source.publishedAt && <> · {formatDate(source.publishedAt)}</>}
      </span>
    </p>
  );
}
