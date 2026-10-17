import { EVIDENCE_STATUSES, EVIDENCE_STATUS_META } from '../domain/labels';
import { StatusBadge } from './StatusBadge';

export function StatusLegend() {
  return (
    <details className="legend">
      <summary>Cómo leer los estados</summary>
      <dl className="legend-list">
        {EVIDENCE_STATUSES.map((status) => (
          <div key={status} className="legend-row">
            <dt>
              <StatusBadge status={status} />
            </dt>
            <dd>{EVIDENCE_STATUS_META[status].description}</dd>
          </div>
        ))}
      </dl>
      <p className="legend-note">
        Los estados describen la evidencia aprobada disponible. EntreLineas no valora ni puntúa a los
        partidos.
      </p>
    </details>
  );
}
