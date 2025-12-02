import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../app/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuthContext();

  // TODO: Réactiver l'authentification
  // Mode développement : accès sans authentification
  return <>{children}</>;

  /* Authentication temporairement désactivée
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
  */
};
