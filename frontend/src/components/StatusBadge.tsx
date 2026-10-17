import { EVIDENCE_STATUS_META } from '../domain/labels';
import type { EvidenceStatus } from '../domain/types';
import { StatusIcon } from './StatusIcon';

export function StatusBadge({
  status,
  size = 'md',
}: {
  status: EvidenceStatus;
  size?: 'md' | 'lg';
}) {
  return (
    <span className={`status status--${status} status--${size}`}>
      <StatusIcon status={status} />
      <span className="sr-only">Estado de la evidencia: </span>
      <span>{EVIDENCE_STATUS_META[status].label}</span>
    </span>
  );
}
