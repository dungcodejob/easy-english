import { STORAGE_KEYS } from '@shared/constants';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authApi } from '../services';
import type { LoginCredentials } from '../types/login-credentials';

type AuthState =
  | {
      isAuthenticated: false;
      accessToken: null;
      refreshToken: null;
      user: null;
    }
  | {
      isAuthenticated: true;
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        name: string;
      };
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
      accessToken: null,
      refreshToken: null,
      user: null,
      login: async (data) => {
        const result = await authApi.login(data);
        
        if (result.isErr()) {
          throw result.error;
        }

        // The result.value is { data: AuthResultDto } based on SingleResponseDto
        set({ isAuthenticated: true, ...result.value.data });
      },
      logout: async () => {
        const result = await authApi.logout();
        
        if (result.isErr()) {
           // We might still want to clear store even if logout API fails
           console.error('Logout failed', result.error);
        }
        
        set({ isAuthenticated: false, accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
