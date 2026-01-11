import { create } from 'zustand';
import { authApi } from '../services';
import type { LoginCredentials } from '../types/login-credentials';

type AuthState =
  | {
      isAuthenticated: false;
      accessToken: null;
      refreshToken: null;
      user: null;
      isBootstrapping: boolean;
    }
  | {
      isAuthenticated: true;
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        name: string;
      };
      isBootstrapping: boolean;
    };

type AuthMethod = {
  login: (data: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setBootstrapping: (isBootstrapping: boolean) => void;
  setAuth: (data: { accessToken: string; refreshToken: string; user: { id: string; name: string } }) => void;
};
type AuthStore = AuthState & AuthMethod;

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  isBootstrapping: true,
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
  setAuth: (data) => set({ isAuthenticated: true, ...data }),
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
}));
