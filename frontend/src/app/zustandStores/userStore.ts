import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    token: string | null;
    setToken: (token: string | null) => void;
    clearToken: () => void;
    _persist?: {
        rehydrated: boolean;
    };
}

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