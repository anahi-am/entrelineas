import type { ReactNode } from 'react';

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <p className="state-title">{label}</p>
      <div className="skeleton-list" aria-hidden="true">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="state state--empty">
      <h2 className="state-title">{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title,
  onRetry,
  children,
}: {
  title: string;
  onRetry?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="state state--error" role="alert">
      <h2 className="state-title">{title}</h2>
      {children && <p>{children}</p>}
      {onRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
