import { EVIDENCE_STATUSES, EVIDENCE_STATUS_META, EVIDENCE_TIERS } from '../domain/labels';
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
      <div className="tier-guide">
        <h3>Cómo leemos la evidencia</h3>
        <dl className="legend-list">
          {EVIDENCE_TIERS.map((tier) => (
            <div key={tier.label} className="legend-row">
              <dt>{tier.label}</dt>
              <dd>{tier.description}</dd>
            </div>
          ))}
        </dl>
        <p className="legend-note">
          Una estadística oficial puede aportar contexto sin demostrar que una promesa se haya cumplido.
        </p>
      </div>
    </details>
  );
}
