export type ConventionType = 'stage_initiation' | 'pfmp_seconde' | 'pfmp_premiere_terminale';

export interface Convention {
  id?: string;
  status: 'draft' | 'pending_signatures' | 'signed' | 'ready_to_print';
  convention_type?: ConventionType;
  created_by?: string;
  created_at?: string;
  updated_at?: string;

  diplome_prepare?: string;
  domaine_professionnel?: string;
  annee_scolaire?: string;

  company_name?: string;
  company_siren?: string;
  company_signatory_lastname?: string;
  company_signatory_firstname?: string;
  company_signatory_title?: string;
  company_phone?: string;
  company_email?: string;
  stage_location?: string;
  qualite_representant?: string;
  lieu_stage_si_different?: string;

  student_lastname?: string;
  student_firstname?: string;
  student_gender?: 'M' | 'F';
  student_birthdate?: string;
  student_address?: string;
  student_phone?: string;
  student_email?: string;
  student_class?: string;

  is_minor?: boolean;
  guardian_lastname?: string;
  guardian_firstname?: string;
  guardian_address?: string;
  guardian_phone?: string;
  guardian_email?: string;

  enseignant_referent_nom?: string;
  enseignant_referent_prenom?: string;
  enseignant_referent_fonction?: string;
  enseignant_referent_email?: string;

  tuteur_entreprise_nom?: string;
  tuteur_entreprise_prenom?: string;
  tuteur_entreprise_fonction?: string;
  tuteur_entreprise_telephone?: string;
  tuteur_entreprise_email?: string;

  horaires_lundi?: string;
  horaires_mardi?: string;
  horaires_mercredi?: string;
  horaires_jeudi?: string;
  horaires_vendredi?: string;
  horaires_samedi?: string;
  duree_hebdomadaire?: number;

  main_tasks?: string;
  principales_taches?: string;
  signing_location?: string;
  signing_date?: string;
}

export interface StagePeriod {
  id?: string;
  convention_id?: string;
  period_number: number;
  start_date: string;
  end_date: string;
  daily_hours?: string;
}

export interface Signature {
  id?: string;
  convention_id?: string;
  signer_role: 'student' | 'parent' | 'maitre_stage' | 'responsable_classe' | 'chef_etablissement';
  signer_name: string;
  signer_email?: string;
  signature_data: string;
  signed_at?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface User {
  id?: string;
  email: string;
  full_name: string;
  role: 'admin' | 'chef_etablissement' | 'responsable_classe' | 'eleve' | 'maitre_stage' | 'parent';
  created_at?: string;
}
