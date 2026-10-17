import { Link } from 'react-router-dom';
import { EmptyState } from '../components/StateMessages';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada');
  return (
    <EmptyState
      title="Página no encontrada"
      action={
        <Link to="/" className="button">
          Ir al inicio
        </Link>
      }
    >
      La dirección que has abierto no existe en EntreLineas.
    </EmptyState>
  );
}
