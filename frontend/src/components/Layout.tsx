import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useRepository } from '../repository/RepositoryContext';

export function Layout() {
  const repository = useRepository();
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Move focus to the content after in-app navigation so keyboard and
  // screen-reader users land on the new page, not on the old link.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" className="brand" aria-label="EntreLineas, ir al inicio">
            <span className="brand-mark" aria-hidden="true" />
            EntreLineas
          </Link>
          <p className="tagline">Lo prometido, lo hecho y lo que falta por comprobar</p>
        </div>
      </header>

      {repository.dataSource === 'mock' && (
        <div className="demo-banner" role="note">
          <div className="container">
            <strong>Datos de demostración.</strong> Los partidos, promesas y fuentes de esta versión
            son ficticios y sirven solo para probar la interfaz.
          </div>
        </div>
      )}

      <main id="contenido" className="container main" tabIndex={-1} ref={mainRef}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            Solo se muestra evidencia aprobada. Lo que no aparece aquí no se ha podido confirmar, y
            eso no equivale a que no haya ocurrido.
          </p>
        </div>
      </footer>
    </>
  );
}
