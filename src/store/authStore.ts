import { create } from 'zustand';

interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'responsable_classe' | 'famille';
}

interface AuthStore {
  user: AppUser | null;
  loading: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  clearUser: () => set({ user: null }),
}));
