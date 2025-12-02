import { useState, useEffect } from 'react';
import { hasDirectorSigned } from '../../features/signatures/utils/signatureValidation';
import { showError } from '../../lib/utils/toast';
import { Download, Lock } from 'lucide-react';
import { Spinner } from '../common/Spinner';

interface DownloadConventionButtonProps {
  conventionId: string;
  onDownload: () => void;
}

export const DownloadConventionButton = ({
  conventionId,
  onDownload
}: DownloadConventionButtonProps) => {
  const [canDownload, setCanDownload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIfCanDownload();
  }, [conventionId]);

  const checkIfCanDownload = async () => {
    setLoading(true);
    const directorSigned = await hasDirectorSigned(conventionId);
    setCanDownload(directorSigned);
    setLoading(false);
  };

  const handleClick = () => {
    if (!canDownload) {
      showError('⚠️ Le directeur doit signer avant de pouvoir télécharger la convention');
      return;
    }
    onDownload();
  };

  if (loading) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-2"
      >
        <Spinner size="sm" />
        Vérification...
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={!canDownload}
        className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition shadow-lg ${
          canDownload
            ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {canDownload ? (
          <>
            <Download className="w-5 h-5" />
            Télécharger la convention
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            En attente de signature du directeur
          </>
        )}
      </button>

      {!canDownload && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-sm text-orange-800">
            ⚠️ <strong>Sécurité :</strong> Le directeur doit valider et signer avant l'impression de la convention.
          </p>
        </div>
      )}
    </div>
  );
};
