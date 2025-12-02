import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { NewConventionPage } from '../pages/NewConventionPage';
import { ConventionDetailPage } from '../pages/ConventionDetailPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { SuperAdminPage } from '../pages/SuperAdminPage';
import { HelpPage } from '../pages/HelpPage';

export const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/aide" element={<HelpPage />} />
        <Route path="/new" element={<NewConventionPage />} />
        <Route path="/conventions/:id" element={<ConventionDetailPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute>
              <SuperAdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
