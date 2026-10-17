import { useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/StateMessages';
import { PromiseCard } from '../components/PromiseCard';
import { StatusLegend } from '../components/StatusLegend';
import { TopicFilter } from '../components/TopicFilter';
import { SearchBar } from '../components/SearchBar';
import { pluralize } from '../domain/format';
import { TOPIC_META, topicFromSlug } from '../domain/labels';
import type { Topic } from '../domain/types';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useRepository } from '../repository/RepositoryContext';

export function HomePage() {
  const repository = useRepository();
  const [params, setParams] = useSearchParams();
  const activeTopic = topicFromSlug(params.get('tema'));
  const query = params.get('q') ?? '';
  const { state, reload } = useAsyncResource(
    (signal) => repository.listPublishedPromises({ signal }),
    [repository],
  );

  useDocumentTitle('Promesas y su rastro de evidencia');

  function selectTopic(topic: Topic | null) {
    const next = new URLSearchParams(params);
    if (topic) next.set('tema', TOPIC_META[topic].slug);
    else next.delete('tema');
    setParams(next);
  }

  function setQuery(value: string) {
    const next = new URLSearchParams(params);
    if (value.trim()) next.set('q', value);
    else next.delete('q');
    setParams(next);
  }

  const backSearch = params.toString() ? `?${params.toString()}` : '';

  return (
    <>
      <section className="intro" aria-labelledby="page-title">
        <h1 id="page-title">Lo que se prometió, lo que consta y lo que falta por comprobar</h1>
        <p className="lead">
          EntreLineas reúne lo que prometió un partido, qué acción oficial existe y qué pruebas la
          respaldan. Cuando algo no se puede confirmar, lo decimos con claridad.
        </p>
        <StatusLegend />
      </section>

      <section aria-labelledby="list-title" className="list-section">
        <h2 id="list-title" className="section-title">
          Actualizaciones y promesas
        </h2>
        <p className="section-intro">
          Las novedades oficiales aparecen primero. Busca una promesa, un partido o una fuente para
          seguir su rastro.
        </p>
        <SearchBar value={query} onChange={setQuery} />
        <TopicFilter active={activeTopic} onChange={selectTopic} />

        {state.status === 'loading' && <LoadingState label="Cargando promesas…" />}

        {state.status === 'error' && (
          <ErrorState title="No hemos podido cargar las promesas" onRetry={reload}>
            Ha ocurrido un problema al obtener los datos. Comprueba tu conexión e inténtalo de
            nuevo.
          </ErrorState>
        )}

        {state.status === 'success' && (() => {
          const all = state.data;
          const normalizedQuery = query.trim().toLocaleLowerCase('es');
          const matchesQuery = (promise: (typeof all)[number]) => {
            if (!normalizedQuery) return true;
            const searchable = [
              promise.originalText,
              promise.party.name,
              promise.territory,
              promise.officialSource.title,
              promise.officialSource.publisher,
              ...(promise.contextSources ?? []).flatMap((source) => [source.title, source.publisher]),
              ...promise.evidence.flatMap((item) => [item.title, item.summary, item.source.publisher]),
            ]
              .join(' ')
              .toLocaleLowerCase('es');
            return searchable.includes(normalizedQuery);
          };
          const visible = all
            .filter((p) => (activeTopic ? p.topic === activeTopic : true))
            .filter(matchesQuery)
            .sort((a, b) => {
              const aDate = a.evidence[0]?.date ?? a.officialSource.publishedAt ?? a.lastUpdatedAt;
              const bDate = b.evidence[0]?.date ?? b.officialSource.publishedAt ?? b.lastUpdatedAt;
              return bDate.localeCompare(aDate);
            });

          if (all.length === 0) {
            return (
              <EmptyState title="Todavía no hay promesas publicadas">
                Cuando haya promesas con evidencia aprobada, aparecerán aquí.
              </EmptyState>
            );
          }
          if (visible.length === 0 && (activeTopic || query)) {
            return (
              <EmptyState
                title={query ? `No encontramos resultados para «${query}»` : `No hay promesas publicadas sobre ${TOPIC_META[activeTopic!].label.toLowerCase()}`}
                action={
                  <button type="button" className="button" onClick={() => { selectTopic(null); setQuery(''); }}>
                    Limpiar búsqueda
                  </button>
                }
              />
            );
          }
          return (
            <>
              <p className="result-count" role="status" aria-live="polite">
                {pluralize(visible.length, 'resultado', 'resultados')}
                {activeTopic && ` sobre ${TOPIC_META[activeTopic].label.toLowerCase()}`}
                {query && ` para «${query}»`}
              </p>
              <ul className="card-list">
                {visible.map((promise) => (
                  <li key={promise.id}>
                    <PromiseCard promise={promise} backSearch={backSearch} />
                  </li>
                ))}
              </ul>
            </>
          );
        })()}
      </section>
    </>
  );
}
