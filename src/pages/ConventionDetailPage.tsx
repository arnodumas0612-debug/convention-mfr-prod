import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { SignatureWorkflow } from '../components/SignatureWorkflow';
import { generateConventionDocx } from '../services/docxService';
import { supabase } from '../lib/supabase';
import { useConventionsStore } from '../store/conventionsStore';

export const ConventionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedConvention, setSelectedConvention } = useConventionsStore();
  const [signatures, setSignatures] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const loading = !selectedConvention;

  useEffect(() => {
    loadConvention();
    loadSignatures();
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

  const loadSignatures = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('signatures')
      .select('*')
      .eq('convention_id', id)
      .order('signed_at', { ascending: true });

    if (error) {
      console.error('Error loading signatures:', error);
    } else if (data) {
      setSignatures(data);
    }
  };

  const refreshConvention = async () => {
    await loadConvention();
    await loadSignatures();
  };

  const handleDownloadDocx = async () => {
    if (!selectedConvention) return;

    try {
      setIsGenerating(true);
      await generateConventionDocx(selectedConvention, signatures);
    } catch (error) {
      console.error('Erreur génération convention:', error);
      alert('Erreur lors de la génération de la convention');
    } finally {
      setIsGenerating(false);
    }
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
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/admin')}
          className="text-blue-600 hover:text-blue-700 transition"
        >
          ← Retour à la liste
        </button>
        <button
          onClick={handleDownloadDocx}
          disabled={selectedConvention.status !== 'ready_to_print' || isGenerating}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
            selectedConvention.status === 'ready_to_print' && !isGenerating
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Download className="w-5 h-5" />
          {isGenerating
            ? 'Génération en cours...'
            : selectedConvention.status === 'ready_to_print'
            ? 'Télécharger la convention (.docx)'
            : 'En attente des signatures'}
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
