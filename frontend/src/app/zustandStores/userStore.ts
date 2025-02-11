import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

// Create the store with persistence.
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null, // Initial state: no token
      setToken: (token: string | null) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
