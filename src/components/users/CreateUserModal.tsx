import { useState } from 'react';
import { createUser, generateLogin, generatePasswordFromBirthdate } from '../../features/users/services/userService';
import { showSuccess, showError } from '../../lib/utils/toast';
import { Input } from '../common/Input';

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateUserModal = ({ onClose, onSuccess }: CreateUserModalProps) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'responsable_classe' | 'famille'>('famille');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<{login: string, password: string, email: string, role: string} | null>(null);

  const previewLogin = firstname && lastname ? generateLogin(firstname, lastname) : '';
  const previewPassword = birthdate ? generatePasswordFromBirthdate(birthdate) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstname || !lastname || !birthdate || !role) {
      showError('Tous les champs sont requis');
      return;
    }

    setLoading(true);

    const { error, credentials: creds } = await createUser({
      firstname,
      lastname,
      birthdate,
      role,
    });

    setLoading(false);

    if (error) {
      showError('Erreur lors de la création');
      console.error(error);
    } else {
      setCredentials(creds);
      showSuccess('Utilisateur créé !');
      onSuccess();
    }
  };

  const copyCredentials = () => {
    const roleLabel: Record<string, string> = {
      super_admin: 'Super Administrateur',
      admin: 'Administrateur',
      responsable_classe: 'Responsable de classe',
      famille: 'Famille'
    };
    const displayRole = roleLabel[credentials?.role || 'famille'] || credentials?.role || 'Famille';

    const text = `Rôle: ${displayRole}\nLogin: ${credentials?.login}\nMot de passe: ${credentials?.password}`;
    navigator.clipboard.writeText(text);
    showSuccess('Identifiants copiés !');
  };

  const getRoleLabel = (r: string) => {
    const labels: Record<string, string> = {
      super_admin: '👑 Super Administrateur',
      admin: '⚙️ Administrateur',
      responsable_classe: '👨‍🏫 Responsable de classe',
      famille: '👤 Famille'
    };
    return labels[r] || r;
  };

  if (credentials) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">✅ Compte créé !</h2>

          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-4 text-center">
              Transmettez ces identifiants à l'utilisateur :
            </p>

            <div className="bg-white p-3 rounded mb-3">
              <p className="text-xs text-gray-500">Rôle</p>
              <p className="text-lg font-semibold text-gray-800">{getRoleLabel(credentials.role)}</p>
            </div>

            <div className="bg-white p-4 rounded mb-3">
              <p className="text-xs text-gray-500">Login (identifiant)</p>
              <p className="text-2xl font-bold text-blue-600">{credentials.login}</p>
            </div>

            <div className="bg-white p-4 rounded">
              <p className="text-xs text-gray-500">Mot de passe</p>
              <p className="text-2xl font-bold text-blue-600">{credentials.password}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={copyCredentials}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              📋 Copier les identifiants
            </button>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Fermer
            </button>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>Important :</strong> Créez maintenant l'utilisateur dans Supabase :
              <br/>1. Dashboard → Authentication → Users → Add user
              <br/>2. Email : <code className="bg-yellow-100 px-1">{credentials.email}</code>
              <br/>3. Password : <code className="bg-yellow-100 px-1">{credentials.password}</code>
              <br/>4. ✅ Cochez "Auto Confirm User"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Créer un utilisateur</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="famille">👤 Famille</option>
              <option value="responsable_classe">👨‍🏫 Responsable de classe</option>
              <option value="admin">⚙️ Administrateur</option>
              <option value="super_admin">👑 Super Administrateur</option>
            </select>
          </div>

          <Input
            label="Prénom *"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Arnaud"
            required
          />

          <Input
            label="Nom *"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="DUMAS"
            required
          />

          <Input
            label="Date de naissance *"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />

          {previewLogin && (
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                ✨ Identifiants qui seront générés :
              </p>
              <div className="space-y-1">
                <p className="font-mono text-sm">
                  <span className="text-gray-600">Login :</span> <strong className="text-blue-600">{previewLogin}</strong>
                </p>
                <p className="font-mono text-sm">
                  <span className="text-gray-600">Mot de passe :</span> <strong className="text-blue-600">{previewPassword || '------'}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
