import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { createMockPromiseRepository } from '../repository/mockPromiseRepository';
import type { PromiseRepository } from '../repository/PromiseRepository';
import { RepositoryProvider } from '../repository/RepositoryContext';

export function renderApp(
  route = '/',
  repository: PromiseRepository = createMockPromiseRepository({ latencyMs: 0 }),
) {
  return render(
    <RepositoryProvider repository={repository}>
      <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    </RepositoryProvider>,
  );
}
