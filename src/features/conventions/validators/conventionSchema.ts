import { z } from 'zod';

export const conventionSchema = z.object({
  diplome_prepare: z.string().optional(),
  domaine_professionnel: z.string().optional(),
  annee_scolaire: z.string().optional(),

  company_name: z.string().min(2, 'Nom requis (min 2 caractères)'),
  company_siren: z
    .string()
    .regex(/^\d{9}$/, 'Le SIREN doit contenir exactement 9 chiffres'),
  company_phone: z
    .string()
    .regex(/^0[1-9]\d{8}$/, 'Format : 0XXXXXXXXX (10 chiffres)'),
  company_email: z.string().email('Email invalide'),
  company_signatory_lastname: z.string().min(2, 'Nom requis'),
  company_signatory_firstname: z.string().min(2, 'Prénom requis'),
  company_signatory_title: z.string().min(2, 'Fonction requise'),
  stage_location: z.string().min(5, 'Lieu du stage requis'),
  qualite_representant: z.string().optional(),
  lieu_stage_si_different: z.string().optional(),

  student_lastname: z.string().min(2, 'Nom requis'),
  student_firstname: z.string().min(2, 'Prénom requis'),
  student_email: z.string().email('Email invalide'),
  student_phone: z.string().regex(/^0[1-9]\d{8}$/, 'Format : 0XXXXXXXXX'),
  student_birthdate: z.string().min(1, 'Date de naissance requise'),
  student_address: z.string().min(5, 'Adresse requise'),
  student_class: z.string().min(1, 'Classe requise'),
  student_gender: z.enum(['M', 'F'], { errorMap: () => ({ message: 'Sélectionnez un genre' }) }),

  is_minor: z.boolean(),
  guardian_lastname: z.string().optional(),
  guardian_firstname: z.string().optional(),
  guardian_phone: z.string().optional(),
  guardian_email: z.string().optional(),
  guardian_address: z.string().optional(),

  enseignant_referent_nom: z.string().optional(),
  enseignant_referent_prenom: z.string().optional(),
  enseignant_referent_fonction: z.string().optional(),
  enseignant_referent_email: z.string().email('Email invalide').optional().or(z.literal('')),

  tuteur_entreprise_nom: z.string().optional(),
  tuteur_entreprise_prenom: z.string().optional(),
  tuteur_entreprise_fonction: z.string().optional(),
  tuteur_entreprise_telephone: z.string().optional(),
  tuteur_entreprise_email: z.string().email('Email invalide').optional().or(z.literal('')),

  horaires_lundi: z.string().optional(),
  horaires_mardi: z.string().optional(),
  horaires_mercredi: z.string().optional(),
  horaires_jeudi: z.string().optional(),
  horaires_vendredi: z.string().optional(),
  horaires_samedi: z.string().optional(),
  duree_hebdomadaire: z.number().min(1).max(40).optional(),

  main_tasks: z.string().min(10, 'Description des tâches requise (min 10 caractères)'),
  principales_taches: z.string().optional(),
  signing_location: z.string().min(3, 'Lieu de signature requis'),
  signing_date: z.string().optional(),
  convention_type: z.enum(['stage_initiation', 'pfmp_seconde', 'pfmp_premiere_terminale']).optional(),
}).refine((data) => {
  if (data.is_minor) {
    return (
      data.guardian_lastname &&
      data.guardian_firstname &&
      data.guardian_phone &&
      data.guardian_email &&
      data.guardian_address &&
      data.guardian_lastname.length >= 2 &&
      data.guardian_firstname.length >= 2
    );
  }
  return true;
}, {
  message: "Les informations du représentant légal sont obligatoires pour un mineur",
  path: ["guardian_lastname"],
});

export type ConventionFormData = z.infer<typeof conventionSchema>;
