import { Link } from 'react-router-dom';
import { Home, HelpCircle, Mail, Phone } from 'lucide-react';

export const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <HelpCircle className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold">Centre d'aide</h1>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-900">
                📝 Comment créer une convention ?
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Connectez-vous avec vos identifiants</li>
                <li>Cliquez sur "Créer une nouvelle convention"</li>
                <li>Remplissez les informations de l'entreprise (SIREN à 9 chiffres)</li>
                <li>Remplissez les informations de l'élève</li>
                <li>Si l'élève est mineur, cochez la case et remplissez les infos du représentant légal</li>
                <li>Définissez les périodes de stage</li>
                <li>Validez la convention</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-900">
                🔐 Système d'identifiants
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <p className="mb-3 font-semibold">Format des identifiants :</p>
                <div className="space-y-2 mb-4">
                  <p><strong>Login :</strong> Initiale.NOM</p>
                  <p className="text-sm text-gray-600 ml-6">Exemple : A.DUMAS pour Arnaud DUMAS</p>
                  <p><strong>Mot de passe :</strong> JJMMAA (6 chiffres de la date de naissance)</p>
                  <p className="text-sm text-gray-600 ml-6">Exemple : 061279 pour 06/12/1979</p>
                </div>
                <p className="text-sm text-orange-700">
                  ⚠️ Ces identifiants sont valables pour tous les utilisateurs (familles, responsables, direction)
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-900">
                ✍️ Workflow de signature
              </h2>
              <p className="mb-3">Les signatures doivent être effectuées dans cet ordre :</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Élève</li>
                <li>Représentant légal (si mineur)</li>
                <li>Maître de stage</li>
                <li>Responsable de classe</li>
                <li><strong className="text-red-600">Chef d'établissement (signature finale obligatoire)</strong></li>
              </ol>
              <p className="mt-4 text-sm bg-orange-50 p-3 rounded border border-orange-200">
                ⚠️ <strong>Important :</strong> La convention ne peut être téléchargée/imprimée
                qu'après la signature du chef d'établissement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-900">
                ❓ Questions fréquentes
              </h2>
              <div className="space-y-4">
                <details className="bg-gray-50 p-4 rounded-lg">
                  <summary className="font-semibold cursor-pointer">
                    J'ai oublié mon mot de passe
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Votre mot de passe est votre date de naissance au format JJMMAA (6 chiffres).
                    Exemple : si vous êtes né le 15/03/1985, votre mot de passe est 150385.
                  </p>
                </details>

                <details className="bg-gray-50 p-4 rounded-lg">
                  <summary className="font-semibold cursor-pointer">
                    Comment signer sans compte ?
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Le responsable vous enverra un lien unique de signature par email.
                    Cliquez sur ce lien et suivez les instructions.
                  </p>
                </details>

                <details className="bg-gray-50 p-4 rounded-lg">
                  <summary className="font-semibold cursor-pointer">
                    Pourquoi je ne peux pas télécharger la convention ?
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Le téléchargement n'est possible qu'après la signature finale du chef d'établissement.
                    Toutes les signatures précédentes doivent également être complétées.
                  </p>
                </details>

                <details className="bg-gray-50 p-4 rounded-lg">
                  <summary className="font-semibold cursor-pointer">
                    Le SIREN, c'est quoi ?
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Le SIREN est un numéro à 9 chiffres qui identifie l'entreprise.
                    Il est disponible sur les documents officiels de l'entreprise ou sur societe.com
                  </p>
                </details>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-900">
                📞 Besoin d'aide ?
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                <p className="mb-4 font-semibold">Contactez le support MFR :</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <a href="mailto:support@mfr-anse.fr" className="text-blue-600 hover:underline">
                      support@mfr-anse.fr
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span>04 XX XX XX XX</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
