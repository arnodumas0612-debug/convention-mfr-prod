import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FileText, Home, Users, LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { useAuthContext } from '../../app/AuthProvider';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, signOut } = useAuthContext();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MFR - Conventions de stage</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                Accueil
              </button>
              <button
                onClick={() => navigate('/aide')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive('/aide') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Aide
              </button>
              <button
                onClick={() => navigate('/admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive('/admin') && !isActive('/super-admin') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                Admin
              </button>
              {userProfile?.role === 'super_admin' && (
                <button
                  onClick={() => navigate('/super-admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    isActive('/super-admin') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Utilisateurs
                </button>
              )}
              {userProfile && (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{userProfile.full_name}</p>
                      <p className="text-xs text-gray-600 capitalize">{userProfile.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Déconnexion"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
};
