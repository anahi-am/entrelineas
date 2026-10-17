import { formatDate } from '../domain/format';
import type { BoeFeedItem } from '../domain/types';
import { Link } from 'react-router-dom';

export function BoeFeed({ items }: { items: BoeFeedItem[] }) {
  if (items.length === 0) {
    return <p className="feed-empty">No hay publicaciones de vivienda en los últimos días.</p>;
  }
  return (
    <ol className="boe-feed">
      {items.map((item) => (
        <li key={item.id} className="feed-item">
          <div className="feed-date">
            <span aria-hidden="true">▣</span>
            <time dateTime={item.date}>{formatDate(item.date)}</time>
          </div>
          <div>
            <h3 className="feed-title"><Link to={`/boe/${encodeURIComponent(item.id)}`}>{item.title}</Link></h3>
            <p>{item.summary}</p>
            <span className="feed-source">BOE · {item.territory} · documento oficial · ver ficha →</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
