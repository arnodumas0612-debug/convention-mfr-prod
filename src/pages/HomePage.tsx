import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>('');

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white rounded-lg shadow-xl p-12 text-center">
        <div className="flex items-center justify-center gap-8 mb-8">
          <img
            src="/logo-mfr.png"
            alt="MFR - Cultivons les réussites"
            className="h-24 w-auto object-contain"
          />
          <img
            src="/logo-federation.png"
            alt="La Petite Gonthière"
            className="h-20 w-auto object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Bienvenue sur la plateforme de conventions de stage
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Créez, signez et gérez vos conventions de stage de manière entièrement numérique
        </p>

        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-green-700" />
            <h3 className="text-lg font-bold text-green-900">Première visite ?</h3>
          </div>
          <p className="text-sm text-green-800 mb-3">
            Connectez-vous avec vos identifiants : <strong>Initiale.NOM</strong> / <strong>JJMMAA</strong> (date de naissance)
          </p>
          <button
            onClick={() => navigate('/aide')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Consulter le guide d'aide
          </button>
        </div>

        <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-blue-900 mb-3">
            Pour commencer : Sélectionnez la classe de l'élève
          </h3>
          <p className="text-sm text-blue-800 mb-4">
            Ce choix détermine le type de convention (stages d'initiation pour 4ème/3ème ou PFMP pour 2nde/1ère/Term)
          </p>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white"
          >
            <option value="">-- Sélectionner la classe --</option>
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
          {selectedClass && (
            <p className="mt-3 text-sm text-green-700 font-semibold">
              ✓ Convention {
                ['4ème', '3èmeA', '3èmeN'].includes(selectedClass)
                  ? "de stages d'initiation"
                  : ['2nde1', '2nde2'].includes(selectedClass)
                  ? 'PFMP Seconde'
                  : 'PFMP 1ère/Terminale'
              } sélectionnée
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              if (!selectedClass) {
                alert('Veuillez d\'abord sélectionner une classe');
                return;
              }
              navigate('/new', { state: { selectedClass } });
            }}
            className={`px-8 py-4 rounded-lg transition text-lg font-semibold shadow-lg ${
              selectedClass
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!selectedClass}
          >
            Créer une nouvelle convention
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-lg font-semibold"
          >
            Voir toutes les conventions
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Remplir le formulaire</h3>
            <p className="text-sm text-gray-600">
              Complétez les informations de l'entreprise, de l'élève et du stage en 3 étapes simples
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Collecter les signatures</h3>
            <p className="text-sm text-gray-600">
              Chaque partie signe électroniquement sur ordinateur ou smartphone
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Imprimer</h3>
            <p className="text-sm text-gray-600">
              Une fois le chef d'établissement a signé, imprimez la convention finale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
