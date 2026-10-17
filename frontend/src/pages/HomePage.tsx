import { useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/StateMessages';
import { PromiseCard } from '../components/PromiseCard';
import { StatusLegend } from '../components/StatusLegend';
import { TopicFilter } from '../components/TopicFilter';
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
          Promesas publicadas
        </h2>
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
          const visible = activeTopic ? all.filter((p) => p.topic === activeTopic) : all;

          if (all.length === 0) {
            return (
              <EmptyState title="Todavía no hay promesas publicadas">
                Cuando haya promesas con evidencia aprobada, aparecerán aquí.
              </EmptyState>
            );
          }
          if (visible.length === 0 && activeTopic) {
            return (
              <EmptyState
                title={`No hay promesas publicadas sobre ${TOPIC_META[activeTopic].label.toLowerCase()}`}
                action={
                  <button type="button" className="button" onClick={() => selectTopic(null)}>
                    Ver todos los temas
                  </button>
                }
              />
            );
          }
          return (
            <>
              <p className="result-count" role="status" aria-live="polite">
                {pluralize(visible.length, 'promesa', 'promesas')}
                {activeTopic && ` sobre ${TOPIC_META[activeTopic].label.toLowerCase()}`}
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
