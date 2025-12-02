import { create } from 'zustand';
import { Convention } from '../types/convention';

interface ConventionsStore {
  conventions: Convention[];
  loading: boolean;
  selectedConvention: Convention | null;
  setConventions: (conventions: Convention[]) => void;
  addConvention: (convention: Convention) => void;
  updateConvention: (id: string, updates: Partial<Convention>) => void;
  deleteConvention: (id: string) => void;
  setSelectedConvention: (convention: Convention | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useConventionsStore = create<ConventionsStore>((set) => ({
  conventions: [],
  loading: false,
  selectedConvention: null,

  setConventions: (conventions) => set({ conventions }),

  addConvention: (convention) =>
    set((state) => ({
      conventions: [...state.conventions, convention]
    })),

  updateConvention: (id, updates) =>
    set((state) => ({
      conventions: state.conventions.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  deleteConvention: (id) =>
    set((state) => ({
      conventions: state.conventions.filter((c) => c.id !== id),
    })),

  setSelectedConvention: (convention) => set({ selectedConvention: convention }),

  setLoading: (loading) => set({ loading }),
}));
