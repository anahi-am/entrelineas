import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { mockPromiseRows } from './data/mock/mockPromises';
import { EVIDENCE_STATUSES, EVIDENCE_STATUS_META } from './domain/labels';
import { StatusBadge } from './components/StatusBadge';
import { render } from '@testing-library/react';
import { createMockPromiseRepository } from './repository/mockPromiseRepository';
import { renderApp } from './test/renderApp';

describe('StatusBadge', () => {
  it('renders the Spanish label for every status', () => {
    for (const status of EVIDENCE_STATUSES) {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(EVIDENCE_STATUS_META[status].label)).toBeInTheDocument();
      unmount();
    }
    expect(EVIDENCE_STATUSES.map((s) => EVIDENCE_STATUS_META[s].label)).toEqual([
      'Hecho',
      'En trámite',
      'Bloqueada',
      'Sin rastro',
      'Evidencia insuficiente',
    ]);
  });
});

describe('Home page', () => {
  it('shows a loading state, then the promise list', async () => {
    renderApp();
    expect(screen.getByRole('status')).toHaveTextContent('Cargando promesas…');
    const list = await screen.findByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(mockPromiseRows.length);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('shows the demo-data banner for mock data', async () => {
    renderApp();
    expect(await screen.findByText('Datos de demostración.')).toBeInTheDocument();
  });

  it('filters by the housing topic and keeps filter state accessible', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('list');

    const group = screen.getByRole('group', { name: 'Filtrar por tema' });
    expect(within(group).getByRole('button', { name: 'Todos' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(within(group).getByRole('button', { name: 'Vivienda' }));
    const expected = mockPromiseRows.filter((r) => r.topic === 'housing').length;
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(expected);
    expect(within(group).getByRole('button', { name: 'Vivienda' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/sobre vivienda/)).toBeInTheDocument();
  });

  it('reads the housing topic from the URL', async () => {
    renderApp('/?tema=vivienda');
    await screen.findByRole('list');
    expect(screen.getByRole('button', { name: 'Vivienda' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows an empty state with no promises', async () => {
    renderApp('/', createMockPromiseRepository({ latencyMs: 0, scenario: 'empty' }));
    expect(await screen.findByText('Todavía no hay promesas publicadas')).toBeInTheDocument();
  });

  it('shows an error state and recovers on retry', async () => {
    const user = userEvent.setup();
    let fail = true;
    const working = createMockPromiseRepository({ latencyMs: 0 });
    renderApp('/', {
      ...working,
      listPublishedPromises: async (options) => {
        if (fail) throw new Error('boom');
        return working.listPublishedPromises(options);
      },
    });
    expect(await screen.findByRole('alert')).toHaveTextContent('No hemos podido cargar las promesas');
    fail = false;
    await user.click(screen.getByRole('button', { name: 'Intentar de nuevo' }));
    expect(await screen.findByRole('list')).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderApp();
    await screen.findByRole('list');
    expect((await axe(container)).violations).toEqual([]);
  });

  it('offers a skip link as the first focusable element', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('list');
    await user.tab();
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toHaveFocus();
  });
});

describe('Promise detail page', () => {
  const row = mockPromiseRows.find((r) => r.id === 'demo-vivienda-001')!;

  it('links from the list to the detail and back', async () => {
    const user = userEvent.setup();
    renderApp('/?tema=vivienda');
    const link = await screen.findByRole('link', { name: new RegExp(row.originalText.slice(0, 30)) });
    await user.click(link);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(row.originalText);
    await user.click(screen.getByRole('link', { name: /Volver a las promesas/ }));
    expect(await screen.findByRole('button', { name: 'Vivienda' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows the full evidence trail for a promise', async () => {
    renderApp(`/promesas/${row.id}`);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando la promesa…');

    const h1 = await screen.findByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(`«${row.originalText}»`); // original text preserved
    expect(h1).toHaveAttribute('lang', 'es');

    expect(screen.getAllByText('Alianza Ejemplo').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vivienda').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Municipio de Ejemplo').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'En palabras sencillas' })).toBeInTheDocument();
    expect(screen.getByText(row.plainLanguageExplanation)).toBeInTheDocument();

    const panel = h1.parentElement!.querySelector('.status-panel') as HTMLElement;
    expect(within(panel).getByText('En trámite')).toBeInTheDocument();

    const trail = screen.getByRole('list', { name: /Rastro de evidencia/ });
    const approved = row.evidence.filter((e) => e.approved);
    for (const item of approved) expect(within(trail).getByText(item.title)).toBeInTheDocument();
  });

  it('does not show unapproved evidence', async () => {
    renderApp(`/promesas/${row.id}`);
    await screen.findByRole('heading', { level: 1 });
    const hidden = row.evidence.find((e) => !e.approved)!;
    expect(screen.queryByText(hidden.title)).not.toBeInTheDocument();
    expect(screen.queryByText(hidden.source.title)).not.toBeInTheDocument();
  });

  it('renders source links safely, in a new tab, with an accessible hint', async () => {
    renderApp(`/promesas/${row.id}`);
    await screen.findByRole('heading', { level: 1 });
    // The official source appears in the "Ficha" and at the start of the trail.
    const links = screen.getAllByRole('link', { name: /Programa electoral \(documento de ejemplo\)/ });
    expect(links.length).toBeGreaterThanOrEqual(2);
    for (const link of links) {
      expect(link).toHaveAttribute('href', row.officialSource.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(link).toHaveAccessibleName(/se abre en una pestaña nueva/);
    }
  });

  it('states clearly what is still unverified', async () => {
    renderApp(`/promesas/${row.id}`);
    await screen.findByRole('heading', { level: 1 });
    const section = screen.getByRole('region', { name: 'Lo que sigue sin verificar' });
    for (const note of row.unverifiedNotes) expect(within(section).getByText(note)).toBeInTheDocument();
  });

  it('explains a "Sin rastro" promise without implying nothing happened', async () => {
    renderApp('/promesas/demo-vivienda-003');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByText(/Esto no demuestra que no se haya hecho nada/)).toBeInTheDocument();
  });

  it('shows a not-found state for an unknown id', async () => {
    renderApp('/promesas/no-existe');
    expect(await screen.findByText('No encontramos esta promesa')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas las promesas' })).toHaveAttribute('href', '/');
  });

  it('shows an error state with retry when loading fails', async () => {
    renderApp(`/promesas/${row.id}`, createMockPromiseRepository({ latencyMs: 0, scenario: 'error' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No hemos podido cargar esta promesa');
    expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderApp(`/promesas/${row.id}`);
    await screen.findByRole('heading', { level: 1 });
    expect((await axe(container)).violations).toEqual([]);
  });
});

describe('Unknown route', () => {
  it('shows a Spanish not-found page', async () => {
    renderApp('/ruta/inexistente');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument());
  });
});
