import type { EvidenceStatus } from '../domain/types';

/** Shape differs per status so meaning never depends on colour alone. */
export function StatusIcon({ status }: { status: EvidenceStatus }) {
  return (
    <svg
      className="status-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {status === 'done' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l3 3 5-6" />
        </>
      )}
      {status === 'in_progress' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
        </>
      )}
      {status === 'blocked' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M7.5 12h9" />
        </>
      )}
      {status === 'no_trace' && <circle cx="12" cy="12" r="9" strokeDasharray="3 3.2" />}
      {status === 'insufficient_evidence' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.6 9.6a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1 .9-1 1.6" />
          <circle cx="12" cy="16.9" r=".6" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
