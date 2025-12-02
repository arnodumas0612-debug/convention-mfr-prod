import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Router } from './app/Router';
import { AuthProvider } from './app/AuthProvider';
import { isSupabaseConfigured } from './lib/supabase';

function App() {
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setConfigError(true);
      console.error('Supabase configuration missing. Please check environment variables.');
    }
  }, []);

  if (configError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Erreur de configuration</h1>
          </div>
          <p className="text-gray-700 mb-4">
            Les variables d'environnement Supabase ne sont pas configurées correctement.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Variables requises :</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li><code className="bg-gray-200 px-2 py-1 rounded">VITE_SUPABASE_URL</code></li>
              <li><code className="bg-gray-200 px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            Veuillez vérifier la configuration et redémarrer l'application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
