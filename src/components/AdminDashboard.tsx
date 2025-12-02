import { FileText, CheckCircle, Clock, Download, Eye, Trash2, Search, X } from 'lucide-react';
import { Convention } from '../types/convention';
import { supabase } from '../lib/supabase';
import { useConventions } from '../features/conventions/hooks/useConventions';
import { useConventionsStore } from '../store/conventionsStore';
import { useConventionsFilters } from '../features/conventions/hooks/useConventionsFilters';
import { showSuccess, showError } from '../lib/utils/toast';
import { Spinner } from './common/Spinner';

interface AdminDashboardProps {
  onViewConvention: (convention: Convention) => void;
}

export function AdminDashboard({ onViewConvention }: AdminDashboardProps) {
  useConventions();
  const { conventions, loading, deleteConvention } = useConventionsStore();

  const {
    filteredConventions,
    statusFilter,
    setStatusFilter,
    classFilter,
    setClassFilter,
    searchQuery,
    setSearchQuery,
    resetFilters,
    hasActiveFilters,
  } = useConventionsFilters(conventions);

  const handleDelete = async (conventionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette convention ? Cette action est irréversible.')) {
      return;
    }

    try {
      await supabase
        .from('signatures')
        .delete()
        .eq('convention_id', conventionId);

      await supabase
        .from('stage_periods')
        .delete()
        .eq('convention_id', conventionId);

      const { error } = await supabase
        .from('conventions')
        .delete()
        .eq('id', conventionId);

      if (error) throw error;

      deleteConvention(conventionId);
      showSuccess('Convention supprimée avec succès !');
    } catch (error) {
      console.error('Error deleting convention:', error);
      showError('Erreur lors de la suppression de la convention');
    }
  };

  const totalConventions = filteredConventions.length;
  const pending = filteredConventions.filter(c => c.status === 'pending_signatures' || c.status === 'draft').length;
  const signed = filteredConventions.filter(c => c.status === 'signed').length;
  const readyToPrint = filteredConventions.filter(c => c.status === 'ready_to_print').length;

  const pendingPercent = totalConventions > 0 ? Math.round((pending / totalConventions) * 100) : 0;
  const signedPercent = totalConventions > 0 ? Math.round((signed / totalConventions) * 100) : 0;
  const readyPercent = totalConventions > 0 ? Math.round((readyToPrint / totalConventions) * 100) : 0;

  const handleExportCSV = () => {
    const csvData = filteredConventions.map(c => ({
      'Élève': `${c.student_firstname} ${c.student_lastname}`,
      'Classe': c.student_class,
      'Entreprise': c.company_name,
      'SIREN': c.company_siren,
      'Type': c.convention_type || '',
      'Statut': c.status,
      'Date création': new Date(c.created_at || '').toLocaleDateString('fr-FR'),
      'Mineur': c.is_minor ? 'Oui' : 'Non',
    }));

    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `conventions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showSuccess('Export CSV téléchargé !');
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: '📝 Brouillon',
      pending_signatures: '🕒 En attente signatures',
      signed: '✅ Signée',
      ready_to_print: '✅ Prête à imprimer',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      pending_signatures: 'bg-orange-100 text-orange-800',
      signed: 'bg-green-100 text-green-800',
      ready_to_print: 'bg-green-100 text-green-800 font-semibold',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Gestion des conventions de stage</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredConventions.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold"
        >
          <Download className="w-5 h-5" />
          Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{totalConventions}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">En attente</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">{pending}</p>
              <p className="text-xs text-gray-400 mt-1">{pendingPercent}% du total</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Signées</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{signed}</p>
              <p className="text-xs text-gray-400 mt-1">{signedPercent}% du total</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Prêtes</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{readyToPrint}</p>
              <p className="text-xs text-gray-400 mt-1">{readyPercent}% du total</p>
            </div>
            <Download className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filtres et recherche</h2>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <X className="w-4 h-4" />
              Réinitialiser
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Recherche
            </label>
            <input
              type="text"
              placeholder="Élève, entreprise, SIREN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="pending_signatures">En attente signatures</option>
              <option value="signed">Signées</option>
              <option value="ready_to_print">Prêtes à imprimer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les classes</option>
              <option value="4ème">4ème</option>
              <option value="3èmeA">3ème A</option>
              <option value="3èmeN">3ème N</option>
              <option value="2nde1">2nde 1</option>
              <option value="2nde2">2nde 2</option>
              <option value="1ère1">1ère 1</option>
              <option value="1ère2">1ère 2</option>
              <option value="Term1">Term 1</option>
              <option value="Term2">Term 2</option>
            </select>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {filteredConventions.length === conventions.length ? (
              <span><strong>{conventions.length}</strong> convention(s) au total</span>
            ) : (
              <span>
                <strong>{filteredConventions.length}</strong> résultat(s) sur <strong>{conventions.length}</strong> convention(s)
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Élève
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConventions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">Aucune convention trouvée</p>
                      <p className="text-sm">Essayez de modifier vos filtres</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredConventions.map((conv) => (
                  <tr key={conv.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {conv.student_firstname} {conv.student_lastname}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{conv.student_class}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{conv.company_name}</div>
                      <div className="text-xs text-gray-500">{conv.company_siren}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(conv.status || '')}`}>
                        {getStatusLabel(conv.status || '')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(conv.created_at || '').toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onViewConvention(conv)}
                        className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </button>
                      <button
                        onClick={() => handleDelete(conv.id!)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
