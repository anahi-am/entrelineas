import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PromiseDetailPage } from './pages/PromiseDetailPage';
import { BoeDetailPage } from './pages/BoeDetailPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="promesas/:id" element={<PromiseDetailPage />} />
        <Route path="boe/:id" element={<BoeDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
