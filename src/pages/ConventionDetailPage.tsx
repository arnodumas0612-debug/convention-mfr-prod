import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SignatureWorkflow } from '../components/SignatureWorkflow';
import { supabase } from '../lib/supabase';
import { useConventionsStore } from '../store/conventionsStore';

export const ConventionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedConvention, setSelectedConvention } = useConventionsStore();
  const loading = !selectedConvention;

  useEffect(() => {
    loadConvention();
  }, [id]);

  const loadConvention = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('conventions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error loading convention:', error);
    } else if (data) {
      setSelectedConvention(data);
    }
  };

  const refreshConvention = async () => {
    await loadConvention();
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!selectedConvention) {
    return (
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-red-600">Convention non trouvée</p>
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="text-blue-600 hover:text-blue-700 transition"
        >
          ← Retour à la liste
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Détails de la convention</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Élève:</span>{' '}
            {selectedConvention.student_firstname} {selectedConvention.student_lastname}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Entreprise:</span>{' '}
            {selectedConvention.company_name}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Classe:</span>{' '}
            {selectedConvention.student_class || '-'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Statut:</span>{' '}
            <span className="capitalize">{selectedConvention.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
      <SignatureWorkflow convention={selectedConvention} onUpdate={refreshConvention} />
    </div>
  );
};
