import { Link, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/StateMessages';
import { formatDate } from '../domain/format';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PromiseNotFoundError } from '../repository/PromiseRepository';
import { useRepository } from '../repository/RepositoryContext';

export function BoeDetailPage() {
  const { id = '' } = useParams();
  const repository = useRepository();
  const { state, reload } = useAsyncResource(
    (signal) => repository.getBoeItem(id, { signal }),
    [repository, id],
  );
  useDocumentTitle(state.status === 'success' ? state.data.title : 'Actualización del BOE');

  if (state.status === 'loading') return <><Link to="/" className="back-link">← Volver al inicio</Link><LoadingState label="Cargando el documento…" /></>;
  if (state.status === 'error') {
    if (state.error instanceof PromiseNotFoundError) return <><Link to="/" className="back-link">← Volver al inicio</Link><EmptyState title="No encontramos esta actualización"><Link to="/" className="button">Volver al feed</Link></EmptyState></>;
    return <><Link to="/" className="back-link">← Volver al inicio</Link><ErrorState title="No hemos podido cargar el documento" onRetry={reload}>Inténtalo de nuevo en unos momentos.</ErrorState></>;
  }
  const item = state.data;
  return (
    <article className="detail boe-detail">
      <Link to="/" className="back-link">← Volver al feed</Link>
      <header className="detail-header">
        <p className="eyebrow">BOE · {item.territory} · {formatDate(item.date)}</p>
        <h1 className="promise-text">{item.title}</h1>
        <div className="status-panel"><strong>Actualización oficial</strong><p>Novedad documental sobre vivienda. Esto no demuestra por sí solo que una promesa política se haya cumplido.</p></div>
      </header>
      <section className="block" aria-labelledby="boe-summary-title">
        <h2 id="boe-summary-title" className="section-title">Resumen</h2>
        <p className="plain-text">{item.summary}</p>
      </section>
      {item.originalExcerpt && <section className="block excerpt"><h2 className="section-title">Fragmento del documento original</h2><blockquote>{item.originalExcerpt}</blockquote></section>}
      <a className="button" href={item.source.url} target="_blank" rel="noreferrer">Abrir fuente oficial del BOE ↗</a>
    </article>
  );
}
