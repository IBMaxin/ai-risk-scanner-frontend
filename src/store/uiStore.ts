import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      sidebarOpen: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    { name: 'ui-storage' },
  ),
);
