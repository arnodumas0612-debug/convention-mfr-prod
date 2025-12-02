import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, PenTool, CheckCircle, Download } from 'lucide-react';
import { Convention, StagePeriod, Signature } from '../types/convention';
import { SignaturePad } from './SignaturePad';
import { supabase } from '../lib/supabase';
import { downloadConvention } from '../utils/conventionDocGenerator';
import { getConventionType } from '../utils/conventionTypeHelper';
import { showSuccess, showError, showLoading, dismissToast } from '../lib/utils/toast';
import { Spinner } from './common/Spinner';
import { updateConventionStatusAfterDirectorSignature } from '../features/signatures/utils/signatureValidation';
import { DownloadConventionButton } from './conventions/DownloadConventionButton';

interface ConventionWorkflowProps {
  onComplete: (conventionId: string) => void;
  onCancel: () => void;
  initialClass?: string;
}

export function ConventionWorkflow({ onComplete, onCancel, initialClass }: ConventionWorkflowProps) {
  const [step, setStep] = useState(1);
  const [convention, setConvention] = useState<Convention>({
    status: 'draft',
    is_minor: false,
    student_class: initialClass || '',
  });
  const [periods, setPeriods] = useState<StagePeriod[]>([
    { period_number: 1, start_date: '', end_date: '', daily_hours: '' }
  ]);
  const [signatures, setSignatures] = useState<{ [key: string]: string }>({});
  const [signatureObjects, setSignatureObjects] = useState<{ [key: string]: Signature }>({});
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [currentSigner, setCurrentSigner] = useState<{
    role: Signature['signer_role'];
    name: string;
  } | null>(null);
  const [savedConventionId, setSavedConventionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (savedConventionId && step === 4) {
      loadSignatures();
    }
  }, [savedConventionId, step]);

  useEffect(() => {
    if (convention.student_class) {
      try {
        const conventionType = getConventionType(convention.student_class);
        setConvention(prev => ({ ...prev, convention_type: conventionType }));
      } catch (error) {
        console.error('Erreur lors de la détermination du type de convention:', error);
      }
    }
  }, [convention.student_class]);

  const loadSignatures = async () => {
    if (!savedConventionId) return;

    const { data, error } = await supabase
      .from('signatures')
      .select('*')
      .eq('convention_id', savedConventionId);

    if (!error && data) {
      const sigMap: { [key: string]: string } = {};
      const sigObjMap: { [key: string]: Signature } = {};
      data.forEach(sig => {
        sigMap[sig.signer_role] = sig.signature_data;
        sigObjMap[sig.signer_role] = sig;
      });
      setSignatures(sigMap);
      setSignatureObjects(sigObjMap);
    }
  };

  const updateConvention = (field: keyof Convention, value: any) => {
    setConvention(prev => ({ ...prev, [field]: value }));
  };

  const addPeriod = () => {
    if (periods.length < 7) {
      setPeriods([...periods, {
        period_number: periods.length + 1,
        start_date: '',
        end_date: '',
        daily_hours: ''
      }]);
    }
  };

  const removePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  const updatePeriod = (index: number, field: keyof StagePeriod, value: string) => {
    const newPeriods = [...periods];
    newPeriods[index] = { ...newPeriods[index], [field]: value };
    setPeriods(newPeriods);
  };

  const signersConfig = [
    { role: 'student' as const, label: 'Stagiaire', name: `${convention.student_firstname || ''} ${convention.student_lastname || ''}`.trim() || 'Stagiaire' },
    ...(convention.is_minor ? [{ role: 'parent' as const, label: 'Responsable légal', name: `${convention.guardian_firstname || ''} ${convention.guardian_lastname || ''}`.trim() || 'Responsable légal' }] : []),
    { role: 'maitre_stage' as const, label: 'Maître de stage', name: `${convention.company_signatory_firstname || ''} ${convention.company_signatory_lastname || ''}`.trim() || 'Maître de stage' },
    { role: 'responsable_classe' as const, label: 'Responsable de classe', name: 'Responsable de classe' },
    { role: 'chef_etablissement' as const, label: "Chef d'établissement", name: "Chef d'établissement" },
  ];

  const canGoNext = () => {
    if (step === 1) {
      return convention.company_name && convention.company_siren && convention.student_lastname && convention.student_firstname;
    }
    if (step === 2) {
      return periods.every(p => p.start_date && p.end_date);
    }
    if (step === 3) {
      return true;
    }
    return false;
  };

  const saveConventionData = async () => {
    const toastId = showLoading('Enregistrement de la convention...');
    setLoading(true);
    try {
      const { data: conventionData, error: convError } = await supabase
        .from('conventions')
        .insert({
          ...convention,
          status: 'pending_signatures',
        })
        .select()
        .single();

      if (convError) throw convError;

      const periodsWithConventionId = periods.map(p => ({
        ...p,
        convention_id: conventionData.id,
      }));

      const { error: periodsError } = await supabase
        .from('stage_periods')
        .insert(periodsWithConventionId);

      if (periodsError) throw periodsError;

      setSavedConventionId(conventionData.id);
      dismissToast(toastId);
      showSuccess('Convention enregistrée avec succès !');
      setStep(4);
    } catch (error) {
      console.error('Error saving convention:', error);
      dismissToast(toastId);
      showError('Erreur lors de la sauvegarde de la convention');
    } finally {
      setLoading(false);
    }
  };

  const openSignaturePad = (role: Signature['signer_role'], name: string) => {
    setCurrentSigner({ role, name });
    setShowSignaturePad(true);
  };

  const saveSignature = async (signatureData: string) => {
    if (!currentSigner || !savedConventionId) return;

    const toastId = showLoading('Enregistrement de la signature...');
    setLoading(true);
    try {
      const { error } = await supabase
        .from('signatures')
        .insert({
          convention_id: savedConventionId,
          signer_role: currentSigner.role,
          signer_name: currentSigner.name,
          signature_data: signatureData,
          ip_address: '',
          user_agent: navigator.userAgent,
        });

      if (error) throw error;

      await loadSignatures();

      dismissToast(toastId);
      showSuccess('Signature enregistrée avec succès !');

      if (currentSigner.role === 'chef_etablissement') {
        await updateConventionStatusAfterDirectorSignature(savedConventionId);
        showSuccess('✅ Convention validée et prête à être imprimée !');
      }

      setShowSignaturePad(false);
      setCurrentSigner(null);
    } catch (error) {
      console.error('Error saving signature:', error);
      dismissToast(toastId);
      showError('Erreur lors de l\'enregistrement de la signature');
    } finally {
      setLoading(false);
    }
  };

  const allSigned = signersConfig.every(s => signatures[s.role]);

  const handleDownload = async () => {
    if (!savedConventionId) return;

    const toastId = showLoading('Génération du document...');
    setLoading(true);
    try {
      const { data: periodsData } = await supabase
        .from('stage_periods')
        .select('*')
        .eq('convention_id', savedConventionId)
        .order('period_number');

      await downloadConvention(
        convention,
        periodsData || periods,
        signatureObjects
      );

      dismissToast(toastId);
      showSuccess('Document téléchargé avec succès !');
    } catch (error) {
      console.error('Error generating document:', error);
      dismissToast(toastId);
      showError('Erreur lors de la génération du document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {step <= 3 ? 'Nouvelle convention de stage' : 'Signatures'}
          </h1>
          <div className="text-sm text-gray-600">
            {step <= 3 ? `Étape ${step} sur 3` : 'Signatures'}
          </div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition ${
                s <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations Entreprise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  value={convention.company_name || ''}
                  onChange={e => updateConvention('company_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SIREN/SIRET *
                </label>
                <input
                  type="text"
                  value={convention.company_siren || ''}
                  onChange={e => updateConvention('company_siren', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de stage
                </label>
                <input
                  type="text"
                  value={convention.stage_location || ''}
                  onChange={e => updateConvention('stage_location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du signataire
                </label>
                <input
                  type="text"
                  value={convention.company_signatory_lastname || ''}
                  onChange={e => updateConvention('company_signatory_lastname', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom du signataire
                </label>
                <input
                  type="text"
                  value={convention.company_signatory_firstname || ''}
                  onChange={e => updateConvention('company_signatory_firstname', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualité
                </label>
                <input
                  type="text"
                  value={convention.company_signatory_title || ''}
                  onChange={e => updateConvention('company_signatory_title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={convention.company_phone || ''}
                  onChange={e => updateConvention('company_phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={convention.company_email || ''}
                  onChange={e => updateConvention('company_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations Élève</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={convention.student_lastname || ''}
                  onChange={e => updateConvention('student_lastname', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={convention.student_firstname || ''}
                  onChange={e => updateConvention('student_firstname', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexe
                </label>
                <select
                  value={convention.student_gender || ''}
                  onChange={e => updateConvention('student_gender', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={convention.student_birthdate || ''}
                  onChange={e => {
                    updateConvention('student_birthdate', e.target.value);
                    const birthDate = new Date(e.target.value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    updateConvention('is_minor', age < 18);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={convention.student_address || ''}
                  onChange={e => updateConvention('student_address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={convention.student_phone || ''}
                  onChange={e => updateConvention('student_phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={convention.student_email || ''}
                  onChange={e => updateConvention('student_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classe
                </label>
                <input
                  type="text"
                  value={convention.student_class || ''}
                  onChange={e => updateConvention('student_class', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                  disabled
                />
              </div>
            </div>
          </div>

          {convention.is_minor && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsable Légal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={convention.guardian_lastname || ''}
                    onChange={e => updateConvention('guardian_lastname', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={convention.guardian_firstname || ''}
                    onChange={e => updateConvention('guardian_firstname', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={convention.guardian_address || ''}
                    onChange={e => updateConvention('guardian_address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={convention.guardian_phone || ''}
                    onChange={e => updateConvention('guardian_phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={convention.guardian_email || ''}
                    onChange={e => updateConvention('guardian_email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Caractéristiques du stage</h2>
            <div className="space-y-4">
              {periods.map((period, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Période {index + 1}</h3>
                    {periods.length > 1 && (
                      <button
                        onClick={() => removePeriod(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de début *
                      </label>
                      <input
                        type="date"
                        value={period.start_date}
                        onChange={e => updatePeriod(index, 'start_date', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de fin *
                      </label>
                      <input
                        type="date"
                        value={period.end_date}
                        onChange={e => updatePeriod(index, 'end_date', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horaires journaliers
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 9h-17h"
                        value={period.daily_hours || ''}
                        onChange={e => updatePeriod(index, 'daily_hours', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {periods.length < 7 && (
                <button
                  onClick={addPeriod}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
                >
                  + Ajouter une période
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Principales tâches confiées au stagiaire
            </label>
            <textarea
              value={convention.main_tasks || ''}
              onChange={e => updateConvention('main_tasks', e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Décrivez les tâches principales du stagiaire..."
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lieu et date de signature</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fait à
                </label>
                <input
                  type="text"
                  value={convention.signing_location || ''}
                  onChange={e => updateConvention('signing_location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Le
                </label>
                <input
                  type="date"
                  value={convention.signing_date || ''}
                  onChange={e => updateConvention('signing_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Récapitulatif</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Entreprise: {convention.company_name}</p>
              <p>• Élève: {convention.student_firstname} {convention.student_lastname}</p>
              <p>• Nombre de périodes: {periods.length}</p>
              <p>• Statut: {convention.is_minor ? 'Mineur (5 signatures requises)' : 'Majeur (4 signatures requises)'}</p>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">Convention enregistrée !</h3>
            <p className="text-sm text-green-800">
              Veuillez maintenant collecter les signatures de tous les interlocuteurs
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">📋 Workflow des signatures (ordre obligatoire)</h3>
            <ol className="space-y-2 text-sm">
              <li className={signatures['student'] ? "text-green-600 font-medium" : "text-gray-600"}>
                {signatures['student'] ? "✅" : "🕒"} 1. Élève
              </li>
              {convention.is_minor && (
                <li className={signatures['parent'] ? "text-green-600 font-medium" : "text-gray-600"}>
                  {signatures['parent'] ? "✅" : "🕒"} 2. Représentant légal
                </li>
              )}
              <li className={signatures['maitre_stage'] ? "text-green-600 font-medium" : "text-gray-600"}>
                {signatures['maitre_stage'] ? "✅" : "🕒"} {convention.is_minor ? '3' : '2'}. Maître de stage
              </li>
              <li className={signatures['responsable_classe'] ? "text-green-600 font-medium" : "text-gray-600"}>
                {signatures['responsable_classe'] ? "✅" : "🕒"} {convention.is_minor ? '4' : '3'}. Responsable de classe
              </li>
              <li className={signatures['chef_etablissement'] ? "text-green-600 font-bold" : "text-orange-600 font-semibold"}>
                {signatures['chef_etablissement'] ? "✅" : "👑"} {convention.is_minor ? '5' : '4'}. Chef d'établissement (VALIDATION FINALE)
              </li>
            </ol>

            {!signatures['chef_etablissement'] && (
              <div className="mt-3 pt-3 border-t border-blue-300">
                <p className="text-xs text-orange-700 bg-orange-50 p-2 rounded">
                  ⚠️ <strong>Important :</strong> La convention ne pourra être imprimée qu'après la signature finale du directeur
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {signersConfig.map(signer => {
              const signed = !!signatures[signer.role];

              return (
                <div
                  key={signer.role}
                  className={`border-2 rounded-lg p-4 transition ${
                    signed ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {signed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{signer.label}</h3>
                          <p className="text-sm text-gray-600">{signer.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {signed && signatures[signer.role] && (
                        <img
                          src={signatures[signer.role]}
                          alt="Signature"
                          className="h-16 border border-gray-300 rounded bg-white px-2"
                        />
                      )}
                      {!signed && (
                        <button
                          onClick={() => openSignaturePad(signer.role, signer.name)}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          <PenTool className="w-4 h-4" />
                          Signer maintenant
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {allSigned && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Toutes les signatures ont été collectées !
              </h3>
              <p className="text-green-800 mb-4">
                La convention est maintenant prête à être téléchargée
              </p>
              {savedConventionId && (
                <DownloadConventionButton
                  conventionId={savedConventionId}
                  onDownload={handleDownload}
                />
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        {step > 1 && step <= 3 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </button>
        )}

        {step === 1 && (
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Annuler
          </button>
        )}

        {step === 4 && (
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Retour à l'accueil
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canGoNext()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : step === 3 ? (
          <button
            onClick={saveConventionData}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 ml-auto"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Enregistrement...' : 'Enregistrer et passer aux signatures'}
          </button>
        ) : null}
      </div>

      {showSignaturePad && currentSigner && (
        <SignaturePad
          signerName={currentSigner.name}
          onSave={saveSignature}
          onCancel={() => {
            setShowSignaturePad(false);
            setCurrentSigner(null);
          }}
        />
      )}
    </div>
  );
}
