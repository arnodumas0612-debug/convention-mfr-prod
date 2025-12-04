export type UserRole = 'super_admin' | 'admin' | 'user';

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
  student_class?: string;
}
