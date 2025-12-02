import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Convention, StagePeriod } from '../types/convention';
import { getConventionType } from '../utils/conventionTypeHelper';
import { conventionSchema, ConventionFormData } from '../features/conventions/validators/conventionSchema';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { TextArea } from './common/TextArea';

interface ConventionFormProps {
  onSubmit: (convention: Convention, periods: StagePeriod[]) => void;
  initialData?: Convention;
}

const calculateSchoolYear = (startDate?: string): string => {
  if (!startDate) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return month >= 9 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  }

  const date = new Date(startDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 9 && month <= 12 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
};

export function ConventionForm({ onSubmit, initialData }: ConventionFormProps) {
  const [step, setStep] = useState(1);
  const [periods, setPeriods] = useState<StagePeriod[]>([
    { period_number: 1, start_date: '', end_date: '', daily_hours: '' }
  ]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ConventionFormData>({
    resolver: zodResolver(conventionSchema),
    defaultValues: initialData || {
      is_minor: false,
      student_gender: 'M',
      duree_hebdomadaire: 35,
      horaires_lundi: '8h-12h / 14h-18h',
      horaires_mardi: '8h-12h / 14h-18h',
      horaires_mercredi: '8h-12h / 14h-18h',
      horaires_jeudi: '8h-12h / 14h-18h',
      horaires_vendredi: '8h-12h / 14h-18h',
      horaires_samedi: '',
    },
    mode: 'onBlur',
  });

  const studentClass = watch('student_class');
  const isMinor = watch('is_minor');
  const studentBirthdate = watch('student_birthdate');

  useEffect(() => {
    if (studentClass) {
      try {
        const conventionType = getConventionType(studentClass);
        setValue('convention_type', conventionType);
      } catch (error) {
        console.error('Erreur lors de la détermination du type de convention:', error);
      }
    }
  }, [studentClass, setValue]);

  useEffect(() => {
    if (studentBirthdate) {
      const birthDate = new Date(studentBirthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      setValue('is_minor', age < 18);
    }
  }, [studentBirthdate, setValue]);

  useEffect(() => {
    if (periods.length > 0 && periods[0].start_date) {
      const schoolYear = calculateSchoolYear(periods[0].start_date);
      setValue('annee_scolaire', schoolYear);
    }
  }, [periods, setValue]);

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

  const onFormSubmit = (data: ConventionFormData) => {
    const convention: Convention = {
      ...data,
      status: 'draft',
    };
    onSubmit(convention, periods);
  };

  const canGoNext = () => {
    if (step === 1) {
      return studentClass && watch('company_name') && watch('company_siren') && watch('student_lastname') && watch('student_firstname');
    }
    if (step === 2) {
      return periods.every(p => p.start_date && p.end_date);
    }
    return true;
  };

  const classOptions = [
    { value: '', label: '-- Sélectionner la classe --' },
    { value: '4ème', label: '4ème' },
    { value: '3èmeA', label: '3ème A' },
    { value: '3èmeN', label: '3ème N' },
    { value: '2nde1', label: '2nde 1' },
    { value: '2nde2', label: '2nde 2' },
    { value: '1ère1', label: '1ère 1' },
    { value: '1ère2', label: '1ère 2' },
    { value: 'Term1', label: 'Term 1' },
    { value: 'Term2', label: 'Term 2' },
  ];

  const genderOptions = [
    { value: '', label: 'Sélectionner' },
    { value: 'M', label: 'Masculin' },
    { value: 'F', label: 'Féminin' },
  ];

  const domaineOptions = [
    { value: '', label: '-- Sélectionner --' },
    { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Espaces verts', label: 'Espaces verts' },
    { value: 'Vente', label: 'Vente' },
    { value: 'Autre', label: 'Autre' },
  ];

  const qualiteOptions = [
    { value: '', label: '-- Sélectionner --' },
    { value: 'Gérant', label: 'Gérant' },
    { value: 'Directeur', label: 'Directeur' },
    { value: 'Responsable', label: 'Responsable' },
    { value: 'Autre', label: 'Autre' },
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Convention de stage</h1>
          <div className="text-sm text-gray-600">Étape {step} sur 4</div>
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
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Section 1 : Informations générales</h2>

            <div className="space-y-4">
              <Select
                label="Classe de l'élève *"
                {...register('student_class')}
                options={classOptions}
                error={errors.student_class?.message}
              />
              {studentClass && (
                <p className="text-sm text-green-700 font-medium">
                  ✓ Convention {
                    ['4ème', '3èmeA', '3èmeN'].includes(studentClass)
                      ? "de stages d'initiation"
                      : ['2nde1', '2nde2'].includes(studentClass)
                      ? 'PFMP Seconde'
                      : 'PFMP 1ère/Terminale'
                  } sélectionnée
                </p>
              )}

              <Input
                label="Diplôme préparé"
                {...register('diplome_prepare')}
                placeholder="Ex: Bac Pro CGEA, DNB..."
                error={errors.diplome_prepare?.message}
              />

              <Select
                label="Domaine professionnel"
                {...register('domaine_professionnel')}
                options={domaineOptions}
                error={errors.domaine_professionnel?.message}
              />

              <Input
                label="Année scolaire"
                {...register('annee_scolaire')}
                placeholder="Ex: 2025/2026"
                error={errors.annee_scolaire?.message}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Section 2 : Informations Entreprise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Nom de l'entreprise *"
                  {...register('company_name')}
                  error={errors.company_name?.message}
                />
              </div>
              <Input
                label="SIREN (9 chiffres) *"
                {...register('company_siren')}
                placeholder="123456789"
                error={errors.company_siren?.message}
              />
              <Input
                label="Lieu de stage *"
                {...register('stage_location')}
                error={errors.stage_location?.message}
              />
              <Input
                label="Lieu du stage si différent"
                {...register('lieu_stage_si_different')}
                placeholder="Optionnel"
                error={errors.lieu_stage_si_different?.message}
              />
              <Select
                label="Qualité du représentant"
                {...register('qualite_representant')}
                options={qualiteOptions}
                error={errors.qualite_representant?.message}
              />
              <Input
                label="Nom du signataire *"
                {...register('company_signatory_lastname')}
                error={errors.company_signatory_lastname?.message}
              />
              <Input
                label="Prénom du signataire *"
                {...register('company_signatory_firstname')}
                error={errors.company_signatory_firstname?.message}
              />
              <Input
                label="Fonction *"
                {...register('company_signatory_title')}
                error={errors.company_signatory_title?.message}
              />
              <Input
                label="Téléphone *"
                type="tel"
                {...register('company_phone')}
                placeholder="0612345678"
                error={errors.company_phone?.message}
              />
              <Input
                label="Email *"
                type="email"
                {...register('company_email')}
                error={errors.company_email?.message}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Section 3 : Informations Élève</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom *"
                {...register('student_lastname')}
                error={errors.student_lastname?.message}
              />
              <Input
                label="Prénom *"
                {...register('student_firstname')}
                error={errors.student_firstname?.message}
              />
              <Select
                label="Sexe *"
                {...register('student_gender')}
                options={genderOptions}
                error={errors.student_gender?.message}
              />
              <Input
                label="Date de naissance *"
                type="date"
                {...register('student_birthdate')}
                error={errors.student_birthdate?.message}
              />
              <div className="md:col-span-2">
                <Input
                  label="Adresse *"
                  {...register('student_address')}
                  error={errors.student_address?.message}
                />
              </div>
              <Input
                label="Téléphone *"
                type="tel"
                {...register('student_phone')}
                placeholder="0612345678"
                error={errors.student_phone?.message}
              />
              <Input
                label="Email *"
                type="email"
                {...register('student_email')}
                error={errors.student_email?.message}
              />
            </div>
          </div>

          {isMinor && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Représentant Légal *</h2>
              <p className="text-sm text-yellow-800 mb-4">
                L'élève est mineur, les informations du représentant légal sont obligatoires.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom *"
                  {...register('guardian_lastname')}
                  error={errors.guardian_lastname?.message}
                />
                <Input
                  label="Prénom *"
                  {...register('guardian_firstname')}
                  error={errors.guardian_firstname?.message}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Adresse *"
                    {...register('guardian_address')}
                    error={errors.guardian_address?.message}
                  />
                </div>
                <Input
                  label="Téléphone *"
                  type="tel"
                  {...register('guardian_phone')}
                  placeholder="0612345678"
                  error={errors.guardian_phone?.message}
                />
                <Input
                  label="Email *"
                  type="email"
                  {...register('guardian_email')}
                  error={errors.guardian_email?.message}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-900 mb-4">Section 4 : Encadrement pédagogique</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Enseignant référent</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nom"
                    {...register('enseignant_referent_nom')}
                    error={errors.enseignant_referent_nom?.message}
                  />
                  <Input
                    label="Prénom"
                    {...register('enseignant_referent_prenom')}
                    error={errors.enseignant_referent_prenom?.message}
                  />
                  <Input
                    label="Fonction/Discipline"
                    {...register('enseignant_referent_fonction')}
                    placeholder="Ex: Professeur de biologie"
                    error={errors.enseignant_referent_fonction?.message}
                  />
                  <Input
                    label="Email"
                    type="email"
                    {...register('enseignant_referent_email')}
                    error={errors.enseignant_referent_email?.message}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tuteur en entreprise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nom"
                    {...register('tuteur_entreprise_nom')}
                    error={errors.tuteur_entreprise_nom?.message}
                  />
                  <Input
                    label="Prénom"
                    {...register('tuteur_entreprise_prenom')}
                    error={errors.tuteur_entreprise_prenom?.message}
                  />
                  <Input
                    label="Fonction"
                    {...register('tuteur_entreprise_fonction')}
                    placeholder="Ex: Responsable d'exploitation"
                    error={errors.tuteur_entreprise_fonction?.message}
                  />
                  <Input
                    label="Téléphone"
                    type="tel"
                    {...register('tuteur_entreprise_telephone')}
                    placeholder="0612345678"
                    error={errors.tuteur_entreprise_telephone?.message}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Email"
                      type="email"
                      {...register('tuteur_entreprise_email')}
                      error={errors.tuteur_entreprise_email?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Section 5 : Périodes et horaires</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Périodes de stage</h3>
                <div className="space-y-4">
                  {periods.map((period, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Période {index + 1}</h4>
                        {periods.length > 1 && (
                          <button
                            type="button"
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
                      type="button"
                      onClick={addPeriod}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
                    >
                      + Ajouter une période
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Horaires hebdomadaires détaillés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Durée hebdomadaire (heures)"
                    type="number"
                    {...register('duree_hebdomadaire', { valueAsNumber: true })}
                    placeholder="35"
                    error={errors.duree_hebdomadaire?.message}
                  />
                  <div></div>
                  <Input
                    label="Lundi"
                    {...register('horaires_lundi')}
                    placeholder="8h-12h / 14h-18h"
                    error={errors.horaires_lundi?.message}
                  />
                  <Input
                    label="Mardi"
                    {...register('horaires_mardi')}
                    placeholder="8h-12h / 14h-18h"
                    error={errors.horaires_mardi?.message}
                  />
                  <Input
                    label="Mercredi"
                    {...register('horaires_mercredi')}
                    placeholder="8h-12h / 14h-18h"
                    error={errors.horaires_mercredi?.message}
                  />
                  <Input
                    label="Jeudi"
                    {...register('horaires_jeudi')}
                    placeholder="8h-12h / 14h-18h"
                    error={errors.horaires_jeudi?.message}
                  />
                  <Input
                    label="Vendredi"
                    {...register('horaires_vendredi')}
                    placeholder="8h-12h / 14h-18h"
                    error={errors.horaires_vendredi?.message}
                  />
                  <Input
                    label="Samedi (optionnel)"
                    {...register('horaires_samedi')}
                    placeholder="8h-12h"
                    error={errors.horaires_samedi?.message}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">Section 6 : Objectifs pédagogiques</h2>

            <TextArea
              label="Principales tâches confiées au stagiaire *"
              {...register('main_tasks')}
              rows={6}
              placeholder="Ex: Observation des techniques de culture, participation aux soins aux animaux, découverte des métiers..."
              error={errors.main_tasks?.message}
            />

            <div className="mt-4">
              <TextArea
                label="Détails supplémentaires (optionnel)"
                {...register('principales_taches')}
                rows={4}
                placeholder="Informations complémentaires..."
                error={errors.principales_taches?.message}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lieu et date de signature</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fait à *"
                {...register('signing_location')}
                error={errors.signing_location?.message}
              />
              <Input
                label="Le"
                type="date"
                {...register('signing_date')}
                error={errors.signing_date?.message}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Récapitulatif</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Entreprise: {watch('company_name')}</p>
              <p>• Élève: {watch('student_firstname')} {watch('student_lastname')}</p>
              <p>• Classe: {watch('student_class')}</p>
              <p>• Année scolaire: {watch('annee_scolaire')}</p>
              <p>• Nombre de périodes: {periods.length}</p>
              <p>• Statut: {isMinor ? 'Mineur (5 signatures requises)' : 'Majeur (4 signatures requises)'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canGoNext()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        )}
      </div>
    </form>
  );
}
