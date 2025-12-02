import { useState, useEffect } from 'react';
import { CheckCircle, Clock, FileText, PenTool } from 'lucide-react';
import { Convention, Signature } from '../types/convention';
import { SignaturePad } from './SignaturePad';
import { supabase } from '../lib/supabase';

interface SignatureWorkflowProps {
  convention: Convention;
  onUpdate: () => void;
}

export function SignatureWorkflow({ convention, onUpdate }: SignatureWorkflowProps) {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [currentSigner, setCurrentSigner] = useState<{
    role: Signature['signer_role'];
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const signersConfig = [
    { role: 'student' as const, label: 'Stagiaire', name: `${convention.student_firstname} ${convention.student_lastname}` },
    ...(convention.is_minor ? [{ role: 'parent' as const, label: 'Responsable légal', name: `${convention.guardian_firstname} ${convention.guardian_lastname}` }] : []),
    { role: 'maitre_stage' as const, label: 'Maître de stage', name: `${convention.company_signatory_firstname} ${convention.company_signatory_lastname}` },
    { role: 'responsable_classe' as const, label: 'Responsable de classe', name: 'Responsable de classe' },
    { role: 'chef_etablissement' as const, label: "Chef d'établissement", name: "Chef d'établissement" },
  ];

  useEffect(() => {
    loadSignatures();
  }, [convention.id]);

  const loadSignatures = async () => {
    if (!convention.id) return;

    const { data, error } = await supabase
      .from('signatures')
      .select('*')
      .eq('convention_id', convention.id);

    if (!error && data) {
      setSignatures(data);
    }
  };

  const hasSignature = (role: Signature['signer_role']) => {
    return signatures.some(sig => sig.signer_role === role);
  };

  const openSignaturePad = (role: Signature['signer_role'], name: string) => {
    setCurrentSigner({ role, name });
    setShowSignaturePad(true);
  };

  const saveSignature = async (signatureData: string) => {
    if (!currentSigner || !convention.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('signatures')
        .insert({
          convention_id: convention.id,
          signer_role: currentSigner.role,
          signer_name: currentSigner.name,
          signature_data: signatureData,
          ip_address: '',
          user_agent: navigator.userAgent,
        });

      if (error) throw error;

      await loadSignatures();

      const allSigned = signersConfig.every(s =>
        hasSignature(s.role) || s.role === currentSigner.role
      );

      const directorSigned = currentSigner.role === 'chef_etablissement' ||
                            signatures.some(sig => sig.signer_role === 'chef_etablissement');

      if (allSigned && directorSigned) {
        await supabase
          .from('conventions')
          .update({ status: 'ready_to_print' })
          .eq('id', convention.id);
      } else {
        await supabase
          .from('conventions')
          .update({ status: 'pending_signatures' })
          .eq('id', convention.id);
      }

      onUpdate();
      setShowSignaturePad(false);
      setCurrentSigner(null);
    } catch (error) {
      console.error('Error saving signature:', error);
      alert('Erreur lors de l\'enregistrement de la signature');
    } finally {
      setLoading(false);
    }
  };

  const canPrint = convention.status === 'ready_to_print';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Signatures requises</h2>
          {canPrint && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Prête à imprimer</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {signersConfig.map(signer => {
            const signed = hasSignature(signer.role);
            const signature = signatures.find(s => s.signer_role === signer.role);

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
                        <Clock className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{signer.label}</h3>
                        <p className="text-sm text-gray-600">{signer.name}</p>
                        {signature && (
                          <p className="text-xs text-gray-500 mt-1">
                            Signé le {new Date(signature.signed_at!).toLocaleDateString('fr-FR')} à{' '}
                            {new Date(signature.signed_at!).toLocaleTimeString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {signed && signature?.signature_data && (
                      <img
                        src={signature.signature_data}
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
                        Signer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {canPrint && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-semibold"
            >
              <FileText className="w-5 h-5" />
              Imprimer la convention
            </button>
          </div>
        )}
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
