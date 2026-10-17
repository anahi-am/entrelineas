import { EVIDENCE_KIND_LABEL } from '../domain/labels';
import { formatDate } from '../domain/format';
import type { PromiseRecord } from '../domain/types';
import { SourceReference } from './ExternalLink';

/**
 * The product's core: a vertical trail that starts at the promise, passes through
 * each approved piece of evidence, and ends at what is still unverified.
 */
export function EvidenceTrail({ promise }: { promise: PromiseRecord }) {
  return (
    <ol className="trail" aria-label="Rastro de evidencia, en orden cronológico">
      <li className="trail-item trail-item--start">
        <span className="trail-node" aria-hidden="true" />
        <div className="trail-body">
          <p className="trail-kicker">Punto de partida</p>
          <h3 className="trail-title">Promesa registrada</h3>
          <SourceReference source={promise.officialSource} />
        </div>
      </li>

      {promise.evidence.map((item) => (
        <li className="trail-item" key={item.id}>
          <span className="trail-node" aria-hidden="true" />
          <div className="trail-body">
            <p className="trail-kicker">
              <time dateTime={item.date}>{formatDate(item.date)}</time> ·{' '}
              {EVIDENCE_KIND_LABEL[item.kind]}
            </p>
            <h3 className="trail-title">{item.title}</h3>
            <p>{item.summary}</p>
            {item.originalExcerpt && (
              <figure className="excerpt">
                <blockquote lang="es">«{item.originalExcerpt}»</blockquote>
                <figcaption>Texto original de la fuente</figcaption>
              </figure>
            )}
            <SourceReference source={item.source} />
          </div>
        </li>
      ))}

      {promise.evidence.length === 0 && (
        <li className="trail-item trail-item--gap">
          <span className="trail-node" aria-hidden="true" />
          <div className="trail-body">
            <p className="trail-kicker">Sin pruebas aprobadas</p>
            <p>
              Todavía no hay evidencia aprobada de acción oficial sobre esta promesa. Esto no
              demuestra que no se haya hecho nada: solo que no hay nada publicado aquí.
            </p>
          </div>
        </li>
      )}

      <li className="trail-item trail-item--end">
        <span className="trail-node" aria-hidden="true" />
        <div className="trail-body">
          <p className="trail-kicker">Punto final</p>
          <h3 className="trail-title">
            <a href="#sin-verificar" className="plain-link">
              Lo que sigue sin verificar
            </a>
          </h3>
        </div>
      </li>
    </ol>
  );
}
