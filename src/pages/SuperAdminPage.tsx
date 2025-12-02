import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Users } from 'lucide-react';
import { CreateUserModal } from '../components/users/CreateUserModal';
import { getAllUsers, deleteUser } from '../features/users/services/userService';
import { showSuccess, showError } from '../lib/utils/toast';
import { Spinner } from '../components/common/Spinner';

export const SuperAdminPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await getAllUsers();
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`)) {
      return;
    }

    const { error } = await deleteUser(userId);
    if (error) {
      showError('Erreur lors de la suppression');
    } else {
      showSuccess('Utilisateur supprimé');
      loadUsers();
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      super_admin: '👑 Super Admin',
      admin: '⚙️ Admin',
      responsable_classe: '📚 Responsable',
      famille: '👨‍👩‍👧 Famille'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-700 border-purple-300',
      admin: 'bg-blue-100 text-blue-700 border-blue-300',
      responsable_classe: 'bg-green-100 text-green-700 border-green-300',
      famille: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[role as keyof typeof colors] || colors.famille;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
            <p className="text-gray-600">Créez et gérez les comptes pour tous les utilisateurs</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            Créer un utilisateur
          </button>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tous les utilisateurs</h2>
                <p className="text-sm text-gray-600">{users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Aucun utilisateur créé
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(user.id, user.full_name)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Système d'identifiants unifié</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Login :</strong> Initiale.NOM (ex: A.DUMAS pour Arnaud DUMAS)</p>
            <p><strong>Mot de passe :</strong> JJMMAA (6 chiffres de la date de naissance, ex: 061279 pour 06/12/1979)</p>
            <p><strong>Email technique :</strong> login@mfr-conventions.local</p>
            <div className="mt-3 pt-3 border-t border-blue-300">
              <p className="font-semibold mb-1">Exemples :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Famille : A.DUPONT / 150892 (15/08/1992)</li>
                <li>Responsable : M.MARTIN / 230575 (23/05/1975)</li>
                <li>Super admin : J.DURAND / 101268 (10/12/1968)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            loadUsers();
          }}
        />
      )}
    </div>
  );
};
