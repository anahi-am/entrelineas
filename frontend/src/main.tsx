import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { createDefaultPromiseRepository } from './repository';
import { RepositoryProvider } from './repository/RepositoryContext';
import './styles.css';

const repository = createDefaultPromiseRepository();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RepositoryProvider repository={repository}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </RepositoryProvider>
  </StrictMode>,
);
