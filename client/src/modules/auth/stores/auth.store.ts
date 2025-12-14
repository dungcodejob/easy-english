import { STORAGE_KEYS } from '@shared/constants';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authApi } from '../services';
import type { AuthResult } from '../types';
import type { LoginCredentials } from '../types/login-credentials';

type AuthState =
  | {
      isAuthenticated: false;
      tokens: null;
    }
  | {
      isAuthenticated: true;
      tokens: AuthResult['tokens'];
    };

type AuthMethod = {
  login: (data: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
};
type AuthStore = AuthState & AuthMethod;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      tokens: null,
      login: async (data) => {
        await authApi
          .login(data)
          .then((res) =>
            set({ isAuthenticated: true, tokens: res.data.tokens }),
          );
      },
      logout: async () => {
        await authApi
          .logout()
          .then(() => set({ isAuthenticated: false, tokens: null }));
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
