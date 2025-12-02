import { create } from 'zustand';

interface UiStore {
  sidebarOpen: boolean;
  modalOpen: boolean;
  currentFilter: string;
  searchQuery: string;
  setSidebarOpen: (open: boolean) => void;
  setModalOpen: (open: boolean) => void;
  setCurrentFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: false,
  modalOpen: false,
  currentFilter: 'all',
  searchQuery: '',

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setModalOpen: (open) => set({ modalOpen: open }),
  setCurrentFilter: (filter) => set({ currentFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
