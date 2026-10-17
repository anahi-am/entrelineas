import { Link, useLocation, useParams } from 'react-router-dom';
import { EvidenceTrail } from '../components/EvidenceTrail';
import { SourceReference } from '../components/ExternalLink';
import { EmptyState, ErrorState, LoadingState } from '../components/StateMessages';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../domain/format';
import { EVIDENCE_STATUS_META, TOPIC_META } from '../domain/labels';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PromiseNotFoundError } from '../repository/PromiseRepository';
import { useRepository } from '../repository/RepositoryContext';

function BackLink() {
  const location = useLocation();
  const backSearch = (location.state as { backSearch?: string } | null)?.backSearch ?? '';
  return (
    <Link to={`/${backSearch}`} className="back-link">
      <span aria-hidden="true">←</span> Volver a las promesas
    </Link>
  );
}

export function PromiseDetailPage() {
  const { id = '' } = useParams();
  const repository = useRepository();
  const { state, reload } = useAsyncResource(
    (signal) => repository.getPromiseById(id, { signal }),
    [repository, id],
  );

  const title =
    state.status === 'success'
      ? `${state.data.party.name}: ${state.data.originalText}`
      : state.status === 'error' && state.error instanceof PromiseNotFoundError
        ? 'Promesa no encontrada'
        : 'Promesa';
  useDocumentTitle(title);

  if (state.status === 'loading') {
    return (
      <>
        <BackLink />
        <LoadingState label="Cargando la promesa…" />
      </>
    );
  }

  if (state.status === 'error') {
    if (state.error instanceof PromiseNotFoundError) {
      return (
        <>
          <BackLink />
          <EmptyState
            title="No encontramos esta promesa"
            action={
              <Link to="/" className="button">
                Ver todas las promesas
              </Link>
            }
          >
            Puede que el enlace sea incorrecto o que la promesa ya no esté publicada.
          </EmptyState>
        </>
      );
    }
    return (
      <>
        <BackLink />
        <ErrorState title="No hemos podido cargar esta promesa" onRetry={reload}>
          Ha ocurrido un problema al obtener los datos. Inténtalo de nuevo en unos momentos.
        </ErrorState>
      </>
    );
  }

  const promise = state.data;
  const statusMeta = EVIDENCE_STATUS_META[promise.status];

  return (
    <article className="detail">
      <BackLink />

      <header className="detail-header">
        <p className="eyebrow">
          {TOPIC_META[promise.topic].label} · {promise.territory}
        </p>
        <p className="label">Promesa original · {promise.party.name}</p>
        <h1 className="promise-text" lang="es">
          «{promise.originalText}»
        </h1>
        <div className="status-panel">
          <StatusBadge status={promise.status} size="lg" />
          <p>{statusMeta.description}</p>
          <p>
            <a href="#sin-verificar" className="plain-link">
              Ver lo que sigue sin verificar ↓
            </a>
          </p>
        </div>
      </header>

      <div className="detail-grid">
        <div className="detail-main">
          <section aria-labelledby="plain-title" className="block">
            <h2 id="plain-title" className="section-title">
              En palabras sencillas
            </h2>
            <p className="plain-text">{promise.plainLanguageExplanation}</p>
            <p className="hint">
              Explicación redactada para facilitar la lectura. No sustituye a las fuentes.
            </p>
          </section>

          <section aria-labelledby="trail-title" className="block">
            <h2 id="trail-title" className="section-title">
              Rastro de evidencia
            </h2>
            <EvidenceTrail promise={promise} />
          </section>

          <section id="sin-verificar" aria-labelledby="unverified-title" className="block unverified">
            <h2 id="unverified-title" className="section-title">
              Lo que sigue sin verificar
            </h2>
            {promise.unverifiedNotes.length > 0 ? (
              <ul className="unverified-list">
                {promise.unverifiedNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : (
              <p>Esta ficha no registra puntos pendientes de verificación.</p>
            )}
            <p className="hint">
              Solo se muestra evidencia aprobada. Lo que no aparece en el rastro no se ha podido
              confirmar.
            </p>
          </section>
        </div>

        <aside className="detail-side" aria-labelledby="facts-title">
          <h2 id="facts-title" className="section-title">
            Ficha
          </h2>
          <dl className="facts">
            <div>
              <dt>Partido</dt>
              <dd>{promise.party.name}</dd>
            </div>
            <div>
              <dt>Tema</dt>
              <dd>{TOPIC_META[promise.topic].label}</dd>
            </div>
            <div>
              <dt>Ámbito territorial</dt>
              <dd>{promise.territory}</dd>
            </div>
            <div>
              <dt>Última actualización</dt>
              <dd>{formatDate(promise.lastUpdatedAt)}</dd>
            </div>
            <div>
              <dt>Fuente oficial</dt>
              <dd>
                <SourceReference source={promise.officialSource} />
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
