export type UserRole = 'admin' | 'chef_etablissement' | 'responsable_classe' | 'eleve' | 'maitre_stage' | 'parent';

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
}
