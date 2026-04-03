import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  login: (token: string, tenantId: string) => void;
  logout: () => void;
}

/**
 * Global auth state persisted to localStorage via zustand/persist.
 * Clears access_token key for axios interceptor compatibility.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      tenantId: null,
      isAuthenticated: false,
      login: (token, tenantId) => {
        localStorage.setItem('access_token', token);
        set({ token, tenantId, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        set({ token: null, tenantId: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' },
  ),
);
